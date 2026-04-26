const Match = require('../../models/matchModel');
const Team = require('../../models/teamModel');
const Sport = require('../../models/sportModel');
const DBConnection = require('../../config/databaseConnection');


// Create Match
exports.createMatch = async (req, res) => {
  const conn = await DBConnection();
  try {
    const { sport, team1, team2, matchDate, venue, status } = req.body;

    // Check sport exists
    const sportExists = await Sport.findById(sport);
    if (!sportExists) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sport not found'
      });
    }

    // Check teams exist
    const team1Exists = await Team.findById(team1);
    const team2Exists = await Team.findById(team2);

    if (!team1Exists || !team2Exists) {
      return res.status(404).json({
        status: 'fail',
        message: 'One or both teams not found'
      });
    }

    // Prevent same team match
    if (team1 === team2) {
      return res.status(400).json({
        status: 'fail',
        message: 'A team cannot play against itself'
      });
    }

    const match = await Match.create({
      sport,
      team1,
      team2,
      matchDate,
      venue,
      status
    });

    res.status(201).json({
      status: 'success',
      message: 'Match created successfully',
      data: match
    });

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};


// Get All Matches
exports.getAllMatches = async (req, res) => {
  const conn = await DBConnection();
  try {
    const matches = await Match.find()
      .populate('sport')
      .populate('team1')
      .populate('team2');

    res.status(200).json({
      status: 'success',
      count: matches.length,
      data: matches
    });

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};


// Get Single Match
exports.getSingleMatch = async (req, res) => {
  const conn = await DBConnection();
  try {
    const match = await Match.findById(req.params.id)
      .populate('sport')
      .populate('team1')
      .populate('team2');

    if (!match) {
      return res.status(404).json({
        status: 'fail',
        message: 'Match not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: match
    });

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};


// Update Match
exports.updateMatch = async (req, res) => {
  const conn = await DBConnection();
  try {
    const { team1, team2 } = req.body;

    if (team1 && team2 && team1 === team2) {
      return res.status(400).json({
        status: 'fail',
        message: 'A team cannot play against itself'
      });
    }

    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedMatch) {
      return res.status(404).json({
        status: 'fail',
        message: 'Match not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Match updated successfully',
      data: updatedMatch
    });

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};


// Delete Match
exports.deleteMatch = async (req, res) => {
  const conn = await DBConnection();
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        status: 'fail',
        message: 'Match not found'
      });
    }

    await match.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Match deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};