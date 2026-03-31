export async function submitAnalysis({ text, file, category, token }) {
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
