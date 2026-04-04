/**
 * uploadExistingPdfs.js
 *
 * Migration script: reads all PDFs from server/data/import/ (all subdirs),
 * uploads each to Cloudinary, and saves the pdfUrl to MongoDB.
 *
 * Run with:
 *   node server/scripts/uploadExistingPdfs.js
 *
 * Safe to re-run — skips files already uploaded (pdfUrl already set in DB).
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const { uploadFile } = require("../services/cloudinaryService");
const { generateMapping } = require("./generatePdfMapping");
const Case = require("../models/Case");

const IMPORT_ROOT = path.join(__dirname, "../data/import");
const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME;

// ─── Utility helpers ────────────────────────────────────────────────────────

function humanTitle(filename) {
  return path.basename(filename, path.extname(filename))
    .replace(/[_-]+/g, " ")
    .replace(/\s*\(\d+\)\s*$/, "")
    .trim();
}

function extractYear(filename) {
  const m = filename.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : null;
}

/** Recursively collect all .PDF files under a directory. */
function collectPdfs(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectPdfs(fullPath));
    } else if (entry.isFile() && /\.pdf$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔌 Connecting to MongoDB…");
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log("✅ MongoDB connected");

  const pdfs = collectPdfs(IMPORT_ROOT);
  console.log(`\n📂 Found ${pdfs.length} PDF(s) in ${IMPORT_ROOT}\n`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of pdfs) {
    const filename = path.basename(filePath);
    const title = humanTitle(filename);
    const year = extractYear(filename);

    try {
      // Check if already in DB
      const existing = await Case.findOne({ sourceFile: filename });

      if (existing?.pdfUrl) {
        console.log(`⏭  SKIP  ${filename}  (already uploaded)`);
        skipped++;
        continue;
      }

      // Upload to Cloudinary
      console.log(`⬆  UPLOADING  ${filename}…`);
      const pdfUrl = await uploadFile(filePath);

      if (existing) {
        // Update existing record
        existing.pdfUrl = pdfUrl;
        await existing.save();
      } else {
        // Create new record
        await Case.create({
          caseTitle: title,
          caseNumber: "",
          year,
          sourceFile: filename,
          pdfUrl,
        });
      }

      console.log(`✅ DONE   ${filename}`);
      console.log(`          ${pdfUrl}\n`);
      uploaded++;
    } catch (err) {
      console.error(`❌ FAILED ${filename}: ${err.message}`);
      failed++;
    }
  }

  console.log("\n─────────────────────────────────");
  console.log(`Uploaded : ${uploaded}`);
  console.log(`Skipped  : ${skipped}`);
  console.log(`Failed   : ${failed}`);
  console.log("─────────────────────────────────\n");

  if (uploaded > 0 || skipped > 0) {
    try {
      await generateMapping();
    } catch (err) {
      console.warn("⚠️ Failed to update mapping JSON:", err.message);
    }
  }

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
