import API_BASE from "./config";

// Loads the user's complete history of case analyses from the server
export async function fetchHistory(token) {
  const response = await fetch(`${API_BASE}/api/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Could not load history.");
  }

  return payload.history || [];
}
