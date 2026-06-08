# Reunite — Modernization Plan

Reunite arranges terminal (and other app) windows into a saved grid layout for the current display.

## What stays the same
- Core concept: detect display, look up saved config, snap windows into a grid
- `setup` subcommand to save a config for the current display
- `new` subcommand to open a new window into the next grid slot
- `--fill` flag to pad the grid with empty windows

## Changes

### CJS → ESM
All files move from `require`/`module.exports` to `import`/`export`.

### Storage: `emporium` → JSON file
One model, a handful of rows. A JSON file at `~/.config/reunite/configs.json` is sufficient.
No new dependency needed — `node:fs` reads and writes it directly.

### Multi-app support
- Default behavior: arrange windows across **all** visible apps using `System Events`
- `--app <name>` flag narrows arrangement to one app (e.g. `--app Terminal`)
- `repositionWindow` and related osascript helpers are generalized to accept an app name
- `setup` stores an optional `app` field (null = all apps) if you want per-app saved layouts

### osascript helpers
- Replace callback-based `runCommand` with `execSync` from `node:child_process`
- Generalize `repositionWindow`, `countWindows`, `getWindowBounds` to accept an app name param
- `getDisplaySize` stays as-is (uses Finder desktop bounds, unrelated to app targeting)

### CLI / termkit
- Update to current termkit ESM API (matches Scripts conventions)
- Clean up `version` subcommand — `--version` flag is enough

## File structure (target)
```
src/
  commands/       osascript wrappers (getDisplaySize, countWindows, getWindowBounds, repositionWindow, etc.)
  actions/        reunite.js, setup.js
  store.js        read/write ~/.config/reunite/configs.json
  program.js      termkit CLI definition
bin/
  cli.mjs
```

## Requires
- macOS Accessibility permission for `System Events` (needed for multi-app window control)
- Node >= 20
