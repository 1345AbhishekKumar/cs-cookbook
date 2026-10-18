import { describe, it, expect } from "vitest";
import { COMMON_ICON_ALIASES } from "@/lib/icon-aliases";
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
});

describe("lib/cn", () => {
  it("should merge class names correctly", () => {
    const result = cn("base-class", "extra-class");
    expect(result).toContain("base-class");
    expect(result).toContain("extra-class");
  });
});
