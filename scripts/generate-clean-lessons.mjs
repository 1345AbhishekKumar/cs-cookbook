import fs from 'node:fs';
import path from 'node:path';

function decodeHtml(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, ' — ')
    .replace(/&ndash;/g, ' – ')
    .replace(/&hellip;/g, '...')
    .replace(/&rarr;/g, '→')
    .replace(/&larr;/g, '←')
    .replace(/&times;/g, '×')
    .replace(/&check;/g, '✓')
    .replace(/&middot;/g, '·')
    .replace(/&bull;/g, '•')
    .replace(/&nbsp;/g, ' ');
}

function cleanText(html) {
  let s = html;
  // strong / b
  s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, c) => `**${cleanText(c).trim()}**`);
  // em / i
  s = s.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, c) => `*${cleanText(c).trim()}*`);
  // inline code
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => {
    const raw = decodeHtml(c.replace(/<[^>]+>/g, '')).replace(/`/g, '\\`');
    return `\`${raw}\``;
  });
  // kbd
  s = s.replace(/<kbd[^>]*>([\s\S]*?)<\/kbd>/gi, (_, c) => `<kbd>${cleanText(c).trim()}</kbd>`);
  // links
  s = s.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const t = cleanText(text).trim();
    if (!t) return '';
    return `[${t}](${href})`;
  });
  // strip any remaining span or mark tags
  s = s.replace(/<\/?(span|mark)[^>]*>/gi, '');
  return decodeHtml(s);
}

function stripNumbering(title) {
  let t = title.trim();
  // remove leading numbers like "1 ", "2. ", "01 - ", etc.
  t = t.replace(/^\d+[\s.:\-–—]+/, '');
  // capitalize first letter if needed
  if (t.length > 0) {
    t = t.charAt(0).toUpperCase() + t.slice(1);
  }
  return t;
}

function formatTable(tableHtml) {
  const rows = [];
  const trMatches = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  
  for (const tr of trMatches) {
    const cells = [];
    const cellMatches = tr.match(/<(th|td)[^>]*>([\s\S]*?)<\/(th|td)>/gi) || [];
    for (const cell of cellMatches) {
      const inner = cell.replace(/^<(th|td)[^>]*>/i, '').replace(/<\/(th|td)>$/i, '');
      let cleaned = cleanText(inner).replace(/[\r\n]+/g, ' ').replace(/\|/g, '\\|').trim();
      
      if (cleaned.includes('${') || cleaned.includes('$') || cleaned.includes('{') || cleaned.includes('}')) {
        if (!cleaned.startsWith('`') && !cleaned.endsWith('`') && !cleaned.includes('**')) {
          cleaned = `\`${cleaned.replace(/`/g, '')}\``;
        } else {
          cleaned = cleaned.replace(/\{/g, '\\{').replace(/\}/g, '\\}');
        }
      }
      cells.push(cleaned || '-');
    }
    if (cells.length > 0) rows.push(cells);
  }

  if (rows.length === 0) return '';
  const colCount = Math.max(...rows.map((r) => r.length));
  const normalized = rows.map((r) => {
    while (r.length < colCount) r.push('-');
    return r;
  });

  const header = normalized[0];
  const separator = new Array(colCount).fill('---');
  const body = normalized.slice(1);

  const lines = [
    `| ${header.join(' | ')} |`,
    `| ${separator.join(' | ')} |`,
    ...body.map((r) => `| ${r.join(' | ')} |`),
  ];
  return '\n\n' + lines.join('\n') + '\n\n';
}

function detectLang(code, label = '') {
  const lbl = label.toLowerCase();
  const cd = code.trim();
  if (lbl.includes('json') || (cd.startsWith('{') && cd.includes('"') && cd.includes(':'))) return 'json';
  if (lbl.includes('javascript') || lbl.includes('js') || lbl.includes('node') || cd.includes('console.log') || cd.includes('require(')) return 'javascript';
  if (lbl.includes('typescript') || lbl.includes('ts')) return 'typescript';
  if (lbl.includes('html')) return 'html';
  if (lbl.includes('powershell') || cd.includes('PS >') || cd.includes('Get-Process')) return 'powershell';
  if (lbl.includes('python') || (cd.includes('import ') && cd.includes('def '))) return 'python';
  return 'bash';
}

