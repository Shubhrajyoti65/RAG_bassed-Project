import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function AuthPanel({ onLogin, onSignup, onGoogleAuth, loading, isDark }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get("tab") === "signup" ? "signup" : "login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const googleButtonRef = useRef(null);
  const googleAuthRef = useRef(onGoogleAuth);
  const googleConfigured = Boolean(GOOGLE_CLIENT_ID);

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
    <div className="max-w-6xl w-full mx-auto animate-fade-in">
      <div className="app-card ui-border-highlight overflow-hidden p-0">
        <div className="grid md:grid-cols-2">
          <section className="gradient-primary-bg px-8 py-10 sm:px-10 sm:py-11 text-white">
            <span className="inline-flex items-center rounded-full bg-white/12 px-3.5 py-1 font-label text-[11px] font-bold tracking-[0.16em] uppercase text-white/85">
              Secure access
            </span>

            <h2 className="mt-5 font-headline text-3xl sm:text-4xl font-bold leading-tight">
              {mode === "signup" ? "Create your legal workspace" : "Welcome back to your chambers"}
            </h2>

            <p className="mt-4 font-body text-white/85 leading-relaxed">
              {mode === "signup"
                ? "Register to save analyses, track precedent research, and continue your workflow across sessions."
                : "Sign in to resume your ongoing analysis and review your prior case summaries."}
            </p>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Privacy first</p>
                <p className="font-body text-sm text-white/90 mt-1">Your submitted data remains account-bound and access controlled.</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Built for clarity</p>
                <p className="font-body text-sm text-white/90 mt-1">Structured legal summaries designed for practical consultation prep.</p>
              </div>
            </div>
          </section>

          <section className="p-8 sm:p-10 bg-surface">
            <div className="mb-7">
              <h3 className="font-headline text-2xl font-bold text-text-primary">
                {mode === "signup" ? "Create account" : "Sign in"}
              </h3>
              <p className="font-body text-sm text-text-secondary mt-1.5">
                {mode === "signup" ? "Start with your basic details." : "Use your registered email and password."}
              </p>
            </div>

            <div className="relative mb-6 grid grid-cols-2 rounded-xl border border-border p-1 bg-surface ui-border-highlight transition-all duration-300">
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

            <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full app-button-primary ui-button-enhance ui-button-shine py-3.5 font-label font-bold text-sm disabled:opacity-55 disabled:cursor-not-allowed"
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

            <p className="mt-6 text-center font-body text-sm text-text-secondary">
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
