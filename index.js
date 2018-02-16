#!/usr/bin/env node

let term = require('termkit'),
  cosmetic = require('cosmetic'),
  { activateTerminal, activateWindow, countWindows, getDisplaySize, getWindowBounds, getWindowSize, makeNewWindow, repositionWindow, resizeWindow } = require('./helpers'),
  emporium = require('./emporium'),
  Configuration = emporium.models.Configuration;

let program = term.command('reunite', '[layout]')
  .version(process.env.npm_package_version)
  .description('A terminal orginizing utility')
  .options([
    term.option('f', 'fill', null, 'Fill grid with new terminal windows')
  ])
  .action(async (err, options) => {
    if (err) return console.log(`${cosmetic.red(err.name)}: ${err.message}`);
    let display = await getDisplaySize();
    let configuration = await Configuration.fetchOne({ display });
    if (!configuration) return console.log(`${cosmetic.red('Error:')} No configuration found for current display setup`);
    if (configuration.activate) activateTerminal();

    let columns = configuration.columns;
    let rows = configuration.rows;
    if (options.layout) [ columns, rows ] = options.layout.split(/x/i);

    let width = configuration.size[0] / columns
    let height = configuration.size[1] / rows

    let count = await countWindows();

    let positionsCount = count;

    if (options.fill && count < rows * columns) positionsCount = rows * columns;

    let positions = [];
    let currentColumn = 1, currentRow = 1;
    for (let i = 1; i <= positionsCount; i++) {
      let x = configuration.bounds[0] + configuration.size[0] * (currentColumn - 1) / columns;
      let y = configuration.bounds[1] + configuration.size[1] * (currentRow - 1) / rows;
      positions.push(`${Math.trunc(x)},${Math.trunc(y)}`);
      currentColumn++;
      if (currentColumn > columns) {
        currentColumn = 1;
        currentRow++;
        if (currentRow > rows) currentRow = 1;
      };
    };

    let moves = [];
    let stay = [];
    let promises = [];
    for (let i = 1; i <= count; i++) {
      let promise = getWindowBounds(i).then((bounds) => {
        if (positions.includes(`${bounds[0]},${bounds[1]}`)) {
          stay.push(...positions.splice(positions.indexOf(`${bounds[0]},${bounds[1]}`), 1));
          if (Math.abs(height - (bounds[3] - bounds[1])) > 7 || Math.abs(width - (bounds[2] - bounds[0])) > 7) resizeWindow(i, width, height);
        } else moves.push(i);
      });
      promises.push(promise);
    };
    await Promise.all(promises);

    promises = [];
    for (let i of moves) {
      let bounds = await getWindowBounds(i);
      if (!stay.includes(`${bounds[0]},${bounds[1]}`)) {
        let coordinates = positions.shift().split(',');
        let promise = repositionWindow(i, coordinates[0], coordinates[1], width, height);
        promises.push(promise);
      };
    };
    await Promise.all(promises);

    if (positions.length > 0) {
      for (let i of positions) {
        let coordinates = i.split(',');
        await makeNewWindow();
        await repositionWindow(1, coordinates[0], coordinates[1], width, height);
      };
      await activateWindow(positions.length + 1);
    };
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
      let columns = 3, rows = 2;
      if (options.layout) {
        [ columns, rows ] = options.layout.split(/x/i);
      };
      let display = await getDisplaySize();
      let edit = false;
      let configuration = await Configuration.fetchOne({ display });
      if (configuration) edit = true;
      if (!configuration) configuration = new Configuration();
      if (options.activate) configuration.activate = true;
      if (options['no-activate']) configuration.activate = false;
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
