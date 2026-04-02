import CaseSummary from "./CaseSummary";
import LegalProvisions from "./LegalProvisions";
import SimilarCases from "./SimilarCases";

// Formats the total time taken for analysis into a readable string
function formatAnalysisTime(ms) {
  if (typeof ms !== "number" || Number.isNaN(ms) || ms < 0) return null;
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`;
}

// Container component that holds the full suite of analysis results sections
export default function ResultsPanel({ result, analysisTimeMs }) {
  const timeLabel = formatAnalysisTime(analysisTimeMs);

  return (
    <div className="space-y-6 bg-surface rounded-2xl shadow-sm border border-border p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-bg" />

      <div className="flex items-center gap-3 pt-2">
        <h2 className="font-headline text-2xl font-bold text-text-primary">Analysis Results</h2>
        {timeLabel && (
          <span className="ml-auto font-label text-xs font-bold text-primary bg-primary/10  px-3 py-1 rounded-full border border-primary/20">
            Completed in {timeLabel}
          </span>
        )}
      </div>

      <CaseSummary summary={result.summary} />
      <LegalProvisions provisions={result.legalProvisions} />
      <SimilarCases cases={result.similarCases} />

      {result.disclaimer && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4 mt-6 flex gap-3">
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-body text-sm text-amber-800 dark:text-amber-300 leading-relaxed italic">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}


