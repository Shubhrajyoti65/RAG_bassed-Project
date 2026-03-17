import { useState } from "react";
import { submitAnalysis } from "../api/analysisApi";

export function useAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function analyze({ text, file, token }) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await submitAnalysis({ text, file, token });
      setResult(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
  }

  function loadSavedResult(savedResult) {
    setResult(savedResult || null);
    setError(null);
    setLoading(false);
  }

  return { result, loading, error, analyze, reset, loadSavedResult };
}
