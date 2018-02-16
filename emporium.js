let Emporium = require('emporium');

let emporium = new Emporium('Reunite');

emporium.pretty();

let Schema = emporium.Schema;

let ConfigurationSchema = new Schema('Configuration', {
  activate: {type: Boolean, default: false},
  bounds: Array,
  columns: Number,
  display: Array,
  rows: Number,
  size: Array
});

ConfigurationSchema.hide(['_id']);

emporium.add(ConfigurationSchema);

module.exports = emporium;
