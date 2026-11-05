import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { SearchPrefetcher, warmSearch } from "@/components/search-prefetcher";

describe("components/search-prefetcher.tsx", () => {
  const originalEnv = process.env.NODE_ENV;
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("[]"));
  });

  afterEach(() => {
    (process.env as any).NODE_ENV = originalEnv;
    fetchSpy.mockRestore();
    vi.clearAllMocks();
  });

  it("attaches pointerover, focusin, and keydown listeners in production mode", () => {
    (process.env as any).NODE_ENV = "production";
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = render(<SearchPrefetcher />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "pointerover",
      expect.any(Function),
      { passive: true }
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "focusin",
      expect.any(Function),
      { passive: true }
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
      { passive: true }
    );

    // Unmount and verify cleanup
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "pointerover",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "focusin",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("triggers warmSearch when Ctrl or Meta key is pressed", () => {
    (process.env as any).NODE_ENV = "production";
    render(<SearchPrefetcher />);

    fireEvent.keyDown(document, { ctrlKey: true, key: "Control" });

    // warmSearch triggers fetch to warmup query
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/search?query=__warmup__",
      expect.objectContaining({ priority: "low" })
    );
  });
});
