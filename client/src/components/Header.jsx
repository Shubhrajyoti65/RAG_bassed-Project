import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header({ user, onLogout, isDark, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-brand-navy dark:bg-brand-dark border-b-4 border-brand-peach dark:border-brand-peach/60 text-white shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
              <svg
                className="w-7 h-7 text-amber-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </Link>
            <div>
              <Link to="/">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight hover:text-brand-peach transition-colors">
                  Nyaay Sahayak
                </h1>
              </Link>
              <p className="text-indigo-200 dark:text-slate-300 text-sm mt-0.5">
              Janta ki Seva mein Samarpit
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 mx-auto bg-black/20 px-6 py-2 rounded-full border border-white/10">
            <Link to="/" className="text-white/90 hover:text-brand-peach transition-colors text-sm font-semibold tracking-wide">Home</Link>
            <Link to="/analyze" className="text-white/90 hover:text-brand-peach transition-colors text-sm font-semibold tracking-wide">Analyze</Link>
            {user && <Link to="/dashboard" className="text-white/90 hover:text-brand-peach transition-colors text-sm font-semibold tracking-wide">Dashboard</Link>}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
              className="p-2 rounded-md bg-white/15 hover:bg-white/25 transition-colors"
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95l-1.414 1.414M12 16a4 4 0 100-8 4 4 0 000 8z"
                  />
                </svg>
              )}
            </button>

            {user && (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-indigo-100 max-w-40 truncate">{user.name}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-3 z-20">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 truncate">{user.email}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout();
                      }}
                      className="mt-3 w-full text-left text-sm px-3 py-2 rounded-md bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {!user && (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="text-sm font-semibold text-white/90 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/login" className="text-sm font-bold bg-white dark:bg-slate-800 text-brand-navy dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 px-4 py-1.5 rounded-full shadow-sm transition-all hidden sm:block border border-transparent dark:border-slate-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
