import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Mermaid } from "@/components/mermaid";

// Mock mermaid module
vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockImplementation(async (id: string, text: string) => {
      if (text.includes("SYNTAX_ERROR")) {
        throw new Error("Parse error");
      }
      return {
        svg: `<svg data-testid="mocked-mermaid-svg"><text>${text}</text></svg>`,
      };
    }),
  },
}));

describe("Mermaid Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders SVG when mermaid renders successfully", async () => {
    render(<Mermaid chart="graph TD; A-->B;" caption="Sample Diagram" />);

    await waitFor(() => {
      expect(screen.getByTestId("mocked-mermaid-svg")).toBeInTheDocument();
    });

    expect(screen.getByText("Sample Diagram")).toBeInTheDocument();
  });

  it("falls back to raw code block when diagram syntax fails", async () => {
    render(<Mermaid chart="graph TD; SYNTAX_ERROR" />);

    await waitFor(() => {
      expect(screen.getByText("graph TD; SYNTAX_ERROR")).toBeInTheDocument();
    });
  });

  it("attaches MutationObserver to sync dark theme mode", () => {
    const observeSpy = vi.spyOn(MutationObserver.prototype, "observe");
    render(<Mermaid chart="graph TD; A-->B;" />);

    expect(observeSpy).toHaveBeenCalledWith(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });
});
