const mongoose = require('mongoose')

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['Team', 'Individual', 'Combo', 'Trio', 'Other'],
    default: 'Other'
  },
  players: {
    type: Number,
    min: 1,
    default: 1
  },
})