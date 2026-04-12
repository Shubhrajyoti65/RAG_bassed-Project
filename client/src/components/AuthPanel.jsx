import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  password: "",
  resetToken: "",
  newPassword: "",
  confirmPassword: "",
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const AUTH_BG_FILES = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8 (2).png",
  "9 (2).png",
];

// Returns the full public path for an authentication background image
function getAuthBackgroundPath(fileName) {
  return `/BGS/${encodeURIComponent(fileName)}`;
}

// Unified component for user login and signup with Google OAuth support
export default function AuthPanel({ onLogin, onSignup, onGoogleAuth, onForgotPassword, onResetPassword, loading, isDark }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get("tab") === "signup" ? "signup" : "login");
  const [flow, setFlow] = useState(() => {
    const tab = searchParams.get("tab");
    if (tab === "forgot") return "forgot";
    if (tab === "reset") return "reset";
    return "auth";
  });
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    if (tab === "forgot") {
      setFlow("forgot");
    } else if (tab === "reset") {
      setFlow("reset");
    } else {
      setFlow("auth");
    }
    setMode(tab === "signup" ? "signup" : "login");
    setError("");
    setSuccess("");
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

// Updates a specific field in the signup/login form state
  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

// Submits the authentication form to the parent component
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (flow === "forgot") {
      if (!form.email.trim()) {
        setError("Email is required.");
        return;
      }

      try {
        const payload = await onForgotPassword({ email: form.email.trim() });
        setSuccess(payload?.message || "If your account exists, a reset OTP has been sent to your email.");
        setSearchParams({ tab: "reset" });
        setForm((prev) => ({
          ...prev,
          password: "",
          resetToken: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } catch (err) {
        setError(err.message || "Could not request password reset.");
      }
      return;
    }

    if (flow === "reset") {
      const token = form.resetToken.trim();
      if (!token) {
        setError("Reset OTP is required.");
        return;
      }

      if (!form.newPassword) {
        setError("New password is required.");
        return;
      }

      if (form.newPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      try {
        const payload = await onResetPassword({ token, newPassword: form.newPassword });
        setSuccess(payload?.message || "Password has been reset. Please sign in.");
        setForm(initialForm);
        setSearchParams({});
      } catch (err) {
        setError(err.message || "Could not reset password.");
      }
      return;
    }

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
                {flow === "forgot" ? "Forgot password" : flow === "reset" ? "Reset password" : mode === "signup" ? "Create account" : "Sign in"}
              </h3>
            </div>

            {flow === "auth" ? (
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
                    setSuccess("");
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
                    setSuccess("");
                  }}
                  className={`relative z-10 rounded-lg py-2.5 font-label text-sm font-bold transition-colors ${
                    mode === "signup" ? "text-white" : "text-text-secondary"
                  }`}
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="mb-5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setSearchParams({});
                    setError("");
                    setSuccess("");
                  }}
                  className="font-label text-sm font-semibold text-primary hover:underline"
                >
                  Back to sign in
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {flow === "auth" && mode === "signup" && (
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

              {flow === "auth" ? (
                <>
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

                  {mode === "login" && (
                    <div className="-mt-1 text-right">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setSearchParams({ tab: "forgot" });
                          setError("");
                          setSuccess("");
                        }}
                        className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </>
              ) : null}

              {flow === "reset" && (
                <>
                  <div>
                    <label className="block mb-1.5 font-label text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                      Reset OTP
                    </label>
                    <input
                      type="text"
                      value={form.resetToken}
                      onChange={(event) => updateField("resetToken", event.target.value)}
                      placeholder="Enter 6-digit OTP from email"
                      disabled={loading}
                      className="w-full app-input ui-border-highlight px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 font-label text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                      New password
                    </label>
                    <input
                      type="password"
                      value={form.newPassword}
                      onChange={(event) => updateField("newPassword", event.target.value)}
                      placeholder="Enter new password"
                      disabled={loading}
                      className="w-full app-input ui-border-highlight px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 font-label text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(event) => updateField("confirmPassword", event.target.value)}
                      placeholder="Re-enter new password"
                      disabled={loading}
                      className="w-full app-input ui-border-highlight px-4 py-3 text-sm"
                    />
                  </div>
                </>
              )}

              {success && (
                <div className="rounded-xl border border-green-300/60 bg-green-50/80 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

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
                {loading
                  ? flow === "forgot"
                    ? "Sending OTP..."
                    : flow === "reset"
                      ? "Resetting password..."
                      : "Authenticating..."
                  : flow === "forgot"
                    ? "Send reset OTP"
                    : flow === "reset"
                      ? "Reset password"
                      : mode === "signup"
                        ? "Create account"
                        : "Sign in"}
              </button>

              {flow === "auth" && (
                <>
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
                </>
              )}
            </form>

            {flow === "auth" ? (
              <p className="mt-4 text-center font-body text-sm text-text-secondary">
                {mode === "login" ? "New here? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setSearchParams(mode === "login" ? { tab: "signup" } : {});
                    setError("");
                    setSuccess("");
                  }}
                  className="font-semibold text-primary hover:underline"
                >
                  {mode === "login" ? "Create account" : "Sign in"}
                </button>
              </p>
            ) : (
              <p className="mt-4 text-center font-body text-sm text-text-secondary">
                Remembered your password?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setSearchParams({});
                    setError("");
                    setSuccess("");
                  }}
                  className="font-semibold text-primary hover:underline"
                >
                  Go to sign in
                </button>
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
