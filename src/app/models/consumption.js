const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumptionSchema = new Schema({
  house: { type: Schema.Types.ObjectId, ref: 'House', required: true },
  data_ora: { type: Date, required: true },
  valore: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Consumption', consumptionSchema);
