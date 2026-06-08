/* eslint-disable no-console */
import cosmetic from 'cosmetic'
import { Options } from 'termkit'

import { getDisplaySize, getWindowBounds, getWindows } from '../commands/index'
import { Config, find, save } from '../store'
import reunite from './reunite'

export default async function setup(options: Options): Promise<void> {
  const apps = (options['apps'] as string[] | undefined) ?? []
  const measureApp = apps[0] ?? 'Terminal'

  let columns = 3
  let rows = 2
  const layout = options['layout'] as string | undefined
  if (layout) [columns, rows] = layout.split(/x/i).map(Number)

  const display = getDisplaySize()
  const wins = getWindows([measureApp])
  if (wins.length === 0) throw new Error(`No windows found for "${measureApp}" — make sure it is open and visible`)
  const bounds = getWindowBounds(wins[0])
  const size: [number, number] = [bounds[2] - bounds[0], bounds[3] - bounds[1]]

  const existing = find(display)

  const config: Config = {
    activate: existing?.activate ?? false,
    apps,
    bounds: [bounds[0], bounds[1], bounds[2], bounds[3]],
    columns,
    display: display as [number, number, number, number],
    rows,
    size
  }

  if (options['activate'] === true) config.activate = true
  if (options['no-activate'] === true) config.activate = false

  save(config)

  const label = apps.length > 0 ? ` (${apps.join(', ')})` : ''
  if (existing) {
    console.log(`${cosmetic.green('Updated:')} Existing configuration for current display${label}`)
  } else {
    console.log(`${cosmetic.green('Added:')} New configuration for current display${label}`)
  }

  await reunite({ ...options, layout: undefined })
}
