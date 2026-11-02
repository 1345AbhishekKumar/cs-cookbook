import { describe, it, expect } from "vitest";
import {
  appName,
  docsRoute,
  docsImageRoute,
  docsContentRoute,
  gitConfig,
  getPageMarkdownUrl,
  getPageImageUrl,
} from "@/lib/shared";

describe("lib/shared — constants", () => {
  it("should export appName as a non-empty string", () => {
    expect(typeof appName).toBe("string");
    expect(appName.length).toBeGreaterThan(0);
  });

  it("should export docsRoute starting with /", () => {
    expect(docsRoute).toBe("/docs");
  });

  it("should export docsImageRoute starting with /", () => {
    expect(docsImageRoute.startsWith("/")).toBe(true);
  });

  it("should export docsContentRoute starting with /", () => {
    expect(docsContentRoute.startsWith("/")).toBe(true);
  });

  it("should export gitConfig with user, repo, and branch", () => {
    expect(typeof gitConfig.user).toBe("string");
    expect(typeof gitConfig.repo).toBe("string");
    expect(typeof gitConfig.branch).toBe("string");
    expect(gitConfig.user.length).toBeGreaterThan(0);
    expect(gitConfig.repo.length).toBeGreaterThan(0);
    expect(gitConfig.branch.length).toBeGreaterThan(0);
  });
});

describe("lib/shared — getPageMarkdownUrl()", () => {
  it("should return segments ending with content.md", () => {
    const result = getPageMarkdownUrl({ slugs: ["dsa", "sorting"] });
    expect(result.segments).toEqual(["dsa", "sorting", "content.md"]);
  });

  it("should return a url string", () => {
    const result = getPageMarkdownUrl({ slugs: ["dsa"] });
    expect(typeof result.url).toBe("string");
    expect(result.url.length).toBeGreaterThan(0);
  });

  it("should handle empty slugs array", () => {
    const result = getPageMarkdownUrl({ slugs: [] });
    expect(result.segments).toEqual(["content.md"]);
  });

  it("should handle single slug", () => {
    const result = getPageMarkdownUrl({ slugs: ["overview"] });
    expect(result.segments).toEqual(["overview", "content.md"]);
  });
});

describe("lib/shared — getPageImageUrl()", () => {
  it("should return segments ending with image.png", () => {
    const result = getPageImageUrl({ slugs: ["dsa", "sorting"] });
    expect(result.segments).toEqual(["dsa", "sorting", "image.png"]);
  });

  it("should return a url string", () => {
    const result = getPageImageUrl({ slugs: ["dsa"] });
    expect(typeof result.url).toBe("string");
    expect(result.url.length).toBeGreaterThan(0);
  });

  it("should handle empty slugs array", () => {
    const result = getPageImageUrl({ slugs: [] });
    expect(result.segments).toEqual(["image.png"]);
  });

  it("should support locale option in getPageMarkdownUrl and getPageImageUrl", () => {
    const mdResult = getPageMarkdownUrl({ slugs: ["dsa"], locale: "en" });
    expect(mdResult.url).toContain("en");

    const imgResult = getPageImageUrl({ slugs: ["dsa"], locale: "en" });
    expect(imgResult.url).toContain("en");
  });
});
