const express = require('express');
const router = express.Router();
const matchController = require('../../controllers/model_controllers/matchController');

router.post('/', matchController.createMatch);
router.get('/scheduled', matchController.getScheduledMatches);
router.get('/', matchController.getAllMatches);
router.get('/:id', matchController.getSingleMatch);
router.put('/:id', matchController.updateMatch);
router.delete('/:id', matchController.deleteMatch);

module.exports = router;