#!/usr/bin/env node
let term = require('termkit'),
  cosmetic = require('cosmetic'),
  { activateWindow, countWindows, getDisplaySize, getWindowBounds, getWindowSize, makeNewWindow, repositionWindow } = require('./helpers'),
  emporium = require('./emporium'),
  Configuration = emporium.models.Configuration;

let program = term.command('Organize', '[layout]')
  .version(process.env.npm_package_version)
  .description('A terminal orginizing utility')
  .options([
    term.option('f', 'fill', null, 'Fill grid with new terminal windows')
  ])
  .action(async (err, options) => {
    if (err) return console.log(`${cosmetic.red(err.name)}: ${err.message}`);
    let display = await getDisplaySize();
    let edit = false;
    let configuration = await Configuration.fetchOne({ display });
    if (!configuration) return console.log(`${cosmetic.red('Error:')} No configuration found for current display setup`);

    let columns = configuration.columns;
    let rows = configuration.rows;
    if (options.layout) [ columns, rows ] = options.layout.split(/x/i);

    let count = await countWindows();
    let currentColumn = 1, currentRow = 1;
    for (let i = 1; i <= count; i++) {
      let x = configuration.bounds[0] + configuration.size[0] * (currentColumn - 1) / columns;
      let y = configuration.bounds[1] + configuration.size[1] * (currentRow - 1) / rows;
      let width = configuration.size[0] / columns;
      let height = configuration.size[1] / rows;
      await repositionWindow(i, x, y, width, height);
      currentColumn++;
      if (currentColumn > columns) {
        currentColumn = 1;
        currentRow++;
        if (currentRow > rows) currentRow = 1;
      };
    };
    if (options.fill && count < columns * rows) {
      for (let i = count + 1; i <= columns * rows; i++) {
        let x = configuration.bounds[0] + configuration.size[0] * (currentColumn - 1) / columns;
        let y = configuration.bounds[1] + configuration.size[1] * (currentRow - 1) / rows;
        let width = configuration.size[0] / columns;
        let height = configuration.size[1] / rows;
        await makeNewWindow(i);
        await repositionWindow(1, x, y, width, height);
        currentColumn++;
        if (currentColumn > columns) {
          currentColumn = 1;
          currentRow++;
          if (currentRow > rows) currentRow = 1;
        };
      };
      await activateWindow(columns * rows - count + 1);
    };
  })
  .commands([
    term.command('setup', '[layout]')
    .description('Set up new bounds for your organization')
    .action(async (err, options) => {
      if (err) return console.log(`${cosmetic.red(err.name)}: ${err.message}`);
      let columns = 3, rows = 2;
      if (options.layout) {
        [ columns, rows ] = options.layout.split(/x/i);
      };
      let display = await getDisplaySize();
      let edit = false;
      let configuration = await Configuration.fetchOne({ display });
      if (configuration) edit = true;
      if (!configuration) configuration = new Configuration();
      configuration.bounds = await getWindowBounds();
      configuration.columns = columns;
      configuration.display = display;
      configuration.rows = rows;
      configuration.size = await getWindowSize();
      await configuration.save();
      if (edit) {
        return console.log(`${cosmetic.green('Updated:')} Existing configuration for current display setup`);
      };
      return console.log(`${cosmetic.green('Added:')} New configuration for current display setup`);
    })
  ]);

program.parse(process.argv);
