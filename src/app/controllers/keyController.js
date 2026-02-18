const Key = require('../models/key');
const News = require('../models/news');

exports.getKeys = async (req, res) => {
  try {
    const keys = await Key.find();
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createKey = async (req, res) => {
  try {
    const key = new Key(req.body);
    await key.save();
    res.status(201).json(key);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Corretto: esportata e adattata per gestire req/res come nei test
exports.getNewsByKey = async (req, res) => {
  try {
    const keyId = req.params.id;
    const notizie = await News.find({ chiavi: keyId })
      .populate('chiavi', 'nome')
      .lean();
    res.json(notizie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getKeyWithNews = async (req, res) => {
  try {
    const key = await Key.findById(req.params.id);
    const notizie = await News.find({ chiavi: req.params.id });
    res.json({ key, notizie });
  } catch (error) {
    res.status(500).json({ error: 'Errore' });
  }
};