import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ModuleDiagram } from "@/components/cs101/module-diagram";
import { LessonDiagram } from "@/components/intro-to-programming/lesson-diagram";

describe("components/cs101/module-diagram.tsx", () => {
  it("renders an SVG diagram for valid diagram id 'overview' with caption", () => {
    const { container } = render(
      <ModuleDiagram id="overview" caption="CS 101 Road Map Overview" />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "CS 101 Road Map Overview");

    // Check nodes exist in SVG
    expect(screen.getByText("Hardware")).toBeInTheDocument();
    expect(screen.getByText("Data & Encoding")).toBeInTheDocument();
    expect(screen.getByText("OS & Shell")).toBeInTheDocument();
    expect(screen.getByText("Data Structures")).toBeInTheDocument();

    // Check caption
    expect(screen.getByText("CS 101 Road Map Overview")).toBeInTheDocument();
  });

  it("returns null safely for an unrecognized diagram id", () => {
    const { container } = render(
      <ModuleDiagram id="unrecognized-diagram-id" />
    );
    expect(container.firstChild).toBeNull();
  });
});

describe("components/intro-to-programming/lesson-diagram.tsx", () => {
  it("renders the ported SVG diagram for valid id 'itp-m1' with caption", () => {
    const { container } = render(
      <LessonDiagram id="itp-m1" caption="From human idea to execution" />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(
      screen.getByText("From human idea to execution")
    ).toBeInTheDocument();
    expect(screen.getByText(/Your idea/i)).toBeInTheDocument();
  });

  it("renders diagram itp-m2 without caption", () => {
    const { container } = render(<LessonDiagram id="itp-m2" />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(screen.getByText(/1\. Edit/i)).toBeInTheDocument();
    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("returns null for unknown diagram id", () => {
    const { container } = render(<LessonDiagram id="unknown-itp-diagram" />);
    expect(container.firstChild).toBeNull();
  });
});
