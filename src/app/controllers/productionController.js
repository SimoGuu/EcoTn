const Production = require('../models/production');

exports.getProductions = async (req, res) => {
  try {
    const productions = await Production.find().populate('house');
    res.json(productions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduction = async (req, res) => {
  try {
    const production = new Production(req.body);
    await production.save();
    res.status(201).json(production);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
