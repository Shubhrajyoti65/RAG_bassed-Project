import { useParams, Link, useNavigate } from "react-router-dom";
import { ALL_JUDGMENTS } from "../api/judgmentsData";

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function JudgmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const judgment = ALL_JUDGMENTS.find((j) => String(j.id) === String(id));

  if (!judgment) {
    return (
      <div className="jdp-not-found">
        <div className="jdp-not-found-inner">
          <div className="jdp-not-found-icon">⚖️</div>
          <h1 className="jdp-nf-title">Judgment not found</h1>
          <p className="jdp-nf-sub">The judgment you are looking for does not exist or has been removed.</p>
          <Link to="/" className="app-button-primary jdp-back-btn">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="jdp-root animate-fade-in">
      {/* Breadcrumb */}
      <nav className="jdp-breadcrumb">
        <button className="jdp-breadcrumb-btn" onClick={() => navigate(-1)} aria-label="Go back">
          ← Back
        </button>
        <span className="jdp-breadcrumb-sep">/</span>
        <span className="jdp-breadcrumb-label">Judgment Detail</span>
      </nav>

      {/* Header card */}
      <header className="jdp-header app-card p-7 sm:p-9">
        <div className="jdp-header-meta">
          <span className="jdp-court-badge">{judgment.court}</span>
          <span className="jdp-date-badge">{fmtDate(judgment.date)}</span>
        </div>
        <h1 className="jdp-title">{judgment.title}</h1>

        {judgment.citation && (
          <p className="jdp-citation">📄 {judgment.citation}</p>
        )}
        {judgment.bench && (
          <p className="jdp-bench">👨‍⚖️ {judgment.bench}</p>
        )}
      </header>

      {/* Summary highlight */}
      <div className="jdp-summary-box">
        <p className="jdp-summary-label">Summary</p>
        <p className="jdp-summary-text">{judgment.summary}</p>
      </div>

      <div className="jdp-two-col">
        {/* Key points */}
        {judgment.keyPoints?.length > 0 && (
          <section className="jdp-section app-card p-6">
            <h2 className="jdp-section-title">
              <span className="jdp-section-icon">📌</span> Key Legal Points
            </h2>
            <ol className="jdp-keypoints-list">
              {judgment.keyPoints.map((point, i) => (
                <li key={i} className="jdp-keypoint-item">
                  <span className="jdp-keypoint-num">{i + 1}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Provisions */}
        {judgment.provisions?.length > 0 && (
          <section className="jdp-section app-card p-6">
            <h2 className="jdp-section-title">
              <span className="jdp-section-icon">⚖️</span> Statutory Provisions
            </h2>
            <ul className="jdp-provisions-list">
              {judgment.provisions.map((prov) => (
                <li key={prov} className="jdp-provision-chip">{prov}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Full judgment text */}
      {judgment.fullText && (
        <section className="jdp-section app-card p-6 sm:p-8">
          <h2 className="jdp-section-title">
            <span className="jdp-section-icon">📜</span> Full Judgment Summary
          </h2>
          <div className="jdp-fulltext">
            {judgment.fullText.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* Impact */}
      {judgment.impact && (
        <section className="jdp-impact-box">
          <h2 className="jdp-impact-title">
            <span>💡</span> Impact &amp; Significance
          </h2>
          <p className="jdp-impact-text">{judgment.impact}</p>
        </section>
      )}

      {/* Disclaimer */}
      <p className="jdp-disclaimer">
        ⚠️ This is an AI-summarised educational overview for informational purposes only. This is not legal advice.
        Always consult a qualified advocate for case-specific guidance.
      </p>

      {/* Bottom nav */}
      <div className="jdp-bottom-nav">
        <button className="app-button-secondary jdp-bottom-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <Link to="/" className="app-button-primary jdp-bottom-btn">
          Home
        </Link>
      </div>
    </div>
  );
}
