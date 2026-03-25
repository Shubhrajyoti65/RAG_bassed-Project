function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

export default function Dashboard({ history = [], onSelect }) {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-800 gap-4">
        <div>
          <h2 className="text-3xl font-black text-brand-navy dark:text-slate-100 tracking-tight">
            Analysis Dashboard
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Review and manage your past domestic violence case analyses.
          </p>
        </div>
        <div>
          <span className="inline-block bg-brand-peach/20 text-brand-red px-4 py-2 rounded-xl font-bold border border-brand-peach/40 shadow-sm">
            {history.length} Saved Records
          </span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-3xl bg-gray-50/50 dark:bg-slate-900/30">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
            <svg
              className="w-12 h-12 text-brand-red dark:text-brand-peach"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            No analysis history yet
          </h3>
          <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
            You haven't analyzed any cases yet. Head over to the Analyze page to analyze your first domestic violence document.
          </p>
          <a
            href="/analyze"
            className="bg-brand-navy hover:bg-[#0c1433] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md"
          >
            Start First Analysis
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-slate-800 transition-all flex flex-col group cursor-pointer relative overflow-hidden focus-within:ring-2 focus-within:ring-brand-peach"
              onClick={() => onSelect(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelect(item); }}
            >
              {/* Accents */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-peach/10 dark:bg-brand-navy/30 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-200 dark:border-slate-700">
                  {item.inputType}
                </span>
                <span className="text-xs font-medium text-gray-400 dark:text-slate-500">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              
              <div className="flex-grow mb-6 relative z-10">
                <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 font-medium">
                  {item.inputPreview || "No preview available for this document."}
                </p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                <span className="text-xs font-bold text-brand-navy dark:text-brand-peach transition-colors group-hover:text-brand-red">
                  Click to review
                </span>
                <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white text-brand-red transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
