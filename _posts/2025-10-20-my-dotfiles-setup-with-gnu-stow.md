---
layout: post
title: My Dotfiles Setup with GNU Stow
description: How I use GNU Stow to manage dotfiles across macOS and Arch Linux. Simple symlink-based config management for zsh, neovim, and development tools.
categories: ["Development", "Tools", "Productivity", "Configuration"]
---

# My Dotfiles Setup with GNU Stow

I've been maintaining my [dotfiles](https://www.freecodecamp.org/news/dotfiles-what-is-a-dot-file-and-how-to-create-it-in-mac-and-linux/) for a while now, and I've finally settled on a setup that works really well across both my macOS machine and my [Arch Linux](https://archlinux.org/) box running [Omarchy](https://omarchy.org/). The key to making this work? [GNU Stow](https://www.gnu.org/software/stow/).

If you're not familiar with GNU Stow, it's a symlink farm manager. In plain English, it creates symbolic links from a central dotfiles directory to wherever your configs actually need to live. This means you can keep everything in one place, version control it all, and selectively install just the configs you need on any given machine.

## Why GNU Stow?

I haven't really tried any of the other solutions out there but Stow just clicks for me because it's:

- **Simple** - It's just symlinks. Nothing fancy.
- **Modular** - Each tool gets its own package that can be installed independently.
- **Transparent** - You can see exactly what's linked where.
- **Reversible** - `stow -D` removes all the symlinks, no mess left behind.

## The Structure

My dotfiles are organised into modular packages in `~/dotfiles`, with each tool or category getting its own directory:

```
~/dotfiles/
├── zsh/           # Shell configuration
├── git/           # Git configuration
├── nvim/          # Neovim editor
├── zellij/        # Terminal multiplexer
├── hyprland/      # Wayland compositor (Linux)
├── macos-tools/   # macOS-specific tools
└── ...
```

Each package contains the files in the structure they'd normally live in your home directory. For example, the `zsh` package has `.zshrc`, `.zsh-darwin.sh`, `.zsh-linux.sh`, and so on.

## The Setup Scripts

To make getting started easier, I created installation scripts for each platform. They handle package installation, prompt for optional components, and automatically stow the configs.

For Arch Linux:
```bash
cd ~/dotfiles
./install-arch.sh
```

For macOS:
```bash
cd ~/dotfiles
./install-macos.sh
```

These scripts will install the necessary packages (like zsh, neovim, zellij, fzf, etc.) and then selectively stow the configs you want.

## OS-Specific Configurations

One challenge with cross-platform dotfiles is handling the differences between operating systems. I solved this with OS-specific configuration files that get sourced automatically.

In my zsh setup, I have:
- `.zsh-darwin.sh` - macOS-specific settings (Homebrew paths, ASDF, etc.)
- `.zsh-linux.sh` - Linux-specific settings (Paru AUR helper, ASDF, etc.)

The main `.zshrc` detects which OS you're on and sources the appropriate file. This keeps the platform-specific cruft out of the main config.

## Key Tools

Here are just some of the tools I'm using currently across both systems:

### Shell & Terminal

- **[zsh](https://www.zsh.org/)** with Zinit plugin manager and Powerlevel10k prompt
- **[zellij](https://zellij.dev/)** as a modern terminal multiplexer
- **[fzf](https://junegunn.github.io/fzf/)** for fuzzy finding
- **[eza](https://eza.rocks/)** as a modern ls replacement
- **[zoxide](https://crates.io/crates/zoxide)** for smart directory jumping

### Development:**
- **[Zed](https://zed.dev/)** editor (my new favourite)
- **[neovim](https://neovim.io/)** for editing
- **[lazygit](https://github.com/jesseduffield/lazygit)** for a nice Git TUI
- **[lazydocker](https://github.com/jesseduffield/lazydocker)** for a nice Docker TUI
- **[lazysql](https://github.com/jorgerojas26/lazysql)** for a nice SQL TUI

### Nic
- **[yazi](https://yazi-rs.github.io/)** as a terminal file manager
- **[btop](https://github.com/aristocratos/btop)** for system monitoring

### Arch/Omarchy Desktop
- **[Hyprland](https://hypr.land/)** as a Wayland compositor
- **[Waybar](https://github.com/Alexays/Waybar)** for status bar
- **[Wofi](https://github.com/SimplyCEO/wofi)** for application launcher

### macOS Things
- **[Ghostty](https://ghostty.org/)** terminal

## Using the Setup

Once you've cloned the repo to `~/dotfiles`, using it is straightforward:

Install just the essentials:
```bash
stow zsh git nvim zellij
```

Full Arch Linux desktop:
```bash
stow zsh git nvim zellij hyprland wayland-tools gtk lazygit yazi btop
```

macOS with development tools:
```bash
stow zsh git nvim zellij macos-tools lazygit yazi btop ideavim
```

And if you want to remove something:
```bash
stow -D nvim
```

## Personal Scripts and Secrets

I keep personal scripts and secrets in `~/.zsh_scripts/` and `~/.zsh_secrets/` respectively. These directories are gitignored, but any `.sh` files in them are automatically sourced by my zsh config. This gives me a place for machine-specific or sensitive configs that don't belong in version control.

## The Payoff

The real benefit of this setup became clear when I set up my Arch Linux machine. Instead of spending hours remembering which configs I needed and manually copying everything over, I just ran the install script and stowed the packages I wanted. Five minutes later, my terminal felt like home.

Same goes for when I inevitably mess something up. I can nuke my configs, re-stow, and be back up and running immediately. No hunting for backup files or trying to remember what I changed.

## Try It Out

You can find my dotfiles at [github.com/penkin/dotfiles](https://github.com/penkin/dotfiles). Feel free to use them as reference or inspiration for your own setup.

If you've never used Stow before, I'd highly recommend giving it a shot. It's one of those tools that just makes sense once you start using it.

## Warning

I am always playing with my dotfiles, tweaking them, and experimenting with new tools. This means that some of the configurations may not work perfectly out of the box, and you may need to make some adjustments to suit your needs.
