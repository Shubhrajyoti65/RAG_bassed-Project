// Central API base URL — empty in development (Vite proxy handles it),
// set to the Railway backend URL in production via VITE_API_BASE env var.
const API_BASE = import.meta.env.VITE_API_BASE || "";

export default API_BASE;
