const mongoose = require("mongoose");

// Mongoose schema for user profiles and authentication data
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    avatarUrl: {
      type: String,
      default: "",
      trim: true,
    },
    sex: {
      type: String,
      enum: ["", "male", "female", "other", "prefer_not_to_say"],
      default: "",
    },
    passwordResetTokenHash: {
      type: String,
      default: null,
      index: true,
    },
    passwordResetExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
