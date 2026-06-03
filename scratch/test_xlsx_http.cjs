const xlsx = require('xlsx');
const workbook = xlsx.readFile('test.xlsx');
let found = false;
for (const sheetName of workbook.SheetNames) {
  const worksheet = workbook.Sheets[sheetName];
  for (const cellAddress in worksheet) {
    if (cellAddress[0] === '!') continue;
    const cell = worksheet[cellAddress];
    if (cell.v && typeof cell.v === 'string' && cell.v.includes('http')) {
      console.log(`Found http in ${sheetName}!${cellAddress}: ${cell.v}`);
      found = true;
    }
  }
}
if (!found) console.log("No http found anywhere in the sheet values.");
