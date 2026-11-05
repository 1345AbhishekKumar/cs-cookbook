import { expect, type Locator, type Page } from "@playwright/test";

export class DocsPage {
  readonly page: Page;
  readonly moduleSwitcherButton: Locator;
  readonly moduleSwitcherListbox: Locator;
  readonly sidebarNav: Locator;
  readonly tocNav: Locator;
  readonly markdownCopyButton: Locator;
  readonly viewOptionsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.moduleSwitcherButton = page.getByRole("button", {
      name: /switch module/i,
    });
    this.moduleSwitcherListbox = page.getByRole("listbox", {
      name: /curriculum modules/i,
    });
    this.sidebarNav = page
      .locator("nav, aside")
      .filter({ hasText: /modules/i })
      .first();
    this.tocNav = page
      .locator("aside")
      .filter({ hasText: /on this page|contents/i });
    this.markdownCopyButton = page.getByRole("button", {
      name: /copy markdown/i,
    });
    this.viewOptionsButton = page.getByRole("button", {
      name: /view options|options/i,
    });
  }

  async goto(slug = "dsa") {
    await this.page.goto(`/docs/${slug}`);
    await expect(this.page.locator("body")).toBeVisible();
  }

  async openModuleSwitcher() {
    await this.moduleSwitcherButton.click();
    await expect(this.moduleSwitcherListbox).toBeVisible();
  }

  async selectModule(moduleTitle: string) {
    await this.openModuleSwitcher();
    const item = this.moduleSwitcherListbox.getByRole("link", {
      name: new RegExp(moduleTitle, "i"),
    });
    await item.click();
  }
}
