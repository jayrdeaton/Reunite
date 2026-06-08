import { Options } from 'termkit'

import { activateApp, doScript, getDisplaySize, getWindowBounds, getWindows, repositionWindow, resizeWindow, WindowRef } from '../commands/index'
import { Config, find } from '../store'

export function computeGrid(config: Config, windowCount: number, add?: number, fill?: boolean): string[] {
  const { bounds, columns, rows, size } = config
  let positionsCount = windowCount
  if (add) positionsCount += add
  if (fill && windowCount < rows * columns) positionsCount = rows * columns

  const positions: string[] = []
  let currentColumn = 1
  let currentRow = 1
  for (let i = 1; i <= positionsCount; i++) {
    const x = bounds[0] + (size[0] * (currentColumn - 1)) / columns
    const y = bounds[1] + (size[1] * (currentRow - 1)) / rows
    positions.push(`${Math.trunc(x)},${Math.trunc(y)}`)
    currentColumn++
    if (currentColumn > columns) {
      currentColumn = 1
      currentRow++
      if (currentRow > rows) currentRow = 1
    }
  }
  return positions
}

export default async function reunite(options: Options, add?: number, scripts?: string[]): Promise<void> {
  const display = getDisplaySize()
  const fill = (options['fill'] as boolean | undefined) ?? false

  let columns = 3
  let rows = 2
  const layout = options['layout'] as string | undefined
  if (layout) [columns, rows] = layout.split(/x/i).map(Number)

  const config = find(display)
  if (!config) throw new Error('No configuration found for current display — run `reunite setup` first')

  if (config.activate) config.apps.forEach(activateApp)

  const effectiveColumns = layout ? columns : config.columns
  const effectiveRows = layout ? rows : config.rows
  const resolvedConfig: Config = { ...config, columns: effectiveColumns, rows: effectiveRows }

  const width = Math.trunc(config.size[0] / effectiveColumns)
  const height = Math.trunc(config.size[1] / effectiveRows)

  const windows = getWindows(config.apps)
  const positions = computeGrid(resolvedConfig, windows.length, add, fill)

  const moves: WindowRef[] = []
  for (const win of windows) {
    const bounds = getWindowBounds(win)
    const key = `${bounds[0]},${bounds[1]}`
    const idx = positions.indexOf(key)
    if (idx >= 0) {
      positions.splice(idx, 1)
      const sizeOff = Math.abs(height - (bounds[3] - bounds[1])) > 7 || Math.abs(width - (bounds[2] - bounds[0])) > 7
      if (sizeOff) resizeWindow(win, width, height)
    } else {
      moves.push(win)
    }
  }

  for (const win of moves) {
    const coordinates = positions.shift()?.split(',')
    if (!coordinates) break
    repositionWindow(win, Number(coordinates[0]), Number(coordinates[1]), width, height)
  }

  if (positions.length > 0) {
    const fillScripts = scripts ?? positions.map(() => '')
    for (const [index, script] of fillScripts.entries()) {
      const coordinates = positions[index]?.split(',')
      if (!coordinates) break
      doScript(script)
      // On darwin, Terminal window 1 is always the most recently opened window
      repositionWindow({ app: 'Terminal', id: 'Terminal:1' }, Number(coordinates[0]), Number(coordinates[1]), width, height)
    }
  }
}
