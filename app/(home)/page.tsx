import Link from 'next/link';
import { RoadmapGrid } from '@/components/roadmap-grid';
import { roadmapItems } from '@/lib/roadmap';

// Single source of truth for horizontal alignment + gutters, so every
// section lines up on the same 1200px grid as the nav.
const container = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8';

// Outlined pill shortcuts, one per roadmap track — the home page's analogue of
// the suggested-prompt chips that sit under a search bar.
const trackChips: { label: string; href: string }[] = [
  { label: 'Foundations', href: '/docs/computer-basics' },
  { label: 'Systems & Data', href: '/docs/computer-networking' },
  { label: 'Architecture', href: '/docs/system-design' },
  { label: 'AI & Intelligence', href: '/docs/ai-ml-foundations' },
  { label: 'Resources', href: '/docs/books' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section — type on an empty canvas, no decoration. */}
      <section className={`${container} pt-24 pb-16 md:pt-32 md:pb-24`}>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center rounded-full border border-fd-border px-3.5 py-1.5 text-[13px] font-medium tracking-[0.02em] text-fd-muted-foreground">
            Comprehensive Engineering Curriculum
          </span>

          <h1 className="text-balance text-4xl font-medium tracking-[-0.03em] text-fd-foreground sm:text-5xl">
            Learning Roadmap — Table of Contents
          </h1>

          <p className="max-w-2xl text-pretty text-[17px] leading-[1.65] text-fd-muted-foreground">
            A comprehensive, structured syllabus spanning foundational computer science, systems
            engineering, cloud architecture, and modern production AI.
          </p>

          {/* One filled button is the system's only chromatic punctuation. */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="#toc"
              className="inline-flex items-center justify-center rounded-full bg-fd-primary px-6 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-80"
            >
              Explore Modules
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-full border border-fd-border px-6 py-2.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
            >
              Open Docs
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 text-[13px] text-fd-muted-foreground">
            <span>
              <strong className="font-medium text-fd-foreground">{roadmapItems.length}</strong>{' '}
              modules
            </span>
            <span className="hidden h-3 w-px bg-fd-border sm:block" aria-hidden />
            <span>
              <strong className="font-medium text-fd-foreground">10</strong> deep-dive lessons
            </span>
            <span className="hidden h-3 w-px bg-fd-border sm:block" aria-hidden />
            <span>Beginner → advanced</span>
          </div>

          <nav
            aria-label="Roadmap tracks"
            className="flex flex-wrap items-center justify-center gap-2 pt-3"
          >
            {trackChips.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className="rounded-full border border-fd-border px-3.5 py-1.5 text-[13px] font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
              >
                {chip.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Table of Contents Grid Section */}
      <RoadmapGrid />

      {/* Footer Info Banner — a hairline rule and whitespace, no card or tint. */}
      <section className={`${container} pb-24 md:pb-32`}>
        <div className="flex flex-col items-center gap-4 border-t border-fd-border pt-16 text-center md:pt-20">
          <h3 className="text-2xl font-medium tracking-[-0.02em] text-fd-foreground md:text-[28px]">
            Ready to begin learning?
          </h3>
          <p className="max-w-xl text-[15px] leading-[1.65] text-fd-muted-foreground">
            Follow the curriculum sequentially or jump directly into the module relevant to your
            current project.
          </p>
          <Link
            href="/docs"
            className="mt-2 inline-flex items-center justify-center rounded-full border border-fd-border px-6 py-2.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
          >
            Start Learning
          </Link>
        </div>
      </section>
    </div>
  );
}
