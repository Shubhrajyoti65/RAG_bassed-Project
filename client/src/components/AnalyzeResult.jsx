import { useState } from "react";

// Helper function to format duration in milliseconds to a human-readable string
function formatDuration(ms) {
  if (typeof ms !== "number" || Number.isNaN(ms)) return "";
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`;
}

function formatCaseTitle(title) {
  return String(title || "").replace(/_+/g, " ").trim();
}

/** Compact vertical similarity score widget — sits top-right of each case card */
// Sub-component to display a visual similarity score for case matches
function SimilarityBar({ score }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));

  const tone =
    safeScore >= 75
      ? {
          text: "text-green-700 dark:text-green-400",
          label: "High Match",
          fill: "bg-green-600 dark:bg-green-500",
        }
      : safeScore >= 50
      ? {
          text: "text-amber-700 dark:text-amber-300",
          label: "Moderate Match",
          fill: "bg-amber-500 dark:bg-amber-400",
        }
      : {
          text: "text-rose-700 dark:text-rose-300",
          label: "Low Match",
          fill: "bg-rose-500 dark:bg-rose-400",
        };

  return (
    <div className="w-full min-w-36 max-w-44">
      <div className="mb-1 flex items-center gap-2 leading-none">
        <span className={`font-headline text-[1.25rem] font-bold ${tone.text}`}>{safeScore}%</span>
        <span className={`font-label text-sm font-semibold ${tone.text}`}>{tone.label}</span>
      </div>

      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700/70 overflow-hidden">
        <div
          className={`h-full rounded-full ${tone.fill} transition-all duration-500`}
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  );
}

// Main component to display the comprehensive analysis results of a legal case
export default function AnalyzeResult({ result, analysisTimeMs, userInput, onRestart }) {
  const hasTranslation = Boolean(result?.translated);
  const [activeTab, setActiveTab] = useState(hasTranslation ? "translated" : "english");
  const displayResult = hasTranslation && activeTab === "translated" ? result.translated : (result?.english || result);

  const provisions = Array.isArray(displayResult?.legalProvisions) ? displayResult.legalProvisions : [];
  const cases = Array.isArray(displayResult?.similarCases) ? displayResult.similarCases.slice(0, 5) : [];
  const summary = String(displayResult?.summary || "").trim();
  const duration = formatDuration(analysisTimeMs);

  const isFileInput = userInput?.file instanceof File;
  const isVoiceInput = userInput?.voiceFile instanceof Blob;

  const inputLabel = isFileInput
    ? userInput.file.name
    : isVoiceInput
    ? result?.transcription || "Voice input processed"
    : userInput?.text
    ? userInput.text.replace(/^\[Category:[^\]]*\]\n?/, "").trim()
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-popIn">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-label text-xs uppercase tracking-[0.2em] font-bold text-primary">Analysis Complete</p>
          <h2 className="font-headline text-2xl font-semibold text-text-primary mt-1">Your Legal Breakdown</h2>
        </div>
        <div className="flex items-center gap-3">
          {duration && (
            <span className="font-label text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/25">
              {duration}
            </span>
          )}
          <button
            type="button"
            onClick={onRestart}
            className="font-label text-sm font-semibold text-primary hover:opacity-70 transition-opacity"
          >
            ← New Analysis
          </button>
        </div>
      </div>

      {/* ── 1. User Submission — gradient banner ── */}
      {inputLabel && (
        <section className="relative overflow-hidden rounded-2xl gradient-primary-bg p-5 shadow-lg">
          {/* decorative blur blobs */}
          <div className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-8 w-24 h-24 rounded-full bg-white/5 blur-xl" />

          <div className="relative flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mt-0.5">
              {isFileInput ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ) : isVoiceInput ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-label text-[11px] uppercase tracking-widest font-bold text-white/70 mb-1">
                {isFileInput ? "Uploaded Document" : isVoiceInput ? "Voice Query" : "Your Submission"}
              </p>
              <p className="font-body text-sm text-white leading-relaxed line-clamp-5">
                {inputLabel}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Language Tabs ── */}
      {hasTranslation && (
        <div className="flex items-center gap-2 mt-4 px-2 border-b border-border">
          <button
            onClick={() => setActiveTab("translated")}
            className={`px-4 py-2 font-label text-sm font-semibold transition-colors duration-200 border-b-2 ${
              activeTab === "translated"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            Translated Analysis
          </button>
          <button
            onClick={() => setActiveTab("english")}
            className={`px-4 py-2 font-label text-sm font-semibold transition-colors duration-200 border-b-2 ${
              activeTab === "english"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            English Original
          </button>
        </div>
      )}

      {/* ── 2. Case Summary ── */}
      {summary && (
        <section className="app-card ui-border-highlight p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full bg-primary" />
            <p className="font-label text-xs uppercase tracking-[0.18em] font-bold text-primary">
              Case Summary
            </p>
          </div>
          <p className="font-body text-base text-text-primary leading-relaxed">{summary}</p>
        </section>
      )}

      {/* ── 3. Legal Provisions ── */}
      {provisions.length > 0 && (
        <section className="app-card ui-border-highlight p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-cyan-400" />
            <p className="font-label text-xs uppercase tracking-[0.18em] font-bold text-cyan-500 dark:text-cyan-400">
              Applicable Legal Provisions
            </p>
            <span className="ml-auto font-label text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {provisions.length} found
            </span>
          </div>
          <div className="space-y-4">
            {provisions.map((prov, i) => (
              <div
                key={i}
                className="flex gap-4 animate-popIn"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="shrink-0 w-7 h-7 rounded-full gradient-primary-bg flex items-center justify-center mt-0.5 shadow-md">
                  <span className="text-white font-bold text-xs">{i + 1}</span>
                </div>
                <div className="min-w-0 flex-1 border-l-2 border-primary/20 pl-3">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-label text-sm font-bold text-primary">{prov.section}</span>
                    {prov.act && (
                      <span className="font-label text-xs text-text-secondary bg-surface border border-border px-2 py-0.5 rounded-full">
                        {prov.act}
                      </span>
                    )}
                  </div>
                  {prov.relevance && (
                    <p className="font-body text-base text-text-primary leading-relaxed">{prov.relevance}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 4. Similar Cases (top 5) ── */}
      {cases.length > 0 && (
        <section className="app-card ui-border-highlight p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-sky-500 dark:bg-cyan-400" />
            <p className="font-label text-xs uppercase tracking-[0.18em] font-bold text-sky-600 dark:text-cyan-300">
              Similar Cases
            </p>
            <span className="ml-auto font-label text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-300 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/25">
              Top {cases.length}
            </span>
          </div>
          <div className="space-y-4">
            {cases.map((c, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-surface/60 p-4 animate-popIn"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Case title row — score bar sits to the right */}
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-sky-100 text-sky-700 dark:bg-cyan-500/15 dark:text-cyan-300 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label text-lg font-semibold text-text-primary leading-snug line-clamp-2">{formatCaseTitle(c.caseTitle)}</p>
                    <p className="font-label text-sm text-text-secondary mt-0.5">
                      {c.year}{c.caseNumber ? ` · ${c.caseNumber}` : ""}
                    </p>
                  </div>
                  {/* Similarity score — top right */}
                  {typeof c.similarityScore === "number" && (
                    <div className="shrink-0 w-full max-w-52 ml-2">
                      <SimilarityBar score={c.similarityScore} />
                    </div>
                  )}
                </div>


                {/* Parallels + Decision */}
                {c.keyParallels && (
                  <p className="font-body text-base text-text-primary leading-relaxed mt-3 pt-3 border-t border-border/60">
                    {c.keyParallels}
                  </p>
                )}
                {c.decision && (
                  <div className="mt-2 flex items-start gap-2">
                    <span className="shrink-0 font-label text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                      Decision
                    </span>
                    <p className="font-body text-sm text-text-secondary leading-relaxed">{c.decision}</p>
                  </div>
                )}

                {/* Case Action Buttons */}
                <div className="mt-3 pt-3 border-t border-border/60 flex flex-wrap justify-end gap-2">
                  {c.pdfUrl ? (
                    <a
                      href={c.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-label text-xs font-bold text-blue-800 bg-blue-200 hover:bg-blue-500 hover:text-white border border-blue-300 hover:border-blue-600 px-3 py-1.5 rounded-lg transition-all duration-200"
                    >
                      View Original Judgment
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="inline-flex items-center font-label text-xs font-semibold text-blue-500 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                      Original judgment unavailable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Disclaimer ── */}
      {displayResult?.disclaimer && (
        <p className="font-label text-xs leading-relaxed text-text-secondary px-1 pb-2">
          {displayResult.disclaimer}
        </p>
      )}
    </div>
  );
}
