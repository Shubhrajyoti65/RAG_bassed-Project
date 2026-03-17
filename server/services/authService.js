const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function toPublicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
  };
}

async function signup({ name, email, password }) {
  const safeName = String(name || "").trim();
  const safeEmail = normalizeEmail(email);
  const safePassword = String(password || "");

  if (!safeName || safeName.length < 2) {
    throw new Error("Name must be at least 2 characters long.");
  }
  if (!safeEmail || !safeEmail.includes("@")) {
    throw new Error("Please provide a valid email address.");
  }
  if (safePassword.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const existingUser = await User.findOne({ email: safeEmail }).lean();
  const exists = Boolean(existingUser);
  if (exists) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(safePassword, 10);
  const user = await User.create({
    name: safeName,
    email: safeEmail,
    passwordHash,
  });

  return toPublicUser(user);
}

async function login({ email, password }) {
  const safeEmail = normalizeEmail(email);
  const safePassword = String(password || "");

  const user = await User.findOne({ email: safeEmail });

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const ok = await bcrypt.compare(safePassword, user.passwordHash);
  if (!ok) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  return toPublicUser(user);
}

function issueToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}

async function getUserById(userId) {
  const user = await User.findById(userId);
  return user ? toPublicUser(user) : null;
}

module.exports = { signup, login, issueToken, verifyToken, getUserById };
