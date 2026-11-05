import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Bookshelf } from "@/components/bookshelf";
import { ModuleOverview } from "@/components/module-overview";
import { ModuleSwitcher } from "@/components/module-switcher";
import { RoadmapGrid } from "@/components/roadmap-grid";
import { SearchPrefetcher, warmSearch } from "@/components/search-prefetcher";
import { ConceptCard } from "@/components/cs101/concept-card";
import {
  LessonIntro,
  Concepts,
  AnalogyCard,
  Explain,
  TryIt,
  Takeaway,
  Flashcard,
  QuickRecall,
  LessonNote,
} from "@/components/cs101/lesson-blocks";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/docs/dsa",
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

describe("Bookshelf Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Bookshelf />);
    expect(container).toBeDefined();
  });

  it("renders category headings and book titles", () => {
    render(<Bookshelf />);
    expect(
      screen.getByText(/Designing Data-Intensive Applications/i)
    ).toBeInTheDocument();
  });
});

describe("ModuleOverview Component", () => {
  it("renders module overview for an existing module slug", () => {
    render(<ModuleOverview slug="dsa" />);
    expect(screen.getByText("What this module covers")).toBeInTheDocument();
    expect(screen.getByText("Foundations")).toBeInTheDocument();
  });

  it("returns null for non-existent module slug", () => {
    const { container } = render(
      <ModuleOverview slug="non-existent-module-xyz" />
    );
    expect(container.firstChild).toBeNull();
  });
});

