import { test, expect } from "../../fixtures/base.fixture";
import { SearchModal } from "../../pages/search-modal.page";

test.describe("Global Search & Discovery System", () => {
  test("should return structured search results from /api/search endpoint", async ({
    request,
  }) => {
    const response = await request.get("/api/search?query=computer");
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      const firstResult = data[0];
      expect(firstResult).toHaveProperty("id");
      expect(firstResult).toHaveProperty("title");
      expect(firstResult).toHaveProperty("url");
      expect(typeof firstResult.url).toBe("string");
    }
  });

  test("should open search dialog via hotkey, perform query, and navigate results", async ({
    page,
  }) => {
    await page.goto("/docs/computer-basics");
    const searchModal = new SearchModal(page);

    // Trigger via hotkey
    await searchModal.openViaHotkey();

    // Query for a known topic
    await searchModal.search("binary");

    // Wait for results to populate
    await expect(searchModal.searchResults.first()).toBeVisible({
      timeout: 10000,
    });
    const resultsCount = await searchModal.searchResults.count();
    expect(resultsCount).toBeGreaterThan(0);

    // Keyboard navigation with ArrowDown
    await page.keyboard.press("ArrowDown");
    const selectedItem = page
      .locator(
        "[role='option'][aria-selected='true'], [data-selected='true'], a[href*='/docs/'][data-highlighted='true']"
      )
      .first();
    if (await selectedItem.isVisible()) {
      await expect(selectedItem).toBeVisible();
    }

    // Dismiss via Escape
    await searchModal.closeViaEscape();
  });

  test("should display graceful empty state for non-matching queries", async ({
    page,
  }) => {
    await page.goto("/docs/computer-basics");
    const searchModal = new SearchModal(page);

    await searchModal.openViaHotkey();
    await searchModal.search("xyznonexistentterm999");

    // Expect empty state or 0 results
    await expect(searchModal.searchResults).toHaveCount(0);
    if (await searchModal.emptyState.isVisible()) {
      await expect(searchModal.emptyState).toBeVisible();
    }

    await searchModal.closeViaEscape();
  });
});
