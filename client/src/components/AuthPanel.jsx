import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export default function AuthPanel({ onLogin, onSignup, loading }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

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
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 p-6">
      <div className="flex gap-2 mb-5 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "login"
              ? "bg-indigo-600 text-white"
              : "text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white"
          }`}
          disabled={loading}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "signup"
              ? "bg-indigo-600 text-white"
              : "text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white"
          }`}
          disabled={loading}
        >
          Sign Up
        </button>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-1">
        {mode === "signup" ? "Create account" : "Welcome back"}
      </h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">
        {mode === "signup"
          ? "Create your account to analyze and save your case history."
          : "Login to access your saved legal analysis history."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your full name"
              disabled={loading}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="name@example.com"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="At least 6 characters"
            disabled={loading}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg py-2.5 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
}
