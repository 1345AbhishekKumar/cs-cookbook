import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useParams: () => ({}),
  notFound: vi.fn(),
}));

// Mock next/font/local
vi.mock("next/font/local", () => ({
  default: () => ({ className: "inter-font-mock" }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock fumadocs-ui layouts
vi.mock("fumadocs-ui/layouts/docs", () => ({
  DocsLayout: ({ children, sidebar }: any) => (
    <div data-testid="docs-layout">
      <div data-testid="sidebar-banner">{sidebar?.banner}</div>
      <main>{children}</main>
    </div>
  ),
}));

vi.mock("fumadocs-ui/layouts/home", () => ({
  HomeLayout: ({ children, className }: any) => (
    <div data-testid="home-layout" className={className}>
      {children}
    </div>
  ),
}));

// Mock RoadmapGrid
vi.mock("@/components/roadmap-grid", () => ({
  RoadmapGrid: () => <div data-testid="mock-roadmap-grid">Roadmap Grid</div>,
}));

// Mock ModuleSwitcher
vi.mock("@/components/module-switcher", () => ({
  ModuleSwitcher: () => (
    <div data-testid="mock-module-switcher">Module Switcher</div>
  ),
}));

import HomePage from "@/app/(home)/page";
import HomeLayout from "@/app/(home)/layout";
import DocsLayoutComponent from "@/app/docs/layout";
import RootLayout, { metadata } from "@/app/layout";
import { roadmapItems } from "@/lib/roadmap";

describe("app/(home)/page.tsx", () => {
  it("renders the hero banner, headline, track navigation chips, and RoadmapGrid", () => {
    render(<HomePage />);

    expect(
      screen.getByText("Comprehensive Engineering Curriculum")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Learning Roadmap — Table of Contents/i,
      })
    ).toBeInTheDocument();

    // Verify track chips
    expect(screen.getByRole("link", { name: "Foundations" })).toHaveAttribute(
      "href",
      "/docs/computer-basics"
    );
    expect(
      screen.getByRole("link", { name: "Systems & Data" })
    ).toHaveAttribute("href", "/docs/computer-networking");
    expect(screen.getByRole("link", { name: "Architecture" })).toHaveAttribute(
      "href",
      "/docs/system-design"
    );
    expect(
      screen.getByRole("link", { name: "AI & Intelligence" })
    ).toHaveAttribute("href", "/docs/ai-ml-foundations");
    expect(screen.getByRole("link", { name: "Resources" })).toHaveAttribute(
      "href",
      "/docs/books"
    );

    // Verify module count matches roadmapItems
    expect(screen.getByText(String(roadmapItems.length))).toBeInTheDocument();

    // Verify Explore and Open Docs links
    expect(
      screen.getByRole("link", { name: "Explore Modules" })
    ).toHaveAttribute("href", "#toc");
    expect(screen.getByRole("link", { name: "Open Docs" })).toHaveAttribute(
      "href",
      "/docs"
    );

    // Verify embedded RoadmapGrid component
    expect(screen.getByTestId("mock-roadmap-grid")).toBeInTheDocument();
  });
});

describe("app/(home)/layout.tsx", () => {
  it("renders HomeLayout with oa-home theme class", () => {
    render(
      <HomeLayout params={Promise.resolve({}) as any}>
        <span data-testid="home-child">Child Element</span>
      </HomeLayout>
    );

    const layout = screen.getByTestId("home-layout");
    expect(layout).toHaveClass("oa-home");
    expect(screen.getByTestId("home-child")).toBeInTheDocument();
  });
});

describe("app/docs/layout.tsx", () => {
  it("renders DocsLayout with page tree and ModuleSwitcher in sidebar banner", () => {
    render(
      <DocsLayoutComponent params={Promise.resolve({}) as any}>
        <span data-testid="doc-child">Doc Body</span>
      </DocsLayoutComponent>
    );

    expect(screen.getByTestId("docs-layout")).toBeInTheDocument();
    expect(screen.getByTestId("mock-module-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("doc-child")).toBeInTheDocument();
  });
});

describe("app/layout.tsx", () => {
  it("exports site-wide metadata with default and template titles", () => {
    expect(metadata.title).toEqual({
      default: "Learning Roadmap",
      template: "%s | Learning Roadmap",
    });
    expect(metadata.description).toBeDefined();
    expect(metadata.metadataBase).toBeDefined();
  });

  it("renders HTML document shell with inter font class and suppressHydrationWarning", () => {
    render(
      <RootLayout params={Promise.resolve({}) as any}>
        <span data-testid="root-child">Page Content</span>
      </RootLayout>
    );

    const rootChild = screen.getByTestId("root-child");
    expect(rootChild).toBeInTheDocument();

    // Verify font class applied
    const html = document.documentElement;
    expect(html.classList.contains("inter-font-mock")).toBe(true);
    expect(html.getAttribute("lang")).toBe("en");
  });
});
