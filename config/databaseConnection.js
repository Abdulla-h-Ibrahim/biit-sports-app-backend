const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://biitsportsapp:biitsportsapp@cluster0.hfdpvbr.mongodb.net/?appName=Cluster0");
    console.log("Mongo DB is connected to CLuster 0 from Abdullah's Account")
  } catch (error) {
    console.error("Database Connection Failed", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;