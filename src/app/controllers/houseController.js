const House = require('../models/house');

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
