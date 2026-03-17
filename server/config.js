const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
  override: true,
});

module.exports = {
  PORT: process.env.PORT || 3001,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || "gemini-embedding-001",
  GENERATION_MODEL: process.env.GENERATION_MODEL || "gemini-2.0-flash",
  ENABLE_FALLBACK_ANALYSIS: process.env.ENABLE_FALLBACK_ANALYSIS !== "false",
  JWT_SECRET: process.env.JWT_SECRET || "change-this-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017",
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "nyayasahayak",
};
