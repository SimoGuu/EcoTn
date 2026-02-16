const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');

router.get('/', productionController.getProductions);
router.post('/', productionController.createProduction);
router.get('/stats/:id', productionController.getProductionStats);

module.exports = router;
