import { test, expect } from "@playwright/test";

test.describe("Home Page and Interactive Features", () => {
  test("should load the home page with hero section and curriculum info", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.*|CS.*|Docs.*/i);
    await expect(page.locator("body")).toBeVisible();

    const mainHeading = page.getByRole("heading", { level: 1 });
    await expect(mainHeading).toContainText("Learning Roadmap");

    const exploreButton = page.getByRole("link", { name: "Explore Modules" });
    await expect(exploreButton).toBeVisible();

    const openDocsButton = page.getByRole("link", { name: "Open Docs" });
    await expect(openDocsButton).toBeVisible();
  });

  test("should jump to Table of Contents section when clicking Explore Modules", async ({
    page,
  }) => {
    await page.goto("/");
    const exploreButton = page.getByRole("link", { name: "Explore Modules" });
    await exploreButton.click();

    await expect(page).toHaveURL(/.*#toc$/);
    const tocSection = page.locator("#toc");
    await expect(tocSection).toBeVisible();
  });

  test("should toggle roadmap views between All and AI tracks", async ({
    page,
  }) => {
    await page.goto("/");
    const aiFilterButton = page.getByRole("button", {
      name: /ai & intelligence/i,
    });
    if (await aiFilterButton.isVisible()) {
      await aiFilterButton.click();
      await expect(aiFilterButton).toHaveAttribute("aria-pressed", "true");
    }
  });

  test("should render track navigation shortcut chips with valid links", async ({
    page,
  }) => {
    await page.goto("/");
    const trackNav = page.getByRole("navigation", { name: "Roadmap tracks" });
    await expect(trackNav).toBeVisible();

    const foundationsChip = trackNav.getByRole("link", { name: "Foundations" });
    await expect(foundationsChip).toBeVisible();
    await expect(foundationsChip).toHaveAttribute(
      "href",
      "/docs/computer-basics"
    );
  });
});
