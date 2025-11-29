// Simple script to extract text from docx file
// Run with: node extract-docx.js

const fs = require('fs');
const path = require('path');

const docxPath = path.join(__dirname, 'Vietnam Journey_ Classic Highlights & Offbeat Adventures.docx');

// Try to read as zip and extract document.xml
try {
  const AdmZip = require('adm-zip');
  const zip = new AdmZip(docxPath);
  const xmlContent = zip.readAsText('word/document.xml');
  
  // Simple XML to text extraction (basic)
  const text = xmlContent
    .replace(/<[^>]+>/g, ' ') // Remove XML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  fs.writeFileSync('vietnam-journey-content.txt', text, 'utf8');
  console.log('Extracted text saved to vietnam-journey-content.txt');
  console.log('\nFirst 500 characters:');
  console.log(text.substring(0, 500));
} catch (e) {
  console.error('Error extracting docx. Please install adm-zip: npm install adm-zip');
  console.error('Or paste the content from the document here.');
}

