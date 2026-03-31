const multer = require("multer");

const storage = multer.memoryStorage();
const allowedPdfMimeTypes = new Set([
  "application/pdf",
  "application/x-pdf",
  "application/acrobat",
  "applications/vnd.pdf",
  "text/pdf",
]);

// Configuration for file uploads using Multer, restricted to PDF files
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const mime = String(file.mimetype || "").toLowerCase();
    const hasPdfExtension = /\.pdf$/i.test(String(file.originalname || ""));

    if (allowedPdfMimeTypes.has(mime) || hasPdfExtension) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"), false);
    }
  },
});

module.exports = upload;
