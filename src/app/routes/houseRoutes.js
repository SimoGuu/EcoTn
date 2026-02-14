const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController');

router.get('/', houseController.getHouses);
router.post('/', houseController.createHouse);
router.get('/:id', houseController.getHouseById);
router.put('/:id', houseController.updateHouse);
router.delete('/:id', houseController.deleteHouse);

module.exports = router;
