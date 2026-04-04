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

async function fetchFullCase(title, caseNumber) {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (caseNumber) params.set("caseNumber", caseNumber);
  const res = await fetch(`/api/cases/lookup?${params.toString()}`);
  if (!res.ok) throw new Error("Server error");
  return res.json();
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
  const [pdfUrl, setPdfUrl] = useState(null);
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
    
    // 1. Immediately use the Cloudinary URL if it was already enriched during analysis
    if (sc.pdfUrl) {
      setPdfUrl(sc.pdfUrl);
    }

    // 2. Fetch full JSON content (facts/decision) and potentially the pdfUrl if missing
    fetchFullCase(sc.caseTitle, sc.caseNumber)
      .then((data) => {
        if (data.pdfUrl && !sc.pdfUrl) {
          setPdfUrl(data.pdfUrl);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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
          {pdfUrl
            ? <span className="cdp-full-badge">📄 Original PDF</span>
            : <span className="cdp-full-badge cdp-full-badge--warn">⚠ PDF not found</span>}
          {typeof c?.similarityScore === "number" && <ScoreBar score={c.similarityScore} />}
        </div>
        <h1 className="cdp-case-title">{displayTitle}</h1>
        {c?.caseNumber && <p className="cdp-case-number">Case No: {c.caseNumber}</p>}
      </header>

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

      {/* PDF viewer */}
      {pdfUrl ? (
        <section className="cdp-pdf-section">
          <div className="cdp-pdf-toolbar">
            <span className="cdp-pdf-label">📄 Original Judgment — High Court</span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cdp-pdf-open-btn"
            >
              Open in new tab ↗
            </a>
          </div>
          <iframe
            src={pdfUrl}
            className="cdp-pdf-frame"
            title={displayTitle}
            allow="fullscreen"
          />
        </section>
      ) : (
        <div className="cdp-not-indexed-notice">
          <span>ℹ️</span>
          <p>
            The original PDF for this judgment is not yet available in our cloud library.
            The AI-generated summary above provides the key points extracted during indexing.
            We are continuously uploading full judgments to Cloudinary.
          </p>
        </div>
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
