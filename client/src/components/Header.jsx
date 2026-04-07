import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

// Main navigation header component with responsive mobile menu and profile dropdown
export default function Header({ user, onLogout, isDark, onToggleTheme, onNewAnalysis }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("/");
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
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

  // Track section highlight on the home page.
  useEffect(() => {
    if (user && location.pathname === "/") {
      setActiveSection("/");
      return;
    }

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
  }, [location.pathname, user]);

  const guestPrimaryNavLinks = [
    { label: "Home", to: "/" },
    { label: "Features", to: "/#features" },
    { label: "About Us", to: "/#about" },
    { label: "Contact Us", to: "/#contact" },
  ];

  const userCoreNavLinks = [
    { label: "Home", to: "/" },
    { label: "Analyze", to: "/analyze" },
    { label: "Dashboard", to: "/dashboard" },
  ];

  const legalNavLinks = [
    { label: "Privacy", to: "/privacy-policy" },
    { label: "Terms", to: "/terms-of-service" },
  ];

  const primaryNavLinks = user ? userCoreNavLinks : guestPrimaryNavLinks;

// Handles navigation clicks, including smooth scrolling for anchor links and reset for new analysis
  function handleNavClick(e, to) {
    // Always reset analysis state when navigating to /analyze
    if (to === "/analyze") {
      onNewAnalysis?.();
    }

    if (to === "/") {
      e.preventDefault();

      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "auto" });
          setActiveSection("/");
        }, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("/");
      }

      setMobileMenuOpen(false);
      return;
    }

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
            ? "bg-surface/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 gradient-primary-bg rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <span className="font-headline text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                  Nyaay Sahayak
                </span>
                <p className="font-label text-[9px] font-semibold text-text-secondary tracking-[0.15em] uppercase leading-none mt-0.5 hidden sm:block">
                  Janata kee seva mein samarpit
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-4">
              <nav className="flex items-center gap-1 bg-surface/80 backdrop-blur-sm px-2 py-1.5 rounded-full border border-border/60">
                {primaryNavLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={(e) => handleNavClick(e, link.to)}
                    className={`px-5 py-2 rounded-full text-sm font-medium font-label transition-all duration-200 ${
                      activeSection === link.to
                        ? "bg-primary text-white shadow-sm"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {!user && (
                <div className="flex items-center gap-1 pl-4 border-l border-border/70">
                  {legalNavLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className={`px-3 py-2 text-sm font-medium font-label transition-colors ${
                        activeSection === link.to
                          ? "text-primary"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dark/Light Mode Toggle */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2.5 rounded-full bg-surface/80 border border-border/60 text-text-secondary hover:text-primary hover:bg-surface/80 transition-all duration-200"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              {/* Logged-in user profile */}
              {user && (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-surface hover:bg-surface/80 border border-border/60 transition-all duration-200"
                    aria-haspopup="menu"
                    aria-expanded={profileMenuOpen}
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full gradient-primary-bg text-white text-xs font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                    <span className="font-label text-sm font-medium text-text-primary max-w-28 truncate hidden sm:block">
                      {user.name}
                    </span>
                    <svg className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl shadow-xl border border-border p-3 z-20 animate-fade-in">
                      <div className="px-3 py-2">
                        <p className="font-label text-sm font-bold text-text-primary truncate">{user.name}</p>
                        <p className="font-label text-xs text-text-secondary mt-0.5 truncate">{user.email}</p>
                      </div>
                      <div className="border-t border-border my-2" />
                      <Link to="/profile" onClick={() => setProfileMenuOpen(false)}
                        className="block w-full text-left font-label text-sm px-3 py-2 rounded-xl text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                        Profile
                      </Link>
                      <Link to="/history" onClick={() => setProfileMenuOpen(false)}
                        className="block w-full text-left font-label text-sm px-3 py-2 rounded-xl text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                        Full History
                      </Link>
                      <Link to="/analyze" onClick={() => { setProfileMenuOpen(false); onNewAnalysis?.(); }}
                        className="block w-full text-left font-label text-sm px-3 py-2 rounded-xl text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                        Analyze
                      </Link>
                      <Link to="/dashboard" onClick={() => setProfileMenuOpen(false)}
                        className="block w-full text-left font-label text-sm px-3 py-2 rounded-xl text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                        Dashboard
                      </Link>
                      <Link to="/contact-us" onClick={() => setProfileMenuOpen(false)}
                        className="block w-full text-left font-label text-sm px-3 py-2 rounded-xl text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                        Contact Us
                      </Link>
                      <div className="border-t border-border my-2" />
                      <button
                        type="button"
                        onClick={() => { setProfileMenuOpen(false); onLogout(); }}
                        className="w-full text-left font-label text-sm px-3 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200/80 hover:bg-red-600 hover:text-white hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
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
                  className="font-label text-sm font-bold bg-primary text-white px-6 py-2.5 rounded-full hover:opacity-90 hover:scale-[1.03] transition-all duration-200 shadow-sm hover:shadow-md hidden sm:block"
                >
                  {finalAuthButton.label}
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden p-2 rounded-xl text-text-secondary hover:bg-surface/80 transition-colors"
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
          <div className="absolute top-14 sm:top-16 left-4 right-4 bg-surface rounded-2xl shadow-2xl border border-border p-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {primaryNavLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={(e) => { handleNavClick(e, link.to); setMobileMenuOpen(false); }}
                  className="px-4 py-3 rounded-xl text-base font-medium font-label text-text-primary hover:bg-surface/80 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {!user && (
                <>
                  <div className="border-t border-border my-2" />
                  <p className="px-4 pb-1 font-label text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary">Legal</p>
                  {legalNavLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-xl text-base font-medium font-label text-text-primary hover:bg-surface/80 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              )}

              {!user && (
                <>
                  <div className="border-t border-border my-2" />
                  <Link
                    to={finalAuthButton.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center font-label text-sm font-bold bg-primary text-white px-6 py-3 rounded-full transition-all duration-200"
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
      <div className="h-14 sm:h-16" />
    </>
  );
}


