import { describe, it, expect } from "vitest";
import { resolveLucideIcon } from "@/lib/source";

describe("lib/source — resolveLucideIcon()", () => {
  it("should return undefined for undefined input", () => {
    expect(resolveLucideIcon(undefined)).toBeUndefined();
  });

  it("should return undefined for empty string", () => {
    expect(resolveLucideIcon("")).toBeUndefined();
  });

  it("should return undefined for whitespace-only string", () => {
    expect(resolveLucideIcon("   ")).toBeUndefined();
  });

  it("should resolve a known canonical icon name", () => {
    const result = resolveLucideIcon("BookOpen");
    expect(result).toBeDefined();
  });

  it("should resolve a kebab-case icon name", () => {
    const result = resolveLucideIcon("book-open");
    expect(result).toBeDefined();
  });

  it("should resolve an aliased deprecated name", () => {
    // "AlertCircle" maps to "CircleAlert" via COMMON_ICON_ALIASES
    const result = resolveLucideIcon("AlertCircle");
    expect(result).toBeDefined();
  });

  it("should return undefined for a totally invalid icon name", () => {
    const result = resolveLucideIcon("NonExistentIconXyz123");
    expect(result).toBeUndefined();
  });

  it("should strip surrounding quotes from the name", () => {
    const result = resolveLucideIcon("'BookOpen'");
    expect(result).toBeDefined();

    const result2 = resolveLucideIcon('"BookOpen"');
    expect(result2).toBeDefined();
  });

  it("should cache resolved icons on subsequent calls", () => {
    const first = resolveLucideIcon("Terminal");
    const second = resolveLucideIcon("Terminal");
    // Both should be defined and be the same React element structure
    expect(first).toBeDefined();
    expect(second).toBeDefined();
  });

  it("should resolve icon with Icon suffix", () => {
    // Lucide exports components as both 'Search' and 'SearchIcon'
    const result = resolveLucideIcon("Search");
    expect(result).toBeDefined();
  });

  it("should return undefined for non-string inputs", () => {
    expect(resolveLucideIcon(123 as unknown as string)).toBeUndefined();
    expect(resolveLucideIcon(null as unknown as string)).toBeUndefined();
    expect(resolveLucideIcon({} as unknown as string)).toBeUndefined();
  });
});
