import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import {
  rehypeCodeDefaultOptions,
  remarkMdxMermaid,
} from "fumadocs-core/mdx-plugins";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { visit } from "unist-util-visit";

function remarkNormalizeCodeLang() {
  return (tree: any) => {
    visit(tree, "code", (node: any) => {
      if (node.lang === "terminal" || node.lang === "cisco") {
        node.lang = "bash";
      }
    });
  };
}

function remarkUnwrapHeadingLinks() {
  return (tree: any) => {
    visit(tree, "heading", (node: any) => {
      if (!Array.isArray(node.children)) return;
      node.children = node.children.flatMap((child: any) => {
        if (child.type === "link") {
          return child.children || [];
        }
        return child;
      });
    });
  };
}

const GLOBALLY_PROVIDED_IMPORT_PREFIXES = [
  "fumadocs-ui/components/",
  "@/components/",
];
const GLOBALLY_PROVIDED_IMPORT_EXACT = new Set(["lucide-react"]);

/**
 * In Fumadocs Dynamic Mode (runtime `outputFormat: "function-body"`), static ESM
 * imports of TSX/UI components cannot be executed directly via Node's native
 * `import()`. All UI & simulator components used across `content/docs` are
 * already supplied globally by `getMDXComponents()` in `components/mdx.tsx`,
 * so stripping those redundant import declarations lets MDX resolve them from
 * `props.components` without modifying any `.mdx` files.
 */
function remarkStripGlobalComponentImports() {
  return (tree: any) => {
    if (!Array.isArray(tree.children)) return;
    tree.children = tree.children.filter((node: any) => {
      if (node.type !== "mdxjsEsm") return true;
      const body = node.data?.estree?.body;
      if (!Array.isArray(body) || body.length === 0) return true;
      const allProvidedImports = body.every((stmt: any) => {
        if (stmt.type !== "ImportDeclaration") return false;
        const source = stmt.source?.value;
        if (typeof source !== "string") return false;
        return (
          GLOBALLY_PROVIDED_IMPORT_EXACT.has(source) ||
          GLOBALLY_PROVIDED_IMPORT_PREFIXES.some((prefix) =>
            source.startsWith(prefix)
          )
        );
      });
      return !allProvidedImports;
    });
  };
}

/**
 * Guards against unescaped `{...}` inside prose (for example unparsed inline
 * LaTeX `\(... \text{ req/sec} ...\)`) being evaluated as undeclared JS
 * identifiers at render time, without modifying any documentation `.mdx` files.
 */
function remarkEscapeUndeclaredTextExpressions() {
  function hasIdentifier(ast: any): boolean {
    if (!ast || typeof ast !== "object") return false;
    if (ast.type === "Identifier") return true;
    for (const val of Object.values(ast)) {
      if (Array.isArray(val)) {
        if (val.some(hasIdentifier)) return true;
      } else if (val && typeof val === "object") {
        if (hasIdentifier(val)) return true;
      }
    }
    return false;
  }

  return (tree: any) => {
    visit(
      tree,
      "mdxTextExpression",
      (node: any, index: number | undefined, parent: any) => {
        if (typeof index !== "number" || !parent) return;
        const estree = node.data?.estree;
        if (estree && hasIdentifier(estree)) {
          parent.children[index] = {
            type: "text",
            value: `{${node.value ?? ""}}`,
          };
        }
      }
    );
  };
}

const isDev = process.env.NODE_ENV !== "production";
const rawActiveModule = process.env.ACTIVE_DOCS_MODULE?.trim();
// Scoped dev is an opt-in speed optimization. Default to all docs ("content/docs")
// unless ACTIVE_DOCS_MODULE is set to a specific module (e.g. "dsa", "learn-python").
const activeModule =
  isDev && rawActiveModule && rawActiveModule !== "all" ? rawActiveModule : "";

const docsDir = activeModule ? `content/docs/${activeModule}` : "content/docs";

export const docs = defineDocs({
  dir: docsDir,
  docs: {
    dynamic: true,
  },
});

export default defineConfig({
  mdxOptions: {
    // Search parses raw markdown via `extractProseStructure` in `app/api/search/route.ts`,
    // so `structuredData` exports are unused (~14 MB of dead compiled JS).
    remarkStructureOptions: false,
    // `components/mdx.tsx` renders plain `<img loading="lazy" />` and all 172 images
    // use absolute/external URLs (0 relative imports); skip build-time image probing.
    remarkImageOptions: false,
    remarkPlugins: [
      remarkStripGlobalComponentImports,
      remarkEscapeUndeclaredTextExpressions,
      remarkNormalizeCodeLang,
      remarkUnwrapHeadingLinks,
      remarkMdxMermaid,
      remarkMath,
    ],
    rehypePlugins: (v) => [[rehypeKatex, { strict: false }], ...(v ?? [])],
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      fallbackLanguage: "plaintext",
    },
  },
});
