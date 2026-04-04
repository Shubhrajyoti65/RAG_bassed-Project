const mongoose = require("mongoose");

function normalizeComparable(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[_\-]+/g, " ")
    .replace(/[^a-z0-9 ]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const caseSchema = new mongoose.Schema(
  {
    caseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    caseNumber: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: Number,
      default: null,
    },
    facts: {
      type: String,
      default: "",
    },
    legalReasoning: {
      type: String,
      default: "",
    },
    decision: {
      type: String,
      default: "",
    },
    relevantSections: {
      type: [String],
      default: [],
    },
    sourceFile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    pdfUrl: {
      type: String,
      required: true,
      trim: true,
    },
    embedding: {
      type: [Number],
      default: undefined,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    normalizedTitle: {
      type: String,
      index: true,
      default: "",
    },
    caseNumberNormalized: {
      type: String,
      index: true,
      default: "",
    },
    sourceFileNormalized: {
      type: String,
      index: true,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "cases",
  }
);

caseSchema.pre("validate", function setNormalizedFields() {
  this.normalizedTitle = normalizeComparable(this.caseTitle);
  this.caseNumberNormalized = normalizeComparable(this.caseNumber);
  this.sourceFileNormalized = normalizeComparable(this.sourceFile);
});

module.exports = mongoose.model("Case", caseSchema);
