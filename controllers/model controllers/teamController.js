const DBConnection = require("../../config/databaseConnection")
const Team = require('../../models/teamModel');
const Sport = require('../../models/sportModel');

exports.createTeam = async (req, res) => {
  const conn = await DBConnection();

  try {
    const { name, sport, createdBy, members } = req.body;
    const userId = req.user.id;

    const sportExist = await Sport.findById(sport);
    if (!sportExist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sport not found'
      });
    }

    const team = new Team({
      name,
      sport,
      createdBy: userId,
      members
    });

    await team.save();

    res.status(201).json({
      status: 'success',
      data: team
    });
  }
  catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}

exports.addMember = async (req, res) => {
  const conn = await DBConnection();
  try {
    const { teamId } = req.params;
    const { user, role } = req.body;
    const team = await Team.findById(teamId).populate('sport');

    if (!team) {
      return res.status(400).json({
        message: 'Team not Found'
      })
    }

    if (team.members.some(m => m.user.toString() === user)) {
      return res.status(400).json({ message: 'User already in team' });
    }

    if (team.members.length >= team.sport.maxPlayers) {
      return res.status(400).json({ message: 'Team is full' });
    }

    if (role === 'captain') {
      const hasCaptain = team.members.some(m => m.role === 'captain');
      if (hasCaptain) {
        return res.status(400).json({ message: 'Captain already exists' });
      }
    }

    team.members.push({ user, role });

    await team.save();

    res.json({
      messgae: 'Member Added',
      team
    })
  } catch (err) {
    res.status(500).json({ error: error.message });
  }
}

exports.removeMember = async (req, res) => {
  try {
    const { teamId, userId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    team.members = team.members.filter(
      m => m.user.toString() !== userId
    );
    await team.save();
    res.json({ message: 'Member removed', team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('sport', 'name')
      .populate('createdBy', 'name email')
      .populate('members.user', 'name');

    res.json(teams);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('sport')
      .populate('createdBy')
      .populate('members.user');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.deleteOne();

    res.json({ message: 'Team deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
