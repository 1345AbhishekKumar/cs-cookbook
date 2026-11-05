import { test, expect } from "../../fixtures/base.fixture";

test.describe("Performance: Mobile & Throttled Conditions", () => {
  test("home page remains resilient under simulated 3G and 4x CPU slowdown", async ({
    page,
    perf,
    browserName,
  }) => {
    // Only Chromium supports CDP throttling
    test.skip(
      browserName !== "chromium",
      "CDP throttling is only applicable to Chromium"
    );

    // Emulate Fast 3G + 4x slower CPU (typical budget mobile phone)
    await perf.emulateThrottling("fast3G", 4);

    const duration = await perf.measureDuration(async () => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
    });

    console.log(`Throttled 3G initial render took: ${duration}ms`);

    // Ensure the main heading renders even under harsh conditions within 12 seconds
    expect(
      duration,
      "Initial hero render under 3G should complete within 12000ms"
    ).toBeLessThan(12000);
  });
});
