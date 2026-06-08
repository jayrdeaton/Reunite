import { execSync } from 'node:child_process'

import { Platform, WindowRef } from '../interface'

function run(script: string): string {
  return execSync(script, { encoding: 'utf-8' }).trim()
}

// WindowRef.id format: "AppName:windowIndex" e.g. "Terminal:1"
function parseRef(id: string): [string, number] {
  const colon = id.lastIndexOf(':')
  return [id.slice(0, colon), parseInt(id.slice(colon + 1), 10)]
}

function getVisibleApps(): string[] {
  const output = run(`osascript -e 'tell application "System Events"
    set result to {}
    repeat with proc in (every process whose visible is true)
      if (count of windows of proc) > 0 then
        set end of result to name of proc
      end if
    end repeat
    result
  end tell'`)
  if (!output) return []
  return output
    .split(', ')
    .map((s) => s.trim())
    .filter(Boolean)
}

const darwin: Platform = {
  activateApp(app) {
    run(`osascript -e 'tell application "${app}" to activate'`)
  },

  doScript(script = '') {
    run(`osascript -e 'tell application "System Events" to tell application "Terminal"
      do script("${script}")
    end tell'`)
  },

  getDisplaySize() {
    return run(`osascript -e 'tell application "Finder"
      get bounds of window of desktop
    end tell'`)
      .split(', ')
      .map(Number)
  },

  getWindows(apps) {
    const targets = apps.length > 0 ? apps : getVisibleApps()
    const windows: WindowRef[] = []
    for (const app of targets) {
      const count = parseInt(
        run(`osascript -e 'tell application "System Events" to tell application process "${app}"
          count of windows
        end tell'`),
        10
      )
      for (let i = 1; i <= count; i++) {
        windows.push({ app, id: `${app}:${i}` })
      }
    }
    return windows
  },

  getWindowBounds(win) {
    const [app, num] = parseRef(win.id)
    return run(`osascript -e 'tell application "${app}"
      get bounds of window ${num}
    end tell'`)
      .split(', ')
      .map(Number)
  },

  repositionWindow(win, x, y, width, height) {
    const [app, num] = parseRef(win.id)
    run(`osascript -e 'tell application "System Events" to tell application process "${app}"
      try
        get properties of window ${num}
        set position of window ${num} to {${x}, ${y}}
        set size of window ${num} to {${width}, ${height}}
      end try
    end tell'`)
  },

  resizeWindow(win, width, height) {
    const [app, num] = parseRef(win.id)
    run(`osascript -e 'tell application "System Events" to tell application process "${app}"
      try
        get properties of window ${num}
        set size of window ${num} to {${width}, ${height}}
      end try
    end tell'`)
  }
}

export default darwin
