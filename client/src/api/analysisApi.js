// Sends case text or a PDF file to the backend for automated legal analysis
export async function submitAnalysis({ text, file, token }) {
  let response;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    response = await fetch("/api/analyze", {
      method: "POST",
      headers: authHeaders,
      body: formData,
    });
  } else {
    response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ text }),
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  return response.json();
}
