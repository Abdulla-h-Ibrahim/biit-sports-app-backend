const express = require('express');
const router = express.Router();

const {
  createSport,
  getAllSports,
  getSportById,
  updateSport,
  deleteSport
} = require('../../controllers/model controllers/sportController');

router.post('/', createSport);
router.get('/', getAllSports);
router.get('/:id', getSportById);
router.put('/:id', updateSport);
router.delete('/:id', deleteSport);

module.exports = router;