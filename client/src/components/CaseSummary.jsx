export default function CaseSummary({ summary }) {
  return (
    <div className="bg-light-card-alt dark:bg-dark-card-alt rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
      <div className="bg-violet-50 dark:bg-violet-950/20 px-6 py-3 border-b border-light-border dark:border-dark-border">
        <h3 className="font-headline text-base font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
          <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Case Summary
        </h3>
      </div>
      <div className="px-6 py-4">
        <p className="font-body text-light-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
