const express = require('express');
const router = express.Router();
const consumptionController = require('../controllers/consumptionController');

router.get('/', consumptionController.getConsumptions);
router.post('/', consumptionController.createConsumption);
router.get('/:id', consumptionController.getConsumptionById);
router.put('/:id', consumptionController.updateConsumption);
router.delete('/:id', consumptionController.deleteConsumption);

module.exports = router;

