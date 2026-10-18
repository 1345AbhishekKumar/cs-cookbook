import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith(".mdx")) {
      results.push(full);
    }
  }
  return results;
}

const files = walk("content/docs/learn-python");
let failures = 0;

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const relPath = path.relative(process.cwd(), file).replace(/\\/g, "/");

  // Check 1: No <Accordion title="Question
  if (/<Accordion\s+title=["']Question/i.test(content)) {
    console.error(`FAIL: ${relPath} contains <Accordion title="Question...`);
    failures++;
  }

  // Check 2: No nested <Accordion> inside another <Accordion>
  const lines = content.split("\n");
  let depth = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/<Accordion[\s>]/i.test(line) && !/<\/Accordion>/i.test(line)) {
      depth++;
      if (depth > 1) {
        console.error(
          `FAIL: ${relPath} line ${i + 1} has nested <Accordion> at depth ${depth}`
        );
        failures++;
        break;
      }
    }
    if (/<\/Accordion>/i.test(line)) {
      depth = Math.max(0, depth - 1);
    }
  }
}

if (failures > 0) {
  console.error(`\nTotal failures: ${failures}`);
  process.exit(1);
} else {
  console.log(
    `\nSUCCESS: All ${files.length} learn-python MDX files have clean question/solution structures!`
  );
  process.exit(0);
}
