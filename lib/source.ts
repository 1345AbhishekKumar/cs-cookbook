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

const COMMON_ICON_ALIASES: Record<string, string> = {
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
};

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

const customLucidePlugin = {
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

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [customLucidePlugin],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
});
