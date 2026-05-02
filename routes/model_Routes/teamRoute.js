const express = require('express');
const router = express.Router();

const {
  createTeam,
  addMember,
  respondToInvitation,
  getPlayerTeams,
  removeMember,
  getAllTeams,
  getTeamById,
  deleteTeam
} = require('../../controllers/model_controllers/teamController');

// Team CRUD
router.post('/', createTeam);
router.get('/', getAllTeams);
router.get('/player/:userId', getPlayerTeams);
router.get('/:id', getTeamById);
router.delete('/:id', deleteTeam);

// Team Members
router.post('/:teamId/members', addMember);
router.patch('/:teamId/members/:userId/respond', respondToInvitation);
router.delete('/:teamId/members/:userId', removeMember);

module.exports = router;