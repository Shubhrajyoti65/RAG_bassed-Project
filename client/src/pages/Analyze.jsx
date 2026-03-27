import InputPanel from "../components/InputPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import ResultsPanel from "../components/ResultsPanel";
import { useEffect, useState } from "react";

export default function Analyze({ token, loadUserHistory, isDark, result, loading, error, analysisTimeMs, analyze, reset }) {
  const [toast, setToast] = useState(null);

  async function handleAnalyze(payload) {
    const outcome = await analyze({ ...payload, token });
    await loadUserHistory();
    if (outcome?.ok) {
      setToast({ message: "Analysis generated successfully!", type: "success" });
    } else {
      setToast({ message: "Analysis failed. See error for details.", type: "error" });
    }
  }

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
        <InputPanel onAnalyze={handleAnalyze} loading={loading} />
      </div>

      <div className="space-y-6">
        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} onDismiss={reset} />}
        {result && <ResultsPanel result={result} isDark={isDark} analysisTimeMs={analysisTimeMs} />}

        {!loading && !error && !result && (
          <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-sm border border-light-border dark:border-dark-border p-8 text-center">
            <div className="gradient-primary-bg w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="font-headline text-lg font-bold text-light-text dark:text-dark-text mb-2">Ready to Analyze</h3>
            <p className="font-body text-sm text-light-text-secondary dark:text-dark-text-secondary max-w-sm mx-auto">
              Enter a domestic violence case description or upload a PDF document to get AI-powered analysis with similar High Court judgments.
            </p>
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-8 right-8 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border animate-fade-in ${
          toast.type === 'success' ? 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800'
        }`}>
          {toast.type === 'success' ? (
            <div className="gradient-primary-bg p-1.5 rounded-full"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
          ) : (
            <div className="bg-red-500 p-1.5 rounded-full"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></div>
          )}
          <span className="font-label text-sm font-bold text-light-text dark:text-dark-text">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-3 p-1 rounded-full text-light-text-muted hover:text-light-text transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
