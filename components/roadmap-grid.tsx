'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { filterRoadmap, roadmapItems, ROADMAP_VIEWS, type RoadmapView } from '@/lib/roadmap';

// Single source of truth for horizontal alignment + gutters, so every
// section lines up on the same 1200px grid as the nav.
const container = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8';

/**
 * The roadmap table of contents. Renders every module by default and can be
 * narrowed to the AI & Intelligence track with the pills beside the count.
 */
export function RoadmapGrid() {
  const [view, setView] = useState<RoadmapView>('all');
  const items = filterRoadmap(roadmapItems, view);
  const activeView = ROADMAP_VIEWS.find((option) => option.id === view) ?? ROADMAP_VIEWS[0];

  return (
    <section id="toc" className={`${container} flex-1 pb-20 md:pb-28`}>
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-[13px] font-medium tracking-[0.14em] text-fd-muted-foreground uppercase">
            Curriculum
          </p>
          <h2 className="text-[28px] font-medium tracking-[-0.02em] text-fd-foreground">
            Roadmap Modules
          </h2>
          <p className="max-w-2xl text-[15px] leading-[1.65] text-fd-muted-foreground">
            {activeView.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Outlined pill filters: all modules ⇄ AI-only modules. */}
          <div role="group" aria-label="Filter roadmap modules" className="flex items-center gap-2">
            {ROADMAP_VIEWS.map((option) => {
              const active = view === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setView(option.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    active
                      ? 'border-fd-foreground/20 bg-fd-secondary text-fd-foreground'
                      : 'border-fd-border text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <span className="pl-1 text-[13px] text-fd-muted-foreground">
            {items.length} {view === 'ai' ? 'AI modules' : 'curated modules'}
          </span>
        </div>
      </div>

      {/* key={view} restarts the entrance animation whenever the filter changes */}
      <div
        key={view}
        className="grid grid-cols-1 gap-4 [animation:roadmap-fade_240ms_ease-out] sm:grid-cols-2 lg:grid-cols-3 motion-reduce:[animation:none]"
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group relative flex h-full flex-col rounded-md border border-fd-border bg-fd-card p-5 transition-colors duration-200 hover:border-fd-foreground/25 hover:bg-fd-accent"
            >
              {/* Top Bar with Icon and Category */}
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-fd-border text-fd-foreground">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </span>
                <span className="rounded-full border border-fd-border px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] text-fd-muted-foreground uppercase">
                  {item.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="flex items-start justify-between gap-2 text-base font-medium text-fd-foreground">
                <span>{item.title}</span>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 -translate-x-1 text-fd-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </h3>

              {/* Description */}
              <p className="mt-2 line-clamp-3 text-sm leading-[1.6] text-fd-muted-foreground">
                {item.description}
              </p>

              {/* Tags Footer — pushed to the bottom so cards line up */}
              <div className="mt-auto pt-5">
                <div className="flex flex-wrap gap-1.5 border-t border-fd-border pt-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-fd-secondary px-2.5 py-1 text-[11px] text-fd-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
