let Emporium = require('emporium');

let emporium = new Emporium('Reunite');

emporium.pretty();

let Schema = emporium.Schema;

let schema = new Schema('Configuration', {
  activate: {type: Boolean, default: false},
  bounds: Array,
  columns: Number,
  display: Array,
  rows: Number,
  size: Array
});

schema.hide(['_id']);

emporium.add(schema);

module.exports = emporium;
