import { test as base, expect, type Page } from "@playwright/test";
import { PerformanceHelper } from "../helpers/performance.helper";

/**
 * Custom Playwright test fixture providing:
 * 1. Web Audio API mock (AudioContext) so sound effects in simulators don't crash in headless mode.
 * 2. Automatic clipboard permissions for code block and markdown copy tests.
 * 3. PerformanceHelper for loading speed, Web Vitals, asset tracking, and network throttling.
 */
export const test = base.extend<{
  mockAudio: void;
  grantClipboard: void;
  perf: PerformanceHelper;
}>({
  perf: async ({ page }, use) => {
    const helper = new PerformanceHelper(page);
    await use(helper);
    await helper.clearThrottling();
  },
  mockAudio: [
    async ({ page }, use) => {
      await page.addInitScript(() => {
        const MockOscillator = function () {
          return {
            connect: () => {},
            disconnect: () => {},
            start: () => {},
            stop: () => {},
            type: "sine",
            frequency: {
              value: 440,
              setValueAtTime: () => {},
              exponentialRampToValueAtTime: () => {},
              linearRampToValueAtTime: () => {},
            },
          };
        };

        const MockGain = function () {
          return {
            connect: () => {},
            disconnect: () => {},
            gain: {
              value: 1,
              setValueAtTime: () => {},
              exponentialRampToValueAtTime: () => {},
              linearRampToValueAtTime: () => {},
            },
          };
        };

        const MockAudioContext = class {
          state = "running";
          currentTime = 0;
          destination = {};
          createOscillator = MockOscillator;
          createGain = MockGain;
          createBuffer = () => ({
            getChannelData: () => new Float32Array(1024),
          });
          createBufferSource = () => ({
            connect: () => {},
            start: () => {},
            stop: () => {},
            buffer: null,
          });
          resume = async () => {};
          suspend = async () => {};
          close = async () => {};
        };

        // Inject into global window scope
        (window as any).AudioContext = MockAudioContext;
        (window as any).webkitAudioContext = MockAudioContext;
      });
      await use();
    },
    { auto: true },
  ],

  grantClipboard: [
    async ({ context }, use) => {
      try {
        await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      } catch {
        // Fallback for browsers that don't support grantPermissions
      }
      await use();
    },
    { auto: true },
  ],
});

export { expect };
