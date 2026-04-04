const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const config = require("../config");
const { connectMongo } = require("../services/mongoService");
const { uploadFile } = require("../services/storageService");
const Case = require("../models/Case");

const IMPORT_ROOT = path.join(__dirname, "..", "data", "import");
const IMPORTED_CASES_FILE = path.join(
  __dirname,
  "..",
  "data",
  "importedCases.json"
);

function normalizeComparable(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[_\-]+/g, " ")
    .replace(/[^a-z0-9 ]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toPosixRelative(filePath, rootPath) {
  return path.relative(rootPath, filePath).replace(/\\/g, "/");
}

function humanizeFileName(filename) {
  return path
    .basename(filename, path.extname(filename))
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferYear(value) {
  const fromValue = Number(value);
  if (Number.isInteger(fromValue) && fromValue >= 1800 && fromValue <= 2200) {
    return fromValue;
  }

  const match = String(value || "").match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

function loadImportedCases() {
  try {
    if (!fs.existsSync(IMPORTED_CASES_FILE)) {
      return [];
    }

    const raw = fs.readFileSync(IMPORTED_CASES_FILE, "utf-8").trim();
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`Failed to read imported cases JSON: ${error.message}`);
    return [];
  }
}

function buildImportedCasesLookup(records) {
  const bySource = new Map();
  const byTitle = new Map();

  for (const record of records) {
    const source = String(record?.sourceFile || "").trim();
    if (source) {
      bySource.set(normalizeComparable(source), record);
      bySource.set(normalizeComparable(path.basename(source)), record);
    }

    const title = String(record?.caseTitle || "").trim();
    if (title) {
      byTitle.set(normalizeComparable(title), record);
    }
  }

  return { bySource, byTitle };
}

function collectPdfs(dirPath) {
  const items = [];
  if (!fs.existsSync(dirPath)) {
    return items;
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      items.push(...collectPdfs(fullPath));
      continue;
    }

    if (entry.isFile() && /\.pdf$/i.test(entry.name)) {
      items.push(fullPath);
    }
  }

  return items;
}

function resolveImportedRecord(filePath, relativePath, lookups) {
  const baseName = path.basename(filePath);

  const candidates = [
    normalizeComparable(relativePath),
    normalizeComparable(baseName),
    normalizeComparable(path.basename(baseName, path.extname(baseName))),
  ];

  for (const key of candidates) {
    const fromSource = lookups.bySource.get(key);
    if (fromSource) {
      return fromSource;
    }
  }

  const titleLike = humanizeFileName(baseName);
  return lookups.byTitle.get(normalizeComparable(titleLike)) || null;
}

function getRuntimeOptions() {
  const forceFromArgs = process.argv.includes("--force");
  const forceFromEnv =
    String(process.env.FORCE_REUPLOAD || "").toLowerCase() === "true";

  return {
    forceReupload: forceFromArgs || forceFromEnv,
  };
}

async function upsertCaseRecord(
  filePath,
  relativePath,
  importedRecord,
  options
) {
  const baseName = path.basename(filePath);

  const title =
    String(importedRecord?.caseTitle || "").trim() ||
    humanizeFileName(baseName);
  const caseNumber = String(importedRecord?.caseNumber || "").trim();
  const year = inferYear(importedRecord?.year || baseName);

  const existing = await Case.findOne({
    $or: [{ sourceFile: relativePath }, { sourceFile: baseName }],
  });

  if (existing?.pdfUrl && !options.forceReupload) {
    return {
      status: "skipped",
      reason: "already_has_pdf",
      caseId: String(existing._id),
    };
  }

  const pdfUrl = await uploadFile(filePath);

  const updatePayload = {
    caseTitle: title,
    caseNumber,
    year,
    facts: String(importedRecord?.facts || ""),
    legalReasoning: String(importedRecord?.legalReasoning || ""),
    decision: String(importedRecord?.decision || ""),
    relevantSections: Array.isArray(importedRecord?.relevantSections)
      ? importedRecord.relevantSections
      : [],
    sourceFile: relativePath,
    pdfUrl,
    metadata: {
      category: path.dirname(relativePath).replace(/\\/g, "/") || "root",
      importedAt: importedRecord?.importedAt || null,
    },
  };

  if (existing) {
    Object.assign(existing, updatePayload);
    await existing.save();
    return { status: "updated", caseId: String(existing._id), pdfUrl };
  }

  const created = await Case.create(updatePayload);
  return { status: "created", caseId: String(created._id), pdfUrl };
}

async function main() {
  const options = getRuntimeOptions();

  console.log(
    `Cloudinary target: ${config.CLOUDINARY_CLOUD_NAME || "(unset)"}/${
      config.CLOUDINARY_CASES_FOLDER || "cases"
    }`
  );
  if (options.forceReupload) {
    console.log("Force mode enabled: existing pdfUrl values will be replaced.");
  }

  console.log("Connecting to MongoDB...");
  await connectMongo();

  const files = collectPdfs(IMPORT_ROOT);
  const importedCases = loadImportedCases();
  const lookups = buildImportedCasesLookup(importedCases);

  if (files.length === 0) {
    console.log("No PDF files found under server/data/import");
    await mongoose.disconnect();
    process.exit(0);
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of files) {
    const relativePath = toPosixRelative(filePath, IMPORT_ROOT);
    const importedRecord = resolveImportedRecord(
      filePath,
      relativePath,
      lookups
    );

    try {
      const result = await upsertCaseRecord(
        filePath,
        relativePath,
        importedRecord,
        options
      );
      if (result.status === "created") {
        created += 1;
        console.log(`Created case metadata: ${relativePath}`);
      } else if (result.status === "updated") {
        updated += 1;
        console.log(`Updated case metadata: ${relativePath}`);
      } else {
        skipped += 1;
        console.log(`Skipped existing case: ${relativePath}`);
      }
    } catch (error) {
      failed += 1;
      console.error(`Failed ${relativePath}: ${error.message}`);
    }
  }

  console.log("--- Migration Summary ---");
  console.log(`Total files: ${files.length}`);
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(async (error) => {
  console.error(`Migration failed: ${error.message}`);
  try {
    await mongoose.disconnect();
  } catch {
    // no-op
  }
  process.exit(1);
});
