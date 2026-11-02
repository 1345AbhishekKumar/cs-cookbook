import { describe, it, expect } from "vitest";
import { cn } from "@/lib/cn";

describe("lib/cn", () => {
  it("merges simple string class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("ignores falsy and boolean conditions", () => {
    const isHidden = false;
    const isVisible = true;
    expect(
      cn(
        "base-class",
        isHidden && "hidden-class",
        isVisible && "visible-class",
        null,
        undefined,
        0,
        ""
      )
    ).toBe("base-class visible-class");
  });

  it("handles object syntax conditionally", () => {
    expect(
      cn({
        "font-bold": true,
        "text-red-500": false,
        underline: true,
      })
    ).toBe("font-bold underline");
  });

  it("handles nested arrays of classes", () => {
    expect(cn(["btn", ["btn-primary", false && "btn-disabled"]])).toBe(
      "btn btn-primary"
    );
  });

  it("handles empty invocations without crashing", () => {
    expect(cn()).toBe("");
  });
});
