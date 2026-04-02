// Registers a new user with name, email, and password
export async function signupUser({ name, email, password }) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Signup failed (${response.status})`);
  }

  return payload;
}

// Authenticates an existing user and returns a session token
export async function loginUser({ email, password }) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Login failed (${response.status})`);
  }

  return payload;
}

// Authenticates a user via a Google OAuth ID token
export async function googleAuthUser({ idToken }) {
  const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload.error || `Google login failed (${response.status})`
    );
  }

  return payload;
}

// Requests a password reset OTP for an existing account email
export async function requestPasswordReset({ email }) {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload.error || `Password reset OTP request failed (${response.status})`
    );
  }

  return payload;
}

// Resets account password using a valid reset OTP
export async function resetPasswordWithToken({ token, newPassword }) {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp: token, newPassword }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload.error || `Password reset failed (${response.status})`
    );
  }

  return payload;
}

// Retrieves the logged-in user's profile information using a valid token
export async function getCurrentUser(token) {
  const response = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Session expired. Please login again.");
  }

  return payload.user;
}

// Updates the current user's profile details including name, avatar, and gender
export async function updateCurrentUser(token, { name, avatarUrl, gender }) {
  const response = await fetch("/api/auth/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, avatarUrl, gender, sex: gender }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Could not update profile.");
  }

  return payload.user;
}
