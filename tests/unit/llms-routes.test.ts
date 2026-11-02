import { describe, it, expect, vi } from "vitest";
import { GET as getLlmsTxt } from "@/app/llms.txt/route";
import { GET as getLlmsFullTxt } from "@/app/llms-full.txt/route";

describe("app/llms.txt and app/llms-full.txt routes", () => {
  it("llms.txt GET returns a valid Response object", async () => {
    const response = await getLlmsTxt();
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(typeof text).toBe("string");
  });

  it("llms-full.txt GET returns a valid Response object", async () => {
    const response = await getLlmsFullTxt();
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(typeof text).toBe("string");
  });
});
