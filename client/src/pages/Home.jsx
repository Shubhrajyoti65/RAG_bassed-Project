import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

const FEATURES = [
  {
    title: "AI Case Analysis",
    description:
      "Understand complicated domestic violence narratives through structured issue mapping and legal context extraction.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
  {
    title: "Provision Matching",
    description:
      "Identify relevant statutory provisions and map your facts to legal protections likely to matter in consultation.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 8c-1.657 0-3 1.343-3 3 0 2.25 3 5 3 5s3-2.75 3-5c0-1.657-1.343-3-3-3zM5 20h14"
      />
    ),
  },
  {
    title: "Precedent Search",
    description:
      "Surface similar judgments with confidence signals so you can prepare clear, fact-based next steps quickly.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
      />
    ),
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Describe your situation",
    description:
      "Type your case details or upload a PDF. Share facts in your own words, not legal jargon.",
  },
  {
    number: "02",
    title: "Run AI legal analysis",
    description:
      "Our retrieval pipeline compares your input with curated judgments and extracts useful legal structure.",
  },
  {
    number: "03",
    title: "Review clear guidance",
    description:
      "Get a concise summary, suggested provisions, similar cases, and practical preparation points.",
  },
];

const TRUST_STATS = [
  { label: "Cases analyzed", value: "500+" },
  { label: "Accuracy signal", value: "98%" },
  { label: "Provisions indexed", value: "50+" },
  { label: "Availability", value: "24/7" },
];

const CONTACT_POINTS = [
  { title: "Email", detail: "support@nyaaysahayak.in" },
  { title: "Location", detail: "MNNIT Allahabad, India" },
  { title: "Support hours", detail: "Mon to Fri, 9:00 AM to 6:00 PM IST" },
];

