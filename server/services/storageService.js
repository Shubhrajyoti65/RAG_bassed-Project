const fs = require("fs");
const path = require("path");

// Ensures a directory exists and creates an empty JSON file if it doesn't
function ensureJsonFile(filePath, defaultValue) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

// Reads and parses a JSON file from disk
function readJson(filePath, defaultValue) {
  ensureJsonFile(filePath, defaultValue);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// Writes data to a JSON file on disk
function writeJson(filePath, value) {
  ensureJsonFile(filePath, []);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

module.exports = { ensureJsonFile, readJson, writeJson };
