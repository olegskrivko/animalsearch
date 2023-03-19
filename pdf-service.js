const PDFDocument = require("pdfkit");

function buildPDF(data, dataCallback, endCallback) {
  const doc = new PDFDocument();
  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  doc.fontSize(18).text(data);
  doc.end();
}

module.exports = { buildPDF };
