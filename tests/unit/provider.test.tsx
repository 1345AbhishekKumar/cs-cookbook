import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { RootProvider } from "@/components/provider";

// Mock fumadocs-ui/provider/next
vi.mock("fumadocs-ui/provider/next", () => ({
  RootProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="base-root-provider">{children}</div>
  ),
}));

describe("RootProvider Component", () => {
  it("renders children and wraps with base provider", () => {
    render(
      <RootProvider>
        <span>Child content inside provider</span>
      </RootProvider>
    );

    expect(screen.getByTestId("base-root-provider")).toBeInTheDocument();
    expect(
      screen.getByText("Child content inside provider")
    ).toBeInTheDocument();
  });
});
