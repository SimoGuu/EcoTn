const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  identificatore: { type: String, required: true, unique: true },
  codiceFiscale: { type: String, required: true, unique: true },
  isDipendente: { type: Boolean, required: true, unique: false },
}, { timestamps: true });

module.exports = mongoose.model('Person', personSchema);
