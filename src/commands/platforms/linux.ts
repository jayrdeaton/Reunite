import { execSync } from 'node:child_process'

import { Platform, WindowRef } from '../interface'

function run(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8' }).trim()
}

interface WmEntry {
  id: string
  className: string
  x: number
  y: number
  width: number
  height: number
}

// wmctrl -lGx columns: id desktop x y w h WM_CLASS hostname title...
function listWindows(): WmEntry[] {
  return run('wmctrl -lGx')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const p = line.split(/\s+/)
      return {
        id: p[0],
        x: parseInt(p[2], 10),
        y: parseInt(p[3], 10),
        width: parseInt(p[4], 10),
        height: parseInt(p[5], 10),
        className: (p[6] ?? '').split('.')[0].toLowerCase()
      }
    })
}

const SYSTEM_CLASSES = new Set(['desktop', 'dock', 'panel', 'plasmashell', 'kwin', 'ksmserver'])

const linux: Platform = {
  activateApp(app) {
    run(`wmctrl -a "${app}"`)
  },

  doScript() {
    throw new Error('Opening new terminal windows is not yet supported on Linux — use `--fill` only on macOS')
  },

  getDisplaySize() {
    const xrandr = run('xrandr')
    // Prefer the primary monitor; fall back to the first connected one
    const match = xrandr.match(/connected\s+primary\s+(\d+)x(\d+)\+(\d+)\+(\d+)/) ?? xrandr.match(/connected\s+(\d+)x(\d+)\+(\d+)\+(\d+)/)
    if (!match) throw new Error('Could not determine display size from xrandr output')
    const [, w, h, x, y] = match.map(Number)
    return [x, y, x + w, y + h]
  },

  getWindows(apps) {
    const all = listWindows()

    if (apps.length === 0) {
      return all.filter((w) => !SYSTEM_CLASSES.has(w.className)).map((w) => ({ app: w.className, id: w.id }))
    }

    const windows: WindowRef[] = []
    for (const app of apps) {
      const needle = app.toLowerCase()
      const matched = all.filter((w) => w.className === needle || w.className.includes(needle))
      windows.push(...matched.map((w) => ({ app, id: w.id })))
    }
    return windows
  },

  getWindowBounds(win) {
    const w = listWindows().find((e) => e.id === win.id)
    if (!w) throw new Error(`Window ${win.id} not found`)
    return [w.x, w.y, w.x + w.width, w.y + w.height]
  },

  repositionWindow(win, x, y, width, height) {
    // Remove maximized state first so the move takes effect
    run(`wmctrl -i -r ${win.id} -b remove,maximized_vert,maximized_horz`)
    run(`wmctrl -i -r ${win.id} -e 0,${x},${y},${width},${height}`)
  },

  resizeWindow(win, width, height) {
    run(`wmctrl -i -r ${win.id} -b remove,maximized_vert,maximized_horz`)
    run(`wmctrl -i -r ${win.id} -e 0,-1,-1,${width},${height}`)
  }
}

export default linux
