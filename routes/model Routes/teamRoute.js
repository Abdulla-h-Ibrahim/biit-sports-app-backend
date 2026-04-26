const express = require('express');
const router = express.Router();

const {
  createTeam,
  addMember,
  removeMember,
  getAllTeams,
  getTeamById,
  deleteTeam
} = require('../../controllers/model controllers/teamController');

// Team CRUD
router.post('/', createTeam);
router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.delete('/:id', deleteTeam);

// Team Members
router.post('/:teamId/members', addMember);
router.delete('/:teamId/members/:userId', removeMember);

module.exports = router;