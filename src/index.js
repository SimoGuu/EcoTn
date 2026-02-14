const app = require('./app/app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
