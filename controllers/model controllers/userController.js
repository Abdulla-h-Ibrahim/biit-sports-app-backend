const User = require('../../models/userModel');
const DBConnection = require("../../config/databaseConnection")

exports.createUser = async (req, res) => {
  const conn = await DBConnection();
  try {
    const user = await User.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        user: user
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    })
  }
}

exports.getAllUsers = async (req, res) => {
  const conn = await DBConnection();

  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      users: users,
      results: users.length,
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    })
  }
}

exports.getUserById = async (req, res) => {
  const conn = await DBConnection();

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user: user
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    })
  }
}

exports.updateUserById = async (req, res) => {
  const conn = await DBConnection();
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user: user
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    })
  }
}

exports.deleteUserById = async (req, res) => {
  const conn = await DBConnection();
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    } else {
      res.status(200).json({
        status: 'success',
        user: user
      })
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      mwssage: error.message
    })
  }
}