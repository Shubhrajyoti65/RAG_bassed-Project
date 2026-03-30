import AnalyzeInput from "../components/AnalyzeInput";
import AnalyzeResult from "../components/AnalyzeResult";
import AnalyzingLoader from "../components/AnalyzingLoader";
import ErrorAlert from "../components/ErrorAlert";
import { useEffect, useMemo, useState } from "react";

export default function Analyze({ token, loadUserHistory, result, loading, error, analysisTimeMs, analyze, reset }) {
  const [userInput, setUserInput] = useState(null);
  const analysisResult = useMemo(() => result || null, [result]);

  async function handleAnalyze(payload) {
    setUserInput(payload);
    const outcome = await analyze({ ...payload, token });
    if (outcome?.ok) {
      await loadUserHistory();
    }
  }

  function handleRestart() {
    setUserInput(null);
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
        <p className="mt-5 font-body text-lg text-text-primary max-w-3xl mx-auto leading-relaxed">
          No jargon. No confusion. Just structured, calm, and actionable legal guidance.
        </p>
      </section>

      {!analysisResult ? (
        <div className="space-y-5">
          <AnalyzeInput onAnalyze={handleAnalyze} loading={loading} />
          {loading && <AnalyzingLoader />}
          {error && <ErrorAlert message={error} onDismiss={reset} />}
        </div>
      ) : (
        <div>
          <AnalyzeResult
            result={analysisResult}
            analysisTimeMs={analysisTimeMs}
            onRestart={handleRestart}
            userInput={userInput}
          />
        </div>
      )}
    </div>
  );
}
