const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { extractTextFromPDF } = require("../services/pdfService");
const { analyzeCase } = require("../services/ragService");
const authenticate = require("../middleware/authenticate");
const { saveHistory } = require("../services/historyService");

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

      const category = (req.body?.category || "general").toLowerCase();
      const analysis = await analyzeCase(caseText, category);
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
