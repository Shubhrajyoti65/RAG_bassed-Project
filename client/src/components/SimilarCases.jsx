export default function SimilarCases({ cases }) {
  if (!cases || cases.length === 0) return null;

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-brand-navy dark:text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Similar High Court Judgments
        </h3>
        <span className="text-xs font-semibold bg-brand-peach/30 text-brand-red px-3 py-1.5 rounded-full border border-brand-peach/50 shadow-sm">
          {cases.length} Matches
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cases.map((c, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-brand-peach/50 transition-all group flex flex-col h-full relative overflow-hidden focus-within:ring-2 focus-within:ring-brand-peach/50">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-navy via-brand-red to-brand-peach opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex items-start justify-between gap-3 mb-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-snug">
                {c.caseTitle}
              </h4>
              <div className="shrink-0 flex flex-col items-end">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2d6a4f] dark:text-[#52b788] bg-[#d8f3dc] dark:bg-[#1b4332] px-2.5 py-1 rounded-md border border-[#95d5b2] dark:border-[#2d6a4f]">
                  {c.similarityScore}% Match
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-slate-400 mt-1.5 bg-gray-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-gray-100 dark:border-slate-700 shadow-sm">{c.year}</span>
              </div>
            </div>
            
            <div className="mb-4">
               <span className="inline-flex items-center text-[10px] text-brand-navy font-semibold px-2 py-1 bg-brand-navy/5 dark:bg-brand-navy/30 dark:text-brand-peach rounded border border-brand-navy/10 dark:border-brand-navy/50 tracking-wider">
                CASE NO: {c.caseNumber}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-slate-300 flex-grow mb-6 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
              {c.keyParallels}
            </p>
            
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
              <div className="flex items-start gap-3 bg-brand-cream/50 dark:bg-brand-navy/10 rounded-lg p-3 border border-brand-peach/30 dark:border-brand-navy/30">
                <div className="p-1.5 bg-white dark:bg-brand-navy/20 rounded shadow-sm border border-brand-peach/20 dark:border-brand-navy/40">
                  <svg className="w-4 h-4 text-brand-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-brand-navy dark:text-slate-200 block mb-1 uppercase tracking-wider text-[10px]">Final Decision</span>
                  <span className="text-gray-800 dark:text-slate-300 font-medium leading-relaxed block">{c.decision}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
