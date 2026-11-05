import { test, expect } from "../../fixtures/base.fixture";

test.describe("Performance: Asset & Network Budgets", () => {
  test("homepage asset downloads stay within budget with zero broken requests", async ({
    page,
    perf,
  }) => {
    // 1. Begin asset tracking before navigation
    const getAssetSummary = perf.trackNetworkAssets();

    // 2. Navigate to homepage
    await page.goto("/", { waitUntil: "networkidle" });

    // 3. Collect statistics
    const summary = getAssetSummary();

    console.log("Homepage Asset Summary:", {
      totalRequests: summary.totalRequests,
      totalKB: Math.round(summary.totalBytes / 1024),
      jsKB: Math.round(summary.jsBytes / 1024),
      cssKB: Math.round(summary.cssBytes / 1024),
      imageKB: Math.round(summary.imageBytes / 1024),
    });

    // 4. Assert zero failed network requests (no 404s for chunks, styles, icons, fonts)
    expect(
      summary.failedRequests,
      "Zero network requests should fail with 4xx or 5xx"
    ).toEqual([]);

    // 5. Assert realistic request count budget (prevent request storms)
    expect(
      summary.totalRequests,
      "Initial homepage requests should not exceed 100"
    ).toBeLessThan(100);
  });

  test("documentation article does not produce excessive font or chunk requests", async ({
    page,
    perf,
  }) => {
    const getAssetSummary = perf.trackNetworkAssets();

    await page.goto("/docs/computer-basics", { waitUntil: "networkidle" });

    const summary = getAssetSummary();

    expect(summary.failedRequests).toEqual([]);
    expect(summary.totalRequests).toBeLessThan(120);
  });
});
