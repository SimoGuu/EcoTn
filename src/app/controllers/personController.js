const Person = require('../models/person');

exports.getPersons = async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPerson = async (req, res) => {
  try {
    const person = new Person(req.body);
    await person.save();
    res.status(201).json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ error: 'Person not found' });
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!person) return res.status(404).json({ error: 'Person not found' });
    res.json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) return res.status(404).json({ error: 'Person not found' });
    res.json({ message: 'Person deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
