import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthPanel from "./components/AuthPanel";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ContactUsPage from "./pages/ContactUsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { useAnalysis } from "./hooks/useAnalysis";
import { fetchHistory } from "./api/historyApi";
import { getCurrentUser, googleAuthUser, loginUser, signupUser } from "./api/authApi";

const AUTH_STORAGE_KEY = "nyaya_auth";
const THEME_STORAGE_KEY = "nyaya_theme";

// Root component that handles authentication state, routing, and global theme configuration
function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [quoteSeed, setQuoteSeed] = useState(Date.now());
  const [isDark, setIsDark] = useState(false);

  const { result, loading, error, analysisTimeMs, analyze, reset, loadSavedResult } = useAnalysis();
  const navigate = useNavigate();

  useEffect(() => {
    const cached = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!cached) {
      return;
    }

    let isActive = true;

    async function restoreSession() {
      try {
        const parsed = JSON.parse(cached);
        if (!parsed?.token) {
          return;
        }

        setAuthLoading(true);
        setToken(parsed.token);
        setQuoteSeed(Number(parsed.quoteSeed) || Date.now());

        const currentUser = await getCurrentUser(parsed.token);
        if (!isActive) {
          return;
        }

        setUser(currentUser);
        const list = await fetchHistory(parsed.token);
        if (!isActive) {
          return;
        }

        setHistory(list);
      } catch {
        if (!isActive) {
          return;
        }

        setToken("");
        setUser(null);
        setHistory([]);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        if (isActive) {
          setAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (cachedTheme === "dark") {
      setIsDark(true);
      return;
    }

    if (!cachedTheme && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

// Saves the authentication token and user data to local storage and application state
  function persistSession(sessionToken, sessionUser) {
    const nextQuoteSeed = Date.now();
    setToken(sessionToken);
    setUser(sessionUser);
    setQuoteSeed(nextQuoteSeed);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: sessionToken, user: sessionUser, quoteSeed: nextQuoteSeed })
    );
  }

// Updates the user data stored in the local storage session
  function updateStoredSession(nextUser, sessionToken = token) {
    if (!sessionToken) {
      return;
    }

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: sessionToken, user: nextUser, quoteSeed })
    );
  }

// Handles state update when user profile is modified
  function handleUserUpdated(nextUser) {
    setUser(nextUser);
    updateStoredSession(nextUser);
  }

// Clears all session data and logs the user out
  function clearSession() {
    setToken("");
    setUser(null);
    setHistory([]);
    reset();
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

// Fetches the analysis history for the current user from the server
  async function loadUserHistory(sessionToken = token) {
    if (!sessionToken) {
      setHistory([]);
      return;
    }

    const list = await fetchHistory(sessionToken);
    setHistory(list);
  }

// Processes the user login request
  async function handleLogin({ email, password }) {
    setAuthLoading(true);
    try {
      const payload = await loginUser({ email, password });
      persistSession(payload.token, payload.user);
      await loadUserHistory(payload.token);
      navigate("/dashboard", { replace: true });
    } finally {
      setAuthLoading(false);
    }
  }

// Processes the user registration request
  async function handleSignup({ name, email, password }) {
    setAuthLoading(true);
    try {
      const payload = await signupUser({ name, email, password });
      persistSession(payload.token, payload.user);
      await loadUserHistory(payload.token);
      navigate("/dashboard", { replace: true });
    } finally {
      setAuthLoading(false);
    }
  }

// Handles authentication via Google OAuth
  async function handleGoogleAuth(idToken) {
    setAuthLoading(true);
    try {
      const payload = await googleAuthUser({ idToken });
      persistSession(payload.token, payload.user);
      await loadUserHistory(payload.token);
      navigate("/dashboard", { replace: true });
    } finally {
      setAuthLoading(false);
    }
  }

// Loads a specific history item for detailed viewing in the analysis panel
  function handleHistorySelect(item) {
    loadSavedResult(item.analysis);
    navigate("/analyze");
  }

// Toggles between light and dark visual themes
  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  return (
    <Layout user={user} onLogout={clearSession} isDark={isDark} onToggleTheme={toggleTheme} onNewAnalysis={reset}>
        <Routes>
          <Route path="/" element={<Home isDark={isDark} />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" replace /> : (
              <AuthPanel
                onLogin={handleLogin}
                onSignup={handleSignup}
                onGoogleAuth={handleGoogleAuth}
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
                result={result} 
                loading={loading} 
                error={error} 
                analysisTimeMs={analysisTimeMs} 
                analyze={analyze} 
                reset={reset} 
              />
            ) : <Navigate to="/login" state={{ from: "/analyze" }} replace />
          } />
          <Route path="/dashboard" element={
            user ? (
              <Dashboard user={user} quoteSeed={quoteSeed} history={history} onSelect={handleHistorySelect} />
            ) : <Navigate to="/login" state={{ from: "/dashboard" }} replace />
          } />
          <Route path="/history" element={
            user ? (
              <HistoryPage history={history} onSelect={handleHistorySelect} />
            ) : <Navigate to="/login" state={{ from: "/history" }} replace />
          } />
          <Route path="/profile" element={
            user ? (
              <ProfilePage user={user} token={token} onUserUpdated={handleUserUpdated} />
            ) : <Navigate to="/login" state={{ from: "/profile" }} replace />
          } />
          <Route path="/contact-us" element={<ContactUsPage user={user} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Layout>
  );
}

export default App;


