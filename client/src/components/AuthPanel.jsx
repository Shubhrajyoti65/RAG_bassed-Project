import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export default function AuthPanel({ onLogin, onSignup, loading }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get("tab") === "signup" ? "signup" : "login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    const tab = searchParams.get("tab");
    setMode(tab === "signup" ? "signup" : "login");
    setError("");
  }, [searchParams]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
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
        await onSignup({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      } else {
        await onLogin({ email: form.email.trim(), password: form.password });
      }
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    }
  }

  return (
    <div className="max-w-5xl w-full mx-auto animate-fade-in">
      <div className="grid md:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden shadow-xl border border-light-border dark:border-dark-border">
        {/* Left decorative panel — always dark themed */}
        <div className="relative p-10 flex flex-col justify-between overflow-hidden gradient-hero-bg min-h-[480px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <span className="font-headline text-lg font-bold text-white">Nyaay Sahayak</span>
            </div>

            <h2 className="font-headline text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {mode === "signup" ? "Enter the Digital Chambers." : "Access Chambers"}
            </h2>
            <p className="font-body text-white/75 text-base leading-relaxed">
              {mode === "signup"
                ? "Join the next generation of legal practitioners in a secure, transparent, and high-performance digital environment."
                : "Enter your credentials to manage your digital case files."}
            </p>
          </div>

          <div className="relative z-10 space-y-3 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <div>
                <h4 className="font-label text-sm font-bold text-white">Legal Tech</h4>
                <p className="font-body text-xs text-white/60">Advanced analytics for every case file.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div>
                <h4 className="font-label text-sm font-bold text-white">Secure Vault</h4>
                <p className="font-body text-xs text-white/60">End-to-end encrypted document storage.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="bg-light-card dark:bg-dark-card p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="font-headline text-2xl font-bold text-light-text dark:text-dark-text">
              {mode === "signup" ? "Create Account" : "Welcome Back"}
            </h3>
            <p className="font-body text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
              {mode === "signup" ? "Join Nyaay Sahayak today." : "Sign in to your digital chambers."}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="relative flex mb-8 bg-light-muted dark:bg-dark-surface rounded-xl p-1 border border-light-border dark:border-dark-border">
            {/* Sliding indicator */}
            <div
              className="absolute top-1 bottom-1 rounded-lg gradient-primary-bg shadow-md transition-all duration-300 ease-in-out"
              style={{
                width: 'calc(50% - 4px)',
                left: mode === "login" ? '4px' : 'calc(50% + 0px)',
              }}
            />
            <button type="button" onClick={() => { setSearchParams({}); setError(""); }}
              className={`relative z-10 flex-1 py-2.5 rounded-lg font-label text-sm font-bold transition-all duration-200 ${mode === "login"
                ? "text-white"
                : "text-light-text-muted dark:text-dark-text-muted hover:text-light-text dark:hover:text-dark-text"
              }`} disabled={loading}>
              Sign In
            </button>
            <button type="button" onClick={() => { setSearchParams({ tab: "signup" }); setError(""); }}
              className={`relative z-10 flex-1 py-2.5 rounded-lg font-label text-sm font-bold transition-all duration-200 ${mode === "signup"
                ? "text-white"
                : "text-light-text-muted dark:text-dark-text-muted hover:text-light-text dark:hover:text-dark-text"
              }`} disabled={loading}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label className="block font-label text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-2 ml-1 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-light-text-muted dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)}
                    className="w-full pl-10 bg-light-muted dark:bg-dark-surface text-light-text dark:text-dark-text rounded-xl px-4 py-3 font-body text-sm border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 placeholder:text-light-text-muted/60"
                    placeholder="John Doe" disabled={loading} />
                </div>
              </div>
            )}

            <div>
              <label className="block font-label text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-2 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-light-text-muted dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)}
                  className="w-full pl-10 bg-light-muted dark:bg-dark-surface text-light-text dark:text-dark-text rounded-xl px-4 py-3 font-body text-sm border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 placeholder:text-light-text-muted/60"
                  placeholder="name@example.com" disabled={loading} />
              </div>
            </div>

            <div>
              <label className="block font-label text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-2 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-light-text-muted dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)}
                  className="w-full pl-10 bg-light-muted dark:bg-dark-surface text-light-text dark:text-dark-text rounded-xl px-4 py-3 font-body text-sm border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 placeholder:text-light-text-muted/60"
                  placeholder="••••••••" disabled={loading} />
              </div>
            </div>

            {mode === "login" && (
              <div className="text-right">
                <a href="#" className="font-label text-xs font-medium text-primary dark:text-primary-dark hover:underline">Forgot Password?</a>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 text-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-body font-medium text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full gradient-primary-bg text-white font-bold font-label rounded-xl py-3.5 mt-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg><span>Authenticating...</span></>
              ) : mode === "signup" ? <span>Create Account</span> : <span>Access Chambers</span>}
            </button>
          </form>

          <p className="font-body text-sm text-light-text-secondary dark:text-dark-text-secondary mt-6 text-center">
            {mode === "login" ? (
              <>New to the digital chambers?{" "}<button type="button" onClick={() => { setSearchParams({ tab: "signup" }); setError(""); }} className="font-semibold text-primary dark:text-primary-dark hover:underline">Request Access</button></>
            ) : (
              <>Already have an account?{" "}<button type="button" onClick={() => { setSearchParams({}); setError(""); }} className="font-semibold text-primary dark:text-primary-dark hover:underline">Login to Chambers</button></>
            )}
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-light-border dark:border-dark-border">
            <a href="#" className="font-label text-[11px] text-light-text-muted dark:text-dark-text-muted hover:text-primary dark:hover:text-primary-dark transition-colors">Privacy Policy</a>
            <span className="text-light-border dark:text-dark-border">·</span>
            <a href="#" className="font-label text-[11px] text-light-text-muted dark:text-dark-text-muted hover:text-primary dark:hover:text-primary-dark transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}
