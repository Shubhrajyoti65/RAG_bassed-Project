import { useState } from "react";

// Cleans up whitespace and normalizes text for display
function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

// Generates a shortened version of a long description for better UI fitting
function getConciseDescription(text, maxLength = 180) {
  const normalized = normalizeText(text);
  if (normalized.length <= maxLength) return normalized;
  const sentenceEnd = normalized.lastIndexOf(". ", maxLength);
  if (sentenceEnd >= 100) return `${normalized.slice(0, sentenceEnd + 1)}...`;
  return `${normalized.slice(0, maxLength).trim()}...`;
}

// Component to display a list of applicable legal sections with expandable details
export default function LegalProvisions({ provisions }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!provisions || provisions.length === 0) return null;

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="bg-primary/5  px-6 py-3 border-b border-border">
        <h3 className="font-headline text-base font-semibold text-text-primary flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Relevant Legal Provisions
        </h3>
      </div>
      <div className="divide-y divide-border">
        {provisions.map((p, i) => (
          <button type="button" key={i}
            className="w-full text-left px-6 py-4 hover:bg-primary/5  transition-colors duration-200"
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            aria-expanded={expandedIndex === i}>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full gradient-primary-bg text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div className="w-full">
                <p className="font-headline font-semibold text-text-primary text-sm">
                  {p.section}
                  <span className="ml-2 font-label text-xs font-normal text-text-secondary bg-surface px-2 py-0.5 rounded-full">{p.act}</span>
                </p>
                <p className="font-body text-sm text-text-secondary mt-1">
                  {expandedIndex === i ? normalizeText(p.relevance) : getConciseDescription(p.relevance)}
                </p>
                <p className="font-label text-xs font-medium text-primary mt-2">
                  {expandedIndex === i ? "Click to collapse" : "Click to expand"}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


