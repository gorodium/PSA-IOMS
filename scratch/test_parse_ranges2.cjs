function parseDateRanges(dateStr) {
  if (!dateStr) return [];
  let s = dateStr.replace(/\(.*?\)/g, "").trim();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  let currentYear = new Date().getFullYear();
  let currentMonth = "";
  
  const tokens = s.match(/[A-Za-z]+|\d{1,4}|-/g);
  if (!tokens) return [];

  for (let i = tokens.length - 1; i >= 0; i--) {
    let t = tokens[i];
    if (/^\d{4}$/.test(t)) {
      currentYear = parseInt(t);
    } else if (months.some(m => m.toLowerCase() === t.toLowerCase())) {
      currentMonth = t;
    }
  }

  currentYear = new Date().getFullYear();
  currentMonth = "";
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
          ranges.push({ startDate: pendingStart, endDate: d });
          pendingStart = null;
          expectingRangeEnd = false;
        } else {
          if (pendingStart && !expectingRangeEnd) {
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

  return ranges.filter(r => !isNaN(r.startDate.getTime()) && !isNaN(r.endDate.getTime()));
}

console.log("May 01-15, 2026", parseDateRanges("May 01-15, 2026"));
console.log("May 01, 04, 06, 08, 11, 2026", parseDateRanges("May 01, 04, 06, 08, 11, 2026"));
console.log("June 17 - July 11, 2026", parseDateRanges("June 17 - July 11, 2026"));
console.log("June 17 - July 02, 2026", parseDateRanges("June 17 - July 02, 2026"));
