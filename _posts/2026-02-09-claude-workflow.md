---
layout: post
title: "How I'm Actually Using Claude in My Daily Workflow"
date: 2026-02-09
categories: [ai, development, tools, productivity]
description: "A practical look at how I use Claude for real development work—from the Claude.md file setup to plan mode workflows, treating it like a junior programmer, and the importance of always reviewing your code."
youtubeId: lJNjDoJi6hQ
---

We did a quick knowledge-sharing session at work recently where I showed the team how I've been using [Claude Code](https://claude.com/product/claude-code). I thought it would be worth capturing some of those insights here for anyone else who may be interested.

## Two Different Tools for Two Different Jobs

I've settled into a pattern where I use two different Claude tools for different purposes. I use the [Claude Desktop App](https://claude.com/download) for quick, back-and-forth questions. Like when I was figuring out [Flutter](https://flutter.dev/) stuff for a potential project, or working through versioning for project's build pipeline. It's great for that kind of exploratory conversation where I'm just trying to understand something or bouncing thoughts and ideas around.

For actual project work where I'm making code changes, I use Claude Code.

I'm a terminal person; I've been on Linux/OSX for years, so I'm super comfortable in the command line. That makes Claude Code feel really natural to me.

## The CLAUDE.md File is Your Secret Weapon

Here's something that makes a huge difference: when you start a Claude Code project, you get this `CLAUDE.md` when you run the `/init` command. What it does is analyse your codebase, figure out how everything works together, what libraries you're using, how your components are structured; basically builds this whole context about your project.

The cool thing is you can add rules to this file. Like if Claude keeps putting your controllers in the wrong directory, you just tell it in the `CLAUDE.md` file: "Controllers go here." Or you can say "We're doing TDD, so always write the test first, make it fail, then write the code." You give it these guidelines and it follows them.

If you're just getting started with Claude Code, I highly recommend watching [this video on creating an effective CLAUDE.md file](https://www.youtube.com/watch?v=lJNjDoJi6hQ); it's a great primer on how to set up your project context properly.

{% include youtube-player.html id=page.youtubeId %}

## Plan Mode Changes Everything

The real game-changer for me has been plan mode. Let me give you a real example.

We had a ticket to add postal code fields to employee addresses. The team estimated it at four hours because there was front-end work, a detail view, and potentially API work if the backend didn't support it.

I went into plan mode and basically said: "In the employee screen we have address line 1, line 2, city, postal code, province, and country. But in the company view we're missing some of these fields."

Claude came back with a plan. This is what I love about it; it doesn't just start coding. It says "Okay, here's how I'm thinking about this. I need to modify these files. Here's what needs to change in the form. I see there's a handle change function, I'll need to update that. I checked your API and it already supports all these fields, so this is just a UI change."

Then it lists out exactly what it's going to verify to make sure it worked.

We were in standup. I hit enter on that prompt. Five minutes later, the whole thing was done. Data saving, everything looking exactly like the rest of the system. A four-hour task done in five minutes.

## It's Like Working with a Junior Programmer

Here's how I think about Claude: it's a junior programmer.

If I just gave a junior dev a big spec file and said "make this happen," I'd get the same unpredictable results I'd get from Claude. You need to guide it. You need to break things down. You need to explain things.

What Claude is really good at is going through all your files, understanding how everything works together, what talks to what. It has documentation for every library you're using. It's just really good at that stuff.

What's important though is you need to understand context of the environment you're working in. If it is your junior to work with, then you need to guide it, break things down, give it the right context etc.

## When I Actually Use It

Someone asked if I use it for complex business logic. Yup, I do. 

For example, we had these identification fields that all needed specific validation. I had a screenshot of the requirements. I literally just copied the image, pasted it into Claude, and said "We need to add validation to these fields."

It's really good at understanding images and designs, especially if you already have a component system. It figures out how to make things look consistent.

But I broke it up. I told it to do the PAYE reference first. Then the SDL reference. Then the UIF reference. I didn't just dump the whole thing on it.

## Clear the Context Between Tasks

One thing I do religiously after finishing a feature, I clear the context. LLMs work better with smaller contexts. You don't want to give it this massive history of everything you've ever done in the project.

I keep tasks small and focused. Plan one thing, check the plan, do the thing, clear the context, rinse and repeat.

## The Planning Conversation Matters

When you're in plan mode, Claude will ask clarifying questions if it's not sure about something. Like when I asked it to move the address fields to the right column, it asked: "Should the same change be applied to the read-only detail view?"

It was great because in text it kind of draws out the screen with the main labels on the page. You can see visually what it's planning to do before it does it. You can catch mistakes early. You can say "Actually, no, put the address at the bottom, not the top."

It's like pair programming. You're having a conversation about what needs to happen.

## I Still Review Everything

This is critical: you still need to review your code.

I still use my IDE to look at diffs. I go through each change and make sure it makes sense. I'm checking that it didn't break anything. I'm verifying the logic is correct.

Claude is a tool, not a replacement for thinking. I'm the one who understands the problem, makes the decisions, and takes responsibility for the code. Claude just helps me get there faster.

## Cross-Project Work

Oh, and another thing—Claude can work across projects. On one of my projects, I've given it access to both the main UI project and the API/data projects. It knows about both. So when I'm making a change in it, it can go check the API to see if it already supports what I need.

You just tell it in the `CLAUDE.md` file where these other projects are, and it does the rest.

## Just Start Using It

My advice? Just start using it. Even if you're not having it write code for you, use it to ask questions about the codebase. Use it to understand problems and potential solutions. Ask it why it did something. Don't just accept the code and move on. Use it as a learning tool. Build your understanding as you go.

It's not about having the tool do everything for you. It's about getting into the habit of using it to help you work more effectively. The four-hour tasks that take five minutes? Those add up. But only if you actually use the tool.

## There's So Much More to Explore

I should mention what I've shared here is really just scratching the surface. There's a whole ecosystem around Claude Code that I'm still learning about.

Skills, for instance. You can create custom skills that teach Claude how to do specific things in specific ways for your projects. Think of them like specialised training modules.

Then there are [MCP](https://modelcontextprotocol.io/docs/getting-started/intro) servers that let Claude integrate with external tools and services. Want Claude to interact with your Slack workspace? Your Google Drive? Your database? MCP servers make that possible.

Some people are even creating orchestration setups where they use different Claude models for different tasks. Opus for planning and strategy, Sonnet for the actual coding, specialized agents for code review. They run tasks in parallel. It's pretty wild what's possible.
