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

exports.getConsumptionStats = async (req, res) => {
  try {
    const { id } = req.params; // ID della casa
    const { start, end } = req.query; // Date in formato YYYY-MM-DD

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999); // Include tutto l'ultimo giorno

    const isSameDay = start === end;

    // Definiamo il raggruppamento in base alla condizione temporale
    const groupFormat = isSameDay 
      ? { $hour: "$data_ora" } 
      : { $dateToString: { format: "%Y-%m-%d", date: "$data_ora" } };

    const stats = await Consumption.aggregate([
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
      { $sort: { "_id": 1 } } // Ordina cronologicamente
    ]);

    // Formattiamo la risposta in due array
    const labels = stats.map(item => item._id);
    const values = stats.map(item => item.media);

    res.json({ labels, values });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};