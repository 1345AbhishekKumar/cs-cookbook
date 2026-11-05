import type { Page, CDPSession } from "@playwright/test";

export interface NavigationTimingMetrics {
  dnsLookup: number;
  tcpConnect: number;
  ttfb: number; // Time to First Byte
  domContentLoaded: number;
  domInteractive: number;
  pageLoad: number;
  transferSize: number;
  decodedBodySize: number;
}

export interface WebVitalsMetrics {
  fcp: number; // First Contentful Paint (ms)
  lcp: number; // Largest Contentful Paint (ms)
  cls: number; // Cumulative Layout Shift score
}

export interface AssetSummary {
  totalRequests: number;
  totalBytes: number;
  jsBytes: number;
  cssBytes: number;
  imageBytes: number;
  fontBytes: number;
  otherBytes: number;
  failedRequests: Array<{ url: string; status: number }>;
}

export class PerformanceHelper {
  readonly page: Page;
  private cdpSession?: CDPSession;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Injects observers into the page context before navigation begins
   * to accurately record First Contentful Paint (FCP), Largest Contentful Paint (LCP),
   * and Cumulative Layout Shift (CLS).
   */
  async setupWebVitalsObserver(): Promise<void> {
    await this.page.addInitScript(() => {
      (window as any).__vitals = {
        fcp: 0,
        lcp: 0,
        cls: 0,
      };

      try {
        // Paint observer for FCP
        const paintObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.name === "first-contentful-paint") {
              (window as any).__vitals.fcp = entry.startTime;
            }
          }
        });
        paintObserver.observe({ type: "paint", buffered: true });

        // LCP observer (records latest candidate until user interaction)
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            (window as any).__vitals.lcp = lastEntry.startTime;
          }
        });
        lcpObserver.observe({
          type: "largest-contentful-paint",
          buffered: true,
        });

        // Layout shift observer for CLS
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              (window as any).__vitals.cls += (entry as any).value;
            }
          }
        });
        clsObserver.observe({ type: "layout-shift", buffered: true });
      } catch (err) {
        console.warn(
          "PerformanceObserver not supported in this environment",
          err
        );
      }
    });
  }

  /**
   * Retrieves the captured Core Web Vitals from window.__vitals.
   */
  async getWebVitals(): Promise<WebVitalsMetrics> {
    return await this.page.evaluate(() => {
      const vitals = (window as any).__vitals || { fcp: 0, lcp: 0, cls: 0 };
      return {
        fcp: Math.round(vitals.fcp),
        lcp: Math.round(vitals.lcp),
        cls: parseFloat(vitals.cls.toFixed(4)),
      };
    });
  }

  /**
   * Retrieves native Navigation Timing API metrics.
   */
  async getNavigationTimings(): Promise<NavigationTimingMetrics> {
    return await this.page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] as
        PerformanceNavigationTiming | undefined;

      if (!nav) {
        return {
          dnsLookup: 0,
          tcpConnect: 0,
          ttfb: 0,
          domContentLoaded: 0,
          domInteractive: 0,
          pageLoad: 0,
          transferSize: 0,
          decodedBodySize: 0,
        };
      }

      return {
        dnsLookup: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
        tcpConnect: Math.round(nav.connectEnd - nav.connectStart),
        ttfb: Math.round(nav.responseStart - nav.requestStart),
        domContentLoaded: Math.round(
          nav.domContentLoadedEventEnd - nav.startTime
        ),
        domInteractive: Math.round(nav.domInteractive - nav.startTime),
        pageLoad: Math.round(nav.loadEventEnd - nav.startTime),
        transferSize: nav.transferSize || 0,
        decodedBodySize: nav.decodedBodySize || 0,
      };
    });
  }

  /**
   * Starts tracking network asset transfers (JS, CSS, images, etc.) for budget testing.
   * Call the returned function to stop tracking and get the summary report.
   */
  trackNetworkAssets(): () => AssetSummary {
    const summary: AssetSummary = {
      totalRequests: 0,
      totalBytes: 0,
      jsBytes: 0,
      cssBytes: 0,
      imageBytes: 0,
      fontBytes: 0,
      otherBytes: 0,
      failedRequests: [],
    };

    const handler = (response: any) => {
      summary.totalRequests++;

      const status = response.status();
      const url = response.url();

      if (status >= 400) {
        summary.failedRequests.push({ url, status });
      }

      const headers = response.headers();
      const contentLength = headers["content-length"];
      const bytes = contentLength ? parseInt(contentLength, 10) : 0;
      summary.totalBytes += bytes;

      const contentType = (headers["content-type"] || "").toLowerCase();

      if (
        contentType.includes("javascript") ||
        url.endsWith(".js") ||
        url.includes("/_next/static/chunks/")
      ) {
        summary.jsBytes += bytes;
      } else if (contentType.includes("css") || url.endsWith(".css")) {
        summary.cssBytes += bytes;
      } else if (
        contentType.includes("image") ||
        /\.(png|jpe?g|webp|avif|svg|gif)$/i.test(url)
      ) {
        summary.imageBytes += bytes;
      } else if (
        contentType.includes("font") ||
        /\.(woff2?|ttf|otf)$/i.test(url)
      ) {
        summary.fontBytes += bytes;
      } else {
        summary.otherBytes += bytes;
      }
    };

    this.page.on("response", handler);

    return () => {
      this.page.off("response", handler);
      return summary;
    };
  }

  /**
   * Emulates mobile CPU and network throttling conditions via Chrome DevTools Protocol (CDP).
   */
  async emulateThrottling(
    profile: "slow3G" | "fast3G" | "regular4G",
    cpuSlowdownRate = 4
  ): Promise<void> {
    const isChromium =
      this.page.context().browser()?.browserType().name() === "chromium";
    if (!isChromium) {
      // CDP throttling is supported on Chromium
      return;
    }

    if (!this.cdpSession) {
      this.cdpSession = await this.page.context().newCDPSession(this.page);
    }

    const profiles = {
      slow3G: {
        latency: 400,
        downloadThroughput: (400 * 1024) / 8, // 400 Kbps
        uploadThroughput: (400 * 1024) / 8,
      },
      fast3G: {
        latency: 150,
        downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps
        uploadThroughput: (750 * 1024) / 8, // 750 Kbps
      },
      regular4G: {
        latency: 50,
        downloadThroughput: (4 * 1024 * 1024) / 8, // 4 Mbps
        uploadThroughput: (3 * 1024 * 1024) / 8,
      },
    };

    const target = profiles[profile];
    await this.cdpSession.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: target.latency,
      downloadThroughput: target.downloadThroughput,
      uploadThroughput: target.uploadThroughput,
    });

    if (cpuSlowdownRate > 1) {
      await this.cdpSession.send("Emulation.setCPUThrottlingRate", {
        rate: cpuSlowdownRate,
      });
    }
  }

  /**
   * Resets any applied CDP throttling.
   */
  async clearThrottling(): Promise<void> {
    if (this.cdpSession) {
      await this.cdpSession.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 0,
        downloadThroughput: -1,
        uploadThroughput: -1,
      });
      await this.cdpSession.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    }
  }

  /**
   * Measures the duration in milliseconds of a client-side interaction or route transition.
   */
  async measureDuration(action: () => Promise<void>): Promise<number> {
    const start = Date.now();
    await action();
    return Date.now() - start;
  }
}
