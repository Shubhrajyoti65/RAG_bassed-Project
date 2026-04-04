const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { extractTextFromPDF } = require("../services/pdfService");
const { analyzeCase } = require("../services/ragService");
const { detectCategory } = require("../services/categoryService");
const { saveHistory } = require("../services/historyService");
const { toDeliverablePdfUrl } = require("../services/storageService");
const Case = require("../models/Case");
const authenticate = require("../middleware/authenticate");

function normalizeComparable(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[_\-]+/g, " ")
    .replace(/[^a-z0-9 ]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function resolveCaseReference(similarCase) {
  const caseTitle = String(similarCase?.caseTitle || "").trim();
  const caseNumber = String(similarCase?.caseNumber || "").trim();
  const normalizedTitle = normalizeComparable(caseTitle);
  const normalizedCaseNumber = normalizeComparable(caseNumber);

  const query = { $or: [] };
  if (normalizedCaseNumber) {
    query.$or.push({ caseNumberNormalized: normalizedCaseNumber });
  }
  if (normalizedTitle) {
    query.$or.push({ normalizedTitle });
    query.$or.push({ sourceFileNormalized: normalizedTitle });
  }

  if (query.$or.length === 0) {
    return null;
  }

  return Case.findOne(query).select("_id pdfUrl").lean();
}

async function enrichSimilarCases(similarCases) {
  if (!Array.isArray(similarCases) || similarCases.length === 0) {
    return [];
  }

  const links = new Array(similarCases.length).fill(null);

  await Promise.all(
    similarCases.map(async (item, index) => {
      const linkedCase = await resolveCaseReference(item);
      if (!linkedCase) {
        item.caseId = item.caseId || null;
        item.pdfUrl = item.pdfUrl || null;
        return;
      }

      item.caseId = String(linkedCase._id);
      item.pdfUrl = linkedCase.pdfUrl
        ? toDeliverablePdfUrl(linkedCase.pdfUrl)
        : null;
      links[index] = { caseId: item.caseId, pdfUrl: item.pdfUrl };
    })
  );

  return links;
}

// Route to analyze a legal case from either a PDF file upload or direct text input
router.post(
  "/analyze",
  authenticate,
  upload.single("file"),
  async (req, res, next) => {
    try {
      let caseText;
      let inputType = "text";

      if (req.file) {
        caseText = await extractTextFromPDF(req.file.buffer);
        inputType = "pdf";
      } else if (req.body && req.body.text) {
        caseText = req.body.text;
      } else {
        return res.status(400).json({
          error:
            "Please provide either a PDF file or case text in the request body.",
        });
      }

      if (caseText.length < 50) {
        return res.status(400).json({
          error:
            "Case description is too short. Please provide at least 50 characters.",
        });
      }

      if (caseText.length > 50000) {
        return res.status(400).json({
          error:
            "Case description is too long. Maximum 50,000 characters allowed.",
        });
      }

      const userProvidedCategory = String(req.body?.category || "").trim();
      const shouldAutoDetect =
        !userProvidedCategory ||
        userProvidedCategory.toLowerCase() === "not sure";

      const resolvedCategory = shouldAutoDetect
        ? detectCategory(caseText)
        : userProvidedCategory;

      let ragCategory = resolvedCategory.toLowerCase();
      if (ragCategory !== "property") {
        ragCategory = "general"; // All non-property cases share the general DV/mixed index
      }
      const language = req.body?.language || "English";
      const analysis = await analyzeCase(caseText, ragCategory, language);

      try {
        const englishPayload = analysis?.english || analysis;
        const englishLinks = await enrichSimilarCases(
          englishPayload?.similarCases
        );

        // Keep translated response in sync even if translated case titles differ.
        if (analysis?.translated?.similarCases && Array.isArray(englishLinks)) {
          analysis.translated.similarCases.forEach((item, index) => {
            const link = englishLinks[index];
            item.caseId = item.caseId || link?.caseId || null;
            item.pdfUrl = item.pdfUrl || link?.pdfUrl || null;
          });
        }
      } catch (enrichError) {
        // Analysis should still return even if PDF enrichment fails.
        console.warn(
          `Failed to enrich similar cases with pdfUrl: ${enrichError.message}`
        );
      }

      try {
        await saveHistory({
          userId: req.user.id,
          caseText,
          inputType,
          analysis,
        });
      } catch (historyError) {
        // Analysis should not fail if history persistence fails.
        console.warn("Failed to save analysis history:", historyError.message);
      }

      res.json(analysis);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
