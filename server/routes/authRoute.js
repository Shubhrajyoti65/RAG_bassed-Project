const express = require("express");
const authenticate = require("../middleware/authenticate");
const {
  signup,
  login,
  authenticateWithGoogle,
  issueToken,
} = require("../services/authService");

const router = express.Router();

router.post("/auth/signup", async (req, res, next) => {
  try {
    const user = await signup(req.body || {});
    const token = issueToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const user = await login(req.body || {});
    const token = issueToken(user);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/google", async (req, res, next) => {
  try {
    const user = await authenticateWithGoogle(req.body || {});
    const token = issueToken(user);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

router.get("/auth/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
