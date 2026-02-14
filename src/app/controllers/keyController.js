const Key = require('../models/key');

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
