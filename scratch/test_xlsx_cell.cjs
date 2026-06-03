const xlsx = require('xlsx');
const workbook = xlsx.readFile('test.xlsx');
const sheetName = workbook.SheetNames[0];
console.log(JSON.stringify(workbook.Sheets[sheetName]['B3'], null, 2));
console.log(JSON.stringify(workbook.Sheets[sheetName]['B10'], null, 2));
