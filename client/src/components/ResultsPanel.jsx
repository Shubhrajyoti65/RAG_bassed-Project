import CaseSummary from "./CaseSummary";
import LegalProvisions from "./LegalProvisions";
import SimilarCases from "./SimilarCases";

export default function ResultsPanel({ result, isDark }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-linear-to-r from-indigo-200 to-transparent" />
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 px-3">
          Analysis Results
        </span>
        <div className="h-px flex-1 bg-linear-to-l from-indigo-200 to-transparent" />
      </div>

      <CaseSummary summary={result.summary} isDark={isDark} />
      <LegalProvisions provisions={result.legalProvisions} isDark={isDark} />
      <SimilarCases cases={result.similarCases} isDark={isDark} />

      {result.disclaimer && (
        <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-500 dark:text-slate-400 italic">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
