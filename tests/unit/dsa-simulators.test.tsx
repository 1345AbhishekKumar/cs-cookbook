import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import * as searchSimulators from "@/components/dsa/searching-simulators";
import * as memorySimulators from "@/components/dsa/memory-simulators";
import * as dsaBarrel from "@/components/dsa";
import {
  LinearSearchSimulator,
  BinarySearchSimulator,
} from "@/components/dsa/searching-simulators";
import {
  ArrayMemorySimulator,
  StackSimulator,
} from "@/components/dsa/memory-simulators";

describe("DSA searching simulators exports", () => {
  it("exports all standalone search simulators and engine", () => {
    expect(typeof searchSimulators.LinearSearchSimulator).toBe("function");
    expect(typeof searchSimulators.BinarySearchSimulator).toBe("function");
    expect(typeof searchSimulators.JumpSearchSimulator).toBe("function");
    expect(typeof searchSimulators.InterpolationSearchSimulator).toBe(
      "function"
    );
    expect(typeof searchSimulators.ExponentialSearchSimulator).toBe("function");
    expect(typeof searchSimulators.SearchingSimulator).toBe("function");
  });

  it("renders LinearSearchSimulator with controls", () => {
    render(<LinearSearchSimulator />);

    expect(screen.getByRole("button", { name: /RESET/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /STEP/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /PLAY ALL/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /SOUND/i })).toBeInTheDocument();
  });

  it("renders BinarySearchSimulator with controls", () => {
    render(<BinarySearchSimulator />);

    expect(screen.getByRole("button", { name: /RESET/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /STEP/i })).toBeInTheDocument();
  });
});

describe("DSA memory simulators exports", () => {
  it("exports all standalone memory simulators and engine", () => {
    expect(typeof memorySimulators.ArrayMemorySimulator).toBe("function");
    expect(typeof memorySimulators.LinkedListSimulator).toBe("function");
    expect(typeof memorySimulators.StackSimulator).toBe("function");
    expect(typeof memorySimulators.QueueSimulator).toBe("function");
    expect(typeof memorySimulators.HeapStructureSimulator).toBe("function");
    expect(typeof memorySimulators.HashLookupSimulator).toBe("function");
    expect(typeof memorySimulators.MemorySimulator).toBe("function");
  });

  it("renders ArrayMemorySimulator", () => {
    render(<ArrayMemorySimulator />);
    expect(
      screen.getByRole("heading", {
        name: /Contiguous Array Memory Simulator/i,
      })
    ).toBeInTheDocument();
  });

  it("renders StackSimulator", () => {
    render(<StackSimulator />);
    expect(screen.getByRole("heading", { name: /Stack/i })).toBeInTheDocument();
  });
});

describe("DSA barrel exports", () => {
  it("re-exports all sorting, searching, and memory components", () => {
    expect(typeof dsaBarrel.BubbleSortSimulator).toBe("function");
    expect(typeof dsaBarrel.BinarySearchSimulator).toBe("function");
    expect(typeof dsaBarrel.ArrayMemorySimulator).toBe("function");
    expect(typeof dsaBarrel.HashLookupSimulator).toBe("function");
    expect(typeof dsaBarrel.S).toBe("object");
  });
});
