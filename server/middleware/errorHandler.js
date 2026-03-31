// Global middleware to handle errors and send appropriate HTTP responses
function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  const isProduction = process.env.NODE_ENV === "production";

  const message = (err.message || "").toLowerCase();

  if (err.statusCode === 401 || message.includes("invalid email or password")) {
    return res.status(401).json({ error: err.message || "Unauthorized." });
  }

  if (err.statusCode === 409) {
    return res.status(409).json({ error: err.message || "Conflict." });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(413)
      .json({ error: "File too large. Maximum size is 10MB." });
  }

  if (message.includes("only pdf files are accepted")) {
    return res.status(400).json({ error: "Only PDF files are accepted." });
  }

  if (
    err.statusCode === 400 ||
    message.includes("could not extract text from pdf") ||
    message.includes("uploaded pdf could not be read") ||
    message.includes("invalid pdf")
  ) {
    return res.status(400).json({
      error:
        err.message ||
        "Invalid PDF file. Please upload a valid text-based PDF and try again.",
    });
  }

  if (message.includes("api key")) {
    return res.status(500).json({
      error: "AI service configuration error. Please check your API key.",
    });
  }

  if (
    message.includes("quota") ||
    message.includes("429") ||
    message.includes("too many requests")
  ) {
    return res.status(503).json({
      error:
        "AI quota exceeded or service is busy. Please check Gemini billing/quota and try again shortly.",
    });
  }

  if (
    message.includes("not found for api version") ||
    message.includes("models/")
  ) {
    return res.status(500).json({
      error:
        "Configured Gemini model is unavailable for this API version. Update EMBEDDING_MODEL/GENERATION_MODEL in .env.",
    });
  }

  res.status(500).json({
    error:
      !isProduction && err.message
        ? err.message
        : "An internal error occurred. Please try again.",
  });
}

module.exports = errorHandler;
