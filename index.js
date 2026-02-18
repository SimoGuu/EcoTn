require('dotenv').config();
console.log('>>> index.js start');

const app = require('./src/app/app.js');
console.log('>>> app required OK');

require("dotenv").config();

const mongoose = require('mongoose');
console.log('>>> mongoose required OK');

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to Database");
    app.listen(process.env.API_PORT, () => {
      console.log("Server listening on " + process.env.API_PORT);
    });
  })
  .catch(err => {
    console.error("DB connection error", err);
  });