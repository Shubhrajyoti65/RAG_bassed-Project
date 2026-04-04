/**
 * cloudinaryService.js
 * Isolated Cloudinary abstraction — all cloud storage calls go through here.
 * Uses Cloudinary v2 SDK with resource_type: "raw" for PDF uploads.
 */

const cloudinary = require("cloudinary").v2;
const path = require("path");

// Configure once using env vars (loaded by dotenv in index.js before this runs)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a PDF file to Cloudinary under the cases/ folder.
 *
 * @param {string} filePath   Absolute path to the PDF on disk.
 * @param {string} [publicId] Optional explicit public_id (without extension).
 *                            Defaults to the filename stem.
 * @returns {Promise<string>} The secure_url of the uploaded file.
 */
async function uploadFile(filePath, publicId) {
  const stem = path.basename(filePath, path.extname(filePath));
  const safeId = (publicId || stem)
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-.]/g, "")
    .slice(0, 200);

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    folder: "cases",
    public_id: safeId,
    overwrite: false,   // skip re-upload if already exists
    use_filename: false,
  });

  return result.secure_url;
}

/**
 * Check whether a file already exists in Cloudinary.
 *
 * @param {string} publicId  Full public_id e.g. "cases/Balram_Another_..."
 * @returns {Promise<string|null>} secure_url if found, null otherwise.
 */
async function getExistingUrl(publicId) {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: "raw",
    });
    return result.secure_url || null;
  } catch {
    return null;
  }
}

module.exports = { uploadFile, getExistingUrl };
