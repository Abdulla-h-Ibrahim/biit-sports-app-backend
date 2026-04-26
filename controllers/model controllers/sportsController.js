const Sport = require('../../models/sportModel');
const DBConnection = require("../../config/databaseConnection")

exports.createSport = async (req, res) => {
  const conn = await DBConnection();
  try {
    const sport = new Sport(req.body);
    await sport.save();
    res.status(201).json({ success: true, data: sport });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllSports = async (req, res) => {
  const conn = await DBConnection();
  try {
    const sports = await Sport.find();
    res.status(200).json({ success: true, data: sports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSportById = async (req, res) => {
  const conn = await DBConnection();
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) {
      return res.status(404).json({ success: false, message: 'Sport not found' });
    }
    res.status(200).json({ success: true, data: sport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSport = async (req, res) => {
  const conn = await DBConnection();
  try {
    const sport = await Sport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sport) {
      return res.status(404).json({ success: false, message: 'Sport not found' });
    }
    res.status(200).json({ success: true, data: sport });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSport = async (req, res) => {
  const conn = await DBConnection();
  try {
    const sport = await Sport.findByIdAndDelete(req.params.id);
    if (!sport) {
      return res.status(404).json({ success: false, message: 'Sport not found' });
    }
    res.status(200).json({ success: true, message: 'Sport deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};