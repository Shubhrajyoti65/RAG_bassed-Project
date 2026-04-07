const multer = require("multer");

const storage = multer.memoryStorage();
const allowedPdfMimeTypes = new Set([
  "application/pdf",
  "application/x-pdf",
  "application/acrobat",
  "applications/vnd.pdf",
  "text/pdf",
]);

const allowedAudioMimeTypes = new Set([
  "audio/webm",
  "audio/ogg",
  "audio/wav",
  "audio/mp3",
  "audio/mpeg",
]);

// Configuration for file uploads using Multer, restricted to PDF files
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const mime = String(file.mimetype || "").toLowerCase();
    const hasPdfExtension = /\.pdf$/i.test(String(file.originalname || ""));
    const isAudio = mime.startsWith("audio/");

    if (
      allowedPdfMimeTypes.has(mime) ||
      hasPdfExtension ||
      allowedAudioMimeTypes.has(mime) ||
      isAudio
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and common audio files are accepted"), false);
    }
  },
});

module.exports = upload;
