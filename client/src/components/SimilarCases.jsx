// Component that displays a grid of legally similar case precedents
export default function SimilarCases({ cases }) {
  if (!cases || cases.length === 0) return null;

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between pb-3">
        <h3 className="font-headline text-lg font-bold text-text-primary flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Similar High Court Judgments
        </h3>
        <span className="font-label text-xs font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-400/30">
          {cases.length} Matches
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((c, i) => (
          <div key={i} className="bg-surface rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-200 group flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 gradient-primary-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex items-start justify-between gap-3 mb-4">
              <h4 className="font-headline text-sm font-bold text-text-primary leading-snug">{c.caseTitle}</h4>
              <div className="shrink-0 flex flex-col items-end">
                <span className="font-label text-[10px] font-extrabold uppercase tracking-widest text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/40 px-2.5 py-1 rounded-lg border border-green-200 dark:border-green-800">
                  {c.similarityScore}% Match
                </span>
                <span className="font-label text-xs text-text-secondary mt-1.5 bg-surface px-2 py-0.5 rounded">{c.year}</span>
              </div>
            </div>
            
            <span className="inline-flex items-center font-label text-[10px] font-semibold px-2 py-1 bg-primary/5 text-primary rounded border border-primary/20 tracking-wider mb-3 self-start">
              CASE NO: {c.caseNumber}
            </span>

            <p className="font-body text-sm text-text-secondary grow mb-6 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
              {c.keyParallels}
            </p>
            
            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex items-start gap-3 bg-surface rounded-lg p-3">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div className="text-xs">
                  <span className="font-label font-bold text-text-primary block mb-1 uppercase tracking-wider text-[10px]">Final Decision</span>
                  <span className="font-body text-text-secondary leading-relaxed block">{c.decision}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


