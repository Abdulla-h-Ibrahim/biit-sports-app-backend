const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


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

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;