import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

export default function Header({ user, onLogout, isDark, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("/");
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isOnLogin = location.pathname === "/login";
  const isSignupTab = isOnLogin && searchParams.get("tab") === "signup";

  // Scroll detection for navbar background
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile menu on outside click
  useEffect(() => {
    function handleOutsideClick(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Scroll spy — track which section is in view based on scroll position
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(location.pathname);
      return;
    }

    const sectionIds = ["features", "about", "contact"];

    function handleScroll() {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // If near top, show Home
      if (scrollY < viewportHeight * 0.3) {
        setActiveSection("/");
        return;
      }

      // Find which section is closest to the top of viewport
      let active = "/";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Section is considered active if its top is above 60% of viewport
        if (rect.top <= viewportHeight * 0.6) {
          active = `/#${id}`;
        }
      }
      setActiveSection(active);
    }

    // Run once on mount
    setTimeout(handleScroll, 150);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Features", to: "/#features" },
    { label: "About Us", to: "/#about" },
    { label: "Contact Us", to: "/#contact" },
  ];

  function handleNavClick(e, to) {
    if (to.startsWith("/#")) {
      e.preventDefault();
      const id = to.substring(2);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (location.pathname !== "/") {
        window.location.href = to;
      }
      setMobileMenuOpen(false);
    }
  }

  // Dynamic auth button config
  const authButton = isOnLogin && !isSignupTab
    ? { label: "Sign Up", to: "/login?tab=signup" }
    : { label: "Log In", to: "/login" };

  // If user is NOT on login page, default is Sign Up
  const finalAuthButton = !isOnLogin
    ? { label: "Sign Up", to: "/login?tab=signup" }
    : authButton;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 gradient-primary-bg rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <span className="font-headline text-lg sm:text-xl font-bold text-light-text dark:text-dark-text tracking-tight">
                  Nyaay Sahayak
                </span>
                <p className="font-label text-[9px] font-semibold text-light-text-muted dark:text-dark-text-muted tracking-[0.15em] uppercase leading-none mt-0.5 hidden sm:block">
                  Janata kee seva mein samarpit
                </p>
              </div>
            </Link>

            {/* Center Nav — Pill Container (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 bg-light-muted/80 dark:bg-dark-card/80 backdrop-blur-sm px-2 py-1.5 rounded-full border border-light-border/50 dark:border-dark-border/50">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={(e) => handleNavClick(e, link.to)}
                  className={`px-5 py-2 rounded-full text-sm font-medium font-label transition-all duration-200 ${
                    activeSection === link.to
                      ? "bg-white dark:bg-dark-card-alt text-light-text dark:text-dark-text shadow-sm"
                      : "text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-white/60 dark:hover:bg-dark-card-alt/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dark/Light Mode Toggle */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2.5 rounded-full bg-light-muted/80 dark:bg-dark-card/80 border border-light-border/50 dark:border-dark-border/50 text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-dark hover:bg-light-card-alt dark:hover:bg-dark-card-alt transition-all duration-200"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              {/* Logged-in user profile */}
              {user && (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-light-muted dark:bg-dark-card hover:bg-light-card-alt dark:hover:bg-dark-card-alt border border-light-border/50 dark:border-dark-border/50 transition-all duration-200"
                    aria-haspopup="menu"
                    aria-expanded={profileMenuOpen}
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full gradient-primary-bg text-white text-xs font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                    <span className="font-label text-sm font-medium text-light-text dark:text-dark-text max-w-28 truncate hidden sm:block">
                      {user.name}
                    </span>
                    <svg className={`w-4 h-4 text-light-text-muted transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-light-border dark:border-dark-border p-3 z-20 animate-fade-in">
                      <div className="px-3 py-2">
                        <p className="font-label text-sm font-bold text-light-text dark:text-dark-text truncate">{user.name}</p>
                        <p className="font-label text-xs text-light-text-muted dark:text-dark-text-muted mt-0.5 truncate">{user.email}</p>
                      </div>
                      <div className="border-t border-light-border dark:border-dark-border my-2" />
                      <Link to="/analyze" onClick={() => setProfileMenuOpen(false)}
                        className="block w-full text-left font-label text-sm px-3 py-2 rounded-xl hover:bg-light-muted dark:hover:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary transition-colors">
                        Analyze
                      </Link>
                      <Link to="/dashboard" onClick={() => setProfileMenuOpen(false)}
                        className="block w-full text-left font-label text-sm px-3 py-2 rounded-xl hover:bg-light-muted dark:hover:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary transition-colors">
                        Dashboard
                      </Link>
                      <div className="border-t border-light-border dark:border-dark-border my-2" />
                      <button
                        type="button"
                        onClick={() => { setProfileMenuOpen(false); onLogout(); }}
                        className="w-full text-left font-label text-sm px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic auth button (logged out) */}
              {!user && (
                <Link
                  to={finalAuthButton.to}
                  className="font-label text-sm font-bold bg-light-text dark:bg-dark-text text-white dark:text-dark-bg px-6 py-2.5 rounded-full hover:opacity-90 hover:scale-[1.03] transition-all duration-200 shadow-sm hover:shadow-md hidden sm:block"
                >
                  {finalAuthButton.label}
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden p-2 rounded-xl text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-muted dark:hover:bg-dark-card transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-4 right-4 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-light-border dark:border-dark-border p-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={(e) => { handleNavClick(e, link.to); setMobileMenuOpen(false); }}
                  className="px-4 py-3 rounded-xl text-base font-medium font-label text-light-text dark:text-dark-text hover:bg-light-muted dark:hover:bg-dark-surface transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <div className="border-t border-light-border dark:border-dark-border my-2" />
                  <Link to="/analyze" onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-base font-medium font-label text-light-text dark:text-dark-text hover:bg-light-muted dark:hover:bg-dark-surface transition-colors">
                    Analyze
                  </Link>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-base font-medium font-label text-light-text dark:text-dark-text hover:bg-light-muted dark:hover:bg-dark-surface transition-colors">
                    Dashboard
                  </Link>
                </>
              )}
              {!user && (
                <>
                  <div className="border-t border-light-border dark:border-dark-border my-2" />
                  <Link
                    to={finalAuthButton.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center font-label text-sm font-bold bg-light-text dark:bg-dark-text text-white dark:text-dark-bg px-6 py-3 rounded-full transition-all duration-200"
                  >
                    {finalAuthButton.label}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20" />
    </>
  );
}
