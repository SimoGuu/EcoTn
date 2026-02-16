const express = require('express');
const router = express.Router();
const personController = require('../controllers/personController');

router.get('/', personController.getPersons);
router.post('/', personController.createPerson);
router.get('/:id', personController.getPersonById);
router.put('/:id', personController.updatePerson);
router.delete('/:id', personController.deletePerson);
router.get('/:id/houses', personController.getHousesByPerson);

module.exports = router;

