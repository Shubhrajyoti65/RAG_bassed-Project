import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const AUTH_BG_FILES = [
  "ChatGPT Image Mar 29, 2026, 08_33_37 PM.png",
  "ChatGPT Image Mar 29, 2026, 08_33_59 PM.png",
  "ChatGPT Image Mar 29, 2026, 08_34_04 PM.png",
  "ChatGPT Image Mar 30, 2026, 01_17_52 AM.png",
  "Gemini_Generated_Image_191kuv191kuv191k.png",
  "Gemini_Generated_Image_5aepxz5aepxz5aep.png",
  "Gemini_Generated_Image_grpqdygrpqdygrpq.png",
  "Gemini_Generated_Image_w917iiw917iiw917.png",
];

function getAuthBackgroundPath(fileName) {
  return `/BGS/${encodeURIComponent(fileName)}`;
}

export default function AuthPanel({ onLogin, onSignup, onGoogleAuth, loading, isDark }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get("tab") === "signup" ? "signup" : "login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const [authBackground, setAuthBackground] = useState(() => getAuthBackgroundPath(AUTH_BG_FILES[0]));
  const googleButtonRef = useRef(null);
  const googleAuthRef = useRef(onGoogleAuth);
  const googleConfigured = Boolean(GOOGLE_CLIENT_ID);

  useEffect(() => {
    if (typeof window === "undefined" || AUTH_BG_FILES.length === 0) {
      return;
    }

    const previousIndexRaw = window.sessionStorage.getItem("auth-left-bg-index");
    const previousIndex = Number.parseInt(previousIndexRaw ?? "-1", 10);
    let candidateIndex = Math.floor(Math.random() * AUTH_BG_FILES.length);

    if (AUTH_BG_FILES.length > 1 && Number.isInteger(previousIndex) && previousIndex >= 0 && previousIndex === candidateIndex) {
      candidateIndex = (candidateIndex + 1) % AUTH_BG_FILES.length;
    }

    let cancelled = false;
    let attempts = 0;

    function tryLoadAt(index) {
      const src = getAuthBackgroundPath(AUTH_BG_FILES[index]);
      const probe = new window.Image();

      probe.onload = () => {
        if (cancelled) {
          return;
        }
        setAuthBackground(src);
        window.sessionStorage.setItem("auth-left-bg-index", String(index));
      };

      probe.onerror = () => {
        if (cancelled) {
          return;
        }

        attempts += 1;
        if (attempts >= AUTH_BG_FILES.length) {
          const fallbackSrc = getAuthBackgroundPath(AUTH_BG_FILES[0]);
          setAuthBackground(fallbackSrc);
          window.sessionStorage.setItem("auth-left-bg-index", "0");
          return;
        }

        tryLoadAt((index + 1) % AUTH_BG_FILES.length);
      };

      probe.src = src;
    }

    tryLoadAt(candidateIndex);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    googleAuthRef.current = onGoogleAuth;
  }, [onGoogleAuth]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    setMode(tab === "signup" ? "signup" : "login");
    setError("");
  }, [searchParams]);

  useEffect(() => {
    if (!googleConfigured || typeof window === "undefined") {
      setGoogleAvailable(false);
      return undefined;
    }

    let cancelled = false;
    let readyCheckTimer;

    async function handleGoogleCallback(response) {
      if (!response?.credential) {
        setError("Google authentication failed. Please try again.");
        return;
      }

      if (!googleAuthRef.current) {
        setError("Google authentication is not available right now.");
        return;
      }

      setError("");
      try {
        await googleAuthRef.current(response.credential);
      } catch (err) {
        setError(err.message || "Google authentication failed.");
      }
    }

    function renderGoogleButton() {
      if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        shape: "pill",
        size: "large",
        text: "continue_with",
        width: 320,
        theme: isDark ? "filled_black" : "outline",
      });

      setGoogleAvailable(true);
    }

    const existingScript = document.querySelector("script[data-google-identity='true']");
    if (existingScript) {
      if (window.google?.accounts?.id) {
        renderGoogleButton();
      } else {
        readyCheckTimer = window.setInterval(() => {
          if (window.google?.accounts?.id) {
            window.clearInterval(readyCheckTimer);
            renderGoogleButton();
          }
        }, 120);
      }
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = "true";
      script.onload = renderGoogleButton;
      script.onerror = () => {
        if (!cancelled) {
          setGoogleAvailable(false);
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (readyCheckTimer) {
        window.clearInterval(readyCheckTimer);
      }
    };
  }, [googleConfigured, isDark]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      if (mode === "signup") {
        if (!form.name.trim()) {
          setError("Name is required for sign up.");
          return;
        }
        await onSignup({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
      } else {
        await onLogin({
          email: form.email.trim(),
          password: form.password,
        });
      }

      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    }
  }

  return (
    <div className="max-w-5xl w-full mx-auto animate-fade-in">
      <div className="app-card ui-border-highlight overflow-hidden p-0">
        <div className="grid md:grid-cols-2">
          <section
            className={`relative isolate overflow-hidden px-7 py-8 sm:px-8 sm:py-9 border-t ${
              isDark
                ? "border-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "border-black/10 text-slate-900 shadow-[inset_0_1px_0_rgba(0,0,0,0.08)]"
            }`}
          >
            <div
              className="absolute inset-0 -z-20"
              style={{
                backgroundImage: `url("${authBackground}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: isDark ? "contrast(1.06) brightness(0.95)" : "contrast(1.08) brightness(0.98) saturate(1.12)",
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 -z-10"
              style={{
                backgroundImage: isDark
                  ? "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.68)), linear-gradient(rgba(0,0,0,0.36), rgba(0,0,0,0.36))"
                  : "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.14)), linear-gradient(to top, rgba(15,23,42,0.14), rgba(15,23,42,0.03) 44%, rgba(15,23,42,0) 70%), radial-gradient(circle at 18% 16%, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.08) 42%, rgba(15,23,42,0) 76%)",
              }}
              aria-hidden="true"
            />

            <span
              className={`inline-flex items-center rounded-full px-3.5 py-1 font-label text-[11px] font-bold tracking-[0.16em] uppercase ${
                isDark ? "bg-white/12 text-white/85" : "bg-white/70 text-slate-900 border border-black/10"
              }`}
            >
              Secure access
            </span>

            <div
              className={`mt-4 rounded-2xl px-4 py-4 sm:px-5 sm:py-5 ${
                isDark
                  ? "bg-black/24 border border-white/10"
                  : "bg-white/78 border border-black/12 shadow-sm backdrop-blur-[2px]"
              }`}
            >
              <h2 className={`font-headline text-3xl sm:text-4xl font-bold leading-tight ${isDark ? "text-white" : "text-slate-950"}`}>
                {mode === "signup" ? "Create your legal workspace" : "Welcome back to your chambers"}
              </h2>

              <p className={`mt-3 font-body leading-relaxed ${isDark ? "text-slate-200/90" : "text-slate-900 font-medium"}`}>
                {mode === "signup"
                  ? "Register to save analyses, track precedent research, and continue your workflow across sessions."
                  : "Sign in to resume your ongoing analysis and review your prior case summaries."}
              </p>
            </div>

            <div className="mt-6 space-y-2.5">
              <div className={`rounded-2xl px-4 py-2.5 backdrop-blur-[1px] ${isDark ? "bg-white/12 border border-white/10" : "bg-white/80 border border-black/12"}`}>
                <p className={`font-label text-xs font-semibold uppercase tracking-[0.14em] ${isDark ? "text-white/70" : "text-slate-700"}`}>Privacy first</p>
                <p className={`font-body text-sm mt-1 ${isDark ? "text-white/90" : "text-slate-900/90"}`}>Your submitted data remains account-bound and access controlled.</p>
              </div>
              <div className={`rounded-2xl px-4 py-2.5 backdrop-blur-[1px] ${isDark ? "bg-white/12 border border-white/10" : "bg-white/80 border border-black/12"}`}>
                <p className={`font-label text-xs font-semibold uppercase tracking-[0.14em] ${isDark ? "text-white/70" : "text-slate-700"}`}>Built for clarity</p>
                <p className={`font-body text-sm mt-1 ${isDark ? "text-white/90" : "text-slate-900/90"}`}>Structured legal summaries designed for practical consultation prep.</p>
              </div>
            </div>
          </section>

          <section className="p-7 sm:p-8 bg-surface">
            <div className="mb-5">
              <h3 className="font-headline text-2xl font-bold text-text-primary">
                {mode === "signup" ? "Create account" : "Sign in"}
              </h3>
            </div>

            <div className="relative mb-5 grid grid-cols-2 rounded-xl border border-border p-1 bg-surface ui-border-highlight transition-all duration-300">
              <div
                className="absolute top-1 bottom-1 rounded-lg bg-primary transition-all duration-200"
                style={{
                  width: "calc(50% - 4px)",
                  left: mode === "login" ? "4px" : "calc(50% + 0px)",
                }}
              />

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setSearchParams({});
                  setError("");
                }}
                className={`relative z-10 rounded-lg py-2.5 font-label text-sm font-bold transition-colors ${
                  mode === "login" ? "text-white" : "text-text-secondary"
                }`}
              >
                Sign in
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setSearchParams({ tab: "signup" });
                  setError("");
                }}
                className={`relative z-10 rounded-lg py-2.5 font-label text-sm font-bold transition-colors ${
                  mode === "signup" ? "text-white" : "text-text-secondary"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === "signup" && (
                <div>
                  <label className="block mb-1.5 font-label text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Enter your full name"
                    disabled={loading}
                    className="w-full app-input ui-border-highlight px-4 py-3 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block mb-1.5 font-label text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                  Email address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="name@example.com"
                  disabled={loading}
                  className="w-full app-input ui-border-highlight px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-label text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Enter password"
                  disabled={loading}
                  className="w-full app-input ui-border-highlight px-4 py-3 text-sm"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-300/60 bg-red-50/70 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full app-button-primary ui-button-enhance ui-button-shine py-3 font-label font-bold text-sm disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {loading ? "Authenticating..." : mode === "signup" ? "Create account" : "Sign in"}
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface px-3 font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                    Or continue with
                  </span>
                </div>
              </div>

              {googleConfigured ? (
                <div className={`${loading ? "pointer-events-none opacity-70" : ""} flex justify-center`}>
                  <div ref={googleButtonRef} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setError("Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID in client/.env and restart the client.");
                  }}
                  className="w-full app-button-secondary ui-button-enhance py-3 text-sm font-label font-semibold"
                >
                  Continue with Google
                </button>
              )}

              {googleConfigured && !googleAvailable && (
                <p className="text-center font-body text-xs text-text-secondary">Google sign-in is loading...</p>
              )}
            </form>

            <p className="mt-4 text-center font-body text-sm text-text-secondary">
              {mode === "login" ? "New here? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setSearchParams(mode === "login" ? { tab: "signup" } : {});
                  setError("");
                }}
                className="font-semibold text-primary hover:underline"
              >
                {mode === "login" ? "Create account" : "Sign in"}
              </button>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
