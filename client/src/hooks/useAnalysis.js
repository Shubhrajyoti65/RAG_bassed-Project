import { useState } from "react";
import { submitAnalysis } from "../api/analysisApi";

export function useAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisTimeMs, setAnalysisTimeMs] = useState(null);

  async function analyze({ text, file, token }) {
    const startedAt = performance.now();
    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysisTimeMs(null);
    try {
      const data = await submitAnalysis({ text, file, token });
      setResult(data);
      setAnalysisTimeMs(Math.max(0, Math.round(performance.now() - startedAt)));
      return { ok: true, data };
    } catch (err) {
      const message = err.message || "An unexpected error occurred.";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setAnalysisTimeMs(null);
  }

  function loadSavedResult(savedResult) {
    setResult(savedResult || null);
    setError(null);
    setLoading(false);
    setAnalysisTimeMs(null);
  }

  return {
    result,
    loading,
    error,
    analysisTimeMs,
    analyze,
    reset,
    loadSavedResult,
  };
}
