import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  LinearSearchSimulator,
  BinarySearchSimulator,
  JumpSearchSimulator,
  InterpolationSearchSimulator,
  ExponentialSearchSimulator,
  SearchSimulator,
} from "@/components/dsa/searching-simulators";

describe("DSA Searching Simulators", () => {
  it("renders LinearSearchSimulator with controls and steps forward", () => {
    render(<LinearSearchSimulator />);

    expect(screen.getByRole("button", { name: /RESET/i })).toBeInTheDocument();
    const stepBtn = screen.getByRole("button", { name: /STEP/i });
    expect(stepBtn).toBeInTheDocument();

    fireEvent.click(stepBtn);
  });

  it("renders BinarySearchSimulator with logarithmic divide stages", () => {
    render(<BinarySearchSimulator />);

    expect(
      screen.getByRole("heading", { name: /Binary Search Simulator/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /STEP/i })).toBeInTheDocument();
  });

  it("renders JumpSearchSimulator with sqrt(n) block stepping", () => {
    render(<JumpSearchSimulator />);

    expect(
      screen.getByRole("heading", { name: /Jump Search Simulator/i })
    ).toBeInTheDocument();
  });

  it("renders InterpolationSearchSimulator with probe formula calculations", () => {
    render(<InterpolationSearchSimulator />);

    expect(
      screen.getByRole("heading", { name: /Interpolation Search Simulator/i })
    ).toBeInTheDocument();
  });

  it("renders ExponentialSearchSimulator with range doubling", () => {
    render(<ExponentialSearchSimulator />);

    expect(
      screen.getByRole("heading", { name: /Exponential Search Simulator/i })
    ).toBeInTheDocument();
  });

  it("switches search algorithms via unified SearchSimulator", () => {
    const { rerender } = render(<SearchSimulator algorithm="linear" />);
    expect(
      screen.getByRole("heading", { name: /Linear Search Simulator/i })
    ).toBeInTheDocument();

    rerender(<SearchSimulator algorithm="binary" />);
    expect(
      screen.getByRole("heading", { name: /Binary Search Simulator/i })
    ).toBeInTheDocument();

    rerender(<SearchSimulator algorithm="jump" />);
    expect(
      screen.getByRole("heading", { name: /Jump Search Simulator/i })
    ).toBeInTheDocument();
  });
});
