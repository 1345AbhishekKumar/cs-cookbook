import { describe, it, expect } from "vitest";
import {
  roadmapItems,
  categoryAccents,
  AI_CATEGORY,
  ROADMAP_VIEWS,
  filterRoadmap,
  getRoadmapModule,
  type RoadmapCategory,
  type RoadmapView,
} from "@/lib/roadmap";

describe("lib/roadmap — data integrity", () => {
  it("should export a non-empty list of roadmap items", () => {
    expect(Array.isArray(roadmapItems)).toBe(true);
    expect(roadmapItems.length).toBeGreaterThan(0);
  });

  it("every roadmap item should have required fields", () => {
    for (const item of roadmapItems) {
      expect(typeof item.title).toBe("string");
      expect(item.title.length).toBeGreaterThan(0);

      expect(typeof item.description).toBe("string");
      expect(item.description.length).toBeGreaterThan(0);

      expect(typeof item.category).toBe("string");
      expect(item.category.length).toBeGreaterThan(0);

      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.tags.length).toBeGreaterThan(0);

      expect(["function", "object"]).toContain(typeof item.icon);

      expect(typeof item.href).toBe("string");
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  it("slug should be either a non-empty string or null", () => {
    for (const item of roadmapItems) {
      if (item.slug !== null) {
        expect(typeof item.slug).toBe("string");
        expect(item.slug.length).toBeGreaterThan(0);
      }
    }
  });

  it("should have no duplicate titles", () => {
    const titles = roadmapItems.map((i) => i.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("should have no duplicate hrefs", () => {
    const hrefs = roadmapItems.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("lib/roadmap — categoryAccents", () => {
  it("should have an accent for every category used by items", () => {
    const usedCategories = new Set(roadmapItems.map((i) => i.category));
    for (const cat of usedCategories) {
      expect(categoryAccents[cat]).toBeDefined();
      expect(typeof categoryAccents[cat]).toBe("string");
    }
  });
});

describe("lib/roadmap — ROADMAP_VIEWS", () => {
  it("should export at least 2 views (all + ai)", () => {
    expect(ROADMAP_VIEWS.length).toBeGreaterThanOrEqual(2);
  });

  it("each view should have id, label, and description", () => {
    for (const view of ROADMAP_VIEWS) {
      expect(typeof view.id).toBe("string");
      expect(typeof view.label).toBe("string");
      expect(typeof view.description).toBe("string");
    }
  });

  it('should include "all" and "ai" views', () => {
    const ids = ROADMAP_VIEWS.map((v) => v.id);
    expect(ids).toContain("all");
    expect(ids).toContain("ai");
  });
});

describe("lib/roadmap — filterRoadmap()", () => {
  it('should return all items when view is "all"', () => {
    const result = filterRoadmap(roadmapItems, "all");
    expect(result).toEqual(roadmapItems);
    expect(result.length).toBe(roadmapItems.length);
  });

  it('should return only AI category items when view is "ai"', () => {
    const result = filterRoadmap(roadmapItems, "ai");
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(roadmapItems.length);
    for (const item of result) {
      expect(item.category).toBe(AI_CATEGORY);
    }
  });

  it("should not include non-AI items in ai view", () => {
    const result = filterRoadmap(roadmapItems, "ai");
    const nonAi = result.filter((i) => i.category !== AI_CATEGORY);
    expect(nonAi).toHaveLength(0);
  });

  it("handles empty arrays gracefully", () => {
    expect(filterRoadmap([], "all")).toEqual([]);
    expect(filterRoadmap([], "ai")).toEqual([]);
  });

  it("every roadmap item with a slug has href matching /docs/[slug]", () => {
    for (const item of roadmapItems) {
      if (item.slug !== null) {
        expect(item.href).toBe(`/docs/${item.slug}`);
      }
    }
  });
});

describe("lib/roadmap — getRoadmapModule()", () => {
  it("should find a module by its slug", () => {
    const item = roadmapItems.find((i) => i.slug !== null);
    if (item && item.slug) {
      const found = getRoadmapModule(item.slug);
      expect(found).toBeDefined();
      expect(found?.title).toBe(item.title);
    }
  });

  it("should return undefined for non-existent slug", () => {
    expect(getRoadmapModule("non-existent-slug-xyz")).toBeUndefined();
  });

  it("should return undefined for empty string", () => {
    expect(getRoadmapModule("")).toBeUndefined();
  });

  it("should find the dsa module", () => {
    const dsa = getRoadmapModule("dsa");
    expect(dsa).toBeDefined();
    expect(dsa?.title).toBe("Data Structures & Algorithms");
  });
});
