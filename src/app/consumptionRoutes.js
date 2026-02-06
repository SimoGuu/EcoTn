const express = require('express');
const router = express.Router();
const Consumption = require('./models/consumption');

router.get('', async (req, res) => {
  const consumptions = await Consumption.find({}).populate('abitazione');
  res.json(consumptions);
});

router.post('', async (req, res) => {
  let consumption = new Consumption({
    abitazione: req.body.abitazione, // id abitazione
    orario: req.body.orario,         // stringa ISO, es. "2026-02-06T08:30:00Z"
    valore: req.body.valore
  });
  consumption = await consumption.save();
  res.location("/api/v1/consumptions/" + consumption.id).status(201).send();
});

module.exports = router;
