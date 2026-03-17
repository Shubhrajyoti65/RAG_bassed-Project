import { useEffect, useState } from "react";
import Header from "./components/Header";
import Disclaimer from "./components/Disclaimer";
import InputPanel from "./components/InputPanel";
import ResultsPanel from "./components/ResultsPanel";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorAlert from "./components/ErrorAlert";
import AuthPanel from "./components/AuthPanel";
import HistoryPanel from "./components/HistoryPanel";
import { useAnalysis } from "./hooks/useAnalysis";
import { fetchHistory } from "./api/historyApi";
import { getCurrentUser, loginUser, signupUser } from "./api/authApi";

const AUTH_STORAGE_KEY = "nyaya_auth";
const THEME_STORAGE_KEY = "nyaya_theme";

function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isDark, setIsDark] = useState(false);

  const { result, loading, error, analyze, reset, loadSavedResult } = useAnalysis();

  useEffect(() => {
    const cached = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!cached) {
      return;
    }

    try {
      const parsed = JSON.parse(cached);
      if (!parsed?.token) {
        return;
      }

      setToken(parsed.token);
      hydrateSession(parsed.token);
    } catch (_err) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (cachedTheme === "dark") {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  async function hydrateSession(sessionToken) {
    setAuthLoading(true);
    try {
      const currentUser = await getCurrentUser(sessionToken);
      setUser(currentUser);
      await loadUserHistory(sessionToken);
    } catch (_err) {
      clearSession();
    } finally {
      setAuthLoading(false);
    }
  }

  function persistSession(sessionToken, sessionUser) {
    setToken(sessionToken);
    setUser(sessionUser);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: sessionToken, user: sessionUser })
    );
  }

  function clearSession() {
    setToken("");
    setUser(null);
    setHistory([]);
    reset();
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  async function loadUserHistory(sessionToken = token) {
    if (!sessionToken) {
      setHistory([]);
      return;
    }

    const list = await fetchHistory(sessionToken);
    setHistory(list);
  }

  async function handleLogin({ email, password }) {
    setAuthLoading(true);
    try {
      const payload = await loginUser({ email, password });
      persistSession(payload.token, payload.user);
      await loadUserHistory(payload.token);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignup({ name, email, password }) {
    setAuthLoading(true);
    try {
      const payload = await signupUser({ name, email, password });
      persistSession(payload.token, payload.user);
      await loadUserHistory(payload.token);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleAnalyze(payload) {
    await analyze({ ...payload, token });
    await loadUserHistory();
  }

  function handleHistorySelect(item) {
    loadSavedResult(item.analysis);
  }

  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      <Header user={user} onLogout={clearSession} isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <AuthPanel
            onLogin={handleLogin}
            onSignup={handleSignup}
            loading={authLoading}
            isDark={isDark}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
              <InputPanel onAnalyze={handleAnalyze} loading={loading} isDark={isDark} />
              <HistoryPanel history={history} onSelect={handleHistorySelect} isDark={isDark} />
            </div>

            <div className="space-y-6">
              {loading && <LoadingSpinner isDark={isDark} />}
              {error && <ErrorAlert message={error} onDismiss={reset} isDark={isDark} />}
              {result && <ResultsPanel result={result} isDark={isDark} />}

              {!loading && !error && !result && (
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 p-8 text-center">
                  <svg
                    className="w-16 h-16 text-gray-300 dark:text-slate-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-500 dark:text-slate-300 mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-slate-400 max-w-sm mx-auto">
                    Enter a domestic violence case description or upload a PDF
                    document to get AI-powered analysis with similar Allahabad
                    High Court judgments.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <Disclaimer isDark={isDark} />
      </div>

      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400 dark:text-slate-400 text-center">
            NyayaSahayak &mdash; AI-Powered Legal Case Analysis Tool |
            Allahabad High Court Domestic Violence Cases | For Educational
            Purposes Only
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;
