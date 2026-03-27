import Header from "./Header";
import Disclaimer from "./Disclaimer";

export default function Layout({ children, user, onLogout, isDark, onToggleTheme }) {
  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300 flex flex-col">
        <Header user={user} onLogout={onLogout} isDark={isDark} onToggleTheme={onToggleTheme} />
        
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <Disclaimer isDark={isDark} />
        </div>

        <footer className="bg-light-card-alt dark:bg-dark-surface border-t border-light-border dark:border-dark-border mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 gradient-primary-bg rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <span className="font-headline text-sm font-semibold text-light-text dark:text-dark-text">
                  Nyaay Sahayak
                </span>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="font-label text-xs text-light-text-muted dark:text-dark-text-muted hover:text-primary dark:hover:text-primary-dark transition-colors">Privacy Policy</a>
                <a href="#" className="font-label text-xs text-light-text-muted dark:text-dark-text-muted hover:text-primary dark:hover:text-primary-dark transition-colors">Terms of Service</a>
              </div>
              <p className="font-label text-xs text-light-text-muted dark:text-dark-text-muted">
                © 2024 Nyaay Sahayak — Janata kee seva mein samarpit
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
