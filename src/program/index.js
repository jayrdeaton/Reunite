let cosmetic = require('cosmetic'),
  { command, option } = require('termkit'),
  { version } = require('../../package.json'),
  { reunite, setup } = require('../actions');

let program = command('reunite', '[layout]')
  .version(process.env.npm_package_version)
  .description('A terminal orginizing utility')
  .options([
    option('f', 'fill', null, 'Fill grid with new terminal windows')
  ])
  .action(async (options) => await reunite(options))
  .commands([
    command('version')
    .description('Print current version')
    .action(() => console.log(version)),
    command('setup', '[layout]')
    .description('Set up new bounds for your organization')
    .options([
      option('a', 'activate', null, 'Terminal windows come to foreground when reunited'),
      option('n', 'no-activate', null, "Terminal windows don't come to foreground when reunited (default)")
    ])
    .action(async (options) => await setup(options)),
    command('new', '[scripts...]')
    .description('Open new window in grid')
    .action(async (options) => {
      let add = 1;
      if (options.scripts) add = options.scripts.length;
      await reunite(options._parents.reunite, add, options.scripts);
    })
  ]);

module.exports = program;
