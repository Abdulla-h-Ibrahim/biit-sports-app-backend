const User = require('../models/userModel');
const DBConnection = require("../config/databaseConnection")

exports.homePage = (req, res) => {
  try {
    return res.send(`Welcome to Home Page of BIIT Sports Application ... `);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};

exports.login = async (req, res) => {
  const conn = await DBConnection();
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

}

exports.register = async (req, res) => {
  const conn = await DBConnection();
  const { name, arid_no, age, email, password, role, gender } = req.body;
  if (!name || !arid_no || !email || !password || !role || !gender) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Regex for: 20xx-Arid-xxxx
  const aridRegex = /^20\d{2}-Arid-\d{4}$/;
  if (!aridRegex.test(arid_no)) {
    return res.status(400).json({
      success: false,
      message: 'ARID number must be in format 20xx-Arid-xxxx (e.g., 2021-Arid-1234)'
    });
  }

  try {
    const existUserEmail = await User.findOne({ email });
    const existUserArid = await User.findOne({ arid_no });
    if (existUserEmail)
      return res.status(400).json({ success: false, message: 'User already exists with email' });
    if (existUserArid)
      return res.status(400).json({ success: false, message: 'User already exists with ARID number' });


    const user = new User({ name, arid_no, age, email, password, role, gender });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(400).json({ success: false, message: error.message });
  }
}