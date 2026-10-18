import fs from "fs";
import path from "path";
import * as LucideIcons from "lucide-react";

// Load aliases from lib/icon-aliases.ts or fallback to canonical map
let COMMON_ICON_ALIASES = {};
try {
  const aliasesModule = await import("../lib/icon-aliases.ts");
  COMMON_ICON_ALIASES = aliasesModule.COMMON_ICON_ALIASES || {};
} catch {
  COMMON_ICON_ALIASES = {
    Sliders: "SlidersHorizontal",
    Building2: "Building",
    AlertCircle: "CircleAlert",
    CheckCircle: "CircleCheck",
    CheckCircle2: "CircleCheckBig",
    HelpCircle: "CircleHelp",
    XCircle: "CircleX",
    PlusCircle: "CirclePlus",
    MinusCircle: "CircleMinus",
    AlertTriangle: "TriangleAlert",
    AlertOctagon: "OctagonAlert",
    ArrowRightCircle: "CircleArrowRight",
    PlayCircle: "CirclePlay",
    PauseCircle: "CirclePause",
    StopCircle: "CircleStop",
    Edit: "SquarePen",
    Edit2: "Pen",
    Edit3: "Pencil",
    FileEdit: "FilePenLine",
    Delete: "Backspace",
    Trash2: "Trash",
    SearchCheck: "CheckSearch",
    TerminalSquare: "SquareTerminal",
    ActivitySquare: "SquareActivity",
    Github: "GitPullRequest",
    GitHub: "GitPullRequest",
  };
}

// Build sets of all valid Lucide icons
const canonicalIcons = new Set(Object.keys(LucideIcons.icons || {}));
const allExports = new Set(Object.keys(LucideIcons));
const allLowerNames = new Map();

for (const name of allExports) {
  if (
    typeof LucideIcons[name] === "function" ||
    typeof LucideIcons[name] === "object"
  ) {
    allLowerNames.set(name.toLowerCase(), name);
  }
}

