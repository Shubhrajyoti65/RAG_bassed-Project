const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const INPUT_DIR = path.join(__dirname, "..", "data", "import");
const OUTPUT_FILE = path.join(__dirname, "..", "data", "importedCases.json");
const MAX_TEXT_LENGTH = 20000;

async function main() {
  const files = fs
    .readdirSync(INPUT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(txt|pdf)$/i.test(name));

  if (files.length === 0) {
    console.log("No .txt or .pdf files found in server/data/import");
    return;
  }

  const existing = readJsonArray(OUTPUT_FILE);
  const existingBySource = new Map(
    existing
      .filter((item) => typeof item?.sourceFile === "string")
      .map((item) => [item.sourceFile, item])
  );

  const imported = [];
  for (const fileName of files) {
    const filePath = path.join(INPUT_DIR, fileName);
    const text = await extractText(filePath);
    const normalizedText = normalizeText(text);

    if (normalizedText.length < 100) {
      console.warn(`Skipping ${fileName}: extracted text too short.`);
      continue;
    }

    const record = buildCaseRecord({
      fileName,
      text: normalizedText,
      existingRecord: existingBySource.get(fileName),
    });

    imported.push(record);
  }

  const mergedMap = new Map(existing.map((item) => [item.caseNumber, item]));
  for (const item of imported) {
    mergedMap.set(item.caseNumber, item);
  }

  const merged = Array.from(mergedMap.values()).sort((a, b) =>
    String(a.caseNumber).localeCompare(String(b.caseNumber))
  );

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(merged, null, 2));

  console.log(`Imported/updated ${imported.length} case(s).`);
  console.log(
    `Dataset now has ${merged.length} imported case(s): ${OUTPUT_FILE}`
  );
}

async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".txt") {
    return fs.readFileSync(filePath, "utf-8");
  }

  if (ext === ".pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text || "";
  }

  return "";
}

function buildCaseRecord({ fileName, text, existingRecord }) {
  const baseName = path.basename(fileName, path.extname(fileName));
  const titleFromText = firstNonEmptyLine(text);
  const title =
    titleFromText.length >= 8 ? titleFromText : humanizeFileName(baseName);

  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : new Date().getFullYear();

  const caseNumber =
    existingRecord?.caseNumber || `Imported-${slugify(baseName)}-${year}`;

  return {
    caseTitle: title.slice(0, 180),
    year,
    caseNumber,
    facts: truncate(text, MAX_TEXT_LENGTH),
    legalReasoning:
      existingRecord?.legalReasoning ||
      "Imported from source file. Review and refine legal reasoning for better retrieval quality.",
    decision:
      existingRecord?.decision ||
      "Imported source does not include a structured decision field. Update this manually.",
    relevantSections: Array.isArray(existingRecord?.relevantSections)
      ? existingRecord.relevantSections
      : [],
    sourceFile: fileName,
    importedAt: new Date().toISOString(),
  };
}

function readJsonArray(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`Failed to read ${filePath}: ${error.message}`);
    return [];
  }
}

function normalizeText(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function firstNonEmptyLine(text) {
  const lines = String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines[0] || "";
}

function humanizeFileName(name) {
  return name.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function truncate(value, limit) {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 3)}...`;
}

main().catch((error) => {
  console.error("Case import failed:", error);
  process.exit(1);
});
