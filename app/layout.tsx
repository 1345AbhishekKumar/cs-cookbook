import type { Metadata } from "next";
import { RootProvider } from "@/components/provider";
import "katex/dist/katex.css";
import "./global.css";
import localFont from "next/font/local";
import { appName } from "@/lib/shared";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description:
    "A comprehensive, structured syllabus spanning foundational computer science, systems engineering, cloud architecture, and modern production AI.",
};

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  display: "swap",
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
