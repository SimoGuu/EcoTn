const express = require('express');
const router = express.Router();
const Person = require('./models/person');

router.get('', async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

router.post('', async (req, res) => {
  let person = new Person({
    nome: req.body.nome,
    cognome: req.body.cognome,
    passwordHash: req.body.passwordHash
  });
  person = await person.save();
  res.location("/api/v1/persons/" + person.id).status(201).send();
});

module.exports = router;
