import { test, expect } from "../../fixtures/base.fixture";

test.describe("Performance: Navigation & Page Load Timings", () => {
  test("home page meets navigation timing budgets", async ({ page, perf }) => {
    // In dev environments, warm up the route so JIT compilation doesn't pollute navigation budgets
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.reload({ waitUntil: "load" });

    const timing = await perf.getNavigationTimings();

    // Log metrics for visibility in test reports
    console.log("Home Page Navigation Timings:", {
      ttfb: `${timing.ttfb}ms`,
      domInteractive: `${timing.domInteractive}ms`,
      domContentLoaded: `${timing.domContentLoaded}ms`,
      pageLoad: `${timing.pageLoad}ms`,
    });

    // Budget Assertions
    // In dev / local test environments, allow generous realistic ceilings while catching massive regressions
    expect(timing.ttfb, "TTFB should be under 1500ms").toBeLessThan(1500);
    expect(
      timing.domContentLoaded,
      "DOM Content Loaded should be under 3500ms"
    ).toBeLessThan(3500);
    expect(
      timing.pageLoad,
      "Full page load event should be under 6000ms"
    ).toBeLessThan(6000);
  });

  test("documentation route meets navigation timing budgets", async ({
    page,
    perf,
  }) => {
    // In dev environments, warm up the route so JIT compilation doesn't pollute navigation budgets
    await page.goto("/docs/computer-basics", { waitUntil: "domcontentloaded" });
    await page.reload({ waitUntil: "load" });

    const timing = await perf.getNavigationTimings();

    console.log("Docs Page Navigation Timings:", {
      ttfb: `${timing.ttfb}ms`,
      domInteractive: `${timing.domInteractive}ms`,
      domContentLoaded: `${timing.domContentLoaded}ms`,
      pageLoad: `${timing.pageLoad}ms`,
    });

    expect(timing.ttfb, "Docs TTFB should be under 1500ms").toBeLessThan(1500);
    expect(
      timing.domContentLoaded,
      "Docs DOM Content Loaded should be under 3500ms"
    ).toBeLessThan(3500);
    expect(
      timing.pageLoad,
      "Docs page load should be under 6000ms"
    ).toBeLessThan(6000);
  });
});
