const xlsx = require('xlsx');
const workbook = xlsx.readFile('test.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

for (let r = 1; r <= 300; r++) {
  const cellAddress = `B${r}`; // REFERENCE NO is usually column B
  const cell = worksheet[cellAddress];
  if (cell) {
    const value = cell.v;
    const formula = cell.f;
    const link = cell.l ? cell.l.Target : null;
    if (link) {
      console.log(`Row ${r}: Value: ${value}, Link: ${link}`);
    }
  }
}
