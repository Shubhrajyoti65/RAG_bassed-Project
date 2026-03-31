<<<<<<< HEAD
export async function submitAnalysis({ text, file, category, token }) {
=======
// Sends case text or a PDF file to the backend for automated legal analysis
export async function submitAnalysis({ text, file, token }) {
>>>>>>> 2e202d63773fc13c296e892ea7239941b089be3d
  let response;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    if (category) {
      formData.append("category", category);
    }
    response = await fetch("/api/analyze", {
      method: "POST",
      headers: authHeaders,
      body: formData,
    });
  } else {
    response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ text, category }),
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  return response.json();
}
