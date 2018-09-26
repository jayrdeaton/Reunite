let cosmetic = require('cosmetic'),
  reunite = require('./reunite'),
  { getDisplaySize, getWindowBounds, getWindowSize } = require('../helpers'),
  emporium = require('../emporium'),
  Configuration = emporium.models.Configuration;

module.exports = async (options) => {
  let columns = 3, rows = 2;
  if (options.layout) [ columns, rows ] = options.layout.split(/x/i);
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
    console.log(`${cosmetic.green('Updated:')} Existing configuration for current display setup`);
  } else {
    console.log(`${cosmetic.green('Added:')} New configuration for current display setup`);
  };
  await reunite({});
};