function extractAndSaveSvgs(html, fileKey, styleBlock) {
  let counter = 0;
  return html.replace(/<svg[\s\S]*?<\/svg>/gi, (svgRaw) => {
    counter++;
    const filename = `${fileKey}-diagram-${counter}.svg`;
    const outRelPath = `/diagrams/${fileKey}/${filename}`;
    const outAbsPath = path.join('public', 'diagrams', fileKey, filename);
    
    let completeSvg = svgRaw;
    if (!completeSvg.includes('xmlns=')) {
      completeSvg = completeSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (styleBlock && !completeSvg.includes('<style')) {
      completeSvg = completeSvg.replace(/<svg[^>]*>/, `$&<defs><style>${styleBlock}</style></defs>`);
    }

    fs.mkdirSync(path.dirname(outAbsPath), { recursive: true });
    fs.writeFileSync(outAbsPath, completeSvg, 'utf8');

    return `\n\n![${fileKey} diagram](${outRelPath})\n\n`;
  });
}

function convertHtml(html, config) {
  let content = html;

  const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const styleBlock = styleMatch ? styleMatch[1].replace(/\/\*[\s\S]*?\*\//g, '') : '';

  // 1. Strip ALL HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Remove mastheads, heroes, sidebars, TOC, footer, scripts, styles
  content = content.replace(/<header[\s\S]*?<\/header>/gi, '');
  content = content.replace(/<(nav|aside)[^>]*class="[^"]*toc[^"]*"[^>]*>[\s\S]*?<\/(nav|aside)>/gi, '');
  content = content.replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '');
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
  content = content.replace(/<footer[\s\S]*?<\/footer>/gi, '');

  // For 50 commands: strip introductory theory sections if configured
  if (config.stripFoundations) {
    // Cut everything before navigation/first command or Part 01
    const cutIdx = content.indexOf('Navigation &amp; Files') !== -1 ? content.indexOf('Navigation &amp; Files') : content.indexOf('Navigation & Files');
    if (cutIdx !== -1) {
      // Find the nearest opening section tag before it
      const startIdx = content.lastIndexOf('<section', cutIdx);
      if (startIdx !== -1) {
        content = content.substring(startIdx);
      }
    }
  }

  // Extract body/main
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    content = mainMatch[1];
  } else {
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) content = bodyMatch[1];
  }

  // 3. Extract and save SVGs
  content = extractAndSaveSvgs(content, config.fileKey, styleBlock);

  // 4. Extract code blocks with placeholders
  const codeBlocks = [];
  content = content.replace(/<div class="code-block"[\s\S]*?<div class="code-label">([\s\S]*?)<\/div>[\s\S]*?<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>[\s\S]*?<\/div>/gi, (_, label, code) => {
    const cleanLabel = cleanText(label).trim();
    const cleanCode = decodeHtml(code.replace(/<[^>]+>/g, '')).trim();
    const lang = detectLang(cleanCode, cleanLabel);
    const placeholder = `%%%CODE_BLOCK_${codeBlocks.length}%%%`;
    codeBlocks.push(`\n\`\`\`${lang}\n${cleanCode}\n\`\`\`\n`);
    return placeholder;
  });

  content = content.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => {
    const cleanCode = decodeHtml(code.replace(/<[^>]+>/g, '')).trim();
    const lang = detectLang(cleanCode);
    const placeholder = `%%%CODE_BLOCK_${codeBlocks.length}%%%`;
    codeBlocks.push(`\n\`\`\`${lang}\n${cleanCode}\n\`\`\`\n`);
    return placeholder;
  });

  // 5. Extract tables with placeholders
  const tables = [];
  content = content.replace(/<table[\s\S]*?<\/table>/gi, (tbl) => {
    const formatted = formatTable(tbl);
    const placeholder = `%%%TABLE_${tables.length}%%%`;
    tables.push(formatted);
    return placeholder;
  });

  // 6. Remove floating metadata/badges that precede headings
  content = content.replace(/<div class="section-label">([\s\S]*?)<\/div>/gi, '');
  content = content.replace(/<span class="section-label">([\s\S]*?)<\/span>/gi, '');
  content = content.replace(/<div class="kicker">([\s\S]*?)<\/div>/gi, '');
  content = content.replace(/<span class="badge">([\s\S]*?)<\/span>/gi, '');
  content = content.replace(/<span class="lesson-num">([\s\S]*?)<\/span>/gi, '');
  content = content.replace(/<div class="chapter-label">([\s\S]*?)<\/div>/gi, '');

  // 7. Buttons conversion (quiz options & recall questions)
  content = content.replace(/<button[^>]*class="[^"]*opt[^"]*"[^>]*data-why="([^"]*)"[^>]*>([\s\S]*?)<\/button>/gi, (_, why, text) => {
    return `\n- **${cleanText(text).trim()}** — *(Explanation: ${cleanText(why).trim()})*\n`;
  });
  content = content.replace(/<button[^>]*class="[^"]*recall-btn[^"]*"[^>]*>([\s\S]*?)<\/button>/gi, (_, text) => {
    return `\n\n<Callout type="info" title="Quick Recall">\n${cleanText(text).trim()}\n</Callout>\n\n`;
  });
  // Remove copy and action buttons
  content = content.replace(/<button[\s\S]*?<\/button>/gi, '');

  // 8. Details / Summary to clean details blocks
  content = content.replace(/<details[^>]*>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi, (_, summary, body) => {
    const s = cleanText(summary).trim();
    const b = cleanText(body).trim();
    return `\n\n<details>\n<summary>${s}</summary>\n\n${b}\n\n</details>\n\n`;
  });

  // 9. Callouts -> <Callout type="...">
  content = content.replace(/<(div|aside)[^>]*class="[^"]*(tip|warn|warning|note|callout)[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, type, body) => {
    let calloutType = 'info';
    if (type.includes('tip')) calloutType = 'tip';
    else if (type.includes('warn')) calloutType = 'warn';
    const innerText = cleanText(body).trim();
    return `\n\n<Callout type="${calloutType}">\n${innerText}\n</Callout>\n\n`;
  });

  // 10. Headings with NUMBER REMOVAL
  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, h) => {
    const cleaned = stripNumbering(cleanText(h));
    return `\n\n# ${cleaned}\n\n`;
  });
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, h) => {
    const cleaned = stripNumbering(cleanText(h));
    return `\n\n## ${cleaned}\n\n`;
  });
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, h) => {
    const cleaned = stripNumbering(cleanText(h));
    return `\n\n### ${cleaned}\n\n`;
  });
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, h) => {
    const cleaned = stripNumbering(cleanText(h));
    return `\n\n#### ${cleaned}\n\n`;
  });
  content = content.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, h) => {
    const cleaned = stripNumbering(cleanText(h));
    return `\n\n##### ${cleaned}\n\n`;
  });

  // 11. Lists
  content = content.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, body) => {
    const items = [];
    const liMatches = body.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    for (const li of liMatches) {
      const inner = li.replace(/^<li[^>]*>/i, '').replace(/<\/li>$/i, '');
      items.push(`- ${cleanText(inner).trim()}`);
    }
    return '\n\n' + items.join('\n') + '\n\n';
  });

  content = content.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, body) => {
    const items = [];
    const liMatches = body.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    let idx = 1;
    for (const li of liMatches) {
      const inner = li.replace(/^<li[^>]*>/i, '').replace(/<\/li>$/i, '');
      items.push(`${idx++}. ${cleanText(inner).trim()}`);
    }
    return '\n\n' + items.join('\n') + '\n\n';
  });

  // 12. Definition lists
  content = content.replace(/<dl[^>]*>([\s\S]*?)<\/dl>/gi, (_, body) => {
    let out = '\n\n';
    const parts = body.match(/<(dt|dd)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
    for (const p of parts) {
      if (p.startsWith('<dt')) {
        const text = p.replace(/^<dt[^>]*>/i, '').replace(/<\/dt>$/i, '');
        out += `\n**${cleanText(text).trim()}**:\n`;
      } else {
        const text = p.replace(/^<dd[^>]*>/i, '').replace(/<\/dd>$/i, '');
        out += `${cleanText(text).trim()}\n`;
      }
    }
    return out + '\n\n';
  });

  // 13. Paragraphs
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, p) => {
    const text = cleanText(p).trim();
    if (!text) return '';
    return `\n\n${text}\n\n`;
  });

  // 14. Command syntax spans
  content = content.replace(/<span class="syntax"[^>]*>([\s\S]*?)<\/span>/gi, (_, syn) => {
    return `\n\n**Syntax:** \`${decodeHtml(syn.replace(/<[^>]+>/g, '')).trim()}\`\n\n`;
  });

  // 15. Inline formatting across full text
  content = content.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, c) => `**${cleanText(c).trim()}**`);
  content = content.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, c) => `*${cleanText(c).trim()}*`);
  content = content.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => `\`${decodeHtml(c.replace(/<[^>]+>/g, '')).replace(/`/g, '\\`')}\``);
  content = content.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => `[${cleanText(text).trim()}](${href})`);

  // 16. Strip ALL remaining HTML tags
  content = content.replace(/<\/?(?!(?:Callout|LinuxCommandsExplorer|UvBenchmarkLab|UvCommandBuilder|UvTerminalSimulator|GitGraphSimulator|ShellCliGuiComparison|ShellPermissionsCalculator|PowershellPipelineDemo|details|summary|kbd|br)\b)[a-zA-Z0-9_\-]+[^>]*>/gi, '');

  // 17. Clean up lines that are accidental H1 from terminal comments like "# Windows" or "# navigate..."
  content = content.split('\n').map(line => {
    const trimmed = line.trim();
    if (/^#\s+(macOS|Linux|Windows|find|npm|yarn|pnpm|bun|navigate|in an ordinary|click|run)\b/i.test(trimmed)) {
      return `\`${trimmed}\``;
    }
    // Also remove stray raw lines that say "Chapter 00", "Part 01", etc.
    if (/^(Chapter\s+\d+|Part\s+\d+(\s*·\s*[\w\s]+)?|Foundations\s*·\s*\d+|\d+\s*\/\s*BRIEFING)/i.test(trimmed)) {
      return '';
    }
    return line;
  }).join('\n');

  // 18. Escape curly braces outside code blocks
  content = content.replace(/\{/g, '\\{').replace(/\}/g, '\\}');

  // 19. Restore allowed JSX components
  content = content
    .replace(/\\<(Callout|LinuxCommandsExplorer|UvBenchmarkLab|UvCommandBuilder|UvTerminalSimulator|GitGraphSimulator|ShellCliGuiComparison|ShellPermissionsCalculator|PowershellPipelineDemo|details|summary|kbd|br|\/Callout|\/details|\/summary|\/kbd)/g, '<$1')
    .replace(/<(?!\/?(Callout|LinuxCommandsExplorer|UvBenchmarkLab|UvCommandBuilder|UvTerminalSimulator|GitGraphSimulator|ShellCliGuiComparison|ShellPermissionsCalculator|PowershellPipelineDemo|details|summary|kbd|br)\b)([\w\-]+)/g, '&lt;$2');

  // 20. Restore tables
  tables.forEach((t, i) => {
    content = content.replace(`%%%TABLE_${i}%%%`, t);
  });

  // 21. Restore code blocks
  codeBlocks.forEach((c, i) => {
    content = content.replace(`%%%CODE_BLOCK_${i}%%%`, c);
  });

  // Clean extra blank lines
  content = content.replace(/\n{3,}/g, '\n\n').trim();

  // Frontmatter
  let frontmatter = `---
title: "${config.title}"
description: "${config.description}"
icon: ${config.icon}
---

`;

  if (config.extraComponentTop) {
    frontmatter += `${config.extraComponentTop}\n\n`;
  }

  let finalMdx = frontmatter + content;
  if (config.extraComponentBottom) {
    finalMdx += `\n\n${config.extraComponentBottom}\n`;
  }

  return finalMdx;
}

