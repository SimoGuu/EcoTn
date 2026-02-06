const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  passwordHash: { type: String },  // oppure cieId, come volete
}, { timestamps: true });

module.exports = mongoose.model('Person', personSchema);
