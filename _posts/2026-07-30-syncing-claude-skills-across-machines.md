---
layout: post
title: "One Catalog, Every Machine: How I Sync Claude Code Skills"
date: 2026-07-30
categories: [ai, development, tools, dotfiles]
description: "How I keep Claude Code skills identical across my Mac and servers using the skills.sh CLI, a committed catalog in my dotfiles, and a daily sync script that runs from launchd and cron."
---

In [the last post]({{ site.url }}{% post_url 2026-07-21-herding-claudes-my-agentic-workflow %}) I mentioned, almost in passing, that I ship a small skill in my dotfiles that teaches Claude how to drive herdr. That's one skill out of a set that never sits still. A lot of working with agents right now is experimenting: trying the skills people are talking about, whether that's [Superpowers](https://github.com/obra/superpowers), [wayfinder](https://www.youtube.com/watch?v=F3lL98Pj90o), or the [compound engineering](https://every.to/guides/compound-engineering) ideas, and seeing what actually fits alongside the tools I already use. Some earn a permanent spot, some get dropped a week later, and the answer shifts again whenever the tooling underneath changes. That churn is manageable on one machine. Across two Claude accounts and a couple of machines it stops being manageable: every install is per profile and per box, and skills aren't static either, since authors keep improving them and a copy installed months ago can be quietly running on outdated instructions. So I went looking for a way to have skills move easily between profiles and machines, and stay current once they're there. This post is where that landed: skills.sh for every skill with a proper upstream, the dotfiles for the few without one, and a daily sync script gluing it all together, so that a skill added or updated anywhere shows up everywhere.

## The Drift Problem

A skill, for Claude Code, is just a folder with a `SKILL.md` in it. That simplicity is great right up until you have more than one machine. I work across my Mac and an Ubuntu server, and on each of those I run two Claude Code accounts: `ccp` for personal experimentation out of `~/.claude-personal`, and `ccd` for client work out of `~/.claude-dsf`. That's four skill directories that all want the same content, and folders don't sync themselves.

The failure mode is exactly what you'd expect. I'd find a useful skill, install it on the Mac, and three days later watch a Claude on the server flounder at a task its sibling had a skill for. Worse, the copies that did exist drifted. I had vendored a copy of hunk's review skill into my dotfiles at some point, and it turned out to be a full feature section behind upstream, with nothing to tell me so.

Most of my skills come from [skills.sh](https://skills.sh) these days. If you haven't run into it: skills.sh is Vercel's open registry for agent skills, a directory of reusable capabilities you can bolt onto a coding agent, with somewhere north of 90,000 skills in it at the time of writing. It's agent-agnostic ([Claude Code](https://claude.com/product/claude-code), [Cursor](https://cursor.com), [Copilot](https://github.com/features/copilot), [Windsurf](https://windsurf.com) and [a long list of others](https://skills.sh/agent)), the skills themselves live in ordinary GitHub repos, and the [CLI](https://github.com/vercel-labs/skills) that goes with it installs straight from those repos, no account required:

```sh
npx skills add herdrdev/herdr -g        # whole repo
npx skills add mattpocock/skills@triage -g  # one skill
npx skills find review                  # search the registry
npx skills ls -g                        # what's installed
```

The registry has a leaderboard, which is genuinely useful for finding what people actually use, and genuinely dangerous for the same reason a package registry with 90,000 entries always is: anyone can publish, names collide, and two skills with the same name can be entirely different documents. More on that when we get to vendoring.

The CLI knows how to install and update skills. What it doesn't know is that my other machines exist. That part is on me, and the answer, as usual, was [the dotfiles repo]({{ site.url }}{% post_url 2025-10-20-my-dotfiles-setup-with-gnu-stow %}).

## One Directory Serves Two Claudes

Before any syncing between machines, there was a local problem to solve: two Claude accounts on the same box. The skills.sh CLI keeps a single global lockfile, so it has no way to represent one account having a different skill set from the other. Running it once per config directory would double the work to produce a state its manifest can't describe anyway.

So I stopped pretending the accounts differ. Both profiles symlink their skills directory to one canonical location:

```
~/.claude-personal/skills ─┐
~/.claude-dsf/skills ──────┴─→ ~/.claude-shared/skills/
```

Claude Code resolves its global skills directory as `$CLAUDE_CONFIG_DIR/skills`, and the CLI does the same. My sync script exports `CLAUDE_CONFIG_DIR=~/.claude-shared` before calling it, so one `skills add` lands in the shared directory and both accounts see it. `install.sh` creates the symlinks as part of wiring up a new machine.

One sharp edge worth knowing about: `~/.claude-shared/skills` must sit exactly two levels below `$HOME`. When `skills update` runs, it replaces installed folders with *relative* symlinks into its store (`../../.agents/skills/<name>`), which only resolve from that depth. A deeper path works fine right up until the first update, then every skill breaks at once. I learned this the way you learn most things about symlinks.

## The Catalog Is the Interesting File

The piece that actually crosses machines is a committed manifest, `skills/skill-lock.json` in the dotfiles repo. It's generated, never hand-edited, and each entry records where a skill came from:

```json
"herdr": {
  "source": "herdrdev/herdr",
  "sourceType": "github",
  "sourceUrl": "https://github.com/herdrdev/herdr.git",
  "skillPath": "skills/herdr/SKILL.md"
}
```

You might ask why I don't just commit the CLI's own lockfile. I tried. The live file at `~/.agents/.skill-lock.json` carries `installedAt` and `updatedAt` timestamps plus UI state that differs per machine, so committing it raw means three machines rewriting the same lines every day and racing each other on push. The sync script strips it down to the set of skills and their sources, sorted, so the committed file only changes when the skill set actually changes. Most days the catalog step is a no-op, which is exactly what you want from a file three machines share.

## sync.sh Does the Rounds

The script itself, `skills/sync.sh`, is about four steps: pull the repo, install anything the catalog lists that this machine is missing, run `npx skills update -g` to pull upstream changes for everything, then re-normalise the live lockfile back into the catalog and commit-push if it changed. Commits are labelled with the hostname (`skills: sync catalog from Christophers-MacBook-Pro`), which makes the git log a nice little audit trail of which machine learned what.

The "is it installed" check is stricter than you'd think it needs to be. A skill only counts as present when its folder actually exists in `~/.claude-shared/skills`; the lockfile alone isn't trusted, because it retains entries from installs made under a different `CLAUDE_CONFIG_DIR` that Claude can't load from here, and a symlink pointing at a deleted store entry counts as absent. The payoff is that a half-migrated or hand-mangled machine repairs itself on its next run instead of insisting everything is fine.

Each machine runs this daily at 09:00. On the Mac that's a launchd agent (with the nice property that a sleeping laptop runs it on next wake); on Linux it's a cron entry. Both append to a log, and the logs matter, because scheduled runs fail in quiet ways. The one that bit me: cron gets no ssh-agent, so on a machine whose git key has a passphrase the push fails. The script keeps the commit local and retries next run, so nothing breaks loudly, but repeated failures pile up local commits until `git pull --ff-only` starts refusing and that machine silently stops receiving updates. A repeated `push failed` in the log is the thing to watch for. In practice a machine that only consumes skills never commits anything, so this only matters where I actually add skills; that machine gets a passphraseless deploy key.

Before trusting a scheduler I run the script under an environment as bare as cron's:

```sh
env -i HOME="$HOME" PATH=/usr/bin:/bin /bin/sh -c '~/dotfiles/skills/sync.sh --dry-run --verbose'
```

`--verbose` prints which `npx` and `node` got resolved, which is the thing most likely to differ on a fresh machine. The script probes asdf, mise, nvm, bun and Homebrew, preferring version managers so an unattended run uses the same node an interactive shell would.

## Removals Are Deliberately Awkward

A normal sync run only ever adds and updates. A skill that's in the catalog but missing locally reads as "needs installing", not "was deleted", so `npx skills remove` on its own doesn't stick; the next sync sees the catalog still listing it and puts it straight back. Actually dropping one takes two steps:

```sh
npx skills remove <skill> -g
skills/sync.sh --prune
```

`--prune` skips the restore step and rebuilds the catalog from what's really installed, which publishes the removal to the other machines on their next run.

The additive default is deliberate, and I'd defend it. A machine that hasn't synced in weeks would otherwise read as a deletion of everything added since, and recovering from an accidental wipe costs far more than removing a skill by hand on three boxes. Scheduled runs never prune.

## Trust Nothing Upstream Says About Itself

Two gotchas from the first week deserve their own paragraphs.

First, "deleted upstream" almost never means deleted. The CLI resolves each skill at the exact source and path recorded in the lockfile; if the repo gets renamed, transferred to an org, or moves its `SKILL.md`, that lookup 404s and the update run reports the skill as deleted by its author. Nothing breaks in the moment, since the installed copy keeps working, so it's easy to scroll past until a fresh machine fails to restore it. `gh api repos/<source> --jq .full_name` follows renames and reports where the repo actually lives now; then it's remove, re-add from the new location, sync.

Second, check what you actually installed. A `skillPath` of `SKILL.md` at a repo root makes the CLI treat the entire checkout as the skill folder. The herdr skill was 41M of Rust source and vendored dependencies until upstream moved its file down into `skills/herdr/`. Claude does not need the compiler to read the instructions.

## What's Actually Installed Right Now

The catalog currently lists 24 skills, plus one vendored. Roughly by group:

- **Tooling skills** that teach Claude to drive my own stack: [herdr](https://herdr.dev/) (agent multiplexer control) and [hunk-review](https://github.com/modem-dev/hunk) (the live diff review sessions from the last post), each maintained upstream by the tool's own repo, which is where they should live.
- **[Penpot AI Kit](https://github.com/penpot/penpot-ai-kit)**, twelve `penpot-*` skills covering design work end to end: building screens and components, accessibility and token audits, design-to-code review, handoff documents, layer renaming, migration, and a router skill that picks between them.
- **[Matt Pocock's skills](https://github.com/mattpocock/skills)**, nine of them: codebase-design, domain-modeling, wayfinder and triage for finding your way around code, grilling and grill-with-docs for having Claude interrogate a plan before writing anything, resolving-merge-conflicts, handoff, and teach.
- **llm-council**, which convenes several models to argue about a question instead of trusting one answer.
- **human-writing**, the one vendored skill, living in the dotfiles rather than installed from the registry. The entries under that name on skills.sh are different documents by different authors, so there's no upstream to install from. It's also the skill helping to draft this post, which you may make of what you will.

The vendored list is deliberately short. Vendored copies drift silently, which is the exact problem this whole setup exists to solve; hunk-review sat in my dotfiles going stale until I noticed it was upstream's own skill and switched to installing it properly.

## What This Doesn't Cover

Skills turn out to be the only thing that needed custom machinery. Claude Code plugins (Superpowers, the Azure plugin, chrome-devtools-mcp, code-review, frontend-design in my case) are declared in `settings.json` under `enabledPlugins`, and that file is already committed and symlinked into both accounts, so plugins propagate on `git pull` for free. Slash commands likewise just live in the shared `commands/` directory. And cloud sessions, Cowork and claude.ai, read account-level skills configured in the web UI; nothing in this setup reaches them, which is mildly annoying and a problem for another day.

If you already keep dotfiles in git, the whole thing is one script, one generated JSON file, and a scheduler entry. The [skills directory in my dotfiles](https://github.com/penkin/dotfiles/tree/main/skills) has all of it, README included, if you want to steal the pattern. And this is still my personal setup, synced through my personal repo; how any of this works for a team, where the config wants to live in the project and not in someone's home directory, is the post I keep threatening to write next.
