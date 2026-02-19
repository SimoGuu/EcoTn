const House = require('../models/house');
const Consumption = require('../models/consumption');
const Production = require('../models/production');
const mongoose = require('mongoose');

exports.getHouses = async (req, res) => {
  try {
    const houses = await House.find().populate('persone');
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createHouse = async (req, res) => {
  try {
    const house = new House(req.body);
    await house.save();
    res.status(201).json(house);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getHouseById = async (req, res) => {
  try {
    const house = await House.findById(req.params.id).populate('persone');
    if (!house) return res.status(404).json({ error: 'House not found' });
    res.json(house);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateHouse = async (req, res) => {
  try {
    const house = await House.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('persone');
    if (!house) return res.status(404).json({ error: 'House not found' });
    res.json(house);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteHouse = async (req, res) => {
  try {
    const house = await House.findByIdAndDelete(req.params.id);
    if (!house) return res.status(404).json({ error: 'House not found' });
    res.json({ message: 'House deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHouseConsumptionStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const groupFormat = (start === end) 
      ? { $hour: "$data_ora" } 
      : { $dateToString: { format: "%Y-%m-%d", date: "$data_ora" } };

    const stats = await Consumption.aggregate([
      { $match: { house: new mongoose.Types.ObjectId(id), data_ora: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: groupFormat, media: { $avg: "$valore" } } },
      { $sort: { "_id": 1 } }
    ]);

    res.json({ labels: stats.map(s => s._id), values: stats.map(s => s.media) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHouseProductionStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const groupFormat = (start === end) 
      ? { $hour: "$data_ora" } 
      : { $dateToString: { format: "%Y-%m-%d", date: "$data_ora" } };

    const stats = await Production.aggregate([
      { $match: { house: new mongoose.Types.ObjectId(id), data_ora: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: groupFormat, media: { $avg: "$valore" } } },
      { $sort: { "_id": 1 } }
    ]);

    res.json({ labels: stats.map(s => s._id), values: stats.map(s => s.media) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLatestBatteryLevel = async (req, res) => {
  try {
    const { id } = req.params;

    const latestProd = await Production.findOne({ 
      house: id, 
      lv_batteria: { $exists: true, $ne: null } 
    })
    .sort({ data_ora: -1 })
    .select('lv_batteria data_ora');

    if (!latestProd) {
      return res.status(404).json({ 
        message: "Nessun dato sulla batteria trovato per questa casa." 
      });
    }

    res.status(200).json({
      lv_batteria: latestProd.lv_batteria
});
    
  } catch (error) {
    res.status(500).json({ 
      message: "Errore durante il recupero del livello batteria", 
      error: error.message 
    });
  }
};