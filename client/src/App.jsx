import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Disclaimer from "./components/Disclaimer";
import AuthPanel from "./components/AuthPanel";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Dashboard from "./pages/Dashboard";
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

  const { result, loading, error, analysisTimeMs, analyze, reset, loadSavedResult } = useAnalysis();
  const navigate = useNavigate();
  const location = useLocation();

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
      const from = location.state?.from || "/analyze";
      navigate(from, { replace: true });
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
      const from = location.state?.from || "/analyze";
      navigate(from, { replace: true });
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
    navigate("/analyze");
  }

  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  return (
    <Layout user={user} onLogout={clearSession} isDark={isDark} onToggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Home isDark={isDark} />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={
            user ? <Navigate to="/analyze" replace /> : (
              <AuthPanel
                onLogin={handleLogin}
                onSignup={handleSignup}
                loading={authLoading}
                isDark={isDark}
              />
            )
          } />
          <Route path="/analyze" element={
            user ? (
              <Analyze 
                user={user} 
                token={token} 
                history={history} 
                loadUserHistory={loadUserHistory} 
                isDark={isDark} 
                result={result} 
                loading={loading} 
                error={error} 
                analysisTimeMs={analysisTimeMs} 
                analyze={analyze} 
                reset={reset} 
                loadSavedResult={loadSavedResult} 
              />
            ) : <Navigate to="/login" state={{ from: "/analyze" }} replace />
          } />
          <Route path="/dashboard" element={
            user ? (
              <Dashboard history={history} onSelect={handleHistorySelect} isDark={isDark} />
            ) : <Navigate to="/login" state={{ from: "/dashboard" }} replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Layout>
  );
}

export default App;
