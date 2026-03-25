import Header from "./Header";
import Disclaimer from "./Disclaimer";

export default function Layout({ children, user, onLogout, isDark, onToggleTheme }) {
  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors flex flex-col">
        <Header user={user} onLogout={onLogout} isDark={isDark} onToggleTheme={onToggleTheme} />
        
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <Disclaimer isDark={isDark} />
        </div>

        <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <p className="text-xs text-gray-400 dark:text-slate-400 text-center">
              Nyaay Sahayak &mdash; Legal Case Analysis Tool | High Court Domestic Violence Cases | For Educational Purposes Only
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
