const mongoose = require("mongoose");
const config = require("../config");

async function connectMongo() {
  await mongoose.connect(config.MONGODB_URI, {
    dbName: config.MONGODB_DB_NAME,
  });
  console.log("MongoDB connected");
}

module.exports = { connectMongo };
