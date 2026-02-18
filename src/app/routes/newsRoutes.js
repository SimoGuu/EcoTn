const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/', newsController.getNews);
router.post('/', newsController.createNews);
router.get('/:id', newsController.getNewsById);
router.get('/news/key/:id', newsController.getNewsByKey);


module.exports = router;
