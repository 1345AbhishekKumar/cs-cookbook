import { test, expect } from "../../fixtures/base.fixture";

test.describe("Performance: Core Web Vitals (FCP, LCP, CLS)", () => {
  test("home page meets Core Web Vitals targets", async ({ page, perf }) => {
    // 1. Register performance observers prior to document request
    await perf.setupWebVitalsObserver();

    // 2. Navigate and wait for stable state
    await page.goto("/", { waitUntil: "networkidle" });

    // Allow a small tick for any final paint / layout shift calculations
    await page.waitForTimeout(500);

    const vitals = await perf.getWebVitals();

    console.log("Home Page Web Vitals:", {
      FCP: `${vitals.fcp}ms`,
      LCP: `${vitals.lcp}ms`,
      CLS: vitals.cls,
    });

    // First Contentful Paint: user sees first DOM content
    if (vitals.fcp > 0) {
      expect(
        vitals.fcp,
        "First Contentful Paint should be under 2500ms"
      ).toBeLessThan(2500);
    }

    // Largest Contentful Paint: hero / primary block rendered
    if (vitals.lcp > 0) {
      expect(
        vitals.lcp,
        "Largest Contentful Paint should be under 4000ms"
      ).toBeLessThan(4000);
    }

    // Cumulative Layout Shift: visual stability (ideal < 0.1, max acceptable < 0.25)
    expect(
      vitals.cls,
      "Cumulative Layout Shift should be under 0.25"
    ).toBeLessThan(0.25);
  });

  test("docs page maintains low visual layout shift during scroll", async ({
    page,
    perf,
  }) => {
    await perf.setupWebVitalsObserver();
    await page.goto("/docs/computer-basics", { waitUntil: "networkidle" });

    // Simulate user scroll to trigger any lazy-loaded layout shifts
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );
    await page.waitForTimeout(400);

    const vitals = await perf.getWebVitals();

    console.log("Docs Page Web Vitals after scroll:", vitals);

    // Ensure layout stability is preserved even when scrolling
    expect(vitals.cls, "CLS after scroll should be under 0.2").toBeLessThan(
      0.2
    );
  });
});
