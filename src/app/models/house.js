const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const houseSchema = new Schema({
  indirizzo: { type: String, required: true },
  immagineProfilo: { type: String },
  persone: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
}, { timestamps: true });

module.exports = mongoose.model('House', houseSchema);