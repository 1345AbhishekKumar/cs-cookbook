import { describe, it, expect, vi } from "vitest";
import * as audio from "@/components/dsa/audio";
import * as simulators from "@/components/dsa/sorting-simulators";

describe("dsa audio module", () => {
  it("guards against SSR when window is undefined or mocked", () => {
    expect(audio.isSoundEnabled()).toBe(true);
  });

  it("exports all required tone and frequency functions", () => {
    expect(typeof audio.tick).toBe("function");
    expect(typeof audio.pop).toBe("function");
    expect(typeof audio.thud).toBe("function");
    expect(typeof audio.pluck).toBe("function");
    expect(typeof audio.jump).toBe("function");
    expect(typeof audio.chime).toBe("function");
    expect(typeof audio.slide).toBe("function");
    expect(typeof audio.swap).toBe("function");
    expect(typeof audio.up).toBe("function");
    expect(typeof audio.down).toBe("function");
    expect(typeof audio.note).toBe("function");
    expect(typeof audio.hop).toBe("function");
    expect(typeof audio.hash).toBe("function");
    expect(typeof audio.playTone).toBe("function");
    expect(typeof audio.playHiss).toBe("function");
  });

  it("handles sound toggle state properly", () => {
    const listener = vi.fn();
    const unsub = audio.subscribeSound(listener);

    audio.setSoundEnabled(false);
    expect(audio.isSoundEnabled()).toBe(false);
    expect(listener).toHaveBeenCalledWith(false);

    audio.toggleSound();
    expect(audio.isSoundEnabled()).toBe(true);
    expect(listener).toHaveBeenCalledWith(true);

    unsub();
  });

  it("safely executes sound functions without throwing", () => {
    expect(() => {
      audio.tick(1);
      audio.pop();
      audio.thud();
      audio.pluck(2);
      audio.jump();
      audio.chime();
      audio.slide();
      audio.swap();
      audio.up(1);
      audio.down(1);
      audio.note(5);
      audio.hop(2);
      audio.hash();
    }).not.toThrow();
  });
});

describe("dsa sorting simulators components", () => {
  it("exports all 6 standalone simulators and unified component", () => {
    expect(typeof simulators.BubbleSortSimulator).toBe("function");
    expect(typeof simulators.SelectionSortSimulator).toBe("function");
    expect(typeof simulators.InsertionSortSimulator).toBe("function");
    expect(typeof simulators.MergeSortSimulator).toBe("function");
    expect(typeof simulators.QuickSortSimulator).toBe("function");
    expect(typeof simulators.HeapSortSimulator).toBe("function");
    expect(typeof simulators.SortingSimulator).toBe("function");
  });
});
