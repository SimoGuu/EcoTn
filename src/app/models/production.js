const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productionSchema = new Schema({
  house: { type: Schema.Types.ObjectId, ref: 'House', required: true },
  data_ora: { type: Date, required: true, index: true },
  valore: { type: Number, required: true },
  lv_batteria: { type: Number, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Production', productionSchema);
