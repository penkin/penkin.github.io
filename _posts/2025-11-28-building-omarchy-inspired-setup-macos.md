
---
layout: post
title: Building an Omarchy-Inspired Setup on macOS
description: 
categories: ["Development", "Tools", "Productivity", "Configuration"]
--- 

# Building an Omarchy-Inspired Setup on macOS

<figure>
    <img src="{{ '/assets/img/tiling-screenshot.png' | prepend: site.url }}" alt="Example of how it looks.">
    <figcaption>Fig1. - My coding setup</figcaption>
</figure>

When I first discovered [Omarchy](https://omarchy.org/), I loved how clean and out or the way it felt. I loved it's 
keyboard-driven approach to desktop computing. The tiling window management via Hyprland, the minimal aesthetic with 
sharp corners, and the snappy, animation-free workspace switching spoke to my sensibilities. There was just one 
problem: my MacBook Pro M1 can't run Omarchy as a Linux distribution.

Rather than compromise, I decided to recreate the Omarchy experience on macOS (sort of). This post documents my journey building 
a sophisticated tiling window manager setup using `yabai`, `sketchybar`, and `skhd` - bringing the Omarchy philosophy 
to the Mac.

## The Vision

What makes Omarchy special isn't just the tiling - it's the philosophy behind it:

- **Keyboard-first interaction**: Mouse usage should be minimal
- **Instant workspace switching**: No animations, no delays
- **Clean aesthetics**: Sharp corners, minimal chrome, purposeful design
- **Focus-driven workflow**: One task, one workspace, maximum concentration

While I can't run Hyprland on macOS, I can absolutely adopt these principles using the right tools.

## The Foundation: yabai + sketchybar + skhd

My setup relies on three complementary tools:

- **[yabai](https://github.com/koekeishiya/yabai)**: A tiling window manager that gives us BSP (Binary Space Partitioning) layouts and workspace management
- **[sketchybar](https://github.com/FelixKratz/SketchyBar)**: A customizable status bar that replaces the macOS menu bar
- **[skhd](https://github.com/koekeishiya/skhd)**: A hotkey daemon for binding keyboard shortcuts

Together, these tools transform macOS into a keyboard-driven, tiling-focused environment that feels remarkably close to Omarchy.

## The Scripting Addition Challenge

Getting full workspace control with yabai required installing its "scripting addition," which meant partially disabling 
System Integrity Protection (SIP). This was one of the trickier aspects of the setup - I had to reboot into Recovery Mode 
and selectively disable certain SIP protections while keeping others enabled for security.

After modifying SIP, I installed yabai's scripting addition and configured passwordless sudo for it in `/private/etc/sudoers.d/yabai` 
so it could load automatically on startup. I added `sudo yabai --load-sa` at the top of my `~/.config/yabai/yabairc` to 
ensure it loads every time yabai starts.

## yabai Configuration: Tiling That Works

My yabai configuration is focused on creating a clean, predictable tiling environment:

```bash
# BSP layout for automatic tiling
yabai -m config layout bsp

# Padding and gaps for visual breathing room
yabai -m config top_padding    42  # Accounts for sketchybar height
yabai -m config bottom_padding 8
yabai -m config left_padding   8
yabai -m config right_padding  8
yabai -m config window_gap     8

# Mouse follows focus for smoother workflow
yabai -m config mouse_follows_focus on

# Keep certain apps floating
yabai -m rule --add app="^System Settings$" manage=off
```

The padding configuration is crucial - the 42-pixel top padding accounts for my 34-pixel sketchybar plus some margin, 
preventing windows from sliding over my sketchybar.

## Opening apps on certain workspaces

One of the pros of this setup is getting into a flow with how you work. One of the other things that I did was to open
certain apps on certain workspaces. This adds to the predictability of always knowing which of my common apps are where
so when I need to message someone on slack I know its on workspace 3 always etc.

```bash
yabai -m rule --add app="^Arc$" space=1
yabai -m rule --add app="^Ghostty$" space=2
yabai -m rule --add app="^Microsoft Teams$" space=3
yabai -m rule --add app="^Slack$" space=3
yabai -m rule --add app="^WhatsApp$" space=4
yabai -m rule --add app="^Signal$" space=4
yabai -m rule --add app="^Discord$" space=4
yabai -m rule --add app="^Proton Mail$" space=5
yabai -m rule --add app="^Mail$" space=6
yabai -m rule --add app="^Calendar$" space=6
```

I did however run into some really strange behaviour doing this. Often for some reason suddently all my workspace 2 apps were
on workspace 1 or 3 were on 4! That is when I found out that MacOS does some fancy workspace fiddling depening on how you use
them.

To disable this you can easily do it in System Settings, go to `Desktop & Dock` and unchecking 
`Automatically rearrange Spaces based on most recent use`.

<figure>
    <img src="{{ '/assets/img/system-settings-dock.png' | prepend: site.url }}" alt="System Settings for Desktop & Dock.">
    <figcaption>Fig2. - System Settings</figcaption>
</figure>

### Multi-Monitor Support

One of the key improvements I made was proper multi-monitor support. When I connect my external display, I want spaces 
1-6 on my main monitor and spaces 7-12 on the secondary display. This required careful configuration of both yabai and 
sketchybar to understand display relationships.

## sketchybar: The Minimal Status Bar

My sketchybar configuration embraces minimalism while providing essential information:

```bash
# Bar appearance - dark with sharp corners
sketchybar --bar position=top \
                 margin=0 \
                 y_offset=0 \
                 corner_radius=0 \
                 height=34 \
                 color=0xC0000000

# Defaults for all items - light grey text on dark background
default=(
  padding_left=0
  padding_right=4
  icon.font="JetBrainsMono Nerd Font:Regular:14.0"
  label.font="JetBrainsMono Nerd Font:Regular:14.0"
  icon.color=0xff9e9e9e
  label.color=0xff9e9e9e
  icon.highlight_color=0xffffffff
  label.highlight_color=0xffffffff
)
```

### Workspace Indicators

The workspace indicators dynamically update to show which spaces belong to which display:

```bash
# Add space items
for i in {1..10}; do
  sketchybar --add space space.$i left \
             --set space.$i \
                   associated_space=$i \
                   icon=$i \
                   script="$PLUGIN_DIR/spaces.sh"
done
```

The `spaces.sh` plugin queries yabai to determine the current space and display, highlighting the active workspace.

### Status Items

On the right side, I keep things minimal but informative:

- **WiFi**: Shows connection status
- **Battery**: Current charge level
- **Volume**: Audio level indicator
- **Clock**: Time display

Each uses a simple plugin script that updates on relevant events.

## skhd: Keyboard-Driven Everything

The real magic happens in my skhd configuration. I've mapped every window management operation to keyboard shortcuts, 
drawing inspiration from both Omarchy and vim:

### Window Management

```bash
# Terminal
cmd - return : ghostty +new-window

# Window operations
cmd - w : yabai -m window --close
cmd - t : yabai -m window --toggle float
cmd - f : yabai -m window --toggle zoom-fullscreen

# Focus windows (vim keys)
cmd - h : yabai -m window --focus west
cmd - j : yabai -m window --focus south
cmd - k : yabai -m window --focus north
cmd - l : yabai -m window --focus east

# Move/Swap windows
cmd + shift - h : yabai -m window --swap west
cmd + shift - j : yabai -m window --swap south
cmd + shift - k : yabai -m window --swap north
cmd + shift - l : yabai -m window --swap east

# Resize windows
cmd + alt - h : yabai -m window --resize left:-30:0
cmd + alt - j : yabai -m window --resize bottom:0:30
cmd + alt - k : yabai -m window --resize top:0:-30
cmd + alt - l : yabai -m window --resize right:30:0
```

### Workspace Switching

The workspace switching is designed to work seamlessly across multiple displays:

```bash
# Switch to workspace (accounts for multi-monitor)
cmd - 1 : yabai -m space --focus $(yabai -m query --displays --display | jq '.spaces[0]')
cmd - 2 : yabai -m space --focus $(yabai -m query --displays --display | jq '.spaces[1]')
# ... through cmd - 0

# Move window to workspace
cmd + shift - 1 : yabai -m window --space $(yabai -m query --displays --display | jq '.spaces[0]')
cmd + shift - 2 : yabai -m window --space $(yabai -m query --displays --display | jq '.spaces[1]')
# ... through cmd + shift - 0

# Quick workspace navigation
cmd - tab : yabai -m space --focus next || yabai -m space --focus first
cmd + shift - tab : yabai -m space --focus prev || yabai -m space --focus last
```

### Monitor Management

```bash
# Switch between monitors
cmd + ctrl - left : yabai -m display --focus west
cmd + ctrl - right : yabai -m display --focus east

# Move window to another monitor
cmd + shift + ctrl - left : yabai -m window --display west; yabai -m display --focus west
I did however run into some really strange behaviour doing this. Often for some reason suddently all my workspace 2 apps were
```

### Layout Management

```bash
# Layout operations
cmd - e : yabai -m window --toggle split
cmd - b : yabai -m space --balance
cmd - r : yabai -m space --rotate 270
```

### Screenshots

I wanted screenshot functionality since often I need to take screenshots to attach to my PRs. What I did was
add configs to allow me to either take a full screenshot, an interactive screenshot (both to files) and then 
one that goes straight to clipboard:

```bash
# Screenshots using 's' key
cmd + shift - s : screencapture -x ~/Desktop/screenshot-$(date +%Y%m%d-%H%M%S).png
cmd + alt - s : screencapture -i -x ~/Desktop/screenshot-$(date +%Y%m%d-%H%M%S).png
cmd + ctrl - s : screencapture -i -c -x
```

The `-x` ensures that you don't hear that camera noise that screenshots normally makes. Nice and quiet.

## The Workflow

With this setup, my typical workflow looks like this:

1. **Launch terminal**: `cmd + return` opens a new Ghostty window
2. **Switch workspaces**: `cmd + 1` through `cmd + 0` for instant workspace switching
3. **Focus windows**: `cmd + h/j/k/l` for vim-style navigation
4. **Move windows**: `cmd + shift + h/j/k/l` to swap window positions
5. **Multi-monitor**: `cmd + ctrl + left/right` to switch between displays

Everything is keyboard-driven, instant, and predictable. No animations, no delays - just pure efficiency.

## Dotfiles Integration

One of the benefits of using GNU Stow is how seamlessly this integrates with my overall dotfiles setup. My yabai, sketchybar, and 
skhd configurations live in their standard locations:

- `~/.config/yabai/yabairc` - yabai window manager config
- `~/.config/sketchybar/sketchybarrc` - status bar config
- `~/.config/sketchybar/plugins/` - status bar plugins (spaces.sh, battery.sh, wifi.sh, volume.sh, clock.sh)
- `~/.skhdrc` - keyboard shortcut daemon config

These are organized in my dotfiles repository and managed with GNU Stow, making it easy to version control and deploy across machines. 
To set up these configurations on a new machine:

```bash
cd ~/dotfiles
./install-macos.sh  # Installs all dependencies via Homebrew
# Then stow the relevant packages
```

This modular approach means I can selectively install just the tools I need on each machine, whether it's my full desktop setup or a 
minimal configuration on a remote server.

## Lessons Learned

### What Works Well

- **Keyboard-driven workflow**: Once you internalize the keybindings, you rarely touch the mouse
- **Workspace-per-task**: Having dedicated workspaces for different contexts (coding, browsing, communication) reduces mental overhead
- **Multi-monitor support**: The dynamic workspace assignment across displays works beautifully
- **Minimal aesthetics**: The clean status bar and sharp window edges create a focused environment

### Challenges

- **SIP requirements**: Partially disabling System Integrity Protection makes some users uncomfortable, though I haven't experienced any issues
- **Learning curve**: There's definitely an adjustment period when moving from a traditional windowing system
- **Application compatibility**: Some apps don't play nicely with tiling (looking at you, System Settings)

### Compared to Omarchy

While this setup can't fully replicate Omarchy's Hyprland-powered experience, it captures the essential philosophy:

- Keyboard-first interaction? ✓
- Instant workspace switching? ✓
- Clean, minimal aesthetic? ✓
- BSP tiling? ✓ (though not identical to Hyprland)

The main differences are in polish and integration - Omarchy is a cohesive Linux distribution built around these concepts, while this is a 
collection of tools adapted to macOS. But for daily development work on a Mac, it gets remarkably close.

## Try It Yourself

If you're interested in seeing how I've configured everything, check out my [dotfiles repository](https://github.com/penkin/dotfiles). All 
my yabai, sketchybar, and skhd configurations are there, managed with GNU Stow for easy deployment.

Keep in mind this setup requires partially disabling SIP and has a learning curve as you internalize the keybindings. It's also opinionated 
to my workflow - you'll want to adapt it to your own preferences.

## Conclusion

Building an Omarchy-inspired setup on macOS has transformed how I interact with my computer. The keyboard-driven workflow, combined with 
predictable tiling and instant workspace switching, has made me more focused and productive.

While it took some effort to configure and required compromises compared to running Omarchy natively on Linux, the result is a professional 
development environment that honors the Omarchy philosophy while working within macOS's constraints.

If you value keyboard efficiency, minimal distractions, and a focus-driven workflow, I encourage you to explore tiling window management on 
macOS. The tools are mature, the community is active, and the productivity gains are real.
