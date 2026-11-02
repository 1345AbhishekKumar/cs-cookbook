import { describe, it, expect } from "vitest";
import { baseOptions } from "@/lib/layout.shared";

describe("lib/layout.shared — baseOptions()", () => {
  it("should return an object with nav and githubUrl", () => {
    const options = baseOptions();

    expect(options).toBeDefined();
    expect(options.nav).toBeDefined();
    expect(options.githubUrl).toBeDefined();
  });

  it("nav.title should match the appName", () => {
    const options = baseOptions();
    expect(options.nav?.title).toBe("Learning Roadmap");
  });

  it("githubUrl should be a valid GitHub URL", () => {
    const options = baseOptions();
    expect(typeof options.githubUrl).toBe("string");
    expect(options.githubUrl).toMatch(/^https:\/\/github\.com\/.+\/.+$/);
  });
});
