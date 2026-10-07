import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import 'katex/dist/katex.css';
import './global.css';
import { Inter } from 'next/font/google';
import { appName } from '@/lib/shared';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description:
    'A comprehensive, structured syllabus spanning foundational computer science, systems engineering, cloud architecture, and modern production AI.',
};

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
