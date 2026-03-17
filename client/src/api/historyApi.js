export async function fetchHistory(token) {
  const response = await fetch("/api/history", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Could not load history.");
  }

  return payload.history || [];
}
