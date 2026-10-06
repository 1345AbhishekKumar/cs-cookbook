import fs from 'node:fs';

const uvHtml = fs.readFileSync('tools-learn/UV.html', 'utf8');
const uvMdx = fs.readFileSync('content/docs/developer-tools/uv.mdx', 'utf8');

console.log('UV.html length:', uvHtml.length);
console.log('uv.mdx length:', uvMdx.length);

// Find all choice widgets in UV.html
const choiceMatches = uvHtml.match(/<div class="choice"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi) || [];
console.log('Choice widgets in UV.html:', choiceMatches.length);

// Let's inspect the first 2 choice widgets
choiceMatches.slice(0, 2).forEach((c, idx) => {
  console.log(`\n--- Choice Widget ${idx + 1} ---`);
  console.log(c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
});
