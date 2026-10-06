/**
 * Generate the `ai-agents/books-info` docs pages from the upstream
 * `agent-rules-books` source tree.
 *
 * The source tree holds one folder per book, each with three rule depths:
 *
 *   <book>/<book>.nano.md   ->  <book>/nano.mdx   (smallest rule set)
 *   <book>/<book>.mini.md   ->  <book>/mini.mdx   (condensed rule set)
 *   <book>/<book>.md        ->  <book>/full.mdx   (complete rulebook)
 *
 * Each folder also gets a `meta.json` that orders the pages. The per-book
 * `index.mdx` (the human-facing overview) is hand-written and is never
 * touched by this script, so re-running it is safe.
 *
 * Usage:
 *   node scripts/generate-agent-rules-books.mjs <path-to-agent-rules-books-main>
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceRoot = process.argv[2];

if (!sourceRoot) {
  console.error('usage: node scripts/generate-agent-rules-books.mjs <source-dir>');
  process.exit(1);
}

if (!existsSync(sourceRoot) || !statSync(sourceRoot).isDirectory()) {
  console.error(`source directory not found: ${sourceRoot}`);
  process.exit(1);
}

const outRoot = fileURLToPath(
  new URL('../content/docs/ai-agents/books-info/', import.meta.url),
);

/** nano -> mini -> full, in the order agents should graduate through them. */
const VARIANTS = [
  { id: 'nano', suffix: '.nano.md', title: 'Nano rules', icon: 'Zap' },
  { id: 'mini', suffix: '.mini.md', title: 'Mini rules', icon: 'Scissors' },
  { id: 'full', suffix: '.md', title: 'Full rulebook', icon: 'BookOpen' },
];

/** Pull the first meaningful line out of a `## When to use` section. */
function whenToUse(body) {
  const match = body.match(/^## When to use\s*\n+([^\n#][^\n]*)/m);
  return match ? match[1].trim() : null;
}

/** `# OBEY A Philosophy of Software Design by John Ousterhout` -> title/author. */
function splitHeading(heading) {
  const rest = heading.replace(/^#\s+/, '').replace(/^OBEY\s+/i, '').trim();
  const marker = rest.lastIndexOf(' by ');
  if (marker === -1) return { title: rest, author: null };
  return { title: rest.slice(0, marker).trim(), author: rest.slice(marker + 4).trim() };
}

/**
 * MDX reads `<` as JSX, so CommonMark autolinks (`<https://example.com>`)
 * fail to parse. Rewrite them as normal links, skipping fenced code where
 * the angle-bracket form should stay literal.
 */
function mdxSafe(body) {
  let inFence = false;
  return body
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return line.replace(/<((?:https?:|mailto:)[^\s>]+)>/g, '[$1]($1)');
    })
    .join('\n');
}

/** Frontmatter values go through JSON.stringify to stay valid YAML. */
function frontmatter(fields) {
  const lines = Object.entries(fields)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  return `---\n${lines.join('\n')}\n---\n`;
}

const books = readdirSync(sourceRoot)
  .filter((entry) => statSync(join(sourceRoot, entry)).isDirectory())
  .sort();

mkdirSync(outRoot, { recursive: true });

let written = 0;

for (const book of books) {
  const fullSource = join(sourceRoot, book, `${book}.md`);
  if (!existsSync(fullSource)) {
    console.warn(`skipping ${book}: no ${book}.md`);
    continue;
  }

  const bookDir = join(outRoot, book);
  mkdirSync(bookDir, { recursive: true });

  for (const variant of VARIANTS) {
    const sourceFile = join(sourceRoot, book, `${book}${variant.suffix}`);
    if (!existsSync(sourceFile)) {
      console.warn(`skipping ${book}/${variant.id}: missing file`);
      continue;
    }

    const raw = readFileSync(sourceFile, 'utf8').replace(/\r\n/g, '\n').trim();
    const [firstLine, ...restLines] = raw.split('\n');
    const heading = firstLine.replace(/^#\s+/, '').trim();
    const body = restLines.join('\n').trim();

    const description =
      whenToUse(raw) ??
      `The ${variant.title.toLowerCase()} distilled from ${book.replace(/-/g, ' ')}.`;

    // The H1 becomes the page title, so it is demoted to a bold lead-in.
    // Keeps the source's "OBEY ..." imperative for the agents that read it.
    const content = `${frontmatter({
      title: variant.title,
      description,
      icon: variant.icon,
    })}\n**${heading}**\n\n${mdxSafe(body)}\n`;

    writeFileSync(join(bookDir, `${variant.id}.mdx`), content, 'utf8');
    written += 1;
  }

  const meta = {
    title: splitHeading(readFileSync(fullSource, 'utf8').split('\n')[0]).title,
    pages: ['index', ...VARIANTS.map((variant) => variant.id)],
  };
  if (!meta.title) {
    console.warn(`could not parse a title for ${book}; using the folder name`);
    meta.title = book;
  }
  writeFileSync(join(bookDir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
}

console.log(`wrote ${written} rule pages across ${books.length} books to ${outRoot}`);
