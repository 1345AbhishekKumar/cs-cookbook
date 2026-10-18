"use client";

import { RootProvider as BaseRootProvider } from "fumadocs-ui/provider/next";
import type { ComponentProps } from "react";
import { SearchPrefetcher } from "@/components/search-prefetcher";

// Next.js 16 + React 19 flags raw <script> tags rendered within component JSX trees.
// next-themes (bundled in fumadocs-ui) renders an inline <script> to prevent theme FOUC.
// Suppress the warning in development and set scriptProps to avoid React 19 client warnings.
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Encountered a script tag while rendering React component"
      )
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export function RootProvider(props: ComponentProps<typeof BaseRootProvider>) {
  return (
    <BaseRootProvider
      {...props}
      theme={{
        ...props.theme,
        scriptProps: {
          ...props.theme?.scriptProps,
          type: typeof window === "undefined" ? undefined : "application/json",
        },
      }}
    >
      <SearchPrefetcher />
      {props.children}
    </BaseRootProvider>
  );
}
