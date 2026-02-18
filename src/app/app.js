const cors = require('cors');
const express = require('express');
const app = express();
const session = require("express-session");

app.use(cors({
    origin: (process.env.DEPLOY_MODE === "development") ? "http://localhost:5500" : "https://ecotn-frontend.onrender.com",
    credentials: true
}));

app.use(express.json());

if(process.env.DEPLOY_MODE === "development") {
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
}else {
    app.set('trust proxy', 1);

    app.use(session({
        secret: process.env.SESSION_SECRET || 'fanciullina',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        }
    }));
}

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
