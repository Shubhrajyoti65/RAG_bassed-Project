import CaseSummary from "./CaseSummary";
import LegalProvisions from "./LegalProvisions";
import SimilarCases from "./SimilarCases";

function formatAnalysisTime(ms) {
  if (typeof ms !== "number" || Number.isNaN(ms) || ms < 0) {
    return null;
  }

  if (ms < 1000) {
    return `${ms} ms`;
  }

  return `${(ms / 1000).toFixed(2)} s`;
}

export default function ResultsPanel({ result, isDark, analysisTimeMs }) {
  const timeLabel = formatAnalysisTime(analysisTimeMs);

  return (
    <div className="space-y-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 relative overflow-hidden">
      
      {/* Decorative top header bg line */}
      <div className="absolute top-0 left-0 right-0 h-2 flex">
        <div className="w-1/3 h-full bg-brand-navy" />
        <div className="w-1/3 h-full bg-brand-red" />
        <div className="w-1/3 h-full bg-brand-peach" />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <h2 className="text-2xl font-black text-brand-navy dark:text-slate-100 tracking-tight">
          Analysis Results
        </h2>
        
        {timeLabel && (
          <span className="ml-auto text-xs font-bold text-brand-navy dark:text-brand-peach bg-brand-peach/20 dark:bg-brand-navy/40 border border-brand-peach dark:border-brand-peach/40 px-3 py-1 rounded-full shadow-sm">
            Completed in {timeLabel}
          </span>
        )}
      </div>

      <CaseSummary summary={result.summary} isDark={isDark} />
      <LegalProvisions provisions={result.legalProvisions} isDark={isDark} />
      <SimilarCases cases={result.similarCases} isDark={isDark} />

      {result.disclaimer && (
        <div className="bg-brand-red/5 dark:bg-brand-red/10 border border-brand-red/20 dark:border-brand-red/30 rounded-xl px-5 py-4 mt-8 flex gap-3 shadow-inner">
           <svg className="w-5 h-5 text-brand-red shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
          <p className="text-sm font-medium text-brand-red/80 dark:text-red-300/80 leading-relaxed italic">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
