import InputPanel from "../components/InputPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import ResultsPanel from "../components/ResultsPanel";
import { useEffect, useState } from "react";

export default function Analyze({
  token,
  loadUserHistory,
  isDark,
  result,
  loading,
  error,
  analysisTimeMs,
  analyze,
  reset,
}) {
  const [toast, setToast] = useState(null);

  async function handleAnalyze(payload) {
    const outcome = await analyze({ ...payload, token });
    await loadUserHistory();

    if (outcome?.ok) {
      setToast({ message: "Analysis generated successfully!", type: "success" });
      return;
    }

    setToast({ message: "Analysis failed. See error for details.", type: "error" });
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
        <InputPanel
          onAnalyze={handleAnalyze}
          loading={loading}
        />
      </div>

      <div className="space-y-6">
        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} onDismiss={reset} isDark={isDark} />}
        {result && (
          <ResultsPanel
            result={result}
            isDark={isDark}
            analysisTimeMs={analysisTimeMs}
          />
        )}

        {!loading && !error && !result && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 p-8 text-center">
            <svg
              className="w-16 h-16 text-gray-300 dark:text-slate-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-500 dark:text-slate-300 mb-2">
              Ready to Analyze
            </h3>
            <p className="text-sm text-gray-400 dark:text-slate-400 max-w-sm mx-auto">
              Enter a domestic violence case description or upload a PDF document
              to get AI-powered analysis with similar High Court judgments.
            </p>
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-8 right-8 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 border transition-all animate-[bounce_1s_ease-in-out] ${
          toast.type === 'success' 
            ? 'bg-white dark:bg-slate-800 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-300'
            : 'bg-white dark:bg-slate-800 border-brand-red/30 dark:border-brand-red/50 text-brand-red dark:text-red-300'
        }`}>
          {toast.type === 'success' ? (
            <div className="bg-green-100 dark:bg-green-900/40 p-1.5 rounded-full">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
          ) : (
            <div className="bg-brand-red/10 dark:bg-brand-red/20 p-1.5 rounded-full">
             <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
          )}
          <span className="text-sm font-bold tracking-wide">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
