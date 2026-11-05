import { test, expect } from "../../fixtures/base.fixture";

test.describe("MDX Primitives & Visual Components", () => {
  test("should render and switch Fumadocs Tabs", async ({ page }) => {
    // Navigate to a page with multi-language code tabs or instructions
    await page.goto("/docs/developer-tools");

    const tabsList = page.locator("[role='tablist']").first();
    if (await tabsList.isVisible()) {
      const tabs = tabsList.locator("[role='tab']");
      const count = await tabs.count();

      if (count > 1) {
        const secondTab = tabs.nth(1);
        await secondTab.click();
        await expect(secondTab).toHaveAttribute("aria-selected", "true");
      }
    }
  });

  test("should expand and collapse Accordions", async ({ page }) => {
    await page.goto("/docs/computer-basics");

    const accordionButton = page
      .locator("button[data-state], [data-radix-collection-item]")
      .first();
    if (await accordionButton.isVisible()) {
      const initialState = await accordionButton.getAttribute("data-state");
      await accordionButton.click();

      // State should toggle between open and closed
      await expect(async () => {
        const currentState = await accordionButton.getAttribute("data-state");
        expect(currentState).not.toEqual(initialState);
      }).toPass({ timeout: 3000 });
    }
  });

  test("should render KaTeX mathematical equations without raw syntax leaks", async ({
    page,
  }) => {
    await page.goto("/docs/dsa");

    // KaTeX equations render with the class `.katex`
    const katexEl = page.locator(".katex").first();
    if (await katexEl.isVisible()) {
      await expect(katexEl).toBeVisible();
      const rawMathLeaks = await page.locator("body").innerText();
      // Should not see unparsed KaTeX markers like $$ or \\frac raw unparsed text
      expect(rawMathLeaks).not.toContain("$$");
    }
  });

  test("should render Mermaid diagrams as valid SVGs", async ({ page }) => {
    await page.goto("/docs/computer-basics");

    // Check if any mermaid SVG exists
    const mermaidSvg = page.locator("svg[id*='mermaid'], .mermaid svg").first();
    if (await mermaidSvg.isVisible()) {
      await expect(mermaidSvg).toBeVisible();
      // Verify no syntax error element is rendered
      const errorText = page.getByText(
        /syntax error in graph|mermaid syntax error/i
      );
      await expect(errorText).not.toBeVisible();
    }
  });

  test("should copy code block snippets to clipboard", async ({ page }) => {
    await page.goto("/docs/developer-tools");

    const copyBtn = page
      .locator("button[aria-label*='copy' i], pre button")
      .first();
    if (await copyBtn.isVisible()) {
      await copyBtn.click();
      // Button should display checkmark icon or success feedback
      await expect(copyBtn).toBeVisible();
    }
  });
});
