function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

export default function Dashboard({ history = [], onSelect }) {
  const totalCases = history.length;
  const textCases = history.filter(h => h.inputType === "text").length;
  const pdfCases = history.filter(h => h.inputType === "pdf").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl font-bold text-light-text dark:text-dark-text tracking-tight">
            Active Docket Overview
          </h2>
          <p className="font-body text-light-text-secondary dark:text-dark-text-secondary mt-2">
            Review and manage your past domestic violence case analyses.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Cases", value: totalCases, bg: "gradient-primary-bg", textColor: "text-white" },
          { label: "Text Analyses", value: textCases, bg: "bg-violet-100 dark:bg-violet-950/40", textColor: "text-violet-700 dark:text-violet-300" },
          { label: "PDF Analyses", value: pdfCases, bg: "bg-pink-100 dark:bg-pink-950/40", textColor: "text-pink-700 dark:text-pink-300" },
          { label: "Saved Records", value: totalCases, bg: "bg-light-card-alt dark:bg-dark-card-alt", textColor: "text-light-text dark:text-dark-text" },
        ].map((stat) => (
          <div key={stat.label} className="bg-light-card dark:bg-dark-card rounded-2xl p-5 border border-light-border dark:border-dark-border shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <span className={`font-headline text-xl font-bold ${stat.textColor}`}>{stat.value}</span>
            </div>
            <p className="font-label text-xs font-semibold text-light-text-muted dark:text-dark-text-muted uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border">
          <div className="gradient-primary-bg p-5 rounded-2xl shadow-lg mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-headline text-xl font-bold text-light-text dark:text-dark-text mb-2">No analysis history yet</h3>
          <p className="font-body text-light-text-secondary dark:text-dark-text-secondary max-w-sm mx-auto mb-8">
            You haven&apos;t analyzed any cases yet. Head over to the Analyze page to analyze your first domestic violence document.
          </p>
          <a href="/analyze" className="gradient-primary-bg text-white px-8 py-3.5 rounded-xl font-bold font-label shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
            Start First Analysis
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {history.map((item) => (
            <div key={item.id}
              className="bg-light-card dark:bg-dark-card rounded-2xl p-6 shadow-sm hover:shadow-lg border border-light-border dark:border-dark-border transition-all duration-200 flex flex-col group cursor-pointer relative overflow-hidden hover:-translate-y-0.5"
              onClick={() => onSelect(item)} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelect(item); }}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 dark:bg-primary-dark/10 rounded-bl-full -mr-2 -mt-2 transition-transform duration-300 group-hover:scale-125" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="px-3 py-1.5 bg-light-muted dark:bg-dark-surface font-label text-xs font-bold uppercase tracking-wider rounded-full text-light-text-secondary dark:text-dark-text-secondary border border-light-border dark:border-dark-border">
                  {item.inputType}
                </span>
                <span className="font-label text-xs text-light-text-muted dark:text-dark-text-muted">{formatDate(item.createdAt)}</span>
              </div>
              
              <div className="flex-grow mb-6 relative z-10">
                <p className="font-body text-light-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed line-clamp-3">
                  {item.inputPreview || "No preview available for this document."}
                </p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-light-border dark:border-dark-border flex items-center justify-between relative z-10">
                <span className="font-label text-xs font-bold text-primary dark:text-primary-dark">Click to review</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary-dark/15 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-primary dark:text-primary-dark transition-all duration-200">
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
