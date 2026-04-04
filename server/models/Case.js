const mongoose = require("mongoose");

/**
 * Case model — stores metadata and Cloudinary pdfUrl for each indexed judgment.
 * Created separately from User/History to keep concerns clean.
 */
const caseSchema = new mongoose.Schema(
  {
    // Human-readable title (from filename or first line of PDF)
    caseTitle: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Court case number / identifier (may be empty for older judgments)
    caseNumber: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    // Year of judgment
    year: {
      type: Number,
      default: null,
    },

    // Original PDF filename on disk (used for lookup/dedup)
    sourceFile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Cloudinary secure_url — set by the migration script
    pdfUrl: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "cases",
  }
);

// Custom index to find by normalised title efficiently
caseSchema.index({ caseTitle: "text" });

module.exports = mongoose.model("Case", caseSchema);
