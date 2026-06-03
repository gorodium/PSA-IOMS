function parseDatesList(dateStr) {
  if (!dateStr) return [];
  let s = dateStr.replace(/\(.*?\)/g, "").trim();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  let currentMonth = "";
  let currentYear = new Date().getFullYear();
  
  // Extract all tokens: digits, words, and dashes for ranges
  const tokens = s.match(/[A-Za-z]+|\d{1,4}|-/g);
  if (!tokens) return [];

  // First pass: scan backwards to find year and month context
  let dates = [];
  for (let i = tokens.length - 1; i >= 0; i--) {
    let t = tokens[i];
    if (/^\d{4}$/.test(t)) {
      currentYear = parseInt(t);
    } else if (months.some(m => m.toLowerCase() === t.toLowerCase())) {
      currentMonth = t;
    }
  }

  // Second pass: scan forwards and build the date list
  currentMonth = "";
  currentYear = new Date().getFullYear();
  let lastDay = null;

  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    if (/^\d{4}$/.test(t)) {
      currentYear = parseInt(t);
    } else if (months.some(m => m.toLowerCase() === t.toLowerCase())) {
      currentMonth = t;
    } else if (/^\d{1,2}$/.test(t)) {
      if (currentMonth) {
        const day = parseInt(t);
        
        // Check if there was a dash right before this number to form a range
        if (i > 0 && tokens[i-1] === '-' && lastDay !== null) {
          // Fill in the range from lastDay + 1 to day
          for (let d = lastDay + 1; d <= day; d++) {
             dates.push(new Date(`${currentMonth} ${d}, ${currentYear}`));
          }
        } else {
          dates.push(new Date(`${currentMonth} ${day}, ${currentYear}`));
        }
        lastDay = day;
      }
    } else if (t !== '-') {
       lastDay = null;
    }
  }

  const validDates = dates.filter(d => !isNaN(d.getTime()));
  
  // Remove duplicates
  const uniqueDatesMap = new Map();
  for (let d of validDates) {
    uniqueDatesMap.set(d.toISOString(), d);
  }

  return Array.from(uniqueDatesMap.values());
}

console.log("May 01-15, 2026 (Any 04 Days)", parseDatesList("May 01-15, 2026 (Any 04 Days)").length);
console.log("May 01, 04, 06, 08, 11, 2026", parseDatesList("May 01, 04, 06, 08, 11, 2026"));
console.log("June 17 - July 11, 2026", parseDatesList("June 17 - July 11, 2026"));
console.log("June 17 - July 02, 2026", parseDatesList("June 17 - July 02, 2026"));
