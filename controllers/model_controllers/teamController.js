const DBConnection = require("../../config/databaseConnection")
const Team = require('../../models/teamModel');
const Sport = require('../../models/sportModel');
const User = require('../../models/userModel');

exports.createTeam = async (req, res) => {
  const conn = await DBConnection();

  try {
    const { name, sport, createdBy, members } = req.body;
    const userId = req.user?.id || createdBy;

    if (!name || !sport || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'name, sport, and members are required'
      });
    }

    if (!userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'createdBy is required when auth user is missing'
      });
    }

    const sportExist = await Sport.findById(sport);
    if (!sportExist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sport not found'
      });
    }

    const normalizedMembers = members.map((member) => ({
      user: member.user,
      role: member.role || 'player',
      inviteStatus: 'accepted',
    }));

    const team = new Team({
      name,
      sport,
      createdBy: userId,
      members: normalizedMembers
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

    const inviteStatus = 'accepted';
    team.members.push({ user, role, inviteStatus });

    await team.save();

    res.json({
      message: 'Member Added',
      team
    })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.respondToInvitation = async (req, res) => {
  const conn = await DBConnection();
  try {
    const { teamId, userId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'status must be accepted or rejected' });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const member = team.members.find((m) => m.user.toString() === userId);
    if (!member) {
      return res.status(404).json({ message: 'User is not a team member' });
    }

    if (member.role === 'captain') {
      return res.status(400).json({ message: 'Captain does not need invitation response' });
    }

    member.inviteStatus = status;
    await team.save();

    await User.findByIdAndUpdate(userId, {
      $set: {
        'notifications.$[invite].status': status,
        'notifications.$[invite].isRead': true,
      },
    }, {
      arrayFilters: [{ 'invite.team': team._id, 'invite.type': 'team_invite' }],
    });

    const teamMessage = status === 'accepted'
      ? `${member.user} accepted invitation for ${team.name}`
      : `${member.user} rejected invitation for ${team.name}`;

    await User.findByIdAndUpdate(team.createdBy, {
      $push: {
        notifications: {
          type: status === 'accepted' ? 'invite_accepted' : 'invite_rejected',
          title: status === 'accepted' ? 'Invitation Accepted' : 'Invitation Rejected',
          message: teamMessage,
          team: team._id,
          status,
        },
      },
    });

    res.status(200).json({
      status: 'success',
      message: `Invitation ${status}`,
      data: team,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlayerTeams = async (req, res) => {
  const conn = await DBConnection();
  try {
    const { userId } = req.params;
    const teams = await Team.find({
      'members.user': userId
    })
      .populate('sport', 'name maxPlayers')
      .populate('createdBy', 'name email')
      .populate('members.user', 'name email role');

    const mapped = teams.map((team) => {
      const currentMembership = team.members.find((m) => m.user?._id?.toString() === userId);
      const pendingMembers = team.members.filter((m) => m.inviteStatus === 'pending');
      return {
        ...team.toObject(),
        currentMemberInviteStatus: currentMembership?.inviteStatus || null,
        pendingInvitesCount: pendingMembers.length,
      };
    });

    res.status(200).json({
      status: 'success',
      count: mapped.length,
      data: mapped,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
