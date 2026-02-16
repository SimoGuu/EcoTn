//modifiche mie
const cors = require('cors');
const express = require('express');
const app = express();
const session = require("express-session");

// Abilita CORS per tutte le origini
app.use(cors({
    origin: "http://localhost:5500",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'fanciullina',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax"
    }
}));

const personRoutes = require('./routes/personRoutes');
const houseRoutes = require('./routes/houseRoutes');
const consumptionRoutes = require('./routes/consumptionRoutes');
const productionRoutes = require('./routes/productionRoutes');
const newsRoutes = require('./routes/newsRoutes');
const keyRoutes = require('./routes/keyRoutes');
const spidLoginRoutes = require('./routes/spidLoginRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

app.use('/api/v1/persons', personRoutes);
app.use('/api/v1/houses', houseRoutes);
app.use('/api/v1/consumptions', consumptionRoutes);
app.use('/api/v1/productions', productionRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/keys', keyRoutes);
app.use('/api/v1/spid', spidLoginRoutes);
app.use('/api/v1/weather', weatherRoutes);

module.exports = app;
