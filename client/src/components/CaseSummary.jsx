export default function CaseSummary({ summary }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 overflow-hidden">
      <div className="bg-indigo-50 dark:bg-indigo-950/40 px-6 py-3 border-b border-indigo-100 dark:border-indigo-900/50">
        <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Case Summary
        </h3>
      </div>
      <div className="px-6 py-4">
        <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
