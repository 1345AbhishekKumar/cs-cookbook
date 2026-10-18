import fs from "fs";
import path from "path";
import * as dp from "dompurify";

dp.default.addHook = () => {};
dp.default.sanitize = (s) => s;
globalThis.DOMPurify = {
  addHook: () => {},
  sanitize: (s) => s,
};

const mermaid = (await import("mermaid")).default;
mermaid.initialize({
  startOnLoad: false,
  suppressErrorRendering: true,
});

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (file.endsWith(".mdx") || file.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

const files = getFiles("content");
console.log(
  `Scanning ${files.length} markdown/mdx files for mermaid blocks...`
);

let totalDiagrams = 0;
let errors = [];

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  // Match code fences: ```mermaid ... ```
  const regex = /^```mermaid\r?\n([\s\S]*?)\r?\n```/gm;
  let match;
  let index = 0;
  while ((match = regex.exec(content)) !== null) {
    totalDiagrams++;
    index++;
    const chart = match[1].trim();
    try {
      await mermaid.parse(chart);
    } catch (err) {
      errors.push({
        file: path.relative(process.cwd(), file),
        diagramIndex: index,
        error: (err.message || String(err)).trim(),
      });
    }
  }
}

console.log(
  `\nResults: ${totalDiagrams} diagrams scanned across ${files.length} files.`
);
if (errors.length > 0) {
  console.error(`Found ${errors.length} syntax errors:\n`);
  for (const err of errors) {
    console.error(`--- ${err.file} (diagram #${err.diagramIndex}) ---`);
    console.error(err.error);
    console.error("");
  }
  process.exit(1);
} else {
  console.log("All mermaid diagrams parsed successfully with 0 errors!");
  process.exit(0);
}
