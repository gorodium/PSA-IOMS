const xlsx = require('xlsx');
const workbook = xlsx.readFile('test.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

for (let r = 1; r <= 20; r++) {
  const cellAddress = `B${r}`;
  const cell = worksheet[cellAddress];
  if (cell) {
    const value = cell.v;
    const formula = cell.f;
    const link = cell.l ? cell.l.Target : null;
    if (value || link || formula) {
      console.log(`Row ${r}: Value: ${value}, Link: ${link}, Formula: ${formula}`);
    }
  }
}
