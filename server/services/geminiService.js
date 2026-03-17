const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config");

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

function parseJsonFromModelOutput(rawText) {
  try {
    return JSON.parse(rawText);
  } catch (_err) {
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      return JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
    }
    throw new Error("Model returned non-JSON output");
  }
}

async function generateEmbedding(text) {
  const modelCandidates = [
    config.EMBEDDING_MODEL,
    "gemini-embedding-001",
    "text-embedding-004",
  ];

  let lastError;
  for (const model of modelCandidates) {
    try {
      const embeddingModel = genAI.getGenerativeModel({ model });
      const result = await embeddingModel.embedContent(text);

      return result.embedding.values;
    } catch (error) {
      lastError = error;
      if (error?.status !== 404) {
        throw error;
      }
    }
  }

  throw lastError;
}

async function generateAnalysis(prompt) {
  const modelCandidates = [
    config.GENERATION_MODEL,
    "gemini-2.0-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
  ];

  let lastError;
  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(prompt);
      return parseJsonFromModelOutput(result.response.text());
    } catch (error) {
      lastError = error;
      if (error?.status !== 404) {
        throw error;
      }
    }
  }

  throw lastError;
}

module.exports = { generateEmbedding, generateAnalysis };
