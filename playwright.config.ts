import { defineConfig, devices } from "@playwright/test";

const isPerfRun = process.argv.some((arg) => arg.includes("12-performance"));
if (isPerfRun && !process.env.ACTIVE_DOCS_MODULE) {
  process.env.ACTIVE_DOCS_MODULE = "computer-basics";
}

const PORT = process.env.PORT || "3000";
const baseURL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60000,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_TEST_BASE_URL
    ? undefined
    : {
        command: "bun run dev",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120 * 1000,
        env: {
          ...process.env,
          PORT,
          ...(isPerfRun && !process.env.ACTIVE_DOCS_MODULE
            ? { ACTIVE_DOCS_MODULE: "computer-basics" }
            : {}),
        },
      },
});
