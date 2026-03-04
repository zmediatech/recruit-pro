const pdf = require('pdf-parse');
const fs = require('fs');

/**
 * Extracts raw text from a PDF file.
 */
async function extractPdfText(buffer) {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (err) {
        console.error("PDF Parsing Error:", err);
        return "";
    }
}

module.exports = { extractPdfText };
