const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController');

router.get('/', houseController.getHouses);
router.post('/', houseController.createHouse);
router.get('/:id', houseController.getHouseById);
router.put('/:id', houseController.updateHouse);
router.delete('/:id', houseController.deleteHouse);
router.get('/:id/consumption-stats', houseController.getHouseConsumptionStats);
router.get('/:id/production-stats', houseController.getHouseProductionStats);
router.get('/:id/battery/latest', houseController.getLatestBatteryLevel);


module.exports = router;
