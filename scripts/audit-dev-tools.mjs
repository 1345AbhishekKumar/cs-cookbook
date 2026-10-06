import fs from 'node:fs';
import path from 'node:path';

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkDir(full);
    } else if (f.endsWith('.mdx')) {
      const content = fs.readFileSync(full, 'utf8');
      console.log(`\n========================================`);
      console.log(`FILE: ${full} (${content.length} bytes, ${content.split('\n').length} lines)`);
      
      // Check first 40 lines
      const lines = content.split('\n');
      console.log('--- Top 20 lines ---');
      console.log(lines.slice(0, 20).join('\n'));
      
      // Check headings
      const headings = lines.filter(l => l.startsWith('#'));
      console.log('--- Sample Headings (first 10) ---');
      headings.slice(0, 10).forEach(h => console.log('  ', h));
      
      // Check for raw numbering or awkward labels
      const awkward = headings.filter(h => /^##\s+\d+\b/.test(h) || h.includes('Part ') || h.includes('Chapter ') || h.includes('Lesson '));
      if (awkward.length > 0) {
        console.log('--- Awkward Headings Found ---');
        awkward.slice(0, 5).forEach(h => console.log('  !', h));
      }
    }
  }
}

checkDir('content/docs/developer-tools');
