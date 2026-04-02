import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDailyJudgments } from "../api/judgmentsData";

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function JudgmentTicker() {
  const [judgments] = useState(() => getDailyJudgments());
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);
  const intervalRef = useRef(null);

  // Auto-advance active card every 5 seconds (pause on hover)
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % judgments.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [paused, judgments.length]);

  // Scroll the pill-tab strip so the active pill is visible
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const activePill = track.children[activeIndex];
    if (activePill) {
      activePill.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
    }
  }, [activeIndex]);

  const active = judgments[activeIndex];

  return (
    <section
      className="judgment-ticker-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header row */}
      <div className="judgment-ticker-header">
        <div className="judgment-ticker-badge">
          <span className="judgment-ticker-dot" />
          <span>Today&apos;s Judgments</span>
        </div>
        <span className="judgment-ticker-date">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Pill navigation */}
      <div className="judgment-ticker-pills-wrap">
        <div ref={trackRef} className="judgment-ticker-pills">
          {judgments.map((j, i) => (
            <button
              key={j.id}
              className={`judgment-ticker-pill${i === activeIndex ? " active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`View judgment ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main card — wrapped in Link so the whole card is clickable */}
      <Link
        to={`/judgment/${active.id}`}
        className="judgment-ticker-card-link"
        key={activeIndex}
        tabIndex={0}
        aria-label={`Read full judgment: ${active.title}`}
      >
        <div className="judgment-ticker-card">
          <div className="judgment-ticker-card-top">
            <span className="judgment-ticker-court">{active.court}</span>
            <span className="judgment-ticker-card-date">{fmtDate(active.date)}</span>
          </div>
          <h3 className="judgment-ticker-title">{active.title}</h3>
          <p className="judgment-ticker-summary">{active.summary}</p>

          {/* Read more hint */}
          <span className="judgment-ticker-read-more">
            Read full judgment →
          </span>

          {/* Progress bar */}
          <div className="judgment-ticker-progress-track">
            <div
              className={`judgment-ticker-progress-bar${paused ? " paused" : ""}`}
            />
          </div>
        </div>
      </Link>

      {/* Prev / Next controls */}
      <div className="judgment-ticker-controls">
        <button
          className="judgment-ticker-ctrl-btn"
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex((prev) => (prev - 1 + judgments.length) % judgments.length);
          }}
          aria-label="Previous judgment"
        >
          ‹
        </button>
        <span className="judgment-ticker-counter">
          {activeIndex + 1} / {judgments.length}
        </span>
        <button
          className="judgment-ticker-ctrl-btn"
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex((prev) => (prev + 1) % judgments.length);
          }}
          aria-label="Next judgment"
        >
          ›
        </button>
      </div>
    </section>
  );
}
