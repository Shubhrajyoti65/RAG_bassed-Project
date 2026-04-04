/**
 * caseRoute.js
 *
 * GET /api/cases/lookup?title=...&caseNumber=...
 *   Looks up a case by title / caseNumber.
 *   Returns the full JSON record from importedCases.json plus the
 *   Cloudinary pdfUrl from MongoDB (stored during the migration).
 */

const express = require("express");
const path = require("path");
const fs = require("fs");
const Case = require("../models/Case");

const router = express.Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _casesCache = null;

/** Loads the analysis metadata for cases (facts/decision summary) from JSON */
function loadCases() {
  if (_casesCache) return _casesCache;
  const filePath = path.join(__dirname, "../data/importedCases.json");
  if (!fs.existsSync(filePath)) {
    _casesCache = [];
    return _casesCache;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    const parsed = JSON.parse(raw);
    _casesCache = Array.isArray(parsed) ? parsed : [];
  } catch {
    _casesCache = [];
  }
  return _casesCache;
}

function normalise(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[_\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Loads the case title -> pdfUrl mapping from JSON (for O(1) lookup) */
function loadPdfMapping() {
  const filePath = path.join(__dirname, "../data/pdfMapping.json");
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8").trim());
  } catch {
    return null;
  }
}

// ─── Lookup endpoint ─────────────────────────────────────────────────────────

/**
 * Main lookup endpoint for retrieval.
 * We resolve the Cloudinary URL from the JSON mapping (fast) or MongoDB (fallback),
 * and the text content from the JSON index.
 */
router.get("/cases/lookup", async (req, res) => {
  const { title = "", caseNumber = "" } = req.query;
  const cases = loadCases();
  const pdfMapping = loadPdfMapping();
  
  const normTitle = normalise(title);
  const normNumber = normalise(caseNumber);

  // 1. Find JSON record (for summaries, facts, decision etc.)
  let found = null;
  if (normNumber) found = cases.find((c) => normalise(c.caseNumber) === normNumber) || null;
  if (!found && normTitle) found = cases.find((c) => normalise(c.caseTitle) === normTitle) || null;
  if (!found && normTitle) {
    found = cases.find(
      (c) => normalise(c.caseTitle).includes(normTitle) || normTitle.includes(normalise(c.caseTitle))
    ) || null;
  }
  if (!found && normNumber) {
    found = cases.find(
      (c) => normalise(c.caseNumber).includes(normNumber) || normNumber.includes(normalise(c.caseNumber))
    ) || null;
  }

  // 2. Resolve pdfUrl — prefer fast JSON mapping, fallback to MongoDB
  const lookupTitle = (found?.caseTitle || title).toLowerCase();
  let pdfUrl = null;

  // Try fast JSON lookup first
  if (pdfMapping) {
    pdfUrl = pdfMapping.byTitle?.[lookupTitle] || pdfMapping.byFile?.[lookupTitle] || null;
  }

  // Try MongoDB fallback if still missing
  if (!pdfUrl) {
    try {
      const titleRegex = new RegExp(lookupTitle.replace(/[_\-]/g, "[ _-]?"), "i");
      const query = {
        $or: [
          { caseTitle: { $regex: titleRegex } },
          { sourceFile: { $regex: titleRegex } }
        ],
      };
      if (caseNumber) query.$or.push({ caseNumber: caseNumber });

      const dbCase = await Case.findOne(query).select("pdfUrl").lean();
      if (dbCase?.pdfUrl) {
        pdfUrl = dbCase.pdfUrl;
      }
    } catch (err) {
      console.error("MongoDB case lookup error:", err.message);
    }
  }

  return res.json({
    found: Boolean(found),
    case: found || null,
    pdfUrl: pdfUrl || null,
  });
});

module.exports = router;
