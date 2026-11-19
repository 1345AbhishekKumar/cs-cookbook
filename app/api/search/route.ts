import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";
import type { StructuredData } from "fumadocs-core/mdx-plugins";
import { extractProseStructure, fastBreadcrumbs } from "@/lib/search-utils";

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
