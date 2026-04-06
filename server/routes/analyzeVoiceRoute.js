const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { analyzeVoice } = require("../services/ragService");
const { saveHistory } = require("../services/historyService");
const authenticate = require("../middleware/authenticate");

// Route to handle voice-based legal analysis with automatic language detection
router.post(
  "/analyze-voice",
  authenticate,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Audio file is required." });
      }

      const category = req.body?.category || "general";
      
      // Send the audio buffer to the RAG service which communicates with the Python backend
      const analysis = await analyzeVoice(req.file.buffer, category);

      // Save to user history using the transcription text identified by Gemini
      try {
        await saveHistory({
          userId: req.user.id,
          caseText: analysis.transcription || "Voice Query",
          inputType: "voice",
          analysis,
        });
      } catch (historyError) {
        console.warn("Failed to save voice analysis history:", historyError.message);
      }

      res.json(analysis);
    } catch (err) {
      // Pass errors to global error handler
      next(err);
    }
  }
);

module.exports = router;
