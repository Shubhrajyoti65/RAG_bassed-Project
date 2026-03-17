export default function LegalProvisions({ provisions }) {
  if (!provisions || provisions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 overflow-hidden">
      <div className="bg-emerald-50 dark:bg-emerald-950/40 px-6 py-3 border-b border-emerald-100 dark:border-emerald-900/40">
        <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Relevant Legal Provisions
        </h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-slate-800">
        {provisions.map((p, i) => (
          <div key={i} className="px-6 py-4">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-200 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-gray-800 dark:text-slate-100 text-sm">
                  {p.section}
                  <span className="ml-2 text-xs font-normal text-gray-500 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {p.act}
                  </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">{p.relevance}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
