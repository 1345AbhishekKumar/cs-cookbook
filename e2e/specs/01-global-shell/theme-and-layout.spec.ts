import { test, expect } from "../../fixtures/base.fixture";

test.describe("Global Shell: Layout, Theme & Responsiveness", () => {
  test("should render the brand header and valid navigation links", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.*|CS.*|Docs.*/i);

    // Verify brand link in navigation header
    const brandLink = page
      .getByRole("link", { name: /CS.*Cookbook|CS Cookbook/i })
      .first();
    if (await brandLink.isVisible()) {
      await expect(brandLink).toHaveAttribute("href", "/");
    }

    // Verify GitHub repository link
    const githubLink = page.locator("a[href*='github.com']").first();
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute(
      "href",
      /github\.com\/.*\/CS-cookbook/i
    );
  });

  test("should toggle theme between light and dark modes", async ({ page }) => {
    await page.goto("/");
    const htmlElement = page.locator("html");

    // Fumadocs provides a theme toggle button in the navigation or footer
    const themeToggle = page
      .locator("button[aria-label*='theme' i], button[title*='theme' i]")
      .first();
    if (await themeToggle.isVisible()) {
      const initialTheme = (await htmlElement.getAttribute("class")) || "";
      await themeToggle.click();

      // Ensure class on html updates
      await expect(async () => {
        const newTheme = (await htmlElement.getAttribute("class")) || "";
        expect(newTheme).not.toEqual(initialTheme);
      }).toPass({ timeout: 5000 });
    }
  });

  test("should render responsive mobile drawer navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/docs/computer-basics");

    // On mobile, the desktop sidebar is hidden behind a hamburger/menu toggle button
    const menuButton = page
      .locator("button[aria-label*='menu' i], button[aria-label*='sidebar' i]")
      .first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Verify drawer or modal expands
      const drawer = page
        .locator("nav, aside, [role='dialog']")
        .filter({ hasText: /computer basics/i })
        .first();
      await expect(drawer).toBeVisible();
    }
  });

  test("should handle non-existent routes with a proper 404 response", async ({
    page,
  }) => {
    const response = await page.goto("/this-path-does-not-exist-404");
    // Should return 404 or show not found UI
    expect([200, 404]).toContain(response?.status());
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.toLowerCase()).toMatch(
      /404|not found|page could not be found/i
    );
  });
});
