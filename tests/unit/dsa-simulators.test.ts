import { describe, it, expect } from "vitest";
import * as searchSimulators from "@/components/dsa/searching-simulators";
import * as memorySimulators from "@/components/dsa/memory-simulators";
import * as sortingSimulators from "@/components/dsa/sorting-simulators";
import * as dsaBarrel from "@/components/dsa";

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
