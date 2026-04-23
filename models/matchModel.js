const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
  },
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  matchDate: Date,
  venue: String,
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
});

matchSchema.pre('save', function (next) {
  if (this.team1.toString() === this.team2.toString()) {
    return next(new Error("A team cannot play against itself"));
  }
  next();
});

module.exports = mongoose.model('Match', matchSchema);