const express = require('express');
const router = express.Router();
const House = require('./models/house');

// GET /api/v1/houses
router.get('', async (req, res) => {
  const houses = await House.find({}).populate('persone');
  res.json(houses);
});

// POST /api/v1/houses
router.post('', async (req, res) => {
  let house = new House({
    indirizzo: req.body.indirizzo,
    immagineProfilo: req.body.immagineProfilo,
    persone: req.body.persone // array di id persona
  });
  house = await house.save();
  res.location("/api/v1/houses/" + house.id).status(201).send();
});

module.exports = router;