const express = require('express');
const app = express();

app.use(express.json());

const personRoutes = require('./personRoutes');
const houseRoutes = require('./houseRoutes');
const consumptionRoutes = require('./consumptionRoutes');

app.use('/api/v1/persons', personRoutes);
app.use('/api/v1/houses', houseRoutes);
app.use('/api/v1/consumptions', consumptionRoutes);

module.exports = app;
