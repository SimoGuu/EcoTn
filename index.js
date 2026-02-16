require('dotenv').config();
console.log('>>> index.js start');

const app = require('./src/app/app.js');
console.log('>>> app required OK');

const mongoose = require('mongoose');
console.log('>>> mongoose required OK');

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to Database");
    app.listen(8080, () => {
      console.log("Server listening on 8080");
    });
  })
  .catch(err => {
    console.error("DB connection error", err);
  });

