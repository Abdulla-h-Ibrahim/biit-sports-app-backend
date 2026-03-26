
const DBConnection = require("../config/databaseConnection")

exports.testGeneral = (req, res) => {
  res.json({
    message: "Test route working fine"
  });
};

exports.testDatabaseConnection = async (req, res) => {
  try {
    const conn = await DBConnection();

    res.status(200).json({
      status: "success",
      message: `Mongo DB connected, ${conn.connection.host}`,
      host: conn.connection.host,
      dbName: conn.connection.name
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message
    });
  }
}