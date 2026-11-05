import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  SelectionSortSimulator,
  InsertionSortSimulator,
  MergeSortSimulator,
  QuickSortSimulator,
  HeapSortSimulator,
  SortingSimulator,
} from "@/components/dsa/sorting-simulators";

describe("DSA Standalone Sorting Simulators", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders SelectionSortSimulator and advances a step", () => {
    render(<SelectionSortSimulator />);

    expect(
      screen.getByRole("img", { name: /Selection Sort Visualizer/i })
    ).toBeInTheDocument();
    const stepBtn = screen.getByRole("button", { name: "STEP ▸" });
    expect(stepBtn).toBeInTheDocument();

    fireEvent.click(stepBtn);
    expect(screen.getByText(/BEAT 1 \/ 6/i)).toBeInTheDocument();
  });

  it("renders InsertionSortSimulator and controls", () => {
    render(<InsertionSortSimulator />);

    expect(
      screen.getByRole("img", { name: /Insertion Sort Visualizer/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "⟲ RESET" })).toBeInTheDocument();
  });

  it("renders MergeSortSimulator and controls", () => {
    render(<MergeSortSimulator />);

    expect(
      screen.getByRole("img", { name: /Merge Sort Visualizer/i })
    ).toBeInTheDocument();
  });

  it("renders QuickSortSimulator and Lomuto partitioning stage", () => {
    render(<QuickSortSimulator />);

    expect(
      screen.getByRole("img", { name: /Quick Sort Visualizer/i })
    ).toBeInTheDocument();
  });

  it("renders HeapSortSimulator and max-heap tree extraction stage", () => {
    render(<HeapSortSimulator />);

    expect(
      screen.getByRole("img", { name: /Heap Sort Visualizer/i })
    ).toBeInTheDocument();
  });

  it("supports PLAY ALL and PAUSE cycle", () => {
    render(<SelectionSortSimulator />);

    const playBtn = screen.getByRole("button", { name: /PLAY ALL/i });
    fireEvent.click(playBtn);

    // After clicking play, it displays PAUSE
    expect(screen.getByRole("button", { name: /PAUSE/i })).toBeInTheDocument();

    // Advance timer
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    const pauseBtn = screen.getByRole("button", { name: /PAUSE/i });
    fireEvent.click(pauseBtn);
    expect(
      screen.getByRole("button", { name: /PLAY ALL/i })
    ).toBeInTheDocument();
  });

  it("renders unified SortingSimulator for quick sort and heap sort", () => {
    const { rerender } = render(<SortingSimulator algorithm="quick" />);
    expect(
      screen.getByRole("img", { name: /Quick Sort Visualizer/i })
    ).toBeInTheDocument();

    rerender(<SortingSimulator algorithm="heap" />);
    expect(
      screen.getByRole("img", { name: /Heap Sort Visualizer/i })
    ).toBeInTheDocument();
  });
});
