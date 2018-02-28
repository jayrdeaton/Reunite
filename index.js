#!/usr/bin/env node
let term = require('termkit'),
  cosmetic = require('cosmetic'),
  reunite = require('./reunite'),
  setup = require('./setup');

let program = term.command('reunite', '[layout]')
  .version(process.env.npm_package_version)
  .description('A terminal orginizing utility')
  .options([
    term.option('f', 'fill', null, 'Fill grid with new terminal windows')
  ])
  .action(async (err, options) => {
    if (err) return console.log(`${cosmetic.red(err.name)}: ${err.message}`);
    await reunite(options)
  })
  .commands([
    term.command('setup', '[layout]')
    .description('Set up new bounds for your organization')
    .options([
      term.option('a', 'activate', null, 'Terminal windows come to foreground when reunited'),
      term.option('n', 'no-activate', null, "Terminal windows don't come to foreground when reunited (default)")
    ])
    .action(async (err, options) => {
      if (err) return console.log(`${cosmetic.red(err.name)}: ${err.message}`);
      await setup(options);
    }),
    term.command('new', '[scripts...]')
    .description('Open new window in grid')
    .options([
      // term.option('n', 'number', '<number>', 'Run script in new windows')
    ])
    .action(async (err, options) => {
      if (err) return console.log(`${cosmetic.red(err.name)}: ${err.message}`);
      let add = 1;
      if (options.scripts) add = options.scripts.length;
      await reunite(options._parents.reunite, add, options.scripts);
    })
  ]);

program.parse(process.argv);
