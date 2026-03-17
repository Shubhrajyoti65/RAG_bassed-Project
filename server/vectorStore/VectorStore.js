const fs = require("fs");
const path = require("path");
const { generateEmbedding } = require("../services/geminiService");

class VectorStore {
  constructor(persistPath) {
    this.persistPath = persistPath || path.join(__dirname, "vectorData.json");
    this.documents = [];
  }

  async initialize(sampleCases) {
    if (this._loadFromDisk()) {
      console.log(`Loaded ${this.documents.length} documents from cache.`);
    }

    const existingIds = new Set(this.documents.map((doc) => doc.id));
    const pendingCases = sampleCases.filter(
      (c) => !existingIds.has(c.caseNumber)
    );

    if (!pendingCases.length) {
      console.log("Vector cache already up to date.");
      return;
    }

    console.log(
      `Embedding ${pendingCases.length} pending case(s) out of ${sampleCases.length} total...`
    );

    for (let i = 0; i < pendingCases.length; i++) {
      const c = pendingCases[i];
      const textToEmbed = `${c.caseTitle}. ${c.facts} ${c.legalReasoning} ${c.decision}`;
      let embedding;
      try {
        embedding = await generateEmbedding(textToEmbed);
      } catch (error) {
        if (this._isQuotaOrRateLimitError(error)) {
          console.warn(
            "Embedding quota/rate-limit reached during initialization. " +
              "Continuing with partial vector cache and fallback analysis.",
            error.message
          );
          break;
        }
        throw error;
      }

      this.documents.push({
        id: c.caseNumber,
        text: textToEmbed,
        embedding,
        metadata: {
          caseTitle: c.caseTitle,
          year: c.year,
          caseNumber: c.caseNumber,
          facts: c.facts,
          legalReasoning: c.legalReasoning,
          decision: c.decision,
          relevantSections: c.relevantSections,
        },
      });
      console.log(`  Embedded ${i + 1}/${pendingCases.length}: ${c.caseTitle}`);
      await this._delay(1500);
    }

    this._saveToDisk();
    console.log(
      `Vector store initialized and cached with ${this.documents.length} document(s).`
    );
  }

  async search(queryText, topK = 5) {
    if (!this.documents.length) {
      return [];
    }

    const queryEmbedding = await generateEmbedding(queryText);
    const scored = this.documents.map((doc) => ({
      score: this._cosineSimilarity(queryEmbedding, doc.embedding),
      metadata: doc.metadata,
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  _cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;
    return dotProduct / denominator;
  }

  _loadFromDisk() {
    try {
      if (fs.existsSync(this.persistPath)) {
        const raw = fs.readFileSync(this.persistPath, "utf-8");
        const parsed = JSON.parse(raw);
        this.documents = Array.isArray(parsed) ? parsed : [];
        return true;
      }
    } catch (err) {
      console.warn("Failed to load vector cache:", err.message);
    }
    return false;
  }

  _saveToDisk() {
    fs.writeFileSync(this.persistPath, JSON.stringify(this.documents, null, 2));
  }

  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  _isQuotaOrRateLimitError(error) {
    const message = String(error?.message || "").toLowerCase();
    return (
      error?.status === 429 ||
      message.includes("quota") ||
      message.includes("too many requests") ||
      message.includes("rate limit")
    );
  }
}

module.exports = VectorStore;
