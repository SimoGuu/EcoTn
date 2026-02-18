const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  titolo: { type: String, required: true, trim: true },
  testo: { type: String, required: true },
  immagine: { type: String }, // URL o path jpeg
  chiavi: [{ type: Schema.Types.ObjectId, ref: 'Key' }]
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
