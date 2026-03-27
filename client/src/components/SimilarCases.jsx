export default function SimilarCases({ cases }) {
  if (!cases || cases.length === 0) return null;

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between pb-3">
        <h3 className="font-headline text-lg font-bold text-light-text dark:text-dark-text flex items-center gap-2">
          <svg className="w-5 h-5 text-primary dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Similar High Court Judgments
        </h3>
        <span className="font-label text-xs font-bold bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 px-3 py-1.5 rounded-full border border-pink-200 dark:border-pink-800">
          {cases.length} Matches
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((c, i) => (
          <div key={i} className="bg-light-card-alt dark:bg-dark-card-alt rounded-xl p-6 border border-light-border dark:border-dark-border hover:shadow-lg transition-all duration-200 group flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 gradient-primary-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex items-start justify-between gap-3 mb-4">
              <h4 className="font-headline text-sm font-bold text-light-text dark:text-dark-text leading-snug">{c.caseTitle}</h4>
              <div className="shrink-0 flex flex-col items-end">
                <span className="font-label text-[10px] font-extrabold uppercase tracking-widest text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/40 px-2.5 py-1 rounded-lg border border-green-200 dark:border-green-800">
                  {c.similarityScore}% Match
                </span>
                <span className="font-label text-xs text-light-text-muted dark:text-dark-text-muted mt-1.5 bg-light-muted dark:bg-dark-surface px-2 py-0.5 rounded">{c.year}</span>
              </div>
            </div>
            
            <span className="inline-flex items-center font-label text-[10px] font-semibold px-2 py-1 bg-primary/5 dark:bg-primary-dark/10 text-primary dark:text-primary-dark rounded border border-primary/15 dark:border-primary-dark/20 tracking-wider mb-3 self-start">
              CASE NO: {c.caseNumber}
            </span>

            <p className="font-body text-sm text-light-text-secondary dark:text-dark-text-secondary flex-grow mb-6 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
              {c.keyParallels}
            </p>
            
            <div className="mt-auto pt-4 border-t border-light-border dark:border-dark-border">
              <div className="flex items-start gap-3 bg-light-muted dark:bg-dark-surface rounded-lg p-3">
                <svg className="w-4 h-4 text-primary dark:text-primary-dark shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div className="text-xs">
                  <span className="font-label font-bold text-light-text dark:text-dark-text block mb-1 uppercase tracking-wider text-[10px]">Final Decision</span>
                  <span className="font-body text-light-text-secondary dark:text-dark-text-secondary leading-relaxed block">{c.decision}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
