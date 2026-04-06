import { useEffect, useRef, useState } from "react";

export default function JudgmentTicker() {
  const [judgments, setJudgments] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const trackRef = useRef(null);
  const intervalRef = useRef(null);
  const hasJudgments = judgments.length > 0;

  useEffect(() => {
    let cancelled = false;

    async function loadLiveLaw() {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch("/api/livelaw");
        if (!response.ok) {
          throw new Error(`LiveLaw API failed with ${response.status}`);
        }

        const payload = await response.json();
        const articles = Array.isArray(payload?.articles)
          ? payload.articles
          : [];

        if (!cancelled) {
          setJudgments(articles);
          setActiveIndex(0);
        }
      } catch {
        if (!cancelled) {
          setJudgments([]);
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadLiveLaw();

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-advance active card every 5 seconds (pause on hover)
  useEffect(() => {
    if (paused || !hasJudgments) return undefined;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % judgments.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [paused, judgments.length, hasJudgments]);

  useEffect(() => {
    if (!hasJudgments) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((prev) => Math.min(prev, judgments.length - 1));
  }, [judgments.length, hasJudgments]);

  // Scroll the pill-tab strip so the active pill is visible
  useEffect(() => {
    if (!hasJudgments) return;

    const track = trackRef.current;
    if (!track) return;

    const activePill = track.children[activeIndex];
    if (activePill) {
      activePill.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
    }
  }, [activeIndex, hasJudgments]);

  function openArticle(link) {
    if (!link) {
      return;
    }

    window.open(link, "_blank");
  }

  const active = hasJudgments ? judgments[activeIndex] : null;

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
          {judgments.map((article, i) => (
            <button
              key={article.link || `${article.title}-${i}`}
              className={`judgment-ticker-pill${i === activeIndex ? " active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`View judgment ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <p className="judgment-ticker-state">Loading latest legal updates...</p>
      )}

      {!isLoading && !hasJudgments && (
        <p className="judgment-ticker-state judgment-ticker-state-muted">
          {hasError ? "No data available" : "No live updates available right now"}
        </p>
      )}

      {active && (
        <button
          type="button"
          className="judgment-ticker-card-link"
          key={activeIndex}
          onClick={() => openArticle(active.link)}
          aria-label={`Read full judgment: ${active.title}`}
        >
          <div className="judgment-ticker-card">
            <div className="judgment-ticker-card-top">
              <span className="judgment-ticker-court">LiveLaw</span>
              <span className="judgment-ticker-card-date">
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <h3 className="judgment-ticker-title">{active.title}</h3>
            <p className="judgment-ticker-summary" title={active.summary}>
              {active.summary}
            </p>

            <span className="judgment-ticker-read-more">Read full judgment →</span>

            <div className="judgment-ticker-progress-track">
              <div
                className={`judgment-ticker-progress-bar${paused ? " paused" : ""}`}
              />
            </div>
          </div>
        </button>
      )}

      {/* Prev / Next controls */}
      <div className="judgment-ticker-controls">
        <button
          className="judgment-ticker-ctrl-btn"
          disabled={!hasJudgments}
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex((prev) => (prev - 1 + judgments.length) % judgments.length);
          }}
          aria-label="Previous judgment"
        >
          ‹
        </button>
        <span className="judgment-ticker-counter">
          {hasJudgments ? activeIndex + 1 : 0} / {judgments.length}
        </span>
        <button
          className="judgment-ticker-ctrl-btn"
          disabled={!hasJudgments}
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
