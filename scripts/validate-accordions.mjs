import fs from "fs";
import path from "path";

function getMdxFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getMdxFiles(full));
    } else if (file.endsWith(".mdx") || file.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

const files = getMdxFiles("content");
console.log(
  `Scanning ${files.length} markdown/mdx files for standalone <Accordion> components...`
);

const violations = [];

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);
  let depth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track <Accordions> open tags (ignoring self-closing)
    const openAccordions = (line.match(/<Accordions(?=[\s>])/g) || []).length;
    const selfClosingAccordions = (line.match(/<Accordions[^>]*\/>/g) || [])
      .length;
    const closeAccordions = (line.match(/<\/Accordions>/g) || []).length;

    depth += openAccordions - selfClosingAccordions - closeAccordions;

    // Check for <Accordion (ignoring <Accordions)
    const accordionMatches = line.match(/<Accordion(?=[\s>])/g);
    if (accordionMatches && accordionMatches.length > 0) {
      if (depth <= 0) {
        violations.push({
          file,
          line: i + 1,
          snippet: line.trim(),
        });
      }
    }
  }
}

if (violations.length > 0) {
  console.error(
    `\n❌ Found ${violations.length} standalone <Accordion> component(s) outside <Accordions>:`
  );
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} -> ${v.snippet}`);
  }
  console.error(
    "\nFix: Wrap all <Accordion> components inside an enclosing <Accordions>...</Accordions> container to provide the Base UI Accordion.Root context.\n"
  );
  process.exit(1);
} else {
  console.log(
    `✓ All <Accordion> components are properly wrapped inside <Accordions>!`
  );
  process.exit(0);
}
