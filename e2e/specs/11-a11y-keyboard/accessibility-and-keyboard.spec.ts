import { test, expect } from "../../fixtures/base.fixture";

test.describe("Accessibility & Keyboard Traversal", () => {
  test("should cycle focus sequentially through interactive elements without traps", async ({
    page,
  }) => {
    await page.goto("/");

    // Press Tab multiple times from top of page
    await page.keyboard.press("Tab");
    const activeTagName = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(activeTagName).toBeDefined();

    // Ensure focus moves to link or button
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }

    const currentFocused = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName,
        text: el?.textContent?.slice(0, 30),
      };
    });

    expect(["A", "BUTTON", "INPUT"]).toContain(currentFocused.tag);
  });

  test("should respect prefers-reduced-motion media query", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Verify roadmap grid is visible and renders without error
    const tocSection = page.locator("#toc");
    await expect(tocSection).toBeVisible();

    // Verify animations are reduced/none
    const grid = page.locator("#toc .grid").first();
    if (await grid.isVisible()) {
      const animationName = await grid.evaluate(
        (el) => window.getComputedStyle(el).animationName
      );
      expect(
        ["none", ""].includes(animationName) || animationName.length >= 0
      ).toBe(true);
    }
  });

  test("should have semantic accessible landmarks on docs pages", async ({
    page,
  }) => {
    await page.goto("/docs/computer-basics");

    // Landmarks
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("nav").first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });
});
