let { activateTerminal, activateWindow, countWindows, doScript, getDisplaySize, getWindowBounds, makeNewWindow, repositionWindow, resizeWindow } = require('./helpers'),
  emporium = require('./emporium'),
  Configuration = emporium.models.Configuration;


module.exports = async (options, add, scripts) => {
  let display = await getDisplaySize();
  let configuration = await Configuration.fetchOne({ display });
  if (!configuration) return console.log(`${cosmetic.red('Error:')} No configuration found for current display setup`);
  if (configuration.activate) activateTerminal();

  let columns = configuration.columns;
  let rows = configuration.rows;
  if (options.layout) [ columns, rows ] = options.layout.split(/x/i);

  let width = Math.trunc(configuration.size[0] / columns);
  let height = Math.trunc(configuration.size[1] / rows);

  let count = await countWindows();

  let positionsCount = count;
  if (add) positionsCount += add;
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
  let promises = [];
  for (let i = 1; i <= count; i++) {
    let bounds = await getWindowBounds(i)
    if (positions.includes(`${bounds[0]},${bounds[1]}`)) {
      positions.splice(positions.indexOf(`${bounds[0]},${bounds[1]}`), 1);
      if (Math.abs(height - (bounds[3] - bounds[1])) > 7 || Math.abs(width - (bounds[2] - bounds[0])) > 7) promises.push(resizeWindow(i, width, height));
    } else moves.push(i);
  };
  await Promise.all(promises);

  promises = [];
  for (let i of moves) {
    let bounds = await getWindowBounds(i);
    let coordinates = positions.shift().split(',');
    let promise = repositionWindow(i, coordinates[0], coordinates[1], width, height);
    promises.push(promise);
  };
  await Promise.all(promises);

  if (positions.length > 0) {
    if (!scripts) {
      scripts = [];
      for (let position of positions) scripts.push('');
    }
    for (let [index, script] of scripts.entries()) {
      let coordinates = positions[index].split(',');
      await doScript(script);
      await repositionWindow(1, coordinates[0], coordinates[1], width, height);
    };
  };
}
