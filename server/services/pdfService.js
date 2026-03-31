const pdfParse = require("pdf-parse");

// Extracts raw text content from PDF file buffer
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    if (!data.text || data.text.trim().length === 0) {
      const error = new Error(
        "Could not extract text from PDF. The file may be scanned or image-based."
      );
      error.statusCode = 400;
      throw error;
    }
    return data.text.trim();
  } catch (err) {
    if (err.statusCode) {
      throw err;
    }

    const parseError = new Error(
      "The uploaded PDF could not be read. Please upload a valid text-based PDF file."
    );
    parseError.statusCode = 400;
    throw parseError;
  }
}

module.exports = { extractTextFromPDF };
