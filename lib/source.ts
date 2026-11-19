import { docs } from "@/.source";
import { llms, loader } from "fumadocs-core/source";
import * as LucideIcons from "lucide-react";
import { createElement } from "react";
import { docsRoute } from "./shared";

function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}
import { COMMON_ICON_ALIASES } from "./icon-aliases";

const iconCache = new Map<string, any>();

export function resolveLucideIcon(iconName?: string) {
  if (!iconName || typeof iconName !== "string") return undefined;

  const clean = iconName.trim().replace(/^['"]|['"]$/g, "");
  if (!clean) return undefined;

  if (iconCache.has(clean)) {
    const cached = iconCache.get(clean);
    return cached ? createElement(cached) : undefined;
  }

  const aliased = COMMON_ICON_ALIASES[clean] || clean;

  // 1. Direct match in canonical icons dictionary
  let Icon =
    (LucideIcons.icons as Record<string, any>)[aliased] ||
    (LucideIcons.icons as Record<string, any>)[clean];

  // 2. Direct match in root exports (covers all aliases and components in lucide-react)
  if (!Icon) {
    Icon =
      (LucideIcons as Record<string, any>)[aliased] ||
      (LucideIcons as Record<string, any>)[clean];
  }

  // 3. Try PascalCase (for kebab-case or snake_case like 'book-open' -> 'BookOpen')
  if (!Icon) {
    const pascal = toPascalCase(clean);
    const pascalAliased = COMMON_ICON_ALIASES[pascal] || pascal;
    Icon =
      (LucideIcons.icons as Record<string, any>)[pascalAliased] ||
      (LucideIcons.icons as Record<string, any>)[pascal];
  }

  // 4. Try with 'Icon' suffix (e.g. 'TerminalIcon')
  if (!Icon && !clean.endsWith("Icon")) {
    Icon = (LucideIcons as Record<string, any>)[`${clean}Icon`];
  }

  iconCache.set(clean, Icon || null);

  if (Icon) {
    return createElement(Icon);
  }

  return undefined;
}

export const customLucidePlugin = {
  name: "fumadocs:lucide-resolver",
  transformPageTree: {
    file(node: any) {
      if (typeof node?.icon === "string") {
        node.icon = resolveLucideIcon(node.icon);
      }
      return node;
    },
    folder(node: any) {
      if (typeof node?.icon === "string") {
        node.icon = resolveLucideIcon(node.icon);
      }
      return node;
    },
    separator(node: any) {
      if (typeof node?.icon === "string") {
        node.icon = resolveLucideIcon(node.icon);
      }
      return node;
    },
  },
};

const isDev = process.env.NODE_ENV !== "production";
const rawActiveModule = process.env.ACTIVE_DOCS_MODULE?.trim();
// Scoped dev is an opt-in speed optimization. Default to all docs
// unless ACTIVE_DOCS_MODULE is explicitly set to a specific module (e.g. "dsa", "learn-python").
export const activeModule =
  isDev && rawActiveModule && rawActiveModule !== "all" ? rawActiveModule : "";

export const isScopedModuleDev = Boolean(activeModule);

export const moduleBaseUrl = isScopedModuleDev
  ? `${docsRoute}/${activeModule}`
  : docsRoute;

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: moduleBaseUrl,
  source: docs.toFumadocsSource(),
  plugins: [customLucidePlugin],
});

function extractCleanMarkdown(raw: string): string {
  const withoutFrontmatter = raw.replace(/^---[\s\S]*?---\r?\n?/, "");
  const lines = withoutFrontmatter.split(/\r?\n/);
  const out: string[] = [];
  let inCodeBlock = false;
  let inMultiLineImport = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      out.push(line);
      continue;
    }
    if (inCodeBlock) {
      out.push(line);
      continue;
    }
    if (inMultiLineImport) {
      if (trimmed.includes(" from ") || trimmed.endsWith(";")) {
        inMultiLineImport = false;
      }
      continue;
    }
    if (/^import\s+/.test(trimmed)) {
      if (!trimmed.includes(" from ") && !trimmed.endsWith(";")) {
        inMultiLineImport = true;
      }
      continue;
    }
    out.push(line);
  }

  return out.join("\n").trim();
}

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${extractCleanMarkdown(await page.data.getText("raw"))}`,
});
