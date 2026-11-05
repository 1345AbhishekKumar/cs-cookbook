import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Mock fumadocs-ui/og
vi.mock("fumadocs-ui/og", () => ({
  generateOGImage: vi
    .fn()
    .mockImplementation(({ title, description, site }: any) => {
      return new Response(JSON.stringify({ title, description, site }), {
        headers: { "Content-Type": "image/png" },
      });
    }),
}));

import { source } from "@/lib/source";
import { GET, generateStaticParams } from "@/app/og/docs/[...slug]/route";

describe("app/og/docs/[...slug]/route.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPage = {
    locale: "en",
    slugs: ["dsa", "searching"],
    data: {
      title: "Binary Search",
      description: "Logarithmic search algorithm in sorted arrays",
    },
  };

  it("GET generates an OG image response for a valid slug", async () => {
    const getPageSpy = vi
      .spyOn(source, "getPage")
      .mockReturnValue(mockPage as any);

    const req = new Request(
      "http://localhost:3000/og/docs/dsa/searching/image.png"
    );
    const response = await GET(req, {
      params: Promise.resolve({ slug: ["dsa", "searching", "image.png"] }),
    } as any);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");

    const data = await response.json();
    expect(data.title).toBe("Binary Search");
    expect(data.site).toBe("Learning Roadmap");

    // Slicing verified: 'image.png' was stripped and ['dsa', 'searching'] was queried
    expect(getPageSpy).toHaveBeenCalledWith(["dsa", "searching"]);

    getPageSpy.mockRestore();
  });

  it("GET throws notFound() when document does not exist", async () => {
    const getPageSpy = vi
      .spyOn(source, "getPage")
      .mockReturnValue(undefined as any);

    const req = new Request("http://localhost:3000/og/docs/invalid/image.png");
    await expect(
      GET(req, {
        params: Promise.resolve({ slug: ["invalid", "image.png"] }),
      } as any)
    ).rejects.toThrow("NEXT_NOT_FOUND");

    getPageSpy.mockRestore();
  });

  it("generateStaticParams maps source.getPages into locale and image segment routes", () => {
    const getPagesSpy = vi.spyOn(source, "getPages").mockReturnValue([
      {
        locale: "en",
        slugs: ["intro"],
      } as any,
    ]);

    const params = generateStaticParams();
    expect(Array.isArray(params)).toBe(true);
    expect(params.length).toBe(1);
    expect(params[0].lang).toBe("en");
    expect(params[0].slug).toContain("image.png");

    getPagesSpy.mockRestore();
  });
});
