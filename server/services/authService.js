const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const config = require("../config");
const User = require("../models/User");
const { sendResetOtpEmail } = require("./emailService");

let googleClient;

// Normalizes email address to lowercase and trims whitespace
function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

// Converts internal user model to a public DTO format
function toPublicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || "",
    gender: user.sex || "",
    sex: user.sex || "",
    authProvider: user.authProvider || "local",
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
  };
}

// Validates and normalizes user avatar URL or base64 string
function normalizeAvatarUrl(value) {
  const safeValue = String(value || "").trim();
  if (!safeValue) {
    return "";
  }

  if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(safeValue)) {
    if (safeValue.length > 3_000_000) {
      const error = new Error("Uploaded photo is too large.");
      error.statusCode = 400;
      throw error;
    }

    return safeValue;
  }

  if (!/^https?:\/\//i.test(safeValue)) {
    const error = new Error(
      "Avatar must be an uploaded image or a URL starting with http:// or https://."
    );
    error.statusCode = 400;
    throw error;
  }

  if (safeValue.length > 2048) {
    const error = new Error("Avatar URL is too long.");
    error.statusCode = 400;
    throw error;
  }

  return safeValue;
}

// Validates and normalizes gender values
function normalizeGender(value) {
  const safeValue = String(value || "")
    .trim()
    .toLowerCase();

  const allowed = ["", "male", "female", "other", "prefer_not_to_say"];
  if (!allowed.includes(safeValue)) {
    const error = new Error("Please choose a valid gender value.");
    error.statusCode = 400;
    throw error;
  }

  return safeValue;
}

// Initializes and retrieves the Google OAuth2 client
function getGoogleClient() {
  if (!googleClient) {
    googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);
  }
  return googleClient;
}

// Handles user registration logic
async function signup({ name, email, password }) {
  const safeName = String(name || "").trim();
  const safeEmail = normalizeEmail(email);
  const safePassword = String(password || "");

  if (!safeName || safeName.length < 2) {
    const error = new Error("Name must be at least 2 characters long.");
    error.statusCode = 400;
    throw error;
  }
  if (!safeEmail || !safeEmail.includes("@")) {
    const error = new Error("Please provide a valid email address.");
    error.statusCode = 400;
    throw error;
  }
  if (safePassword.length < 6) {
    const error = new Error("Password must be at least 6 characters long.");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: safeEmail }).lean();
  const exists = Boolean(existingUser);
  if (exists) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(safePassword, 10);

  let user;
  try {
    user = await User.create({
      name: safeName,
      email: safeEmail,
      passwordHash,
      authProvider: "local",
    });
  } catch (dbError) {
    if (dbError?.code === 11000) {
      const duplicateField =
        Object.keys(dbError.keyPattern || {})[0] || "field";
      const error = new Error(
        duplicateField === "email"
          ? "An account with this email already exists."
          : "This account information already exists."
      );
      error.statusCode = 409;
      throw error;
    }
    throw dbError;
  }

  return toPublicUser(user);
}

// Handles user login logic with email and password
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

// Handles authentication via Google OAuth ID token
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
  const googleAvatarUrl = normalizeAvatarUrl(payload.picture || "");

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
      avatarUrl: googleAvatarUrl,
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
  if (!user.avatarUrl && googleAvatarUrl) {
    user.avatarUrl = googleAvatarUrl;
    shouldSave = true;
  }

  if (shouldSave) {
    await user.save();
  }

  return toPublicUser(user);
}

// Issues a JWT token for the given user
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

// Verifies a JWT token's validity
function verifyToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}

// Retrieves a user by their unique identifier
async function getUserById(userId) {
  const user = await User.findById(userId);
  return user ? toPublicUser(user) : null;
}

// Updates user profile information
async function updateProfile(userId, payload = {}) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  let shouldSave = false;

  if (Object.prototype.hasOwnProperty.call(payload, "name")) {
    const safeName = String(payload.name || "").trim();
    if (!safeName || safeName.length < 2) {
      const error = new Error("Name must be at least 2 characters long.");
      error.statusCode = 400;
      throw error;
    }

    if (safeName !== user.name) {
      user.name = safeName;
      shouldSave = true;
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, "avatarUrl")) {
    const safeAvatarUrl = normalizeAvatarUrl(payload.avatarUrl);
    if (safeAvatarUrl !== (user.avatarUrl || "")) {
      user.avatarUrl = safeAvatarUrl;
      shouldSave = true;
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(payload, "gender") ||
    Object.prototype.hasOwnProperty.call(payload, "sex")
  ) {
    const incomingGender = Object.prototype.hasOwnProperty.call(
      payload,
      "gender"
    )
      ? payload.gender
      : payload.sex;
    const safeGender = normalizeGender(incomingGender);
    if (safeGender !== (user.sex || "")) {
      user.sex = safeGender;
      shouldSave = true;
    }
  }

  if (shouldSave) {
    await user.save();
  }

  return toPublicUser(user);
}

// Creates a one-time password reset token for a local account
async function requestPasswordReset({ email }) {
  const safeEmail = normalizeEmail(email);

  if (!safeEmail || !safeEmail.includes("@")) {
    const error = new Error("Please provide a valid email address.");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: safeEmail });
  const genericResponse = {
    message:
      "If an account with that email exists, a password reset OTP has been sent.",
  };

  if (!user || !user.passwordHash) {
    return genericResponse;
  }

  const rawOtp = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
  const tokenHash = crypto.createHash("sha256").update(rawOtp).digest("hex");
  const expiresAt = new Date(
    Date.now() + config.PASSWORD_RESET_TTL_MINUTES * 60 * 1000
  );

  user.passwordResetTokenHash = tokenHash;
  user.passwordResetExpiresAt = expiresAt;
  await user.save();

  try {
    await sendResetOtpEmail({
      toEmail: user.email,
      recipientName: user.name,
      otp: rawOtp,
      ttlMinutes: config.PASSWORD_RESET_TTL_MINUTES,
    });
  } catch (emailError) {
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    await user.save();

    const error = new Error(
      "Could not send reset OTP email right now. Please try again shortly."
    );
    error.statusCode = 503;
    throw error;
  }

  return genericResponse;
}

// Resets password using a valid, unexpired token
async function resetPassword({ token, otp, newPassword }) {
  const safeToken = String(otp || token || "").trim();
  const safePassword = String(newPassword || "");

  if (!safeToken) {
    const error = new Error("Reset OTP is required.");
    error.statusCode = 400;
    throw error;
  }

  if (safePassword.length < 6) {
    const error = new Error("Password must be at least 6 characters long.");
    error.statusCode = 400;
    throw error;
  }

  const tokenHash = crypto.createHash("sha256").update(safeToken).digest("hex");
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    const error = new Error("Reset OTP is invalid or has expired.");
    error.statusCode = 400;
    throw error;
  }

  user.passwordHash = await bcrypt.hash(safePassword, 10);
  user.authProvider = user.authProvider || "local";
  user.passwordResetTokenHash = null;
  user.passwordResetExpiresAt = null;
  await user.save();

  return { message: "Password has been reset successfully. Please sign in." };
}

module.exports = {
  signup,
  login,
  authenticateWithGoogle,
  issueToken,
  verifyToken,
  getUserById,
  updateProfile,
  requestPasswordReset,
  resetPassword,
};
