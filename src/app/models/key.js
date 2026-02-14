const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keySchema = new Schema({
  nome: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Key', keySchema);
