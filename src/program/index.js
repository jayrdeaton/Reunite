let cosmetic = require('cosmetic'),
  { command, option } = require('termkit'),
  { reunite, setup } = require('../actions');

let program = command('reunite', '[layout]')
  .version(process.env.npm_package_version)
  .description('A terminal orginizing utility')
  .options([
    option('f', 'fill', null, 'Fill grid with new terminal windows')
  ])
  .action(async (err, options) => {
    if (err) return console.log(`${cosmetic.red(err.name)}: ${err.message}`);
    await reunite(options)
  })
  .commands([
    command('setup', '[layout]')
    .description('Set up new bounds for your organization')
    .options([
      option('a', 'activate', null, 'Terminal windows come to foreground when reunited'),
      option('n', 'no-activate', null, "Terminal windows don't come to foreground when reunited (default)")
    ])
    .action(async (err, options) => {
      if (err) return console.log(`${cosmetic.red(err.name)}: ${err.message}`);
      await setup(options);
    }),
    command('new', '[scripts...]')
    .description('Open new window in grid')
    .options([
      // option('n', 'number', '<number>', 'Run script in new windows')
    ])
    .action(async (err, options) => {
      if (err) return console.log(`${cosmetic.red(err.name)}: ${err.message}`);
      let add = 1;
      if (options.scripts) add = options.scripts.length;
      await reunite(options._parents.reunite, add, options.scripts);
    })
  ]);

module.exports = program;
