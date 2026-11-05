import { test, expect } from "../../fixtures/base.fixture";
import { HomePage } from "../../pages/home.page";

test.describe("Home Page & Curriculum Roadmap Matrix", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should render the hero section, badge, and dynamic curriculum metrics", async ({
    page,
  }) => {
    await expect(homePage.mainHeading).toContainText("Learning Roadmap");

    // Check badge
    const badge = page.getByText("Comprehensive Engineering Curriculum");
    await expect(badge).toBeVisible();

    // Check metric counters (e.g. modules count, 10 deep-dive lessons, beginner -> advanced)
    const metricsContainer = page
      .locator("section")
      .first()
      .getByText(/modules/i);
    await expect(metricsContainer).toBeVisible();
    await expect(page.getByText("10")).toBeVisible();
    await expect(page.getByText(/deep-dive lessons/i)).toBeVisible();
  });

  test("should jump to the table of contents (#toc) on clicking Explore Modules", async ({
    page,
  }) => {
    await homePage.exploreModulesButton.click();
    await expect(page).toHaveURL(/.*#toc$/);
    await expect(homePage.tocSection).toBeInViewport();
  });

  test("should navigate to /docs on clicking Open Docs", async ({ page }) => {
    await homePage.openDocsButton.click();
    await expect(page).toHaveURL(/\/docs/);
  });

  test("should render all track navigation chips with valid links", async () => {
    await expect(homePage.trackNav).toBeVisible();

    const expectedTracks = [
      { name: "Foundations", href: "/docs/computer-basics" },
      { name: "Systems & Data", href: "/docs/computer-networking" },
      { name: "Architecture", href: "/docs/system-design" },
      { name: "AI & Intelligence", href: "/docs/ai-ml-foundations" },
      { name: "Resources", href: "/docs/books" },
    ];

    for (const track of expectedTracks) {
      const chip = homePage.trackNav.getByRole("link", { name: track.name });
      await expect(chip).toBeVisible();
      await expect(chip).toHaveAttribute("href", track.href);
    }
  });

  test("should filter roadmap modules between All and AI tracks", async ({
    page,
  }) => {
    // Initial state: All modules
    await expect(homePage.allFilterButton).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    const allCount = await homePage.moduleCards.count();
    expect(allCount).toBeGreaterThan(5);

    // Switch to AI Track
    await homePage.filterByView("ai");
    const aiCount = await homePage.moduleCards.count();
    expect(aiCount).toBeLessThan(allCount);
    expect(aiCount).toBeGreaterThan(0);

    // Readout text should update
    const countReadout = page.getByText(/AI modules/i);
    await expect(countReadout).toBeVisible();

    // Switch back to All
    await homePage.filterByView("all");
    const resetCount = await homePage.moduleCards.count();
    expect(resetCount).toBe(allCount);
  });

  test("should render valid curriculum cards with categories, tags, and links", async () => {
    const firstCard = homePage.moduleCards.first();
    await expect(firstCard).toBeVisible();

    // Should contain a category pill (e.g. Foundations, Architecture)
    const categoryBadge = firstCard
      .locator("span")
      .filter({ hasText: /foundations|systems|architecture|ai|resources/i })
      .first();
    await expect(categoryBadge).toBeVisible();

    // Should have an icon SVG
    const icon = firstCard.locator("svg").first();
    await expect(icon).toBeVisible();

    // Should have a valid link starting with /docs
    const href = await firstCard.getAttribute("href");
    expect(href).toMatch(/^\/docs/);
  });
});
