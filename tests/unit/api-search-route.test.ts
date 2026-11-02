import { describe, it, expect } from "vitest";
import {
  extractProseStructure,
  fastBreadcrumbs,
  GET,
} from "@/app/api/search/route";

describe("app/api/search — fastBreadcrumbs()", () => {
  it("formats path segments into clean title-cased breadcrumbs", () => {
    const breadcrumbs = fastBreadcrumbs(
      "/docs/01-computer-basics/02-hardware/cpu"
    );
    expect(breadcrumbs).toEqual(["Computer Basics", "Hardware"]);
  });

  it("handles URLs without numeric prefixes and with hyphens/underscores", () => {
    const breadcrumbs = fastBreadcrumbs(
      "/docs/software_craft/clean-code/intro"
    );
    expect(breadcrumbs).toEqual(["Software Craft", "Clean Code"]);
  });

  it("handles single-level docs URLs", () => {
    const breadcrumbs = fastBreadcrumbs("/docs/books");
    expect(breadcrumbs).toEqual([]);
  });
});

describe("app/api/search — extractProseStructure()", () => {
  it("strips frontmatter, parses headings, and extracts meaningful sentences", () => {
    const markdown = `---
title: Introduction to Arrays
description: Array fundamentals
---

# Introduction to Arrays

An array is a contiguous block of allocated memory that stores elements of identical data types sequentially.

## Memory Calculations

When accessing elements, the CPU calculates memory offset in O(1) time without traversing elements.

\`\`\`python
arr = [1, 2, 3]
print(arr[0])
\`\`\`

<CustomComponent prop="value" />
import { Something } from "somewhere";
export const X = 1;
![Diagram](/image.png)

| Operation | Time Complexity |
|---|---|
| Access | O(1) |
`;

    const result = extractProseStructure(markdown);

    // Headings verification
    expect(result.headings).toHaveLength(2);
    expect(result.headings[0]).toEqual({
      id: "introduction-to-arrays",
      content: "Introduction to Arrays",
    });
    expect(result.headings[1]).toEqual({
      id: "memory-calculations",
      content: "Memory Calculations",
    });

    // Content verification (code, JSX, imports, exports, images, and tables ignored)
    expect(result.contents).toHaveLength(2);
    expect(result.contents[0].content).toContain(
      "An array is a contiguous block of allocated memory"
    );
    expect(result.contents[1].content).toContain(
      "When accessing elements, the CPU calculates memory offset"
    );

    // Ensure code snippet was NOT captured
    const codeMatches = result.contents.filter((c) =>
      c.content.includes("arr = [1, 2, 3]")
    );
    expect(codeMatches).toHaveLength(0);
  });

  it("truncates prose content longer than 250 characters", () => {
    const longSentence = "A".repeat(300);
    const result = extractProseStructure(`# Heading\n\n${longSentence}`);
    expect(result.contents[0].content).toHaveLength(250);
  });

  it("ignores sentences shorter than 20 characters", () => {
    const result = extractProseStructure("# Heading\n\nToo short");
    expect(result.contents).toHaveLength(0);
  });
});

describe("app/api/search — GET()", () => {
  it("returns immediate empty array for warmup query in development", async () => {
    const request = new Request(
      "http://localhost:3000/api/search?query=__warmup__"
    );
    const response = await GET(request);
    const json = await response.json();
    expect(json).toEqual([]);
  });
});
