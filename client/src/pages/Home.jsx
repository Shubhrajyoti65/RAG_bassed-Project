import { Link } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";

/* ─── Scroll Reveal Hook ──────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("reveal");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ─── Staggered Scroll Reveal Hook ────────────────────────── */
function useRevealStagger() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("reveal-stagger");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ─── Law-themed SVG Components ───────────────────────────── */
function ScaleOfJustice({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
      <line x1="60" y1="20" x2="60" y2="95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="35" x2="90" y2="35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="60" cy="20" r="4" fill="currentColor"/>
      {/* Left pan */}
      <path d="M25 55 L30 35 L35 55" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M22 55 Q30 62 38 55" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Right pan */}
      <path d="M85 50 L90 35 L95 50" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M82 50 Q90 57 98 50" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Base */}
      <path d="M45 95 L75 95" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 100 L70 100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function GavelIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="28" width="30" height="12" rx="3" transform="rotate(-45 15 28)" fill="currentColor" opacity="0.8"/>
      <rect x="38" y="45" width="6" height="24" rx="3" transform="rotate(-45 38 45)" fill="currentColor" opacity="0.6"/>
      <line x1="55" y1="65" x2="70" y2="65" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Floating Legal Dashboard Mockup ─────────────────────── */
function LegalDashboardVisual() {
  return (
    <div className="relative w-full max-w-lg mx-auto hero-visual-enter">
      {/* Main card */}
      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
        {/* Header bar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 h-6 bg-white/5 rounded-full" />
        </div>

        {/* Analysis result mockup */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary-bg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-white text-sm font-semibold font-label">Case Analysis Complete</div>
              <div className="text-white/40 text-xs font-label">3 precedents found • 4 provisions matched</div>
            </div>
          </div>

          {/* Mini stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Confidence", value: "94%", color: "text-green-400" },
              { label: "Provisions", value: "4", color: "text-primary-dark" },
              { label: "Cases", value: "3", color: "text-tertiary-dark" },
            ].map(s => (
              <div key={s.label} className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className={`text-lg font-bold font-headline ${s.color}`}>{s.value}</div>
                <div className="text-white/40 text-[10px] font-label uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Skeleton lines */}
          <div className="space-y-2 pt-2">
            <div className="h-2.5 bg-white/8 rounded-full w-full animate-shimmer" />
            <div className="h-2.5 bg-white/6 rounded-full w-4/5" />
            <div className="h-2.5 bg-white/4 rounded-full w-3/5" />
          </div>
        </div>
      </div>

      {/* Floating accent elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 text-primary-dark/20 animate-float-slow">
        <ScaleOfJustice className="w-full h-full" />
      </div>
      <div className="absolute -bottom-3 -left-3 w-14 h-14 text-tertiary-dark/15 animate-bob" style={{ animationDelay: "1s" }}>
        <GavelIcon className="w-full h-full" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*                        HOME PAGE                          */
/* ═══════════════════════════════════════════════════════════ */

export default function Home() {
  const featuresHeaderRef = useReveal();
  const featuresGridRef = useRevealStagger();
  const howHeaderRef = useReveal();
  const howGridRef = useRevealStagger();
  const trustRef = useReveal();
  const trustGridRef = useRevealStagger();
  const aboutRef = useReveal();
  const ctaRef = useReveal();
  const contactHeaderRef = useReveal();
  const contactGridRef = useRevealStagger();

  return (
    <div className="flex flex-col gap-0">

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="relative rounded-[2rem] overflow-hidden bg-dark-bg pt-16 pb-20 lg:pt-20 lg:pb-28 px-6 lg:px-12 shadow-2xl mt-2">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(139,92,246,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(161,7,83,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Text content with staggered entrance */}
            <div className="text-center lg:text-left">
              <span className="hero-stagger-1 inline-block py-2 px-5 rounded-full bg-white/5 text-primary-dark text-xs font-bold font-label tracking-[0.2em] uppercase mb-6 border border-white/10 backdrop-blur-sm">
                Janata kee seva mein samarpit
              </span>

              <h1 className="hero-stagger-2 font-headline text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.08]">
                Clarity for your{" "}
                <span className="gradient-text">complex world.</span>
              </h1>

              <p className="hero-stagger-3 font-body text-lg md:text-xl text-dark-text-secondary mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                No jargon. No confusion. Just structured, calm, and actionable legal guidance tailored to your specific situation.
              </p>

              <div className="hero-stagger-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/login?tab=signup"
                  className="btn-glow gradient-primary-bg hover:opacity-90 text-white px-8 py-4 rounded-full font-bold font-label text-base transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Start Your Consultation
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <a
                  href="#features"
                  className="bg-white/8 hover:bg-white/12 text-white border border-white/15 px-8 py-4 rounded-full font-semibold font-label text-base transition-all duration-300 flex items-center justify-center backdrop-blur-sm hover:border-white/25"
                >
                  Explore Features
                </a>
              </div>
            </div>

            {/* Right — Legal dashboard visual */}
            <div className="hidden lg:block">
              <LegalDashboardVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────────── */}
      <section id="features" className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={featuresHeaderRef} className="text-center mb-16">
            <span className="font-label text-xs font-bold tracking-[0.25em] uppercase text-primary dark:text-primary-dark mb-4 block">Capabilities</span>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-5">
              Why Choose Nyaay Sahayak?
            </h2>
            <p className="font-body text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto text-lg">
              Built specifically to assist legal professionals and individuals in understanding complex domestic violence cases through the lens of established precedents.
            </p>
          </div>

          <div ref={featuresGridRef} className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
                title: "AI Case Analysis",
                desc: "Our advanced language models parse complex legal descriptions in seconds, extracting key facts, involved parties, and judicial contexts automatically."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                title: "Document Processing",
                desc: "Securely drag and drop your FIRs, case notes, or PDF documents. We seamlessly handle extraction and prepare the data for contextual matching."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />,
                title: "Precedent Discovery",
                desc: "Discover directly relevant High Court judgments. See match confidence scores, detailed parallels, and identical legal provisions utilized in previous cases."
              }
            ].map((feature) => (
              <div key={feature.title}
                className="card-hover bg-light-card dark:bg-dark-card rounded-2xl p-8 border border-light-border dark:border-dark-border group">
                <div className="w-14 h-14 gradient-primary-bg rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{feature.icon}</svg>
                </div>
                <h3 className="font-headline text-xl font-bold text-light-text dark:text-dark-text mb-3">{feature.title}</h3>
                <p className="font-body text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">{feature.desc}</p>
                <div className="mt-5 flex items-center gap-2 text-primary dark:text-primary-dark font-label text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS — Timeline ──────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div ref={howHeaderRef} className="text-center mb-16">
            <span className="font-label text-xs font-bold tracking-[0.25em] uppercase text-primary dark:text-primary-dark mb-4 block">Process</span>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">
              How It Works
            </h2>
          </div>

          <div ref={howGridRef} className="relative">
            {/* Vertical timeline line (desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent -translate-x-1/2" />

            <div className="space-y-12 md:space-y-16">
              {[
                { step: "01", title: "Describe Your Case", desc: "Enter the domestic violence case details or upload an FIR/PDF document. Our system accepts plain text descriptions as well as scanned documents.", side: "left" },
                { step: "02", title: "AI-Powered Analysis", desc: "Our advanced RAG system searches through a curated database of High Court judgments and identifies the most relevant precedents and legal provisions.", side: "right" },
                { step: "03", title: "Get Structured Results", desc: "Receive a comprehensive analysis with case summary, matched legal provisions, confidence scores, and similar judicial decisions — all in seconds.", side: "left" },
              ].map((item, i) => (
                <div key={item.step} className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${item.side === "right" ? "md:flex-row-reverse" : ""}`}>
                  {/* Timeline node */}
                  <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex w-12 h-12 rounded-full gradient-primary-bg items-center justify-center text-white font-bold text-sm shadow-lg z-10 animate-glow-ring" style={{ animationDelay: `${i * 0.5}s` }}>
                    {item.step}
                  </div>

                  {/* Content card */}
                  <div className={`w-full md:w-[calc(50%-3rem)] card-hover bg-light-card dark:bg-dark-card rounded-2xl p-8 border border-light-border dark:border-dark-border relative overflow-hidden group`}>
                    <div className="absolute top-0 left-0 right-0 h-0.5 gradient-primary-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="md:hidden w-10 h-10 rounded-full gradient-primary-bg flex items-center justify-center text-white font-bold text-sm mb-4 shadow-md">
                      {item.step}
                    </div>
                    <h3 className="font-headline text-xl font-bold text-light-text dark:text-dark-text mb-3">{item.title}</h3>
                    <p className="font-body text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden md:block w-[calc(50%-3rem)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST INDICATORS ─────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={trustRef} className="text-center mb-12">
            <span className="font-label text-xs font-bold tracking-[0.25em] uppercase text-primary dark:text-primary-dark mb-4 block">Trusted By</span>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">
              Built on Trust & Authority
            </h2>
          </div>

          <div ref={trustGridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "500+", label: "Cases Analyzed", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
              { value: "98%", label: "Accuracy Rate", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
              { value: "50+", label: "Legal Provisions", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
              { value: "24/7", label: "Available", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
            ].map((stat) => (
              <div key={stat.label} className="card-hover bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border text-center group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 dark:group-hover:bg-primary-dark/20 transition-colors duration-300">
                  <svg className="w-6 h-6 text-primary dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">{stat.icon}</svg>
                </div>
                <div className="font-headline text-3xl font-bold text-light-text dark:text-dark-text mb-1">{stat.value}</div>
                <div className="font-label text-sm text-light-text-muted dark:text-dark-text-muted uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT US ──────────────────────────────────────── */}
      <section id="about" className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div ref={aboutRef} className="grid md:grid-cols-5 gap-8 items-start">
            {/* Left — decorative */}
            <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border p-8 h-full relative overflow-hidden">
              <div className="absolute inset-0 gradient-primary-bg opacity-5" />
              <ScaleOfJustice className="w-32 h-32 text-primary dark:text-primary-dark mb-6 animate-float-slow" />
              <p className="font-headline text-xl font-bold text-light-text dark:text-dark-text text-center">Justice Through Innovation</p>
              <p className="font-body text-sm text-light-text-muted dark:text-dark-text-muted text-center mt-2">Since 2024 • MNNIT Allahabad</p>
            </div>

            {/* Right — content */}
            <div className="md:col-span-3 bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-bg" />
              <span className="font-label text-xs font-bold tracking-[0.25em] uppercase text-primary dark:text-primary-dark mb-4 block">About Us</span>
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text mb-6">
                Empowering Justice Through Technology
              </h2>
              <div className="space-y-4 font-body text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                <p>
                  Nyaay Sahayak is a legal-tech platform born out of MNNIT Allahabad, designed to bridge the critical gap between complex legal language and the people who need to understand it most.
                </p>
                <p>
                  We leverage cutting-edge AI and Retrieval-Augmented Generation (RAG) to analyze domestic violence cases against a curated database of High Court judgments, providing structured insights, relevant legal provisions, and precedent matches — all in seconds.
                </p>
                <p>
                  Whether you are a legal professional seeking faster research tools or an individual trying to understand your rights, Nyaay Sahayak stands as your dedicated digital legal companion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section ref={ctaRef} className="py-16 px-6 lg:px-8 rounded-[2rem] my-8 mx-2 sm:mx-8 relative overflow-hidden">
        {/* Full gradient background */}
        <div className="absolute inset-0 gradient-primary-bg rounded-[2rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12)_0%,_transparent_50%)] rounded-[2rem]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to find the right precedents?
          </h2>
          <p className="font-body text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of legal professionals using Nyaay Sahayak to streamline their case research.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login?tab=signup"
              className="bg-white text-primary px-8 py-4 rounded-full font-bold font-label text-base transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Get Started Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <a
              href="#features"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-semibold font-label text-base transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ───────────────────────────────────────── */}
      <section id="contact" className="py-16 px-4 sm:px-6 mb-8">
        <div className="max-w-4xl mx-auto">
          <div ref={contactHeaderRef} className="text-center mb-10">
            <span className="font-label text-xs font-bold tracking-[0.25em] uppercase text-primary dark:text-primary-dark mb-4 block">Get In Touch</span>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-4">
              Contact Us
            </h2>
            <p className="font-body text-light-text-secondary dark:text-dark-text-secondary max-w-lg mx-auto">
              Have questions or feedback? We&apos;d love to hear from you.
            </p>
          </div>
          <div ref={contactGridRef} className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                title: "Email",
                detail: "support@nyaaysahayak.in"
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
                title: "Location",
                detail: "MNNIT Allahabad, India"
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: "Hours",
                detail: "Mon - Fri, 9am - 6pm IST"
              }
            ].map((item) => (
              <div key={item.title} className="card-hover bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border text-center group">
                <div className="w-12 h-12 gradient-primary-bg rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                </div>
                <h3 className="font-headline text-base font-bold text-light-text dark:text-dark-text mb-1">{item.title}</h3>
                <p className="font-body text-sm text-light-text-secondary dark:text-dark-text-secondary">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
