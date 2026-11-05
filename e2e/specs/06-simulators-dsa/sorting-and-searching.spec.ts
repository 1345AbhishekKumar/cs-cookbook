import { test, expect } from "../../fixtures/base.fixture";

test.describe("Interactive Simulators: DSA Algorithms", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/test");
  });

  test("should toggle sound on and off in sorting simulator", async ({
    page,
  }) => {
    const soundToggle = page
      .locator(
        "button[aria-label*='sound' i], button:has-text('SOUND ON'), button:has-text('SOUND OFF')"
      )
      .first();
    await expect(soundToggle).toBeVisible({ timeout: 15000 });

    const initialText = await soundToggle.innerText();
    await soundToggle.click();

    await expect(async () => {
      const updatedText = await soundToggle.innerText();
      expect(updatedText).not.toEqual(initialText);
    }).toPass({ timeout: 5000 });
  });

  test("should advance sorting steps and update beat counter", async ({
    page,
  }) => {
    const stepBtn = page.getByRole("button", { name: /step/i }).first();
    await expect(stepBtn).toBeVisible({ timeout: 15000 });

    // Initial beat counter
    const beatCounter = page.getByText(/BEAT \d+ \/ \d+/i).first();
    await expect(beatCounter).toBeVisible();
    const initialText = await beatCounter.innerText();

    // Advance 1 step
    await stepBtn.click();

    await expect(async () => {
      const nextText = await beatCounter.innerText();
      expect(nextText).not.toEqual(initialText);
    }).toPass({ timeout: 5000 });
  });

  test("should play all and pause animation", async ({ page }) => {
    const playBtn = page
      .getByRole("button", { name: /play all|pause/i })
      .first();
    await expect(playBtn).toBeVisible({ timeout: 15000 });

    const initialLabel = await playBtn.innerText();
    await playBtn.click();

    // Button text flips to PAUSE
    await expect(async () => {
      const activeLabel = await playBtn.innerText();
      expect(activeLabel).toMatch(/pause/i);
    }).toPass({ timeout: 5000 });

    // Pause it
    await playBtn.click();
    await expect(async () => {
      const pausedLabel = await playBtn.innerText();
      expect(pausedLabel).toMatch(/play/i);
    }).toPass({ timeout: 5000 });
  });

  test("should reset visualizer stage to beat 0", async ({ page }) => {
    const resetBtn = page.getByRole("button", { name: /reset/i }).first();
    const stepBtn = page.getByRole("button", { name: /step/i }).first();
    const beatCounter = page.getByText(/BEAT \d+ \/ \d+/i).first();

    await expect(stepBtn).toBeVisible({ timeout: 15000 });

    // Step once
    await stepBtn.click();

    // Click Reset
    await resetBtn.click();

    await expect(beatCounter).toHaveText(/BEAT 0/i);
  });
});
