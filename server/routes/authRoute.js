const express = require("express");
const authenticate = require("../middleware/authenticate");
const {
  signup,
  login,
  authenticateWithGoogle,
  issueToken,
  updateProfile,
} = require("../services/authService");

const router = express.Router();

// Route for new user registration
router.post("/auth/signup", async (req, res, next) => {
  try {
    const user = await signup(req.body || {});
    const token = issueToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
});

// Route for user login with username and password
router.post("/auth/login", async (req, res, next) => {
  try {
    const user = await login(req.body || {});
    const token = issueToken(user);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

// Route for authentication via Google OAuth
router.post("/auth/google", async (req, res, next) => {
  try {
    const user = await authenticateWithGoogle(req.body || {});
    const token = issueToken(user);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

// Route to retrieve current user's profile information
router.get("/auth/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Route to update current user's profile information
router.patch("/auth/me", authenticate, async (req, res, next) => {
  try {
    const user = await updateProfile(req.user.id, req.body || {});
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