describe("ModuleSwitcher Component", () => {
  it("renders collapsed switcher button with active module", () => {
    render(<ModuleSwitcher />);
    const btn = screen.getByRole("button", { name: "Switch module" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles dropdown when clicked", () => {
    render(<ModuleSwitcher />);
    const btn = screen.getByRole("button", { name: "Switch module" });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("closes dropdown when Escape key is pressed", () => {
    render(<ModuleSwitcher />);
    const btn = screen.getByRole("button", { name: "Switch module" });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("closes dropdown when clicked outside the container", () => {
    render(<ModuleSwitcher />);
    const btn = screen.getByRole("button", { name: "Switch module" });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");

    fireEvent.mouseDown(document.body);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });
});

describe("RoadmapGrid Component", () => {
  it("renders roadmap heading and initial module list", () => {
    render(<RoadmapGrid />);
    expect(screen.getByText("Roadmap Modules")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "All Modules" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "AI Modules" })
    ).toBeInTheDocument();
  });

  it("toggles filtering when clicking track view buttons", () => {
    render(<RoadmapGrid />);
    const allBtn = screen.getByRole("button", { name: "All Modules" });
    const aiBtn = screen.getByRole("button", { name: "AI Modules" });

    expect(allBtn).toHaveAttribute("aria-pressed", "true");
    expect(aiBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(aiBtn);
    expect(aiBtn).toHaveAttribute("aria-pressed", "true");
    expect(allBtn).toHaveAttribute("aria-pressed", "false");
  });
});

describe("SearchPrefetcher Component", () => {
  it("renders SearchPrefetcher without error", () => {
    const { container } = render(<SearchPrefetcher />);
    expect(container).toBeDefined();
  });

  it("calls warmSearch safely without throwing", () => {
    expect(typeof warmSearch).toBe("function");
    expect(() => warmSearch()).not.toThrow();
  });
});

describe("CS101 Pedagogical Components", () => {
  it("renders ConceptCard with name and category", () => {
    render(
      <ConceptCard name="Big-O Notation" category="Theory">
        <p>Asymptotic behavior of algorithms.</p>
      </ConceptCard>
    );
    expect(screen.getByText("Big-O Notation")).toBeInTheDocument();
    expect(screen.getByText("Theory")).toBeInTheDocument();
    expect(
      screen.getByText("Asymptotic behavior of algorithms.")
    ).toBeInTheDocument();
  });

  it("renders LessonIntro block", () => {
    render(
      <LessonIntro>
        <p>Lesson content intro</p>
      </LessonIntro>
    );
    expect(screen.getByText("Lesson content intro")).toBeInTheDocument();
  });

  it("renders Concepts chip list", () => {
    render(<Concepts items={["Time Complexity", "Space Complexity"]} />);
    expect(screen.getByText("Time Complexity")).toBeInTheDocument();
    expect(screen.getByText("Space Complexity")).toBeInTheDocument();
  });

  it("renders AnalogyCard with name", () => {
    render(
      <AnalogyCard name="Chef's Kitchen">
        <p>Customer's crate vs chef's bowls</p>
      </AnalogyCard>
    );
    expect(screen.getByText("Analogy: Chef's Kitchen")).toBeInTheDocument();
    expect(
      screen.getByText("Customer's crate vs chef's bowls")
    ).toBeInTheDocument();
  });

  it("renders Explain, TryIt, Takeaway, Flashcard, and QuickRecall", () => {
    render(
      <>
        <Explain title="Deep Dive" what="Core mechanism">
          Explanation text
        </Explain>
        <TryIt
          question="What is O(1)?"
          options={["Constant time", "Linear time"]}
        />
        <Takeaway>Mastering Big-O is key.</Takeaway>
        <Flashcard term="Amortized Time">Average per operation.</Flashcard>
        <QuickRecall title="Self Check">Quiz items</QuickRecall>
        <LessonNote title="Trap" variant="warning">
          Beware of O(n^2) nested loops.
        </LessonNote>
      </>
    );
    expect(screen.getByText("Deep Dive")).toBeInTheDocument();
    expect(screen.getByText("Core mechanism")).toBeInTheDocument();
    expect(screen.getByText("What is O(1)?")).toBeInTheDocument();
    expect(screen.getByText("Constant time")).toBeInTheDocument();
    expect(screen.getByText("Mastering Big-O is key.")).toBeInTheDocument();
    expect(screen.getByText("Amortized Time")).toBeInTheDocument();
    expect(screen.getByText("Self Check")).toBeInTheDocument();
    expect(screen.getByText("Trap")).toBeInTheDocument();
  });

  it("renders TryIt in hands-on practice mode when children are provided", () => {
    render(
      <TryIt>
        <p>Implement binary search iteratively.</p>
      </TryIt>
    );

    expect(screen.getByText("Try it — hands-on practice")).toBeInTheDocument();
    expect(
      screen.getByText("Implement binary search iteratively.")
    ).toBeInTheDocument();
  });

  it("renders TryIt with collapsible answer reveal and explanation", () => {
    render(
      <TryIt
        question="What is the space complexity of merge sort?"
        options={["O(1)", "O(n)", "O(n^2)"]}
        answer="O(n)"
        why="Auxiliary buffer array required during merge phase."
      />
    );

    expect(
      screen.getByText("What is the space complexity of merge sort?")
    ).toBeInTheDocument();
    expect(screen.getByText("Reveal answer")).toBeInTheDocument();
    expect(screen.getAllByText("O(n)").length).toBe(2);
    expect(
      screen.getByText(/— Auxiliary buffer array required during merge phase/i)
    ).toBeInTheDocument();
  });

  it("renders LessonNote across multiple style variants (myth, why, tip, info, note)", () => {
    const { container } = render(
      <>
        <LessonNote variant="myth">Myth content</LessonNote>
        <LessonNote variant="why">Why content</LessonNote>
        <LessonNote variant="tip">Tip content</LessonNote>
        <LessonNote variant="info">Info content</LessonNote>
        <LessonNote variant="note">Note content</LessonNote>
        <LessonNote variant="unrecognized-variant" title="Fallback">
          Fallback content
        </LessonNote>
      </>
    );

    expect(screen.getByText("Common misconception")).toBeInTheDocument();
    expect(screen.getAllByText("Why it matters").length).toBe(2);
    expect(screen.getByText("Tip")).toBeInTheDocument();
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });
});
