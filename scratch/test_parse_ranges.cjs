function parseDateRangesList(dateStr) {
  if (!dateStr) return [];
  let s = dateStr.replace(/\(.*?\)/g, "").trim();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  let currentMonth = "";
  let currentYear = new Date().getFullYear();
  
  const tokens = s.match(/[A-Za-z]+|\d{1,4}|-/g);
  if (!tokens) return [];

  // First pass: scan backwards to find year and month context
  for (let i = tokens.length - 1; i >= 0; i--) {
    let t = tokens[i];
    if (/^\d{4}$/.test(t)) {
      currentYear = parseInt(t);
    } else if (months.some(m => m.toLowerCase() === t.toLowerCase())) {
      currentMonth = t;
    }
  }

  // Second pass: scan forwards and build ranges
  currentMonth = "";
  currentYear = new Date().getFullYear();
  let ranges = [];
  
  let pendingStart = null;
  let expectingRangeEnd = false;

  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    if (/^\d{4}$/.test(t)) {
      currentYear = parseInt(t);
    } else if (months.some(m => m.toLowerCase() === t.toLowerCase())) {
      currentMonth = t;
    } else if (t === '-') {
      expectingRangeEnd = true;
    } else if (/^\d{1,2}$/.test(t)) {
      if (currentMonth) {
        const day = parseInt(t);
        const d = new Date(`${currentMonth} ${day}, ${currentYear}`);
        
        if (expectingRangeEnd && pendingStart) {
          // Complete the range
          ranges.push({ startDate: pendingStart, endDate: d });
          pendingStart = d; // in case there's another dash, though rare
          expectingRangeEnd = false;
        } else {
          // Start a new potential range
          if (pendingStart && !expectingRangeEnd) {
             // The previous pendingStart was just a single day
             ranges.push({ startDate: pendingStart, endDate: pendingStart });
          }
          pendingStart = d;
        }
      }
    }
  }
  
  if (pendingStart && !expectingRangeEnd) {
     ranges.push({ startDate: pendingStart, endDate: pendingStart });
  }

  // Filter valid
  return ranges.filter(r => !isNaN(r.startDate.getTime()) && !isNaN(r.endDate.getTime()));
}

console.log("May 01-15, 2026", parseDateRangesList("May 01-15, 2026"));
console.log("May 01, 04, 06, 08, 11, 2026", parseDateRangesList("May 01, 04, 06, 08, 11, 2026"));
console.log("June 17 - July 11, 2026", parseDateRangesList("June 17 - July 11, 2026"));
console.log("June 17 - July 02, 2026", parseDateRangesList("June 17 - July 02, 2026"));
