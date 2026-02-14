const express = require('express');
const app = express();

app.use(express.json());

const personRoutes = require('./routes/personRoutes');
const houseRoutes = require('./routes/houseRoutes');
const consumptionRoutes = require('./routes/consumptionRoutes');
const productionRoutes = require('./routes/productionRoutes');
const newsRoutes = require('./routes/newsRoutes');
const keyRoutes = require('./routes/keyRoutes');

app.use('/api/v1/persons', personRoutes);
app.use('/api/v1/houses', houseRoutes);
app.use('/api/v1/consumptions', consumptionRoutes);
app.use('/api/v1/productions', productionRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/keys', keyRoutes);

module.exports = app;
