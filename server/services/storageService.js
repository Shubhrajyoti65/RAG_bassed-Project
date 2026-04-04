const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const config = require("../config");

let cloudinaryConfigured = false;

function normalizePublicId(value) {
  return String(value || "")
    .trim()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_ ]+/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 180);
}

// Configures Cloudinary lazily to avoid hard failures during unrelated JSON operations.
function ensureCloudinaryConfigured() {
  if (cloudinaryConfigured) {
    return;
  }

  if (
    !config.CLOUDINARY_CLOUD_NAME ||
    !config.CLOUDINARY_API_KEY ||
    !config.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env"
    );
  }

  cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true,
  });
  cloudinaryConfigured = true;
}

// Ensures a directory exists and creates an empty JSON file if it doesn't
function ensureJsonFile(filePath, defaultValue) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

// Reads and parses a JSON file from disk
function readJson(filePath, defaultValue) {
  ensureJsonFile(filePath, defaultValue);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// Writes data to a JSON file on disk
function writeJson(filePath, value) {
  ensureJsonFile(filePath, []);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function extractCloudinaryRawPublicId(fileUrl) {
  try {
    const parsed = new URL(String(fileUrl || ""));

    // Handles signed API download URLs like /v1_1/<cloud>/raw/download?public_id=...
    if (parsed.pathname.includes("/raw/download")) {
      const queryPublicId = parsed.searchParams.get("public_id");
      return queryPublicId ? decodeURIComponent(queryPublicId) : null;
    }

    const marker = "/raw/upload/";
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) {
      return null;
    }

    let tail = decodeURIComponent(parsed.pathname.slice(index + marker.length));
    tail = tail.replace(/^v\d+\//, "");
    return tail || null;
  } catch {
    return null;
  }
}

// Returns a signed URL for raw PDF delivery on Cloudinary accounts that block unsigned access.
function toDeliverablePdfUrl(fileUrl, ttlSeconds = 3600) {
  if (!fileUrl) {
    return null;
  }

  const rawPublicId = extractCloudinaryRawPublicId(fileUrl);
  if (!rawPublicId) {
    return fileUrl;
  }

  try {
    ensureCloudinaryConfigured();

    const format =
      path.extname(rawPublicId).replace(".", "").trim().toLowerCase() || "pdf";

    return cloudinary.utils.private_download_url(rawPublicId, format, {
      resource_type: "raw",
      type: "upload",
      expires_at: Math.floor(Date.now() / 1000) + Number(ttlSeconds || 3600),
    });
  } catch {
    return fileUrl;
  }
}

// Uploads a local file (PDF) to Cloudinary and returns a secure public URL.
async function uploadFile(filePath) {
  ensureCloudinaryConfigured();

  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext !== ".pdf") {
    throw new Error(
      `Only PDF uploads are supported. Received: ${ext || "unknown"}`
    );
  }

  const stem = path.basename(filePath, ext);
  const dirHint = path.dirname(filePath).split(path.sep).slice(-2).join("_");
  const publicId = normalizePublicId(`${dirHint}_${stem}`);
  if (!publicId) {
    throw new Error(
      `Unable to derive Cloudinary public_id from file: ${filePath}`
    );
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: config.CLOUDINARY_CASES_FOLDER,
      public_id: publicId,
      overwrite: false,
      use_filename: false,
      unique_filename: false,
    });

    if (!result?.secure_url) {
      throw new Error("Cloudinary upload succeeded without secure_url");
    }

    return result.secure_url;
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();

    // Duplicate uploads are expected when rerunning migration scripts.
    if (message.includes("already exists") || message.includes("409")) {
      try {
        const existing = await cloudinary.api.resource(
          `${config.CLOUDINARY_CASES_FOLDER}/${publicId}`,
          { resource_type: "raw" }
        );
        if (existing?.secure_url) {
          return existing.secure_url;
        }
      } catch {
        // Ignore lookup errors and fall through to throw the original upload error.
      }
    }

    throw new Error(
      `Cloudinary upload failed for ${path.basename(filePath)}: ${
        error.message
      }`
    );
  }
}

module.exports = {
  ensureJsonFile,
  readJson,
  writeJson,
  uploadFile,
  toDeliverablePdfUrl,
};
