import { test, expect } from "../../fixtures/base.fixture";
import { DocsPage } from "../../pages/docs.page";

const MODULES = [
  { title: "Computer Basics", slug: "computer-basics" },
  { title: "Developer Tools", slug: "developer-tools" },
  { title: "Learn Python", slug: "learn-python" },
  { title: "Data Structures & Algorithms", slug: "dsa" },
  { title: "Operating Systems", slug: "operating-system" },
  { title: "Computer Networking", slug: "computer-networking" },
  { title: "Databases, SQL & Data-Intensive Systems", slug: "databases-sql" },
  { title: "PostgreSQL", slug: "postgresql" },
  { title: "Database Internals", slug: "database-internals" },
  { title: "Full Stack Development", slug: "full-stack-development" },
  { title: "System Design & Distributed Systems", slug: "system-design" },
  { title: "DevOps, CI/CD & Performance", slug: "devops-cicd-performance" },
  { title: "Code with AI", slug: "code-with-ai" },
  { title: "AI / ML Foundations", slug: "ai-ml-foundations" },
  { title: "AI Agents (Loops, Graphs, Swarms)", slug: "ai-agents" },
  { title: "Projects", slug: "projects" },
  { title: "Cheatsheets", slug: "cheatsheets" },
  { title: "Books Library", slug: "books" },
  { title: "Extra", slug: "extra" },
];

test.describe("All Curriculum Modules - Live Error Crawler", () => {
  for (const module of MODULES) {
    test(`should open module "${module.title}" (/docs/${module.slug}) without error`, async ({
      page,
    }) => {
      const pageErrors: Error[] = [];
      const severeConsoleErrors: string[] = [];

      // Intercept runtime exceptions
      page.on("pageerror", (error) => {
        pageErrors.push(error);
      });

      // Intercept severe console errors (excluding harmless browser warnings)
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const text = msg.text();
          if (
            !text.includes("Download the React DevTools") &&
            !text.includes("favicon.ico")
          ) {
            severeConsoleErrors.push(text);
          }
        }
      });

      // Navigate to the module root
      const response = await page.goto(`/docs/${module.slug}`, {
        waitUntil: "domcontentloaded",
      });

      // Assert HTTP status is 200/300 range (not 404 or 500)
      if (response) {
        expect(
          response.status(),
          `Expected valid HTTP status on /docs/${module.slug}, received ${response.status()}`
        ).toBeLessThan(400);
      }

      // Assert body is visible
      await expect(page.locator("body")).toBeVisible();

      // Ensure no Next.js runtime error overlay or error boundary
      const nextErrorDialog = page.locator(
        "nextjs-portal, [data-nextjs-dialog]"
      );
      await expect(nextErrorDialog).not.toBeVisible();

      // Ensure no 500 / unhandled crash text in page body
      const crashHeading = page.getByRole("heading", {
        name: /^(500|Internal Server Error|Unhandled Runtime Error)$/i,
      });
      await expect(crashHeading).not.toBeVisible();

      // Assert primary page heading or document title is present
      const mainHeading = page.locator("h1").first();
      await expect(mainHeading).toBeVisible();

      // Assert zero unhandled JS exceptions
      expect(
        pageErrors,
        `Runtime page errors detected on /docs/${module.slug}: ${pageErrors.map((e) => e.message).join("; ")}`
      ).toHaveLength(0);

      // Assert zero severe console errors
      expect(
        severeConsoleErrors,
        `Severe console errors detected on /docs/${module.slug}: ${severeConsoleErrors.join("; ")}`
      ).toHaveLength(0);
    });
  }

  test("should seamlessly switch between modules using the ModuleSwitcher without errors", async ({
    page,
  }) => {
    const docsPage = new DocsPage(page);
    const pageErrors: Error[] = [];

    page.on("pageerror", (error) => {
      pageErrors.push(error);
    });

    // Start at Computer Basics
    await docsPage.goto("computer-basics");
    await expect(page).toHaveURL(/\/docs\/computer-basics/);

    // Switch to Developer Tools via dropdown
    await docsPage.selectModule("Developer Tools");
    await expect(page).toHaveURL(/\/docs\/developer-tools/);
    await expect(page.locator("h1").first()).toBeVisible();

    // Switch to Learn Python via dropdown
    await docsPage.selectModule("Learn Python");
    await expect(page).toHaveURL(/\/docs\/learn-python/);
    await expect(page.locator("h1").first()).toBeVisible();

    // Switch to Data Structures & Algorithms via dropdown
    await docsPage.selectModule("Data Structures & Algorithms");
    await expect(page).toHaveURL(/\/docs\/dsa/);
    await expect(page.locator("h1").first()).toBeVisible();

    // Ensure no unhandled errors during interactive switching
    expect(pageErrors).toHaveLength(0);
  });
});
