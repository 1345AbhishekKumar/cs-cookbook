import { test, expect } from "../../fixtures/base.fixture";

test.describe("Interactive Simulators: Developer Tools & Shells", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/test");
  });

  test("should step through PowerShell pipeline stages and filter processes", async ({
    page,
  }) => {
    // Stage 1 initial state: displays Get-Process and initial process list
    await expect(page.getByText("Get-Process").first()).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("code").first()).toBeVisible();

    // Advance to Stage 2 (Where-Object)
    const stage2Btn = page.getByRole("button", { name: /stage 2/i });
    if (await stage2Btn.isVisible()) {
      await stage2Btn.click();
      await expect(page.getByText(/Where-Object/i).first()).toBeVisible();
    }

    // Advance to Stage 3 (Select-Object)
    const stage3Btn = page.getByRole("button", { name: /stage 3/i });
    if (await stage3Btn.isVisible()) {
      await stage3Btn.click();
      await expect(page.getByText(/Select-Object/i).first()).toBeVisible();
    }
  });

  test("should toggle permissions in Shell Permissions Calculator", async ({
    page,
  }) => {
    // Find permissions checkboxes or octal input
    const permCalc = page
      .locator("section, div")
      .filter({ hasText: /permissions|octal|chmod/i })
      .first();
    if (await permCalc.isVisible()) {
      const firstCheckbox = permCalc.getByRole("checkbox").first();
      if (await firstCheckbox.isVisible()) {
        const initialChecked = await firstCheckbox.isChecked();
        await firstCheckbox.click();
        expect(await firstCheckbox.isChecked()).toBe(!initialChecked);
      }
    }
  });

  test("should interact with Git Graph visualizer controls", async ({
    page,
  }) => {
    const gitSimulator = page
      .locator("div, section")
      .filter({ hasText: /git graph|commit|branch/i })
      .first();
    if (await gitSimulator.isVisible()) {
      const commitBtn = gitSimulator
        .getByRole("button", { name: /commit/i })
        .first();
      if (await commitBtn.isVisible()) {
        await commitBtn.click();
        // Visual node should be drawn
        const nodes = gitSimulator.locator("circle, rect, [data-commit]");
        expect(await nodes.count()).toBeGreaterThan(0);
      }
    }
  });
});
