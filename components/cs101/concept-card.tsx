import type { ReactNode } from 'react';

/**
 * A single concept card used by lessons.
 * Visual language mirrors `basic_concepts/*.html`:
 * rounded card, colored left border, header row with dot + category chip,
 * and a "what it is / how it works" body written as MDX.
 */
export function ConceptCard({
  name,
  category,
  children,
}: {
  name: string;
  category?: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose my-5 overflow-hidden rounded-xl border border-fd-border border-l-4 border-l-sky-400 bg-fd-card transition-colors hover:border-fd-foreground/25 dark:border-l-sky-400">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fd-border bg-fd-secondary/70 px-5 py-3">
        <h4 className="m-0 flex items-center gap-2 text-sm font-semibold text-fd-foreground">
          <span className="h-2 w-2 shrink-0 rounded-full bg-sky-400" aria-hidden />
          {name}
        </h4>
        {category ? (
          <span className="rounded-md bg-sky-400/10 px-2.5 py-0.5 font-mono text-[11px] font-bold tracking-wide text-sky-600 uppercase dark:text-sky-300">
            {category}
          </span>
        ) : null}
      </div>
      <div className="space-y-3 px-5 py-4 text-sm leading-[1.7] text-fd-muted-foreground [&_p]:my-0 [&_p>strong:first-child]:text-fd-foreground [&_strong]:text-fd-foreground [&_code]:rounded [&_code]:bg-fd-secondary [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px]">
        {children}
      </div>
    </div>
  );
}
