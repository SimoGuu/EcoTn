const mongoose = require('mongoose');
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

exports.getProductionStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.query;

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const isSameDay = start === end;

    const groupFormat = isSameDay 
      ? { $hour: "$data_ora" } 
      : { $dateToString: { format: "%Y-%m-%d", date: "$data_ora" } };

    const stats = await Production.aggregate([
      {
        $match: {
          house: new mongoose.Types.ObjectId(id),
          data_ora: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: groupFormat,
          media: { $avg: "$valore" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const labels = stats.map(item => item._id);
    const values = stats.map(item => item.media);

    res.json({ labels, values });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};