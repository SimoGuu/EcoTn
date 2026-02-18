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

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('chiavi');
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNewsByKey = async (req, res) => {
  try {
    const news = await News.find({ chiavi: req.params.keyId });
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
