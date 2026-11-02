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

const isDev = process.env.NODE_ENV === "development";
const rawActiveModule = process.env.ACTIVE_DOCS_MODULE?.trim();
// Scoped dev is an opt-in speed optimization. Default to all docs ("content/docs")
// unless ACTIVE_DOCS_MODULE is set to a specific module (e.g. "dsa", "learn-python").
const activeModule =
  isDev && rawActiveModule && rawActiveModule !== "all" ? rawActiveModule : "";

const docsDir = activeModule ? `content/docs/${activeModule}` : "content/docs";

export const docs = defineDocs({
  dir: docsDir,
  docs: {
    async: true,
    postprocess: {
      includeProcessedMarkdown: !isDev,
    },
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
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
