import AnalyzeInput from "../components/AnalyzeInput";
import AnalyzeResult from "../components/AnalyzeResult";
import ErrorAlert from "../components/ErrorAlert";
import { useEffect, useMemo } from "react";

export default function Analyze({ token, loadUserHistory, result, loading, error, analysisTimeMs, analyze, reset }) {
  const analysisResult = useMemo(() => result || null, [result]);

  async function handleAnalyze(payload) {
    const outcome = await analyze({ ...payload, token });
    if (outcome?.ok) {
      await loadUserHistory();
    }
  }

  function handleRestart() {
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (analysisResult) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [analysisResult]);

  return (
    <div className="animate-fade-in space-y-8">
      <section className="text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 font-label text-[11px] font-bold tracking-[0.15em] uppercase text-primary">
          Intelligent Legal Counsel
        </span>
        <h1 className="mt-4 font-headline text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-text-primary">
          Clarity for your <span className="hero-title-gradient">complex world.</span>
        </h1>
        <p className="mt-5 font-body text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
          No jargon. No confusion. Just structured, calm, and actionable legal guidance.
        </p>
      </section>

      {!analysisResult ? (
        <div className="space-y-5">
          <AnalyzeInput onAnalyze={handleAnalyze} loading={loading} />
          {loading && (
            <div className="app-card p-8 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="font-headline text-text-primary font-medium">Analyzing your situation...</p>
              <p className="font-body text-sm text-text-secondary text-center max-w-md">
                Processing facts, matching legal provisions, and preparing a structured breakdown.
              </p>
            </div>
          )}
          {error && <ErrorAlert message={error} onDismiss={reset} />}
        </div>
      ) : (
        <div>
          <AnalyzeResult
            result={analysisResult}
            analysisTimeMs={analysisTimeMs}
            onRestart={handleRestart}
          />
        </div>
      )}
    </div>
  );
}


