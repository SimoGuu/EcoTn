const mongoose = require('mongoose');
const Consumption = require('../models/consumption');

exports.getConsumptions = async (req, res) => {
  try {
    const consumptions = await Consumption.find().populate('house');
    res.json(consumptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createConsumption = async (req, res) => {
  try {
    const consumption = new Consumption(req.body);
    await consumption.save();
    res.status(201).json(consumption);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getConsumptionById = async (req, res) => {
  try {
    const consumption = await Consumption.findById(req.params.id).populate('house');
    if (!consumption) {
      return res.status(404).json({ error: 'Consumption not found' });
    }
    res.json(consumption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateConsumption = async (req, res) => {
  try {
    const consumption = await Consumption.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('house');
    if (!consumption) {
      return res.status(404).json({ error: 'Consumption not found' });
    }
    res.json(consumption);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteConsumption = async (req, res) => {
  try {
    const consumption = await Consumption.findByIdAndDelete(req.params.id);
    if (!consumption) {
      return res.status(404).json({ error: 'Consumption not found' });
    }
    res.json({ message: 'Consumption deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};