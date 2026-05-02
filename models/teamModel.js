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
      },
      inviteStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    }
  ],
  teamStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },

}, { timestamps: true });

teamSchema.pre('save', async function () {
  const Sport = mongoose.model('Sport');
  const sport = await Sport.findById(this.sport);

  if (!sport) {
    throw new Error('Sport not found');
  }

  // max players check
  if (this.members.length > sport.maxPlayers) {
    throw new Error('Exceeds max players');
  }

  // duplicate members
  const ids = this.members.map(m => m.user.toString());
  if (new Set(ids).size !== ids.length) {
    throw new Error('Duplicate members not allowed');
  }

  // captain check
  const captains = this.members.filter(m => m.role === 'captain');
  if (captains.length !== 1) {
    throw new Error('Exactly one captain required');
  }

  // team completion is based on invitation acceptance.
  const allAccepted = this.members.every(m => m.inviteStatus === 'accepted');
  this.teamStatus = allAccepted ? 'completed' : 'pending';
});

module.exports = mongoose.model('Team', teamSchema);