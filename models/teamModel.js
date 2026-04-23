const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['captain', 'player'],
        default: 'player',
      }
    }
  ],

}, { timestamps: true });

teamSchema.pre('save', async function (next) {
  const Sport = mongoose.model('Sport');
  const sport = await Sport.findById(this.sport);

  // max players check
  if (this.members.length > sport.maxPlayers) {
    return next(new Error('Exceeds max players'));
  }

  // duplicate members
  const ids = this.members.map(m => m.user.toString());
  if (new Set(ids).size !== ids.length) {
    return next(new Error('Duplicate members not allowed'));
  }

  // captain check
  const captains = this.members.filter(m => m.role === 'captain');
  if (captains.length !== 1) {
    return next(new Error('Exactly one captain required'));
  }

  next();
});

module.exports = mongoose.model('Team', teamSchema);