const pdfParse = require("pdf-parse");

async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);
  if (!data.text || data.text.trim().length === 0) {
    throw new Error(
      "Could not extract text from PDF. The file may be scanned or image-based."
    );
  }
  return data.text.trim();
}

module.exports = { extractTextFromPDF };
