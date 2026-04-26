const DBConnection = require('../../config/databaseConnection');
const Result = require('../models/Result');
const Match = require('../models/Match');

// Create Result
exports.createResult = async (req, res) => {
  const conn = await DBConnection();
  try {
    const { match, winner, team1Score, team2Score, description } = req.body;

    // Check if match exists
    const matchExists = await Match.findById(match);
    if (!matchExists) {
      return res.status(404).json({
        status: 'fail',
        message: 'Match not found'
      });
    }

    // Check if result already exists for this match
    const existingResult = await Result.findOne({ match });
    if (existingResult) {
      return res.status(400).json({
        status: 'fail',
        message: 'Result already exists for this match'
      });
    }

    const result = await Result.create({
      match,
      winner,
      team1Score,
      team2Score,
      description
    });

    res.status(201).json({
      status: 'success',
      message: 'Result created successfully',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get All Results
exports.getAllResults = async (req, res) => {
  const conn = await DBConnection();
  try {
    const results = await Result.find()
      .populate('match')
      .populate('winner');

    res.status(200).json({
      status: 'success',
      count: results.length,
      data: results
    });

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};


// Get Single Result
exports.getSingleResult = async (req, res) => {
  const conn = await DBConnection();
  try {
    const result = await Result.findById(req.params.id)
      .populate('match')
      .populate('winner');

    if (!result) {
      return res.status(404).json({
        status: 'fail',
        message: 'Result not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};


// Update Result
exports.updateResult = async (req, res) => {
  const conn = await DBConnection();
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        status: 'fail',
        message: 'Result not found'
      });
    }

    const updatedResult = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Result updated successfully',
      data: updatedResult
    });

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};


// Delete Result
exports.deleteResult = async (req, res) => {
  const conn = await DBConnection();
    try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        status: 'fail',
        message: 'Result not found'
      });
    }

    await result.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Result deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message
    });
  }
};