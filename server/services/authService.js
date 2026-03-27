const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const config = require("../config");
const User = require("../models/User");

let googleClient;

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
    authProvider: user.authProvider || "local",
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
  };
}

function getGoogleClient() {
  if (!googleClient) {
    googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);
  }
  return googleClient;
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
    authProvider: "local",
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

  if (!user.passwordHash) {
    const error = new Error(
      "This account uses Google sign-in. Continue with Google."
    );
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

async function authenticateWithGoogle({ idToken }) {
  const safeIdToken = String(idToken || "").trim();

  if (!config.GOOGLE_CLIENT_ID) {
    const error = new Error(
      "Google authentication is not configured on server."
    );
    error.statusCode = 500;
    throw error;
  }

  if (!safeIdToken) {
    const error = new Error("Google credential is required.");
    error.statusCode = 400;
    throw error;
  }

  const client = getGoogleClient();
  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: safeIdToken,
      audience: config.GOOGLE_CLIENT_ID,
    });
  } catch {
    const error = new Error("Invalid Google credential.");
    error.statusCode = 401;
    throw error;
  }

  const payload = ticket.getPayload() || {};
  const email = normalizeEmail(payload.email);
  const googleId = String(payload.sub || "").trim();
  const emailVerified = Boolean(payload.email_verified);
  const displayName = String(payload.name || "").trim();

  if (!email || !googleId || !emailVerified) {
    const error = new Error("Unable to verify Google account.");
    error.statusCode = 401;
    throw error;
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: displayName || email.split("@")[0],
      email,
      authProvider: "google",
      googleId,
    });

    return toPublicUser(user);
  }

  let shouldSave = false;
  if (!user.googleId) {
    user.googleId = googleId;
    shouldSave = true;
  }
  if (!user.authProvider && !user.passwordHash) {
    user.authProvider = "google";
    shouldSave = true;
  }
  if (!user.name && displayName) {
    user.name = displayName;
    shouldSave = true;
  }

  if (shouldSave) {
    await user.save();
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

module.exports = {
  signup,
  login,
  authenticateWithGoogle,
  issueToken,
  verifyToken,
  getUserById,
};
