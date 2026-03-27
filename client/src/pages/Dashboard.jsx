import { Link } from "react-router-dom";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

export default function Dashboard({ history = [], onSelect }) {
  const totalCases = history.length;
  const textCases = history.filter(h => h.inputType === "text").length;
  const pdfCases = history.filter(h => h.inputType === "pdf").length;

  const stats = [
    { label: "Total Cases", value: totalCases },
    { label: "Text Analyses", value: textCases },
    { label: "PDF Analyses", value: pdfCases },
    { label: "Saved Records", value: totalCases },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-label text-xs font-bold tracking-[0.22em] uppercase text-primary">Dashboard</p>
          <h2 className="mt-1 font-headline text-3xl font-bold text-text-primary tracking-tight">
            Active Docket Overview
          </h2>
          <p className="font-body text-text-secondary mt-2">
            Review and manage your past domestic violence case analyses.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={stat.label} className="app-card p-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${index === 0 ? "gradient-primary-bg text-white" : "bg-primary/10 text-primary"}`}>
              <span className="font-headline text-xl font-bold">{stat.value}</span>
            </div>
            <p className="font-label text-xs font-semibold text-text-secondary uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {history.length === 0 ? (
        <div className="app-card flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="gradient-primary-bg p-5 rounded-2xl shadow-lg mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-headline text-xl font-bold text-text-primary mb-2">No analysis history yet</h3>
          <p className="font-body text-text-secondary max-w-sm mx-auto mb-8">
            You haven&apos;t analyzed any cases yet. Head over to the Analyze page to analyze your first domestic violence document.
          </p>
          <Link to="/analyze" className="app-button-primary px-8 py-3.5 font-bold font-label shadow-md">
            Start First Analysis
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {history.map((item) => (
            <div key={item.id}
              className="app-card p-6 hover:shadow-lg border border-border transition-all duration-200 flex flex-col group cursor-pointer relative overflow-hidden hover:-translate-y-0.5"
              onClick={() => onSelect(item)} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelect(item); }}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full -mr-2 -mt-2 transition-transform duration-300 group-hover:scale-125" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="px-3 py-1.5 bg-surface font-label text-xs font-bold uppercase tracking-wider rounded-full text-text-secondary border border-border">
                  {item.inputType}
                </span>
                <span className="font-label text-xs text-text-secondary">{formatDate(item.createdAt)}</span>
              </div>
              
              <div className="grow mb-6 relative z-10">
                <p className="font-body text-text-secondary text-sm leading-relaxed line-clamp-3">
                  {item.inputPreview || "No preview available for this document."}
                </p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between relative z-10">
                <span className="font-label text-xs font-bold text-primary">Click to review</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-primary transition-all duration-200">
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


