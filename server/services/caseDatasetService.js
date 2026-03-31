const fs = require("fs");
const path = require("path");

const IMPORTED_CASES_PATH = path.join(
  __dirname,
  "..",
  "data",
  "importedCases.json"
);

// Main entry point to load the entire case dataset
function loadCaseDataset() {
  return loadImportedCases();
}

// Loads legal cases from the imported JSON file
function loadImportedCases() {
  try {
    if (!fs.existsSync(IMPORTED_CASES_PATH)) {
      return [];
    }

    const raw = fs.readFileSync(IMPORTED_CASES_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn(
        "importedCases.json must contain an array. Ignoring imported cases."
      );
      return [];
    }

    const validCases = parsed.filter(isValidCase);
    if (validCases.length !== parsed.length) {
      console.warn(
        `Ignored ${
          parsed.length - validCases.length
        } invalid imported case(s) due to missing required fields.`
      );
    }

    return validCases;
  } catch (error) {
    console.warn("Failed to load importedCases.json:", error.message);
    return [];
  }
}

// Validates that a case object contains all required fields
function isValidCase(item) {
  if (!item || typeof item !== "object") return false;

  const requiredStringFields = [
    "caseTitle",
    "caseNumber",
    "facts",
    "legalReasoning",
    "decision",
  ];

  for (const field of requiredStringFields) {
    if (typeof item[field] !== "string" || item[field].trim() === "") {
      return false;
    }
  }

  if (typeof item.year !== "number" || Number.isNaN(item.year)) {
    return false;
  }

  if (!Array.isArray(item.relevantSections)) {
    return false;
  }

  return true;
}

module.exports = { loadCaseDataset };
