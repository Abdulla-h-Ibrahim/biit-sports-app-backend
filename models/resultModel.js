const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
    unique: true
  },

  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },

  team1Score: {
    type: Number,
    default: 0,
  },

  team2Score: {
    type: Number,
    default: 0,
  },

  description: {
    type: String,
    trim: true,
    maxlength: 500, // optional limit
  }

}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);