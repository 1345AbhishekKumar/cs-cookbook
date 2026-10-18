"use client";

import { useEffect } from "react";

let isWarmed = false;

/**
 * Speculatively warms up both the search dialog client chunk
 * and the server-side search index before the user finishes clicking or typing.
 */
export function warmSearch() {
  if (process.env.NODE_ENV === "development") return;
  if (isWarmed || typeof window === "undefined") return;
  isWarmed = true;

  // 1. Prefetch the dynamic Fumadocs search dialog bundle
  import("fumadocs-ui/components/dialog/search-default").catch(() => {});

  // 2. Warm up the search API route in the background
  fetch("/api/search?query=__warmup__", { priority: "low" }).catch(() => {});
}

export function SearchPrefetcher() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    // A. Trigger on hover over any search button or input in navbar/sidebar
    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button[aria-label*="search" i]') ||
        target?.closest("[data-search-trigger]") ||
        target?.closest(".fd-search-toggle") ||
        target?.closest('input[type="search"]')
      ) {
        warmSearch();
      }
    };

    // B. Trigger when search button receives keyboard focus
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button[aria-label*="search" i]') ||
        target?.closest("[data-search-trigger]") ||
        target?.closest(".fd-search-toggle")
      ) {
        warmSearch();
      }
    };

    // C. Trigger when user presses Ctrl or Cmd (before hitting K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        warmSearch();
      }
    };

    // D. Fallback: Warm up during browser idle time (after 3.5s)
    const idleTimer =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(() => warmSearch(), { timeout: 3500 })
        : setTimeout(warmSearch, 3500);

    document.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    document.addEventListener("focusin", handleFocusIn, { passive: true });
    document.addEventListener("keydown", handleKeyDown, { passive: true });

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("keydown", handleKeyDown);
      if (
        typeof window.cancelIdleCallback === "function" &&
        typeof idleTimer === "number"
      ) {
        window.cancelIdleCallback(idleTimer);
      } else {
        clearTimeout(idleTimer);
      }
    };
  }, []);

  return null;
}
