import { describe, it, expect } from "vitest";
import { COMMON_ICON_ALIASES } from "@/lib/icon-aliases";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/cn";

describe("lib/icon-aliases", () => {
  it("should map deprecated Lucide names to canonical names", () => {
    expect(COMMON_ICON_ALIASES["Sliders"]).toBe("SlidersHorizontal");
    expect(COMMON_ICON_ALIASES["AlertCircle"]).toBe("CircleAlert");
    expect(COMMON_ICON_ALIASES["HelpCircle"]).toBe("CircleHelp");
    expect(COMMON_ICON_ALIASES["Github"]).toBe("GitPullRequest");
  });

  it("all alias keys should have non-empty target names", () => {
    for (const [alias, target] of Object.entries(COMMON_ICON_ALIASES)) {
      expect(typeof alias).toBe("string");
      expect(alias.length).toBeGreaterThan(0);
      expect(typeof target).toBe("string");
      expect(target.length).toBeGreaterThan(0);
    }
  });

  it("every target in COMMON_ICON_ALIASES exists in lucide-react", () => {
    const validIcons = new Set(Object.keys(LucideIcons));
    for (const [alias, target] of Object.entries(COMMON_ICON_ALIASES)) {
      expect(
        validIcons.has(target),
        `Target "${target}" for alias "${alias}" should exist in lucide-react`
      ).toBe(true);
    }
  });
});

describe("lib/cn", () => {
  it("should merge class names correctly", () => {
    const result = cn("base-class", "extra-class");
    expect(result).toContain("base-class");
    expect(result).toContain("extra-class");
  });
});
