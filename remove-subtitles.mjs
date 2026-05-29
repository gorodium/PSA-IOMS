import fs from 'fs';
import path from 'path';

const dir = 'C:/Users/Admin/Documents/PS/components/projects/canvas/widgets';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.tsx')) {
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/\s+defaultSubtitle="[^"]*"/g, '');
    fs.writeFileSync(p, content);
  }
}
console.log('Removed subtitles from all widgets.');
