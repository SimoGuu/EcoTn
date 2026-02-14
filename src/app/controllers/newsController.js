const News = require('../models/news');

exports.getNews = async (req, res) => {
  try {
    const news = await News.find().populate('chiavi');
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
