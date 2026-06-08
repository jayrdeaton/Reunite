# reunite

Snap app windows into a saved grid layout. Run `reunite setup` once per display to record the layout, then `reunite` to snap everything back into place.

## Installation

```bash
npm install -g reunite
```

## Quick start

Open your apps and arrange one window to cover the area you want to use as the grid. Then save the layout:

```bash
reunite setup 3x2 --apps Terminal "Google Chrome" Code
```

After that, run `reunite` at any time to snap all three apps' windows back into a 3-column × 2-row grid.

## Commands

### `reunite [layout]`

Snaps windows into the saved grid for the current display. Pass a layout override to use a different grid without saving it.

```bash
reunite          # use saved layout
reunite 2x2      # override grid on the fly
reunite --fill   # fill empty slots with new Terminal windows (macOS only)
```

### `reunite setup [layout]`

Saves a grid layout for the current display. Reads the position and size of the first window in `--apps` (or Terminal if omitted) to establish the grid area, then saves the layout to `~/.config/reunite/configs.json`.

```bash
reunite setup              # 3×2 grid, all visible apps
reunite setup 4x3          # custom grid size
reunite setup --apps Terminal "Google Chrome" Code
reunite setup --activate   # bring windows to foreground on reunite
```

| Flag | Description |
|------|-------------|
| `--apps app1 app2 ...` | Apps to include (default: all visible windows) |
| `--activate` | Bring windows to the foreground on each reunite |
| `--no-activate` | Leave focus alone (default) |

### `reunite new [scripts...]`

Opens one or more new Terminal windows, each placed in the next available grid slot. Optionally runs a shell command in each. macOS only.

```bash
reunite new
reunite new "npm run dev" "npm run test"
```

## Platform support

| Feature | macOS | Linux (X11) |
|---------|-------|-------------|
| Snap existing windows | ✓ | ✓ |
| Multi-app targeting | ✓ | ✓ |
| `--fill` / `new` (open Terminal windows) | ✓ | — |
| Wayland | — | — |

### Linux setup

Install `wmctrl` and `xrandr`:

```bash
# Debian / Ubuntu
sudo apt install wmctrl x11-xserver-utils

# Fedora
sudo dnf install wmctrl xorg-x11-server-utils

# Arch
sudo pacman -S wmctrl xorg-xrandr
```

**App names on Linux** use the WM_CLASS (the process/class name), not the display name. Common mappings:

| App | macOS name | Linux name |
|-----|-----------|------------|
| Terminal | `Terminal` | `gnome-terminal`, `alacritty`, `xterm` |
| Chrome | `Google Chrome` | `google-chrome` |
| VS Code | `Code` | `code` |
| Firefox | `Firefox` | `firefox` |

```bash
# Linux example
reunite setup 3x2 --apps alacritty google-chrome code
```

## Config

Layouts are stored in `~/.config/reunite/configs.json` — one entry per display. You can edit the file directly to adjust columns, rows, bounds, or the app list without re-running setup.

```json
[
  {
    "display": [0, 0, 2560, 1440],
    "columns": 3,
    "rows": 2,
    "apps": ["Terminal", "Google Chrome", "Code"],
    "bounds": [0, 38, 2560, 1440],
    "size": [2560, 1402],
    "activate": false
  }
]
```

## Requirements

Node 20 or later. On Linux, `wmctrl` and `xrandr` must be installed and an X11 session must be active.

## License

ISC
