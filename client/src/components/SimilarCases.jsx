export default function SimilarCases({ cases }) {
  if (!cases || cases.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 overflow-hidden">
      <div className="bg-purple-50 dark:bg-purple-950/40 px-6 py-3 border-b border-purple-100 dark:border-purple-900/40">
        <h3 className="text-base font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Similar Allahabad High Court Cases
        </h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-slate-800">
        {cases.map((c, i) => (
          <div key={i} className="px-6 py-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                {c.caseTitle}
              </h4>
              <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200">
                {c.similarityScore}% match
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-gray-500 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {c.year}
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-400">{c.caseNumber}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">{c.keyParallels}</p>
            <div className="flex items-start gap-2 bg-gray-50 dark:bg-slate-800 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-gray-400 dark:text-slate-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <p className="text-xs text-gray-600 dark:text-slate-300">
                <strong>Decision:</strong> {c.decision}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
