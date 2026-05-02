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
  notifications: [
    {
      type: {
        type: String,
        enum: ['team_invite', 'invite_accepted', 'invite_rejected'],
        default: 'team_invite',
      },
      title: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
      isRead: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isHashedMatch = await bcrypt.compare(candidatePassword, this.password);
  if (isHashedMatch) return true;

  // Backward compatibility for existing users saved before hashing was added.
  return candidatePassword === this.password;
};

const User = mongoose.model('User', userSchema);

module.exports = User;