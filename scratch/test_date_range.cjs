const ts = require('typescript');

function parseDateRange(dateStr) {
  if (!dateStr) return null;
  // Clean up parenthesis content for parsing limits
  let s = dateStr.replace(/\(.*?\)/g, "").trim();
  
  // Extract all digit groups that look like days or years
  // Match Month names
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  let currentMonth = "";
  let currentYear = new Date().getFullYear();
  let dates = [];

  // Simple trick: extract all date-like tokens
  const tokens = s.match(/[A-Za-z]+|\d{1,4}/g);
  if (!tokens) return null;

  // Scan backwards to find year and month context
  for (let i = tokens.length - 1; i >= 0; i--) {
    let t = tokens[i];
    if (/^\d{4}$/.test(t)) {
      currentYear = parseInt(t);
    } else if (months.some(m => m.toLowerCase() === t.toLowerCase())) {
      currentMonth = t;
    } else if (/^\d{1,2}$/.test(t)) {
      if (currentMonth) {
        dates.push(new Date(`${currentMonth} ${t}, ${currentYear}`));
      }
    }
  }

  // Also scan forwards just in case (e.g. "May 01-15, 2026")
  currentMonth = "";
  currentYear = new Date().getFullYear();
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    if (/^\d{4}$/.test(t)) {
      currentYear = parseInt(t);
    } else if (months.some(m => m.toLowerCase() === t.toLowerCase())) {
      currentMonth = t;
    } else if (/^\d{1,2}$/.test(t)) {
      if (currentMonth) {
        dates.push(new Date(`${currentMonth} ${t}, ${currentYear}`));
      }
    }
  }

  const validDates = dates.filter(d => !isNaN(d.getTime()));
  if (validDates.length === 0) return null;

  const min = new Date(Math.min(...validDates));
  const max = new Date(Math.max(...validDates));

  return { startDate: min, endDate: max };
}

console.log("May 01-15, 2026 (Any 04 Days)", parseDateRange("May 01-15, 2026 (Any 04 Days)"));
console.log("May 01, 04, 06, 08, 11, 2026", parseDateRange("May 01, 04, 06, 08, 11, 2026"));
console.log("June 17 - July 11, 2026", parseDateRange("June 17 - July 11, 2026"));
console.log("April 30, 2026", parseDateRange("April 30, 2026"));
