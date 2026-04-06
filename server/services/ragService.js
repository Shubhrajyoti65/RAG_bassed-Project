const axios = require("axios");
const FormData = require("form-data");
const PYTHON_RAG_URL =
  process.env.PYTHON_RAG_URL || "http://localhost:8000/analyze";
const PYTHON_VOICE_URL = 
  process.env.PYTHON_VOICE_URL || "http://localhost:8000/analyze-voice";

// Sends case text to the Python RAG service for analysis
async function analyzeCase(
  caseText,
  category = "general",
  language = "English"
) {
  const text = String(caseText || "").trim();
  if (!text) {
    throw new Error("Case text is required");
  }

  const response = await fetch(PYTHON_RAG_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, category, language }),
  });

  const raw = await response.text();
  let parsed;
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch (error) {
    throw new Error(
      `Python RAG service returned non-JSON response: ${error.message}`
    );
  }

  if (!response.ok) {
    const message =
      parsed?.detail ||
      parsed?.error ||
      `Python RAG service failed with status ${response.status}`;
    throw new Error(message);
  }

  validateAnalysis(parsed);
  return parsed;
}

// Validates that the LLM analysis response contains all required fields
function validateAnalysis(analysis) {
  const data = analysis.english || analysis;
  const required = ["summary", "legalProvisions", "similarCases", "disclaimer"];
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`Invalid LLM response: missing field "${field}"`);
    }
  }
  if (!Array.isArray(data.legalProvisions)) {
    throw new Error("legalProvisions must be an array");
  }
  if (!Array.isArray(data.similarCases)) {
    throw new Error("similarCases must be an array");
  }
}

async function analyzeVoice(audioBuffer, category = "general") {
  if (!audioBuffer) {
    throw new Error("Audio buffer is required");
  }

  const form = new FormData();
  // Using a blob-like structure for the form data to handle the buffer
  form.append("file", audioBuffer, {
    filename: "voice_query.webm",
    contentType: "audio/webm",
  });
  form.append("category", category);

  try {
    const response = await axios.post(PYTHON_VOICE_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    validateAnalysis(response.data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.error ||
      error.message;
    throw new Error(`Voice analysis failed: ${message}`);
  }
}

module.exports = { analyzeCase, analyzeVoice };
