const xlsx = require('xlsx');
const workbook = xlsx.readFile('test.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// In SheetJS, a cell's hyperlink is in the cell.l object (if it exists)
// e.g., cell.l.Target
for (let r = 1; r <= 20; r++) {
  // Let's assume REFERENCE NO is column B
  const cellAddress = `B${r}`;
  const cell = worksheet[cellAddress];
  if (cell) {
    const value = cell.v;
    const link = cell.l ? cell.l.Target : null;
    if (value || link) {
      console.log(`Row ${r}: Value: ${value}, Link: ${link}`);
    }
  }
}