function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    element.classList.add("reveal");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function useRevealStagger() {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    element.classList.add("reveal-stagger");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function useHeroParallax() {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) {
      return undefined;
    }

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) {
      return undefined;
    }

    let rafId = 0;

    function applyTilt(clientX, clientY) {
      const rect = wrap.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(1100px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translate3d(${(x * 8).toFixed(2)}px, ${(-y * 8).toFixed(2)}px, 0)`;
      });
    }

    function handleMove(event) {
      applyTilt(event.clientX, event.clientY);
    }

    function resetTilt() {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        card.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
      });
    }

    wrap.addEventListener("mousemove", handleMove);
    wrap.addEventListener("mouseleave", resetTilt);

    return () => {
      wrap.removeEventListener("mousemove", handleMove);
      wrap.removeEventListener("mouseleave", resetTilt);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return { wrapRef, cardRef };
}

export default function Home() {
  const heroRef = useReveal();
  const { wrapRef: heroVisualRef, cardRef: heroCardRef } = useHeroParallax();
  const featuresRef = useRevealStagger();
  const processRef = useRevealStagger();
  const trustRef = useRevealStagger();
  const aboutRef = useReveal();
  const contactRef = useRevealStagger();

  return (
    <div className="space-y-14 sm:space-y-16">
      <section ref={heroRef} className="home-hero-shell relative overflow-hidden rounded-4xl app-card p-7 sm:p-10 lg:p-12">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.15),transparent_60%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,rgba(29,78,216,0.12),transparent_58%)]" />

        <div className="relative z-10 grid gap-9 lg:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="hero-copy-intro inline-flex items-center rounded-full border border-border bg-surface/80 px-4 py-1.5 text-[11px] font-label font-bold tracking-[0.2em] uppercase text-primary">
              Janata kee seva mein samarpit
            </span>

            <h1 className="hero-copy-title mt-5 font-headline text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.06] tracking-tight text-text-primary">
              Clarity for your <span className="hero-title-gradient">complex world.</span>
            </h1>

            <p className="hero-copy-text mt-5 max-w-2xl font-body text-base sm:text-lg text-text-secondary leading-relaxed">
              Nyaay Sahayak turns complex domestic violence case details into structured and understandable legal guidance so you can prepare confidently.
            </p>

            <div className="hero-copy-actions mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                to="/login?tab=signup"
                className="app-button-primary px-7 py-3.5 font-label text-sm sm:text-base font-bold text-center"
              >
                Start your consultation
              </Link>
              <a
                href="#features"
                className="app-button-secondary px-7 py-3.5 font-label text-sm sm:text-base font-semibold text-center"
              >
                Explore features
              </a>
            </div>
          </div>

          <div ref={heroVisualRef} className="hero-visual-wrap relative">
            <div ref={heroCardRef} className="hero-preview-card gradient-primary-bg rounded-3xl p-6 sm:p-7 text-white shadow-xl">
            <p className="font-label text-[11px] uppercase tracking-[0.2em] text-white/70">Highlight</p>
            <h2 className="mt-2 font-headline text-2xl font-bold">Legal dashboard preview</h2>
            <p className="mt-3 font-body text-sm text-white/85 leading-relaxed">
              Upload facts, review extracted provisions, and compare precedent confidence in one clear workflow.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="hero-mini-stat rounded-xl bg-white/10 p-3">
                <p className="font-headline text-xl font-bold">94%</p>
                <p className="font-label text-[10px] uppercase tracking-[0.14em] text-white/75">Confidence</p>
              </div>
              <div className="hero-mini-stat rounded-xl bg-white/10 p-3">
                <p className="font-headline text-xl font-bold">4</p>
                <p className="font-label text-[10px] uppercase tracking-[0.14em] text-white/75">Provisions</p>
              </div>
              <div className="hero-mini-stat rounded-xl bg-white/10 p-3">
                <p className="font-headline text-xl font-bold">3</p>
                <p className="font-label text-[10px] uppercase tracking-[0.14em] text-white/75">Cases</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="space-y-7">
        <div>
          <p className="font-label text-xs font-bold tracking-[0.24em] uppercase text-primary">Capabilities</p>
          <h2 className="mt-2 font-headline text-3xl sm:text-4xl font-bold text-text-primary">Built for practical legal clarity</h2>
        </div>

        <div ref={featuresRef} className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className="app-card ui-border-highlight animate-popIn p-6"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <span className="ui-icon-enhance inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-headline text-xl font-bold text-text-primary">{feature.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-7">
        <div>
          <p className="font-label text-xs font-bold tracking-[0.24em] uppercase text-primary">Process</p>
          <h2 className="mt-2 font-headline text-3xl sm:text-4xl font-bold text-text-primary">How your analysis is prepared</h2>
        </div>

        <div ref={processRef} className="grid gap-4 md:grid-cols-3">
          {PROCESS_STEPS.map((step, index) => (
            <article
              key={step.number}
              className="app-card ui-border-highlight animate-popIn p-6"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <p className="font-label text-xs font-bold tracking-[0.2em] uppercase text-primary">Step {step.number}</p>
              <h3 className="mt-2 font-headline text-xl font-bold text-text-primary">{step.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section ref={trustRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_STATS.map((stat, index) => (
          <article
            key={stat.label}
            className="app-card ui-border-highlight animate-popIn p-5 text-center"
            style={{ animationDelay: `${index * 0.07}s` }}
          >
            <p className="font-headline text-3xl font-bold text-text-primary">{stat.value}</p>
            <p className="mt-1 font-label text-xs font-semibold uppercase tracking-[0.17em] text-text-secondary">{stat.label}</p>
          </article>
        ))}
      </section>

      <section id="about" ref={aboutRef} className="app-card ui-border-highlight animate-popIn p-7 sm:p-9">
        <p className="font-label text-xs font-bold tracking-[0.24em] uppercase text-primary">About us</p>
        <h2 className="mt-2 font-headline text-3xl sm:text-4xl font-bold text-text-primary">Technology in service of justice</h2>
        <div className="mt-5 space-y-4 font-body text-text-secondary leading-relaxed">
          <p>
            Nyaay Sahayak was developed at MNNIT Allahabad to bridge the gap between legal complexity and real-world access to guidance.
          </p>
          <p>
            By combining retrieval-augmented generation with curated High Court judgments, the platform helps users understand relevant legal pathways faster.
          </p>
          <p>
            The output is informational and structured for preparation, so advocates and users can discuss facts with better clarity.
          </p>
        </div>
      </section>

      <section id="contact" className="space-y-7 pb-2">
        <div>
          <p className="font-label text-xs font-bold tracking-[0.24em] uppercase text-primary">Contact</p>
          <h2 className="mt-2 font-headline text-3xl sm:text-4xl font-bold text-text-primary">Connect with our team</h2>
        </div>

        <div ref={contactRef} className="grid gap-4 md:grid-cols-3">
          {CONTACT_POINTS.map((point, index) => (
            <article
              key={point.title}
              className="app-card ui-border-highlight animate-popIn p-6"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <h3 className="font-headline text-lg font-bold text-text-primary">{point.title}</h3>
              <p className="mt-2 font-body text-sm text-text-secondary">{point.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}


