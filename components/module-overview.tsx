import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categoryAccents, getRoadmapModule } from '@/lib/roadmap';

/**
 * The header block on a module landing page. Pulls its data straight from
 * `lib/roadmap.ts`, so a module only ever needs its `slug` here.
 */
export function ModuleOverview({ slug }: { slug: string }) {
  const item = getRoadmapModule(slug);
  if (!item) return null;

  const Icon = item.icon;
  const accent = categoryAccents[item.category];

  return (
    <div className="not-prose my-6 space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-md border ${accent}`}>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase ${accent}`}
        >
          {item.category}
        </span>
      </div>

      <div className="rounded-md border border-fd-border bg-fd-card p-5">
        <div className="text-[11px] font-medium tracking-[0.14em] text-fd-muted-foreground uppercase">
          What this module covers
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-fd-secondary px-2.5 py-1 text-xs text-fd-secondary-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:underline"
      >
        Back to the full roadmap
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
