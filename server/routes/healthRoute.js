const express = require("express");
const router = express.Router();

// Route to check server health status
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
