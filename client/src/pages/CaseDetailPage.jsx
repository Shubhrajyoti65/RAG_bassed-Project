import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function loadSummaryCase(index) {
  try {
    const raw = sessionStorage.getItem("nyaya_similar_cases");
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return arr?.[Number(index)] ?? null;
  } catch {
    return null;
  }
}

function ScoreBar({ score }) {
  const safe = Math.max(0, Math.min(100, Number(score) || 0));
  const color =
    safe >= 75
      ? { bar: "#16a34a", label: "High Match", text: "#15803d" }
      : safe >= 50
      ? { bar: "#d97706", label: "Moderate Match", text: "#b45309" }
      : { bar: "#dc2626", label: "Low Match", text: "#b91c1c" };

  return (
    <div className="cdp-score-wrap">
      <div className="cdp-score-top">
        <span className="cdp-score-num" style={{ color: color.text }}>{safe}%</span>
        <span className="cdp-score-label" style={{ color: color.text }}>{color.label}</span>
      </div>
      <div className="cdp-score-track">
        <div className="cdp-score-fill" style={{ width: `${safe}%`, background: color.bar }} />
      </div>
    </div>
  );
}

export default function CaseDetailPage() {
  const { index } = useParams();
  const navigate = useNavigate();

  const [summaryCase, setSummaryCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const sc = loadSummaryCase(index);
    if (!sc) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setSummaryCase(sc);
    setLoading(false);
  }, [index]);

  if (loading) {
    return (
      <div className="cdp-loading">
        <span className="cdp-loading-dot" />
        <span className="cdp-loading-dot" style={{ animationDelay: "0.15s" }} />
        <span className="cdp-loading-dot" style={{ animationDelay: "0.3s" }} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="cdp-not-found">
        <div className="cdp-not-found-inner">
          <div className="cdp-nf-icon">⚖️</div>
          <h1 className="cdp-nf-title">Case not found</h1>
          <p className="cdp-nf-sub">
            Session data is no longer available. Please run a new analysis to view similar cases.
          </p>
          <Link to="/analyze" className="app-button-primary cdp-nf-btn">← Back to Analyze</Link>
        </div>
      </div>
    );
  }

  const c = summaryCase;
  const displayTitle = (c?.caseTitle || "Case Detail").replace(/_/g, " ");

  return (
    <div className="cdp-root animate-fade-in">
      {/* Breadcrumb */}
      <nav className="cdp-breadcrumb">
        <button className="cdp-back-btn" onClick={() => navigate(-1)}>← Back to Analysis</button>
        <span className="cdp-sep">/</span>
        <span className="cdp-crumb-label">Full Judgment</span>
      </nav>

      {/* Header */}
      <header className="app-card cdp-header">
        <div className="cdp-header-meta">
          {c?.year && <span className="cdp-year-badge">{c.year}</span>}
          {c?.pdfUrl ? (
            <span className="cdp-full-badge">PDF Available</span>
          ) : (
            <span className="cdp-full-badge cdp-full-badge--warn">PDF Unavailable</span>
          )}
          {typeof c?.similarityScore === "number" && <ScoreBar score={c.similarityScore} />}
        </div>
        <h1 className="cdp-case-title">{displayTitle}</h1>
        {c?.caseNumber && <p className="cdp-case-number">Case No: {c.caseNumber}</p>}
      </header>

      <section className="app-card cdp-section">
        <div className="cdp-section-header">
          <span className="cdp-section-icon">📄</span>
          <h2 className="cdp-section-title">Original Judgment</h2>
        </div>
        {c?.pdfUrl ? (
          <a
            href={c.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="app-button-primary cdp-bottom-btn"
          >
            Open Original Judgment
          </a>
        ) : (
          <p className="cdp-body-text">
            This case does not currently have a linked original PDF.
          </p>
        )}
      </section>

      {/* AI parallels & decision — quick context before the PDF */}
      {(c?.keyParallels || c?.decision) && (
        <section className="app-card cdp-section">
          <div className="cdp-section-header">
            <span className="cdp-section-icon">🔗</span>
            <h2 className="cdp-section-title">Why this case was matched</h2>
          </div>
          {c.keyParallels && <p className="cdp-body-text">{c.keyParallels}</p>}
          {c.decision && (
            <div className="cdp-decision-inline">
              <span className="cdp-decision-label">Decision:</span>
              <span className="cdp-body-text">{c.decision}</span>
            </div>
          )}
        </section>
      )}

      {/* Disclaimer */}
      <div className="cdp-notice">
        <span>⚠️</span>
        <p>
          This judgment is reproduced for informational and educational purposes only.
          It does not constitute legal advice. Always consult a qualified advocate for guidance specific to your situation.
        </p>
      </div>

      {/* Bottom nav */}
      <div className="cdp-bottom-nav">
        <button className="app-button-secondary cdp-bottom-btn" onClick={() => navigate(-1)}>
          ← Back to Results
        </button>
        <Link to="/analyze" className="app-button-primary cdp-bottom-btn">New Analysis</Link>
      </div>
    </div>
  );
}
