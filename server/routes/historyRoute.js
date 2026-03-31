const express = require("express");
const authenticate = require("../middleware/authenticate");
const { getUserHistory } = require("../services/historyService");

const router = express.Router();

// Route to retrieve the legal analysis history for the authenticated user
router.get("/history", authenticate, async (req, res, next) => {
  try {
    const history = await getUserHistory(req.user.id);
    res.json({ history });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
