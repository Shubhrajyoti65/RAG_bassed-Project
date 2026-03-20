const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
  override: true,
});

module.exports = {
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET || "change-this-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017",
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "nyayasahayak",
};
