const express = require('express');
const router = express.Router();
const keyController = require('../controllers/keyController');

router.get('/', keyController.getKeys);
router.post('/', keyController.createKey);

module.exports = router;
