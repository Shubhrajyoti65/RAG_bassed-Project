const express = require("express");
const authenticate = require("../middleware/authenticate");
const { getUserHistory } = require("../services/historyService");
const { toDeliverablePdfUrl } = require("../services/storageService");

const router = express.Router();

function refreshSimilarCases(similarCases) {
  if (!Array.isArray(similarCases)) {
    return;
  }

  similarCases.forEach((item) => {
    if (!item || !item.pdfUrl) {
      return;
    }
    item.pdfUrl = toDeliverablePdfUrl(item.pdfUrl);
  });
}

function refreshHistoryAnalysisLinks(analysis) {
  if (!analysis || typeof analysis !== "object") {
    return analysis;
  }

  const cloned = JSON.parse(JSON.stringify(analysis));
  const englishPayload = cloned?.english || cloned;
  refreshSimilarCases(englishPayload?.similarCases);
  refreshSimilarCases(cloned?.translated?.similarCases);
  return cloned;
}

// Route to retrieve the legal analysis history for the authenticated user
router.get("/history", authenticate, async (req, res, next) => {
  try {
    const history = await getUserHistory(req.user.id);
    const refreshedHistory = history.map((entry) => ({
      ...entry,
      analysis: refreshHistoryAnalysisLinks(entry.analysis),
    }));
    res.json({ history: refreshedHistory });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
