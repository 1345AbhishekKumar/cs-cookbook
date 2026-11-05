import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  usePathname: vi.fn(() => "/docs"),
}));

// Mock fumadocs-ui/layouts/docs/page
vi.mock("fumadocs-ui/layouts/docs/page", () => ({
  DocsPage: ({ children, full }: any) => (
    <div data-testid="docs-page" data-full={String(Boolean(full))}>
      {children}
    </div>
  ),
  DocsTitle: ({ children }: any) => (
    <h1 data-testid="docs-title">{children}</h1>
  ),
  DocsDescription: ({ children, className }: any) => (
    <p data-testid="docs-desc" className={className}>
      {children}
    </p>
  ),
  DocsBody: ({ children }: any) => (
    <div data-testid="docs-body">{children}</div>
  ),
  MarkdownCopyButton: ({ markdownUrl }: any) => (
    <button data-testid="copy-btn" data-url={markdownUrl}>
      Copy
    </button>
  ),
  ViewOptionsPopover: ({ markdownUrl, githubUrl }: any) => (
    <div
      data-testid="view-options"
      data-markdown-url={markdownUrl}
      data-github-url={githubUrl}
    />
  ),
}));

// Mock source
import { source } from "@/lib/source";
import Page, {
  generateMetadata,
  generateStaticParams,
} from "@/app/docs/[[...slug]]/page";

describe("app/docs/[[...slug]]/page.tsx", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const mockDocPage = {
    url: "/docs/dsa/sorting",
    path: "dsa/sorting.mdx",
    slugs: ["dsa", "sorting"],
    locale: "en",
    data: {
      title: "Sorting Algorithms",
      description: "Learn Bubble, Selection, and Merge sort",
      full: false,
      load: vi.fn().mockResolvedValue({
        body: () => <div data-testid="mdx-rendered-content">MDX Content</div>,
        toc: [{ title: "Overview", url: "#overview", depth: 2 }],
      }),
      getText: vi.fn().mockResolvedValue("Text content for sorting algorithms"),
    },
  };

  it("renders a resolved documentation page with title, description, and copy tools", async () => {
    const getPageByUrlSpy = vi
      .spyOn(source, "getPageByUrl")
      .mockReturnValue(mockDocPage as any);

    const ui = await Page({
      params: Promise.resolve({ slug: ["dsa", "sorting"] }),
    } as any);

    render(ui);

    expect(screen.getByTestId("docs-title")).toHaveTextContent(
      "Sorting Algorithms"
    );
    expect(screen.getByTestId("docs-desc")).toHaveTextContent(
      "Learn Bubble, Selection, and Merge sort"
    );
    expect(screen.getByTestId("copy-btn")).toBeInTheDocument();
    expect(screen.getByTestId("view-options")).toBeInTheDocument();

    const viewOptions = screen.getByTestId("view-options");
    expect(viewOptions.getAttribute("data-github-url")).toContain(
      "/content/docs/dsa/sorting.mdx"
    );

    getPageByUrlSpy.mockRestore();
  });

  it("throws notFound() when document does not exist in production mode", async () => {
    const getPageByUrlSpy = vi
      .spyOn(source, "getPageByUrl")
      .mockReturnValue(undefined as any);
    const getPageSpy = vi
      .spyOn(source, "getPage")
      .mockReturnValue(undefined as any);

    await expect(
      Page({
        params: Promise.resolve({ slug: ["non-existent-page"] }),
      } as any)
    ).rejects.toThrow("NEXT_NOT_FOUND");

    getPageByUrlSpy.mockRestore();
    getPageSpy.mockRestore();
  });

  it("generateMetadata resolves title, description, and og image for existing page", async () => {
    const getPageByUrlSpy = vi
      .spyOn(source, "getPageByUrl")
      .mockReturnValue(mockDocPage as any);

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: ["dsa", "sorting"] }),
    } as any);

    expect(metadata.title).toBe("Sorting Algorithms");
    expect(metadata.description).toBe(
      "Learn Bubble, Selection, and Merge sort"
    );
    expect(metadata.openGraph?.images).toBeDefined();

    getPageByUrlSpy.mockRestore();
  });

  it("generateMetadata throws notFound() when page is not found in non-scoped dev mode", async () => {
    const getPageByUrlSpy = vi
      .spyOn(source, "getPageByUrl")
      .mockReturnValue(undefined as any);
    const getPageSpy = vi
      .spyOn(source, "getPage")
      .mockReturnValue(undefined as any);

    await expect(
      generateMetadata({
        params: Promise.resolve({ slug: ["missing"] }),
      } as any)
    ).rejects.toThrow("NEXT_NOT_FOUND");

    getPageByUrlSpy.mockRestore();
    getPageSpy.mockRestore();
  });

  it("generateStaticParams returns empty array in development environment", async () => {
    (process.env as any).NODE_ENV = "development";
    const params = await generateStaticParams();
    expect(params).toEqual([]);
  });

  it("generateStaticParams calls source.generateParams in production environment", async () => {
    (process.env as any).NODE_ENV = "production";
    const generateParamsSpy = vi
      .spyOn(source, "generateParams")
      .mockReturnValue([{ slug: ["intro"] }] as any);

    const params = await generateStaticParams();
    expect(generateParamsSpy).toHaveBeenCalled();
    expect(params).toEqual([{ slug: ["intro"] }]);

    generateParamsSpy.mockRestore();
  });
});
