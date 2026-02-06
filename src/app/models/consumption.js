const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumptionSchema = new Schema({
  abitazione: { type: Schema.Types.ObjectId, ref: 'House', required: true },
  orario: { type: Date, required: true },
  valore: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Consumption', consumptionSchema);
