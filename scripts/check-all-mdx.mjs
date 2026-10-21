import { compile } from "@mdx-js/mdx";
import fs from "node:fs";
import path from "node:path";
import { frontmatter } from "fumadocs-core/content/md/frontmatter";
import remarkMath from "remark-math";

function getMdxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getMdxFiles(fullPath));
    } else if (file.endsWith(".mdx")) {
      results.push(fullPath);
    }
  }
  return results;
}

async function checkAll() {
  const files = getMdxFiles("content");
  console.log(`Found ${files.length} MDX files to check.`);
  let failed = 0;
  const failedFiles = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { content } = frontmatter(raw);
    try {
      await compile(content, {
        jsx: true,
        remarkPlugins: [remarkMath],
      });
    } catch (err) {
      console.log(`\nFAIL: ${file}`);
      console.log(`  ${err.message}`);
      if (err.line) {
        console.log(`  Line: ${err.line}, Column: ${err.column}`);
      }
      failedFiles.push({
        file,
        error: err.message,
        line: err.line,
        column: err.column,
      });
      failed++;
    }
  }
  console.log(`\nDone. Total: ${files.length}, Failed: ${failed}`);
  fs.writeFileSync(
    "scripts/failed-mdx.json",
    JSON.stringify(failedFiles, null, 2)
  );
}

checkAll();
