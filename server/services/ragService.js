const PYTHON_RAG_URL =
  process.env.PYTHON_RAG_URL || "http://localhost:8000/analyze";

// Sends case text to the Python RAG service for analysis
async function analyzeCase(caseText) {
  const text = String(caseText || "").trim();
  if (!text) {
    throw new Error("Case text is required");
  }

  const response = await fetch(PYTHON_RAG_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
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
  const required = ["summary", "legalProvisions", "similarCases", "disclaimer"];
  for (const field of required) {
    if (!analysis[field]) {
      throw new Error(`Invalid LLM response: missing field "${field}"`);
    }
  }
  if (!Array.isArray(analysis.legalProvisions)) {
    throw new Error("legalProvisions must be an array");
  }
  if (!Array.isArray(analysis.similarCases)) {
    throw new Error("similarCases must be an array");
  }
}

module.exports = { analyzeCase };
