const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://biitsportsapp:biitsportsapp@cluster0.hfdpvbr.mongodb.net/?appName=Cluster0");
    console.log("Mongo DB connected", conn.connection.host)
    return conn;
  } catch (error) {
    console.error("Database Connection Failed", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;