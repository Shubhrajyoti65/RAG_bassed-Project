import { useState } from "react";
import Header from "./Header";
import { Link } from "react-router-dom";

// Main layout wrapper component that provides the global structure, header, and footer
export default function Layout({ children, user, onLogout, isDark, onToggleTheme, onNewAnalysis }) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <img
          src="/images/scales-of-justice-icon-204996-512.png"
          alt=""
          className="page-bg-art page-bg-art-center"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header user={user} onLogout={onLogout} isDark={isDark} onToggleTheme={onToggleTheme} onNewAnalysis={onNewAnalysis} />

        <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="mt-auto border-t border-border/80 bg-surface/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 gradient-primary-bg rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <span className="font-headline text-sm font-semibold text-text-primary">Nyaay Sahayak</span>
              </div>

              <div className="flex items-center gap-6">
                <Link to="/privacy-policy" className="font-label text-xs text-text-secondary hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms-of-service" className="font-label text-xs text-text-secondary hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <button
                  type="button"
                  onClick={() => setShowDisclaimer((prev) => !prev)}
                  className="font-label text-xs text-amber-500 hover:text-amber-400 transition-colors"
                  aria-expanded={showDisclaimer}
                  aria-controls="footer-disclaimer-message"
                >
                  Disclaimer
                </button>
              </div>

              <p className="font-label text-xs text-text-secondary">(c) 2024 Nyaay Sahayak - Janata kee seva mein samarpit</p>
            </div>

            {showDisclaimer && (
              <div
                id="footer-disclaimer-message"
                className="mt-4 rounded-lg border border-amber-300/60 bg-amber-50/70 px-4 py-3 dark:bg-amber-500/8 dark:border-amber-400/30"
              >
                <p className="font-body text-sm text-amber-900 dark:text-amber-200">
                  <strong className="font-headline">Disclaimer:</strong> Nyaay Sahayak is a research tool for informational and educational purposes only. It does <strong>not</strong> provide legal advice. Please consult a qualified advocate for legal guidance.
                </p>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}


