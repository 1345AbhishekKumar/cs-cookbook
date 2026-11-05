import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@/.source": path.resolve(
        import.meta.dirname,
        "./tests/mocks/source-mock.ts"
      ),
      "next/navigation": path.resolve(
        import.meta.dirname,
        "./node_modules/next/navigation.js"
      ),
      "@": path.resolve(import.meta.dirname, "./"),
    },
  },
  test: {
    server: {
      deps: {
        inline: [
          "react",
          "react-dom",
          "lucide-react",
          "fumadocs-core",
          "fumadocs-ui",
        ],
      },
    },
    pool: "threads",
    isolate: true,
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/vitest.setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
  },
});
