
exports.healthGeneral = (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    time: new Date()
  });
};