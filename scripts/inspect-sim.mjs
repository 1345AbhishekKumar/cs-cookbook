import fs from 'node:fs';

const uv = fs.readFileSync('tools-learn/UV.html', 'utf8');
const lines = uv.split('\n');
let inSim = false;
let simLines = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="simulator"')) inSim = true;
  if (inSim) {
    simLines.push(lines[i]);
    if (lines[i].includes('</section>')) break;
  }
}

console.log(simLines.slice(0, 50).join('\n'));
