// routes/sportRoutes.js
const express = require('express');
const router = express.Router();
const sportController = require('../controllers/model controllers/sportsController');

router.post('/', sportController.createSport);
router.get('/', sportController.getAllSports);
router.get('/:id', sportController.getSportById);
router.put('/:id', sportController.updateSport);
router.delete('/:id', sportController.deleteSport);

module.exports = router;