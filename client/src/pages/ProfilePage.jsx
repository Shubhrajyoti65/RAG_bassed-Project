import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateCurrentUser } from "../api/authApi";

const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024;

function getAvatarLabel(name) {
  return String(name || "U").trim().charAt(0).toUpperCase() || "U";
}

export default function ProfilePage({ user, token, onUserUpdated }) {
  const [name, setName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [gender, setGender] = useState(user?.gender || user?.sex || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setAvatarUrl(user?.avatarUrl || "");
    setGender(user?.gender || user?.sex || "");
  }, [user]);

  async function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file only.");
      return;
    }

    if (file.size > MAX_AVATAR_FILE_SIZE) {
      setError("Image is too large. Maximum size is 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(String(reader.result || ""));
      setSuccess("Photo selected. Click Save Changes to update your profile.");
    };
    reader.onerror = () => {
      setError("Could not read image file. Please try another file.");
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const safeName = name.trim();
    if (safeName.length < 2) {
      setError("Full name must be at least 2 characters long.");
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await updateCurrentUser(token, {
        name: safeName,
        avatarUrl: avatarUrl.trim(),
        gender,
      });

      onUserUpdated(updatedUser);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <section className="app-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-label text-xs font-bold tracking-[0.22em] uppercase text-primary">Account</p>
            <h1 className="mt-2 font-headline text-3xl sm:text-4xl font-bold text-text-primary">Profile Settings</h1>
            <p className="font-body text-text-secondary mt-2">Update your display name and avatar used across your dashboard and header.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/profile" className="app-button-primary px-4 py-2.5 font-label text-sm font-semibold">Profile</Link>
            <Link to="/contact-us" className="app-button-secondary px-4 py-2.5 font-label text-sm font-semibold">Contact Us</Link>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="app-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name || "User avatar"}
              className="h-20 w-20 rounded-full object-cover border border-border"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="inline-flex h-20 w-20 rounded-full items-center justify-center gradient-primary-bg text-white font-headline text-3xl">
              {getAvatarLabel(name)}
            </span>
          )}

          <div>
            <p className="font-label text-sm font-bold text-text-primary">{name || "User"}</p>
            <p className="font-body text-sm text-text-secondary break-all">{user?.email || "No email"}</p>
            <p className="font-body text-xs text-text-secondary mt-1">Gender: {gender ? gender.replaceAll("_", " ") : "Not set"}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block mb-1.5 font-label text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
              Full Name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full app-input px-4 py-3 text-sm"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block mb-1.5 font-label text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
              Gender
            </label>
            <select
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              className="w-full app-input px-4 py-3 text-sm"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1.5 font-label text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
              Email ID
            </label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full app-input px-4 py-3 text-sm opacity-80 cursor-not-allowed"
            />
          </div>

          <div className="sm:col-span-2 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label className="block mb-1.5 font-label text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                Upload Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="w-full app-input px-4 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:font-label file:text-xs file:font-semibold file:text-primary"
              />
            </div>

            <button
              type="button"
              onClick={() => setAvatarUrl("")}
              className="app-button-secondary px-4 py-2.5 font-label text-sm font-semibold h-fit sm:mb-px"
            >
              Remove photo
            </button>

            <p className="font-body text-xs text-text-secondary sm:col-span-2">You can upload JPG, PNG, WEBP, or GIF images up to 2MB.</p>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-300/60 bg-red-50/80 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-300/60 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 app-button-primary px-6 py-3.5 font-label font-semibold text-sm disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
