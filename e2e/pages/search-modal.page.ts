import { expect, type Locator, type Page } from "@playwright/test";

export class SearchModal {
  readonly page: Page;
  readonly dialog: Locator;
  readonly searchInput: Locator;
  readonly searchResults: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole("dialog");
    this.searchInput = this.dialog.getByPlaceholder(/search/i);
    this.searchResults = this.dialog.locator(
      "[role='listbox'] a, [role='option'], a[href*='/docs/']"
    );
    this.emptyState = this.dialog.getByText(/no results found|no results/i);
  }

  async openViaHotkey() {
    const isMac = process.platform === "darwin";
    if (isMac) {
      await this.page.keyboard.press("Meta+k");
    } else {
      await this.page.keyboard.press("Control+k");
    }
    await expect(this.dialog).toBeVisible();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async closeViaEscape() {
    await this.page.keyboard.press("Escape");
    await expect(this.dialog).not.toBeVisible();
  }
}
