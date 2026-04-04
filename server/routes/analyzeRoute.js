const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { extractTextFromPDF } = require("../services/pdfService");
const { analyzeCase } = require("../services/ragService");
const { detectCategory } = require("../services/categoryService");
const { saveHistory } = require("../services/historyService");
const Case = require("../models/Case");
const authenticate = require("../middleware/authenticate");

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

      // Enrich analysis with Cloudinary pdfUrls for similar cases
      try {
        const resultTypes = ["english", "translated"];
        for (const type of resultTypes) {
          const content = analysis[type] || (type === "english" ? analysis : null);
          if (content && Array.isArray(content.similarCases)) {
            // Perform all lookups in parallel for better performance
            await Promise.all(content.similarCases.map(async (c) => {
              const titleRegex = new RegExp(c.caseTitle.replace(/[_\-]/g, "[ _-]?"), "i");
              const query = {
                $or: [
                  { caseTitle: { $regex: titleRegex } },
                  { sourceFile: { $regex: titleRegex } }
                ]
              };
              if (c.caseNumber) query.$or.push({ caseNumber: c.caseNumber });
              
              const dbCase = await Case.findOne(query).select("pdfUrl").lean();
              if (dbCase?.pdfUrl) {
                c.pdfUrl = dbCase.pdfUrl;
              }
            }));
          }
          if (!analysis[type]) break;
        }
      } catch (enrichError) {
        console.warn("Analysis enrichment failed (non-critical):", enrichError.message);
      }

      res.json(analysis);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
