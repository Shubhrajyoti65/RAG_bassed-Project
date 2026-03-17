const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    inputType: {
      type: String,
      enum: ["text", "pdf"],
      default: "text",
    },
    inputPreview: {
      type: String,
      required: true,
      trim: true,
    },
    analysis: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

historySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("History", historySchema);
