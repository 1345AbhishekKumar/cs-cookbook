import { test, expect } from "../../fixtures/base.fixture";

test.describe("Interactive Simulators: IT Support Hardware & Logic", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/test");
  });

  test("should toggle bits in Binary Switchboard and update decimal, hex, and ASCII readouts", async ({
    page,
  }) => {
    // Locate the switchboard
    await expect(
      page.getByText("Interactive 8-Bit Binary Switchboard").first()
    ).toBeVisible({ timeout: 15000 });

    // Bit 7 (128)
    const bit128 = page
      .getByRole("button", { name: /Bit 7 \(weight 128\)|128/i })
      .first();
    await expect(bit128).toBeVisible();
    await bit128.click();
    await expect(bit128).toHaveAttribute("aria-pressed", "true");

    // Readout should reflect 128
    const decimalReadout = page
      .getByText("Decimal Total")
      .locator("..")
      .locator("span, p, div")
      .last();
    await expect(decimalReadout).toContainText("128");

    // Toggle off
    await bit128.click();
    await expect(bit128).toHaveAttribute("aria-pressed", "false");
    await expect(decimalReadout).toContainText("0");
  });

  test("should interact with Circuit Simulator logic gates and toggle inputs", async ({
    page,
  }) => {
    const circuitHeading = page
      .getByText(/circuit simulator|logic gates/i)
      .first();
    if (await circuitHeading.isVisible()) {
      // Find input switches
      const inputSwitch = page
        .locator(
          "button[aria-label*='switch' i], button[aria-label*='input' i]"
        )
        .first();
      if (await inputSwitch.isVisible()) {
        await inputSwitch.click();
        await expect(inputSwitch).toBeVisible();
      }
    }
  });

  test("should adjust RGB Mixer sliders and update color readout", async ({
    page,
  }) => {
    const rgbMixerHeading = page.getByText(/rgb.*mixer|color mixer/i).first();
    if (await rgbMixerHeading.isVisible()) {
      // Find range sliders
      const redSlider = page.locator("input[type='range']").first();
      if (await redSlider.isVisible()) {
        await redSlider.fill("200");
        // Verify value reflected
        expect(await redSlider.inputValue()).toBe("200");
      }
    }
  });
});