const FILES = [
  {
    src: 'npm.html',
    dest: 'content/docs/developer-tools/npm.mdx',
    fileKey: 'npm',
    title: 'npm for Beginners',
    description: 'Everything you need to know about npm — from package installation to semantic versioning and package-lock.',
    icon: 'Package',
  },
  {
    src: 'pnpm.html',
    dest: 'content/docs/developer-tools/pnpm.mdx',
    fileKey: 'pnpm',
    title: 'pnpm for Beginners',
    description: 'Fast, disk-efficient, and strict alternative to npm using content-addressable storage and hard links.',
    icon: 'Box',
  },
  {
    src: 'bun.html',
    dest: 'content/docs/developer-tools/bun.mdx',
    fileKey: 'bun',
    title: 'Bun for Beginners',
    description: 'The all-in-one JavaScript toolkit: runtime, package manager, bundler, and test runner powered by Zig and JavaScriptCore.',
    icon: 'Zap',
  },
  {
    src: 'bun vs npm.html',
    dest: 'content/docs/developer-tools/bun-vs-npm.mdx',
    fileKey: 'bun-vs-npm',
    title: 'npm vs Yarn vs pnpm vs Bun',
    description: 'Comprehensive comparison of Node.js package managers: speed benchmarks, hoisting, and disk footprint.',
    icon: 'Scale',
  },
  {
    src: 'linux_basic.html',
    dest: 'content/docs/developer-tools/linux/basics.mdx',
    fileKey: 'linux-basic',
    title: 'Linux Fundamentals',
    description: 'Core mental models: shells, terminals, Unix directory hierarchy, users, permissions, processes, and package managers.',
    icon: 'Terminal',
  },
  {
    src: 'linux_commands_50.html',
    dest: 'content/docs/developer-tools/linux/commands-50.mdx',
    fileKey: 'linux-50',
    title: '50 Most Popular Linux Commands',
    description: 'Complete reference manual: navigation, file manipulation, text processing, processes, networking, archives, and permissions.',
    icon: 'ListOrdered',
    stripFoundations: true,
    extraComponentTop: '<LinuxCommandsExplorer />',
  },
  {
    src: 'UV.html',
    dest: 'content/docs/developer-tools/uv.mdx',
    fileKey: 'uv',
    title: 'uv: The Python Toolchain in One Command',
    description: "Astral's ultra-fast Rust-based Python package and project manager: pip replacement, virtual environments, and lockfiles.",
    icon: 'Rocket',
    extraComponentTop: '<UvBenchmarkLab />\n\n<UvCommandBuilder />\n\n<UvTerminalSimulator />',
  },
  {
    src: 'Git.html',
    dest: 'content/docs/developer-tools/git.mdx',
    fileKey: 'git',
    title: 'Learning Git',
    description: 'From first commit to team workflows: the three trees, DAG commit history, branching, merge vs rebase, and undoing safely.',
    icon: 'GitBranch',
    extraComponentTop: '<GitGraphSimulator />',
  },
  {
    src: 'shell_CLI.html',
    dest: 'content/docs/developer-tools/shell-cli.mdx',
    fileKey: 'shell-cli',
    title: 'Shell Scripting & CLI',
    description: 'From beginner terminal usage to automation wizard: standard streams, piping, redirection, loops, and robust Bash scripting.',
    icon: 'SquareTerminal',
    extraComponentTop: '<ShellCliGuiComparison />\n\n<ShellPermissionsCalculator />',
  },
  {
    src: 'powerhell.html',
    dest: 'content/docs/developer-tools/powershell.mdx',
    fileKey: 'powershell',
    title: 'PowerShell: Objects, Not Text',
    description: "Understanding PowerShell's object pipeline architecture: cmdlets, filtering, sorting, and object manipulation.",
    icon: 'SquareTerminal',
    extraComponentTop: '<PowershellPipelineDemo />',
  },
];

console.log('Generating cleanly structured developer-tools MDX lessons...');
for (const f of FILES) {
  const srcPath = path.join('tools-learn', f.src);
  if (!fs.existsSync(srcPath)) continue;
  const rawHtml = fs.readFileSync(srcPath, 'utf8');
  const mdx = convertHtml(rawHtml, f);
  fs.writeFileSync(f.dest, mdx, 'utf8');
  console.log(`✓ Cleaned & Generated ${f.dest} (${mdx.length} bytes)`);
}
console.log('Generation complete!');
