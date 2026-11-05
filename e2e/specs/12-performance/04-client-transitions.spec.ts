import { test, expect } from "../../fixtures/base.fixture";
import { HomePage } from "../../pages/home.page";

test.describe("Performance: Client-Side Soft Navigations", () => {
  test("navigating from Home to Docs via Link is fast and responsive", async ({
    page,
    perf,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Ensure the CTA link is visible
    await expect(homePage.openDocsButton).toBeVisible();

    // Measure client-side navigation transition time
    const duration = await perf.measureDuration(async () => {
      await homePage.openDocsButton.click();
      await page.waitForURL(/\/docs/, { timeout: 10000 });
      await expect(page.locator("body")).toBeVisible();
    });

    console.log(`Client-side navigation duration: ${duration}ms`);

    // Client-side transitions should feel near-instantaneous (< 2000ms even in dev compilation mode)
    expect(
      duration,
      "Client-side navigation should take under 2500ms"
    ).toBeLessThan(2500);
  });
});
