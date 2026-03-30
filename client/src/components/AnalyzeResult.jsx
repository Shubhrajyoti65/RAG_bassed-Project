import { useEffect, useRef } from "react";

function formatDuration(ms) {
  if (typeof ms !== "number" || Number.isNaN(ms)) return "";
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`;
}

/** Compact vertical similarity score widget — sits top-right of each case card */
function SimilarityBar({ score }) {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.width = "0%";
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.width = `${score}%`;
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const colorClass =
    score >= 75
      ? { bar: "from-green-400 to-emerald-500", text: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/25" }
      : score >= 50
      ? { bar: "from-amber-400 to-orange-400", text: "text-amber-500", bg: "bg-amber-400/10", border: "border-amber-400/25" }
      : { bar: "from-slate-400 to-slate-500", text: "text-text-secondary", bg: "bg-border", border: "border-border" };

  const label = score >= 75 ? "High Match" : score >= 50 ? "Moderate" : "Low Match";

  return (
    <div className={`rounded-xl border ${colorClass.border} ${colorClass.bg} p-2 text-center min-w-[5rem]`}>
      <span className={`font-headline text-lg font-bold leading-none ${colorClass.text}`}>
        {score}%
      </span>
      <p className={`font-label text-[10px] font-semibold mt-0.5 ${colorClass.text} opacity-80`}>{label}</p>
      {/* animated bar */}
      <div className="mt-1.5 w-full h-1 rounded-full bg-black/10 overflow-hidden">
        <div
          ref={barRef}
          className={`h-full rounded-full bg-gradient-to-r ${colorClass.bar} transition-all duration-1000 ease-out`}
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
}

export default function AnalyzeResult({ result, analysisTimeMs, userInput, onRestart }) {
  const provisions = Array.isArray(result?.legalProvisions) ? result.legalProvisions : [];
  const cases = Array.isArray(result?.similarCases) ? result.similarCases.slice(0, 5) : [];
  const summary = String(result?.summary || "").trim();
  const duration = formatDuration(analysisTimeMs);

  const isFileInput = userInput?.file instanceof File;
  const inputLabel = isFileInput
    ? userInput.file.name
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
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-label text-[11px] uppercase tracking-widest font-bold text-white/70 mb-1">
                {isFileInput ? "Uploaded Document" : "Your Submission"}
              </p>
              <p className="font-body text-sm text-white leading-relaxed line-clamp-5">
                {inputLabel}
              </p>
            </div>
          </div>
        </section>
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
            <div className="w-1 h-5 rounded-full bg-violet-500" />
            <p className="font-label text-xs uppercase tracking-[0.18em] font-bold text-violet-500">
              Similar Cases
            </p>
            <span className="ml-auto font-label text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
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
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-500 font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label text-base font-semibold text-text-primary">{c.caseTitle}</p>
                    <p className="font-label text-sm text-text-secondary mt-0.5">
                      {c.year}{c.caseNumber ? ` · ${c.caseNumber}` : ""}
                    </p>
                  </div>
                  {/* Similarity score — top right */}
                  {typeof c.similarityScore === "number" && (
                    <div className="shrink-0 w-28">
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Disclaimer ── */}
      {result?.disclaimer && (
        <p className="font-label text-xs leading-relaxed text-text-secondary px-1 pb-2">
          {result.disclaimer}
        </p>
      )}
    </div>
  );
}
