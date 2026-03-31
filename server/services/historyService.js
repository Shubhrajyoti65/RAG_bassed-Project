const History = require("../models/History");

// Converts history model entry to DTO format
function toHistoryDto(entry) {
  return {
    id: String(entry._id),
    userId: String(entry.userId),
    createdAt:
      entry.createdAt instanceof Date
        ? entry.createdAt.toISOString()
        : entry.createdAt,
    inputType: entry.inputType,
    inputPreview: entry.inputPreview,
    analysis: entry.analysis,
  };
}

// Generates a short preview from full case text
function buildPreview(caseText) {
  const normalized = String(caseText || "")
    .replace(/\s+/g, " ")
    .trim();
  if (normalized.length <= 220) {
    return normalized;
  }
  return `${normalized.slice(0, 217)}...`;
}

// Saves analysis results to user history
async function saveHistory({ userId, caseText, inputType, analysis }) {
  const entry = await History.create({
    userId,
    inputType: inputType || "text",
    inputPreview: buildPreview(caseText),
    analysis,
  });

  return toHistoryDto(entry);
}

// Retrieves analysis history for a specific user
async function getUserHistory(userId) {
  const entries = await History.find({ userId }).sort({ createdAt: -1 }).lean();
  return entries.map(toHistoryDto);
}

module.exports = { saveHistory, getUserHistory };
