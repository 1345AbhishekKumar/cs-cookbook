import katex from 'katex';
import fs from 'node:fs';

const p = 'E:/lession/Learning-css-framework/CS-cookbook/content/docs/ai-agents/agentic-ai/01-transformer-architecture-and-foundations.mdx';
const t = fs.readFileSync(p, 'utf8');

// Extract all display math blocks $$...$$
const re = /\$\$([\s\S]*?)\$\$/g;
let m, i = 0, fails = [];
while ((m = re.exec(t)) !== null && i < 200) {
  i++;
  const body = m[1];
  if (body.includes('begin{aligned}') && fails.length < 3) {
    // try render first aligned block
    try {
      katex.renderToString(body, { displayMode: true, strict: false });
    } catch (e) {
      fails.push({ n: i, err: e.message, body: body.slice(0, 400) });
    }
    if (fails.length === 0 && i === 1) {
      console.log('first aligned block OK, len', body.length);
    }
    break;
  }
}

// Now test ALL display blocks
let total = 0, bad = 0;
const re2 = /\$\$([\s\S]*?)\$\$/g;
let badSamples = [];
while ((m = re2.exec(t)) !== null) {
  total++;
  try {
    katex.renderToString(m[1], { displayMode: true, strict: false, throwOnError: true });
  } catch (e) {
    bad++;
    if (badSamples.length < 5) badSamples.push({ n: total, err: String(e.message).slice(0, 200), body: m[1].slice(0, 300) });
  }
}
console.log('display blocks:', total, 'bad:', bad);
console.log(JSON.stringify(badSamples, null, 2));
