import { test, expect } from "../../fixtures/base.fixture";

test.describe("Headless Routes, SEO & Meta Endpoints", () => {
  test("should serve valid /llms.txt summary endpoint", async ({ request }) => {
    const response = await request.get("/llms.txt");
    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"];
    expect(contentType).toMatch(/text\/plain/i);

    const text = await response.text();
    expect(text.length).toBeGreaterThan(50);
    expect(text.toLowerCase()).toContain("docs");
  });

  test("should serve valid /llms-full.txt comprehensive document endpoint", async ({
    request,
  }) => {
    const response = await request.get("/llms-full.txt");
    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"];
    expect(contentType).toMatch(/text\/plain/i);

    const text = await response.text();
    expect(text.length).toBeGreaterThan(100);
  });

  test("should generate OpenGraph dynamic image at /og/docs/[slug]", async ({
    request,
  }) => {
    const response = await request.get("/og/docs/computer-basics");
    expect([200, 304]).toContain(response.status());

    const contentType = response.headers()["content-type"] || "";
    // Should be image/png or image format
    expect(contentType).toMatch(/image/i);
  });
});
