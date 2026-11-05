import { expect, type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly mainHeading: Locator;
  readonly exploreModulesButton: Locator;
  readonly openDocsButton: Locator;
  readonly trackNav: Locator;
  readonly tocSection: Locator;
  readonly allFilterButton: Locator;
  readonly aiFilterButton: Locator;
  readonly moduleCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", { level: 1 });
    this.exploreModulesButton = page.getByRole("link", {
      name: "Explore Modules",
    });
    this.openDocsButton = page.getByRole("link", { name: "Open Docs" });
    this.trackNav = page.getByRole("navigation", { name: "Roadmap tracks" });
    this.tocSection = page.locator("#toc");
    this.allFilterButton = page.getByRole("button", { name: /all modules/i });
    this.aiFilterButton = page.getByRole("button", {
      name: /ai & intelligence/i,
    });
    this.moduleCards = page.locator("#toc a[href^='/docs']");
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.page.locator("body")).toBeVisible();
  }

  async selectTrackChip(trackName: string) {
    const chip = this.trackNav.getByRole("link", {
      name: new RegExp(trackName, "i"),
    });
    await chip.click();
  }

  async filterByView(view: "all" | "ai") {
    if (view === "all") {
      await this.allFilterButton.click();
      await expect(this.allFilterButton).toHaveAttribute(
        "aria-pressed",
        "true"
      );
    } else {
      await this.aiFilterButton.click();
      await expect(this.aiFilterButton).toHaveAttribute("aria-pressed", "true");
    }
  }
}
