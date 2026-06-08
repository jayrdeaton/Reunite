import { command, option } from 'termkit'

import { reunite, setup } from './actions/index'

const program = command('reunite', '[layout]')
  .version(process.env['npm_package_version'] ?? '')
  .description('Tile app windows into a saved grid layout')
  .options([option('f', 'fill', null, 'Fill grid with new Terminal windows')])
  .action(async (options) => await reunite(options))
  .commands([
    command('setup', '[layout]')
      .description('Save a grid layout for the current display')
      .options([option('a', 'apps', '[apps...]', 'Apps to include in the grid (default: all visible)'), option('A', 'activate', null, 'Bring app windows to foreground when reunited'), option('n', 'no-activate', null, "Don't bring windows to foreground (default)")])
      .action(async (options) => await setup(options)),
    command('new', '[scripts...]')
      .description('Open a new Terminal window in the next grid slot')
      .action(async (options) => {
        const parent = options._parents['reunite']
        const scripts = options['scripts'] as string[] | undefined
        const add = scripts ? scripts.length : 1
        await reunite(parent, add, scripts)
      })
  ])

export default program
