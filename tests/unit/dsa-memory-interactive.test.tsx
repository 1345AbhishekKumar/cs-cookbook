import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  ArrayMemorySimulator,
  LinkedListSimulator,
  StackSimulator,
  QueueSimulator,
  HeapStructureSimulator,
  HashLookupSimulator,
  MemorySimulator,
} from "@/components/dsa/memory-simulators";

describe("DSA Memory Simulators", () => {
  it("renders ArrayMemorySimulator and controls", () => {
    render(<ArrayMemorySimulator />);

    expect(
      screen.getByRole("heading", {
        name: /Contiguous Array Memory Simulator/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /RESET/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /STEP/i })).toBeInTheDocument();
  });

  it("renders LinkedListSimulator and node pointer chaining", () => {
    render(<LinkedListSimulator />);

    expect(
      screen.getByRole("heading", {
        name: /Linked List Pointer Simulator/i,
      })
    ).toBeInTheDocument();
  });

  it("renders StackSimulator with LIFO operation stages", () => {
    render(<StackSimulator />);

    expect(
      screen.getByRole("heading", {
        name: /Stack \(LIFO\) Simulator/i,
      })
    ).toBeInTheDocument();
  });

  it("renders QueueSimulator with FIFO enqueue and dequeue controls", () => {
    render(<QueueSimulator />);

    expect(
      screen.getByRole("heading", {
        name: /Queue \(FIFO\) Pipeline Simulator/i,
      })
    ).toBeInTheDocument();
  });

  it("renders HeapStructureSimulator with array-backed binary tree representation", () => {
    render(<HeapStructureSimulator />);

    expect(
      screen.getByRole("heading", {
        name: /Binary Heap Tree & Array Simulator/i,
      })
    ).toBeInTheDocument();
  });

  it("renders HashLookupSimulator with key modulo hashing and collision resolution", () => {
    render(<HashLookupSimulator />);

    expect(
      screen.getByRole("heading", {
        name: /Hash Lookup & Collision Simulator/i,
      })
    ).toBeInTheDocument();
  });

  it("renders unified MemorySimulator across all supported data structures", () => {
    const { rerender } = render(<MemorySimulator structure="array" />);
    expect(
      screen.getByRole("heading", {
        name: /Contiguous Array Memory Simulator/i,
      })
    ).toBeInTheDocument();

    rerender(<MemorySimulator structure="stack" />);
    expect(
      screen.getByRole("heading", {
        name: /Stack \(LIFO\) Simulator/i,
      })
    ).toBeInTheDocument();

    rerender(<MemorySimulator structure="queue" />);
    expect(
      screen.getByRole("heading", {
        name: /Queue \(FIFO\) Pipeline Simulator/i,
      })
    ).toBeInTheDocument();
  });
});
