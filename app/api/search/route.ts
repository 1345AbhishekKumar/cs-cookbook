import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";
import type { StructuredData } from "fumadocs-core/mdx-plugins";

function extractStructure(raw: string): StructuredData {
  // Strip YAML frontmatter
  const body = raw.replace(/^---[\s\S]*?---\s*/, "");
  const lines = body.split("\n");
  const headings: StructuredData["headings"] = [];
  const contents: StructuredData["contents"] = [];
  let currentHeading: string | undefined = undefined;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("#")) {
      const match = trimmed.match(/^#{1,6}\s+(.+)$/);
      if (match) {
        const title = match[1].replace(/[*_`]/g, "").trim();
        const id = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        headings.push({ id, content: title });
        currentHeading = id;
        continue;
      }
    }

    // Skip code block fences, imports, exports, and component tags
    if (
      trimmed.startsWith("```") ||
      trimmed.startsWith("<") ||
      trimmed.startsWith("import ") ||
      trimmed.startsWith("export ")
    ) {
      continue;
    }

    if (trimmed.length > 5) {
      contents.push({
        heading: currentHeading,
        content: trimmed.replace(/[*_`]/g, "").slice(0, 300),
      });
    }
  }

  return { headings, contents };
}

const isDev = process.env.NODE_ENV === "development";

export const { GET } = createFromSource(source, {
  buildIndex: async (page) => {
    let structuredData: StructuredData = { headings: [], contents: [] };
    if (!isDev) {
      try {
        const raw = await page.data.getText("raw");
        structuredData = extractStructure(raw);
      } catch {
        structuredData = { headings: [], contents: [] };
      }
    }

    return {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData,
    };
  },
});
