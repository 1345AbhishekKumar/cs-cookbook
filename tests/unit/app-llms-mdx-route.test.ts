import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

import { source, docsLlms } from "@/lib/source";
import {
  GET,
  generateStaticParams,
} from "@/app/llms.mdx/docs/[[...slug]]/route";

describe("app/llms.mdx/docs/[[...slug]]/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPage = {
    locale: "en",
    url: "/docs/dsa",
    slugs: ["dsa"],
    data: {
      title: "Data Structures & Algorithms",
      description: "Foundational algorithms",
    },
  };

  it("GET returns a text/markdown response with rendered LLM page content", async () => {
    const getPageSpy = vi
      .spyOn(source, "getPage")
      .mockReturnValue(mockPage as any);
    const docsLlmsPageSpy = vi
      .spyOn(docsLlms, "page")
      .mockResolvedValue(
        "# Data Structures & Algorithms\n\nFull lesson prose."
      );

    const req = new Request(
      "http://localhost:3000/llms.mdx/docs/dsa/content.md"
    );
    const response = await GET(req, {
      params: Promise.resolve({ slug: ["dsa", "content.md"] }),
    } as any);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/markdown");

    const text = await response.text();
    expect(text).toContain("# Data Structures & Algorithms");
    expect(text).toContain("Full lesson prose.");

    // Slicing verified: 'content.md' is stripped and ['dsa'] queried
    expect(getPageSpy).toHaveBeenCalledWith(["dsa"]);

    getPageSpy.mockRestore();
    docsLlmsPageSpy.mockRestore();
  });

  it("GET throws notFound() when the requested markdown slug does not resolve", async () => {
    const getPageSpy = vi
      .spyOn(source, "getPage")
      .mockReturnValue(undefined as any);

    const req = new Request(
      "http://localhost:3000/llms.mdx/docs/unknown/content.md"
    );
    await expect(
      GET(req, {
        params: Promise.resolve({ slug: ["unknown", "content.md"] }),
      } as any)
    ).rejects.toThrow("NEXT_NOT_FOUND");

    getPageSpy.mockRestore();
  });

  it("generateStaticParams maps all source pages to static markdown URL segments", () => {
    const getPagesSpy = vi.spyOn(source, "getPages").mockReturnValue([
      {
        locale: "en",
        slugs: ["computer-basics", "bits"],
      } as any,
    ]);

    const params = generateStaticParams();
    expect(Array.isArray(params)).toBe(true);
    expect(params.length).toBe(1);
    expect(params[0].lang).toBe("en");
    expect(params[0].slug).toContain("content.md");

    getPagesSpy.mockRestore();
  });
});
