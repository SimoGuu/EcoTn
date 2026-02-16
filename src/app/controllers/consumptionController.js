const mongoose = require('mongoose');
const Consumption = require('../models/consumption');

exports.getConsumptions = async (req, res) => {
  try {
    const query = Consumption.find();
    const consumptions = await query.populate('house');
    return res.json(consumptions);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createConsumption = async (req, res) => {
  try {
    const consumption = new Consumption(req.body);
    await consumption.save();
    return res.status(201).json(consumption);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.getConsumptionById = async (req, res) => {
  try {
    const houseId = req.params.id;
    const consumptions = await Consumption.find({ house: houseId }).populate('house');
    if (!consumptions || consumptions.length === 0) {
      return res.status(404).json({ error: 'Consumption not found' });
    }
    return res.json(consumptions);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateConsumption = async (req, res) => {
  try {
    const query = Consumption.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    const consumption = await query.populate('house');
    if (!consumption) {
      return res.status(404).json({ error: 'Consumption not found' });
    }
    return res.json(consumption);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteConsumption = async (req, res) => {
  try {
    const consumption = await Consumption.findByIdAndDelete(req.params.id);
    if (!consumption) {
      return res.status(404).json({ error: 'Consumption not found' });
    }
    return res.json({ message: 'Consumption deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
