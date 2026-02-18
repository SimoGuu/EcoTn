const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/', newsController.getNews);
router.post('/', newsController.createNews);
router.get('/:id', newsController.getNewsById);

module.exports = router;