function toPascalCase(str) {
  return str
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function resolveIcon(iconName) {
  if (!iconName || typeof iconName !== "string") return { valid: false };

  const clean = iconName.trim().replace(/^['"]|['"]$/g, "");
  if (!clean) return { valid: false };

  // 1. Direct canonical match
  if (canonicalIcons.has(clean)) {
    return { valid: true, resolvedName: clean, type: "canonical" };
  }

  // 2. Common alias match
  if (
    COMMON_ICON_ALIASES[clean] &&
    (canonicalIcons.has(COMMON_ICON_ALIASES[clean]) ||
      allExports.has(COMMON_ICON_ALIASES[clean]))
  ) {
    return {
      valid: true,
      resolvedName: COMMON_ICON_ALIASES[clean],
      type: "alias",
    };
  }

  // 3. Direct export match in lucide-react (covers deprecated names & component aliases)
  if (
    allExports.has(clean) &&
    clean !== "icons" &&
    clean !== "createLucideIcon"
  ) {
    return { valid: true, resolvedName: clean, type: "export" };
  }

  // 4. Try PascalCase (kebab-case or snake_case: e.g. "book-open" -> "BookOpen")
  const pascal = toPascalCase(clean);
  if (canonicalIcons.has(pascal)) {
    return { valid: true, resolvedName: pascal, type: "pascal-converted" };
  }
  if (
    COMMON_ICON_ALIASES[pascal] &&
    (canonicalIcons.has(COMMON_ICON_ALIASES[pascal]) ||
      allExports.has(COMMON_ICON_ALIASES[pascal]))
  ) {
    return {
      valid: true,
      resolvedName: COMMON_ICON_ALIASES[pascal],
      type: "alias",
    };
  }
  if (
    allExports.has(pascal) &&
    pascal !== "icons" &&
    pascal !== "createLucideIcon"
  ) {
    return { valid: true, resolvedName: pascal, type: "export" };
  }

  // 5. Try with "Icon" suffix (e.g. "TerminalIcon")
  if (!clean.endsWith("Icon") && allExports.has(`${clean}Icon`)) {
    return { valid: true, resolvedName: `${clean}Icon`, type: "icon-suffix" };
  }

  // 6. Case-insensitive lookup fallback
  const lower = clean.toLowerCase().replace(/[-_]/g, "");
  for (const [key, val] of allLowerNames.entries()) {
    if (key.replace(/[-_]/g, "") === lower) {
      return { valid: true, resolvedName: val, type: "case-insensitive" };
    }
  }

  return { valid: false, clean };
}

// Levenshtein distance for suggesting closest matching icon
function getSuggestion(name) {
  const clean = name.toLowerCase().replace(/[-_]/g, "");
  let bestMatch = null;
  let minDistance = 4; // Maximum edit distance allowed for suggestions

  for (const icon of canonicalIcons) {
    const target = icon.toLowerCase();
    const dist = levenshtein(clean, target);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = icon;
    }
  }
  return bestMatch;
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function getFiles(dir, extensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(full, extensions));
    } else if (extensions.some((ext) => file.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

const contentFiles = getFiles("content", [".mdx", ".md", ".json"]);
console.log(
  `Scanning ${contentFiles.length} documentation files for icon usage...\n`
);

let totalChecked = 0;
const errors = [];
const stats = {
  frontmatter: 0,
  meta: 0,
  jsxProps: 0,
  roadmap: 0,
};

// 1. Scan Content Files (Frontmatter, Meta.json, JSX Component props)
for (const file of contentFiles) {
  const relPath = path.relative(process.cwd(), file);
  const content = fs.readFileSync(file, "utf8");

  if (file.endsWith(".json")) {
    try {
      const data = JSON.parse(content);
      // Meta root icon
      if (data.icon && typeof data.icon === "string") {
        totalChecked++;
        stats.meta++;
        const res = resolveIcon(data.icon);
        if (!res.valid) {
          const suggestion = getSuggestion(data.icon);
          errors.push({
            file: relPath,
            location: 'meta.json property "icon"',
            icon: data.icon,
            suggestion,
          });
        }
      }

      // Meta pages array separator icons e.g. "---[icon] Title"
      if (Array.isArray(data.pages)) {
        data.pages.forEach((page, idx) => {
          if (typeof page === "string") {
            const sepMatch = page.match(/^---\[([a-zA-Z0-9_-]+)\]/);
            if (sepMatch) {
              totalChecked++;
              stats.meta++;
              const iconName = sepMatch[1];
              const res = resolveIcon(iconName);
              if (!res.valid) {
                const suggestion = getSuggestion(iconName);
                errors.push({
                  file: relPath,
                  location: `meta.json pages[${idx}] separator icon`,
                  icon: iconName,
                  suggestion,
                });
              }
            }
          }
        });
      }
    } catch {
      // JSON syntax errors handled elsewhere
    }
    continue;
  }

  // Markdown / MDX files
  const lines = content.split(/\r?\n/);

  // A. Frontmatter icon
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    const fmLines = fmMatch[1].split(/\r?\n/);
    fmLines.forEach((line, idx) => {
      const m = line.match(/^icon:\s*(.+)$/);
      if (m) {
        totalChecked++;
        stats.frontmatter++;
        const rawIcon = m[1].trim().replace(/^['"]|['"]$/g, "");
        const res = resolveIcon(rawIcon);
        if (!res.valid) {
          const suggestion = getSuggestion(rawIcon);
          errors.push({
            file: relPath,
            line: idx + 2, // 1-indexed, accounting for opening ---
            location: `Frontmatter icon`,
            icon: rawIcon,
            suggestion,
          });
        }
      }
    });
  }

  // B. JSX Component icon props: <Card icon="BookOpen" /> or icon={'Folder'}
  lines.forEach((line, lineIdx) => {
    const jsxIconRegex =
      /<([A-Z][a-zA-Z0-9]*)[^>]*\bicon=(?:\{['"]([^'"]+)['"]\}|['"]([^'"]+)['"])/g;
    let match;
    while ((match = jsxIconRegex.exec(line)) !== null) {
      const componentName = match[1];
      const iconValue = (match[2] || match[3] || "").trim();

      // Skip single-character badges/text icons
      if (iconValue.length <= 1) continue;

      totalChecked++;
      stats.jsxProps++;
      const res = resolveIcon(iconValue);
      if (!res.valid) {
        const suggestion = getSuggestion(iconValue);
        errors.push({
          file: relPath,
          line: lineIdx + 1,
          location: `<${componentName} icon="..." />`,
          icon: iconValue,
          suggestion,
        });
      }
    }
  });
}

// 2. Scan lib/roadmap.ts
const roadmapPath = path.join(process.cwd(), "lib", "roadmap.ts");
if (fs.existsSync(roadmapPath)) {
  const content = fs.readFileSync(roadmapPath, "utf8");
  const blockMatch = content.match(
    /export const roadmapItems:\s*RoadmapItem\[\]\s*=\s*\[([\s\S]*?)\];/
  );
  if (blockMatch) {
    const lines = blockMatch[1].split(/\r?\n/);
    lines.forEach((line, idx) => {
      const m = line.match(/^\s*icon:\s*([A-Za-z0-9_]+),?/);
      if (m && m[1] !== "LucideIcon") {
        const iconName = m[1];
        totalChecked++;
        stats.roadmap++;
        const res = resolveIcon(iconName);
        if (!res.valid) {
          const suggestion = getSuggestion(iconName);
          errors.push({
            file: "lib/roadmap.ts",
            line: idx + 1,
            location: `Roadmap item icon`,
            icon: iconName,
            suggestion,
          });
        }
      }
    });
  }
}

// Output Results
console.log("Summary of scanned icons:");
console.log(`  - Frontmatter icons: ${stats.frontmatter}`);
console.log(`  - meta.json icons:   ${stats.meta}`);
console.log(`  - JSX prop icons:    ${stats.jsxProps}`);
console.log(`  - Roadmap icons:     ${stats.roadmap}`);
console.log(`\nTotal icons validated: ${totalChecked}`);

if (errors.length > 0) {
  console.error(`\nFound ${errors.length} invalid icon reference(s):\n`);
  for (const err of errors) {
    const loc = err.line ? `${err.file}:${err.line}` : err.file;
    console.error(`--- ${loc} [${err.location}] ---`);
    console.error(`  Icon: "${err.icon}" is not a recognized Lucide icon.`);
    if (err.suggestion) {
      console.error(`  Did you mean: "${err.suggestion}"?`);
    }
    console.error("");
  }
  process.exit(1);
} else {
  console.log("\nAll icons validated successfully with 0 errors!");
  process.exit(0);
}
