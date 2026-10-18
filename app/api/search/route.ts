import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";
import type { StructuredData } from "fumadocs-core/mdx-plugins";

/**
 * Extracts only headings and clean prose text.
 * Strictly ignores all code blocks (```...```), Mermaid diagrams, JSX tags, and markdown images.
 */
function extractProseStructure(raw: string): StructuredData {
  // Strip YAML frontmatter
  const body = raw.replace(/^---[\s\S]*?---\s*/, "");
  const lines = body.split("\n");
  const headings: StructuredData["headings"] = [];
  const contents: StructuredData["contents"] = [];
  let currentHeading: string | undefined = undefined;
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Toggle code fence: covers ```ts, ```python, ```mermaid, etc.
    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    // Skip everything inside code fences & diagrams
    if (inCodeBlock) continue;

    // Skip JSX/HTML tags, imports, exports, and image markdown
    if (
      trimmed.startsWith("<") ||
      trimmed.startsWith("import ") ||
      trimmed.startsWith("export ") ||
      trimmed.startsWith("![")
    ) {
      continue;
    }

    // Capture Headings (##, ###, etc.)
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

    // Capture meaningful prose sentences (exclude markdown table borders)
    if (trimmed.length > 20 && !trimmed.startsWith("|")) {
      contents.push({
        heading: currentHeading,
        content: trimmed.replace(/[*_`]/g, "").slice(0, 250),
      });
    }
  }

  return { headings, contents };
}

/**
 * Generates breadcrumbs in O(1) from the page URL without recursive tree scanning.
 */
function fastBreadcrumbs(url: string): string[] {
  return url
    .replace(/^\/docs\/?/, "")
    .split("/")
    .slice(0, -1)
    .map((segment) =>
      segment
        .replace(/^(\d+-)/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    );
}

const isDev = process.env.NODE_ENV === "development";

const { GET: originalGET } = createFromSource(source, {
  buildIndex: async (page) => {
    let structuredData: StructuredData = { headings: [], contents: [] };

    // In development, avoid reading and parsing all 789+ files into memory
    if (!isDev) {
      try {
        const raw = await page.data.getText("raw");
        structuredData = extractProseStructure(raw);
      } catch {
        structuredData = { headings: [], contents: [] };
      }
    }

    return {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      breadcrumbs: fastBreadcrumbs(page.url),
      structuredData,
    };
  },
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query")?.trim();

  // If warm-up ping in dev, return immediately without locking the server
  if (query === "__warmup__" || query === "warmup") {
    if (isDev) {
      return Response.json([]);
    }
    await originalGET(request);
    return Response.json([]);
  }

  return originalGET(request);
}
