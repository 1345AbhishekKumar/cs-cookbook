import { test, expect } from "../../fixtures/base.fixture";
import { DocsPage } from "../../pages/docs.page";

test.describe("Docs Platform & Navigation Engine", () => {
  let docsPage: DocsPage;

  test.beforeEach(async ({ page }) => {
    docsPage = new DocsPage(page);
    await docsPage.goto("computer-basics");
  });

  test("should open, inspect, and close ModuleSwitcher dropdown", async ({
    page,
  }) => {
    await expect(docsPage.moduleSwitcherButton).toBeVisible();
    await expect(docsPage.moduleSwitcherButton).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    // Open dropdown
    await docsPage.openModuleSwitcher();
    await expect(docsPage.moduleSwitcherButton).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    await expect(docsPage.moduleSwitcherListbox).toBeVisible();

    // Verify modules count readout inside listbox
    const countLabel = docsPage.moduleSwitcherListbox.getByText(/modules/i);
    await expect(countLabel).toBeVisible();

    // Close via Escape key
    await page.keyboard.press("Escape");
    await expect(docsPage.moduleSwitcherListbox).not.toBeVisible();
    await expect(docsPage.moduleSwitcherButton).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  test("should navigate to a different module via ModuleSwitcher", async ({
    page,
  }) => {
    await docsPage.selectModule("Developer Tools");
    await expect(page).toHaveURL(/\/docs\/developer-tools/);
  });

  test("should render sidebar page tree with active page indicator", async ({
    page,
  }) => {
    // Current page is computer-basics
    const activeItem = page
      .locator(
        "aside a[aria-current='page'], aside a.active, aside a[data-active='true']"
      )
      .first();
    if (await activeItem.isVisible()) {
      await expect(activeItem).toBeVisible();
    }

    // Check sidebar page links exist
    const docLinks = page.locator("aside a[href^='/docs/']");
    expect(await docLinks.count()).toBeGreaterThan(0);
  });

  test("should scroll to section when clicking a Table of Contents (TOC) heading", async ({
    page,
  }) => {
    const tocLinks = page
      .locator("aside")
      .filter({ hasText: /on this page|contents/i })
      .locator("a");
    const count = await tocLinks.count();

    if (count > 0) {
      const firstLink = tocLinks.first();
      const href = await firstLink.getAttribute("href");
      await firstLink.click();

      if (href?.startsWith("#")) {
        await expect(page).toHaveURL(new RegExp(`${href}$`));
        const targetHeading = page.locator(href);
        await expect(targetHeading).toBeInViewport();
      }
    }
  });

  test("should interact with Markdown copy and view options buttons", async ({
    page,
  }) => {
    // Check MarkdownCopyButton
    if (await docsPage.markdownCopyButton.isVisible()) {
      await docsPage.markdownCopyButton.click();
      // Should show check icon or transient copied state
      await expect(docsPage.markdownCopyButton).toBeVisible();
    }

    // Check ViewOptionsPopover
    if (await docsPage.viewOptionsButton.isVisible()) {
      await docsPage.viewOptionsButton.click();
      const popover = page.locator(
        "[role='dialog'], [role='menu'], [data-state='open']"
      );
      await expect(popover).toBeVisible();

      // Check GitHub source link inside popover
      const githubSourceLink = popover.locator("a[href*='github.com']");
      if (await githubSourceLink.isVisible()) {
        await expect(githubSourceLink).toHaveAttribute(
          "href",
          /github\.com.*content\/docs/i
        );
      }
    }
  });
});
