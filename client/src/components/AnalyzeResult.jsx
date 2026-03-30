function formatDuration(ms) {
  if (typeof ms !== "number" || Number.isNaN(ms)) return "";
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`;
}

function buildSteps(result) {
  const provisions = Array.isArray(result?.legalProvisions) ? result.legalProvisions : [];
  const cases = Array.isArray(result?.similarCases) ? result.similarCases : [];
  const summary = String(result?.summary || "").trim();

  const steps = [];

  if (provisions[0]) {
    steps.push(
      `Map your facts against ${provisions[0].section} (${provisions[0].act}) and mark supporting events or documents.`
    );
  }

  if (cases[0]) {
    steps.push(
      `Compare your timeline with ${cases[0].caseTitle} to identify where your facts align or differ materially.`
    );
  }

  if (summary) {
    steps.push("Prepare a concise chronology in 8-10 bullet points based on this breakdown before consulting counsel.");
  }

  while (steps.length < 3) {
    steps.push("Collect and organize related records (messages, reports, documents, witnesses) in date order.");
  }

  return steps.slice(0, 3);
}

export default function AnalyzeResult({ result, analysisTimeMs, onRestart }) {
  const provisions = Array.isArray(result?.legalProvisions) ? result.legalProvisions : [];
  const cases = Array.isArray(result?.similarCases) ? result.similarCases : [];

  const coreProtection = provisions[0];
  const criticalCase = cases[0];
  const steps = buildSteps(result);
  const duration = formatDuration(analysisTimeMs);

  return (
    <div className="app-card ui-border-highlight animate-popIn p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-label text-xs uppercase tracking-[0.22em] font-bold text-primary">Situation Breakdown</p>
          <h2 className="font-headline text-[2rem] leading-tight font-semibold text-text-primary mt-2">Our Findings</h2>
        </div>

        <div className="flex items-center gap-3">
          {duration && (
            <span className="font-label text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/30">
              Completed in {duration}
            </span>
          )}
          <button
            type="button"
            onClick={onRestart}
            className="font-label text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
          >
            Restart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <article className="rounded-2xl p-6 gradient-primary-bg text-white shadow-xl">
          <p className="font-label text-sm font-semibold opacity-90">The Core Protection</p>
          <h3 className="font-headline text-xl font-semibold mt-2">
            {coreProtection ? coreProtection.section : "The Core Protection"}
          </h3>
          <p className="font-body text-sm mt-3 text-white/90 leading-relaxed">
            {coreProtection?.relevance || result?.summary || "Primary legal protection has been identified based on your submitted details."}
          </p>
        </article>

        <article className="rounded-2xl p-6 transition-all duration-300 ui-panel-box ui-border-highlight">
          <p className="font-label text-sm font-semibold text-primary">Critical Window</p>
          <h3 className="font-headline text-xl font-semibold text-text-primary mt-2">What Needs Timely Action</h3>
          <p className="font-body text-sm text-text-primary mt-3 leading-relaxed">
            {criticalCase
              ? `Closest precedent: ${criticalCase.caseTitle} (${criticalCase.year}) with ${criticalCase.similarityScore}% similarity. Prioritize chronology, supporting records, and immediate protective steps.`
              : "Act early to preserve records, sequence events, and prepare issue-wise documentation for formal legal consultation."}
          </p>
        </article>
      </div>

      <section className="mt-7 rounded-2xl p-6 transition-all duration-300 ui-panel-box ui-border-highlight">
        <h3 className="font-headline text-lg font-semibold text-text-primary mb-4">Recommended Next Steps</h3>
        <div className="space-y-3.5">
          {steps.map((step, index) => (
            <div
              key={`${step}-${index}`}
              className="flex items-start gap-3 animate-popIn"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <span className="ui-icon-enhance w-7 h-7 shrink-0 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {index + 1}
              </span>
              <p className="font-body text-text-primary leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {result?.disclaimer && (
        <p className="mt-6 text-xs leading-relaxed text-text-primary">
          {result.disclaimer}
        </p>
      )}
    </div>
  );
}


