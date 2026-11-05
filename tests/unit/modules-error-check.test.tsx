import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import fs from "fs";
import path from "path";
import {
  roadmapItems,
  getRoadmapModule,
  categoryAccents,
  type RoadmapItem,
} from "@/lib/roadmap";
import { ModuleOverview } from "@/components/module-overview";
import { ModuleSwitcher } from "@/components/module-switcher";

// Variable to control mocked pathname per test
let currentMockPathname = "/docs/computer-basics";

vi.mock("next/navigation", () => ({
  usePathname: () => currentMockPathname,
}));

// Mock next/link to render simple <a> tag
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: any;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock lucide-react to render simple span icons in JSDOM tests
vi.mock("lucide-react", async (importOriginal) => {
  const actual: any = await importOriginal();
  const createMockIcon = (name: string) => {
    const Icon = React.forwardRef((props: any, ref: any) => (
      <span ref={ref} data-testid={`icon-${name}`} {...props} />
    ));
    Icon.displayName = name;
    return Icon;
  };

  const mocked: Record<string, any> = { ...actual };
  for (const key of Object.keys(actual)) {
    if (typeof actual[key] === "object" || typeof actual[key] === "function") {
      mocked[key] = createMockIcon(key);
    }
  }
  return mocked;
});

const contentDocsRoot = path.resolve(process.cwd(), "content/docs");
const modules = roadmapItems.filter(
  (item): item is RoadmapItem & { slug: string } => item.slug !== null
);

describe("Curriculum Modules - Unit Integrity & Error Check", () => {
  beforeEach(() => {
    currentMockPathname = "/docs/computer-basics";
  });

  describe("1. Roadmap Module Metadata Integrity", () => {
    it("defines exactly 19 active curriculum modules with non-null slugs", () => {
      expect(modules.length).toBe(19);
      for (const module of modules) {
        expect(module.slug).toBeTruthy();
        expect(typeof module.slug).toBe("string");
        expect(module.slug).toMatch(/^[a-z0-9-]+$/);
      }
    });

    it("ensures all modules have complete metadata fields", () => {
      for (const module of modules) {
        expect(module.title.trim()).not.toBe("");
        expect(module.description.trim()).not.toBe("");
        expect(module.href).toBe(`/docs/${module.slug}`);
        expect(module.category).toBeTruthy();
        expect(categoryAccents[module.category]).toBeDefined();
        expect(Array.isArray(module.tags)).toBe(true);
        expect(module.tags.length).toBeGreaterThan(0);
        expect(module.icon).toBeDefined();
      }
    });

    it("ensures all module slugs are unique", () => {
      const slugs = modules.map((m) => m.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("resolves each module accurately with getRoadmapModule", () => {
      for (const module of modules) {
        const found = getRoadmapModule(module.slug);
        expect(found).toBeDefined();
        expect(found?.title).toBe(module.title);
      }
      expect(getRoadmapModule("non-existent-module-slug")).toBeUndefined();
    });
  });

  describe("2. Content Filesystem & Frontmatter Integrity", () => {
    it.each(modules.map((m) => [m.title, m.slug]))(
      "module %s (%s) has corresponding directory and valid entry doc",
      (_title, slug) => {
        const moduleDir = path.join(contentDocsRoot, slug);
        expect(
          fs.existsSync(moduleDir),
          `Directory missing for module: ${moduleDir}`
        ).toBe(true);

        const stat = fs.statSync(moduleDir);
        expect(stat.isDirectory()).toBe(true);

        // Find entry file: index.mdx or index.md
        const hasIndexMdx = fs.existsSync(path.join(moduleDir, "index.mdx"));
        const hasIndexMd = fs.existsSync(path.join(moduleDir, "index.md"));
        const hasEntry = hasIndexMdx || hasIndexMd;

        expect(
          hasEntry,
          `Module "${slug}" must contain an index.mdx or index.md file in ${moduleDir}`
        ).toBe(true);

        const entryPath = path.join(
          moduleDir,
          hasIndexMdx ? "index.mdx" : "index.md"
        );
        const content = fs.readFileSync(entryPath, "utf-8");

        // Verify basic frontmatter syntax
        expect(content.startsWith("---")).toBe(true);
        const frontmatterEnd = content.indexOf("---", 3);
        expect(frontmatterEnd).toBeGreaterThan(3);

        const frontmatterBlock = content.slice(3, frontmatterEnd);
        expect(frontmatterBlock).toMatch(/title:\s*.+/);
      }
    );
  });

  describe("3. Component Smoke Rendering For Each Module", () => {
    describe("ModuleOverview component", () => {
      it.each(modules.map((m) => [m.title, m.slug]))(
        "renders ModuleOverview for %s without errors",
        (_title, slug) => {
          const { container } = render(<ModuleOverview slug={slug} />);
          expect(container).toBeDefined();
          const module = getRoadmapModule(slug)!;
          // Verify category badge rendered
          expect(screen.getByText(module.category)).toBeDefined();
          // Verify tags rendered
          for (const tag of module.tags) {
            expect(screen.getByText(tag)).toBeDefined();
          }
        }
      );
    });

    describe("ModuleSwitcher component across all modules", () => {
      it.each(modules.map((m) => [m.title, m.slug]))(
        "renders ModuleSwitcher with active module %s without errors",
        (title, slug) => {
          currentMockPathname = `/docs/${slug}`;
          const { unmount } = render(<ModuleSwitcher />);

          // The active module title should be displayed in the button
          const button = screen.getByRole("button", { name: /switch module/i });
          expect(button).toBeDefined();
          expect(button.textContent).toContain(title);

          // Open dropdown
          fireEvent.click(button);
          expect(button.getAttribute("aria-expanded")).toBe("true");

          const listbox = screen.getByRole("listbox", {
            name: /curriculum modules/i,
          });
          expect(listbox).toBeDefined();
          expect(listbox.textContent).toContain("19 modules");

          // Clean up DOM for next iteration
          unmount();
        }
      );
    });
  });
});
