const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  type: {
    type: String,
    enum: ['team', 'individual', 'duo', 'trio'],
    default: 'team',
  },

  minPlayers: {
    type: Number,
    default: 1,
  },

  maxPlayers: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: true,
  }

}, { timestamps: true });

sportSchema.pre('validate', function () {
  if (this.minPlayers < 1) {
    throw new Error('minPlayers must be at least 1');
  }

  if (this.maxPlayers < this.minPlayers) {
    throw new Error('maxPlayers must be greater than or equal to minPlayers');
  }

  if (this.type !== 'team' && this.maxPlayers > 1) {
    throw new Error('Only team sports can have more than 1 player');
  }
});

module.exports = mongoose.model('Sport', sportSchema);