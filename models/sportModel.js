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

module.exports = mongoose.model('Sport', sportSchema);