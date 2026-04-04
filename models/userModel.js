const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  arid_no: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['player', 'coach', 'admin'], // keep consistent with FE values
    default: 'player',
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  profilePic: {
    type: String,
  },
});

// Plain-text comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return candidatePassword === this.password;
};

const User = mongoose.model('User', userSchema);

module.exports = User;