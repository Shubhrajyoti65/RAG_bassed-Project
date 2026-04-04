/**
 * generatePdfMapping.js
 *
 * Exports caseTitle vs Cloudinary pdfUrl mappings from MongoDB to a JSON file.
 * This enables faster, O(1) lookups in the judgment search services.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Case = require("../models/Case");

const MAPPING_FILE = path.join(__dirname, "../data/pdfMapping.json");

/**
 * Main export function to generate the mapping.
 * Can be called from other scripts (like the migration script).
 */
async function generateMapping() {
  console.log("📑 Generating PDF mapping file...");
  
  // 1. Fetch all cases that have a pdfUrl
  const allCases = await Case.find({ pdfUrl: { $ne: null } })
    .select("caseTitle sourceFile pdfUrl")
    .lean();

  const mapping = {
    byTitle: {},
    byFile: {}
  };

  for (const c of allCases) {
    if (c.caseTitle) mapping.byTitle[c.caseTitle.toLowerCase()] = c.pdfUrl;
    if (c.sourceFile) mapping.byFile[c.sourceFile.toLowerCase()] = c.pdfUrl;
  }

  // 2. Write to JSON
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
  
  console.log(`✅ Mapping file created: ${allCases.length} entries saved to ${path.basename(MAPPING_FILE)}`);
  return allCases.length;
}

// If run directly via 'node server/scripts/generatePdfMapping.js'
if (require.main === module) {
  (async () => {
    try {
      console.log("🔌 Connecting to MongoDB...");
      await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME });
      
      await generateMapping();
      
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error("❌ Mapping generation failed:", err.message);
      process.exit(1);
    }
  })();
}

module.exports = { generateMapping };
