import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

// Helper for formatting date-time values into localized strings
function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

// Page component that allows users to search and browse their entire analysis history
export default function HistoryPage({ history = [], onSelect }) {
  const [query, setQuery] = useState("");

  const filteredHistory = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return history;
    }

    return history.filter((item) => {
      return (
        String(item.inputPreview || "").toLowerCase().includes(term)
        || String(item.inputType || "").toLowerCase().includes(term)
      );
    });
  }, [history, query]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <section className="app-card p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="font-label text-xs font-bold tracking-[0.22em] uppercase text-primary">History</p>
            <h1 className="mt-2 font-headline text-3xl sm:text-4xl font-bold text-text-primary">All Extracted Cases</h1>
            <p className="font-body text-text-secondary mt-2">
              Browse your complete analysis history and reopen any previous case result.
            </p>
          </div>

          <div className="w-full lg:w-[320px]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full app-input ui-border-highlight px-4 py-3 text-sm"
              placeholder="Search by keyword or type..."
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <p className="font-label text-sm text-text-secondary">
          Showing {filteredHistory.length} of {history.length} records
        </p>
        <Link to="/dashboard" className="font-label text-sm font-semibold text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="app-card p-10 text-center">
          <h2 className="font-headline text-xl font-bold text-text-primary">No matching records found</h2>
          <p className="font-body text-text-secondary mt-2">Try another search keyword, or run a fresh analysis.</p>
          <Link to="/analyze" className="mt-5 inline-flex app-button-primary ui-button-enhance ui-button-shine px-6 py-3 font-label font-semibold">
            Analyze new case
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredHistory.map((item, index) => (
            <article
              key={item.id}
              className="app-card history-case-card ui-border-highlight animate-popIn p-5 min-h-56 flex flex-col group cursor-pointer relative overflow-hidden"
              style={{ animationDelay: `${index * 0.06}s` }}
              onClick={() => onSelect(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSelect(item);
                }
              }}
            >
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="px-2.5 py-1 bg-surface font-label text-xs font-bold uppercase tracking-wider rounded-full text-text-primary border border-border">
                  #{index + 1} {item.inputType}
                </span>
                <span className="font-label text-xs text-text-primary">{formatDate(item.createdAt)}</span>
              </div>

              <div className="grow mb-4 relative z-10">
                <p className="font-body text-text-primary text-sm leading-relaxed line-clamp-3">
                  {item.inputPreview || "No preview available for this document."}
                </p>
              </div>

              <div className="mt-auto pt-3 border-t border-border flex items-center justify-between relative z-10">
                <span className="font-label text-xs font-bold text-primary">Open result</span>
                <div className="ui-icon-enhance w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-primary transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
