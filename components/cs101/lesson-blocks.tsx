import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

/** Highlighted lead-in used for a lesson overview. */
export function LessonIntro({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose relative my-6 overflow-hidden rounded-md border border-fd-border bg-fd-card py-5 pr-5 pl-7">
      <span className="absolute inset-y-0 left-0 w-0.5 bg-fd-primary" aria-hidden />
      <div className="text-[15px] leading-[1.65] text-fd-muted-foreground [&_p]:my-0 [&_p+p]:mt-4 [&_strong]:text-fd-foreground">
        {children}
      </div>
    </div>
  );
}

/** The "concepts covered" chips shown at the top of a module. */
export function Concepts({ items }: { items: string[] }) {
  return (
    <div className="not-prose my-6 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[11px] font-medium tracking-[0.14em] text-fd-muted-foreground uppercase">
        Concepts
      </span>
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-fd-secondary px-2.5 py-1 text-xs text-fd-secondary-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/** Two-panel card contrasting the machine view with the everyday analogy. */
export function AnalogyCard({ name, children }: { name?: string; children: ReactNode }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-md border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2 border-b border-fd-border bg-fd-secondary px-5 py-3">
        <Sparkles className="h-4 w-4 shrink-0 text-fd-foreground" strokeWidth={1.5} />
        <span className="text-sm font-medium text-fd-foreground">
          Analogy{name ? `: ${name}` : ''}
        </span>
      </div>
      <div className="grid gap-5 p-5 text-sm leading-[1.65] text-fd-muted-foreground sm:grid-cols-2 [&_p]:my-0 [&_p+p]:mt-4 [&_strong]:text-fd-foreground">
        {children}
      </div>
    </div>
  );
}

// Monochrome callouts — the two variants are distinguished by label and chip
// emphasis rather than hue.
const NOTE_VARIANTS = {
  myth: {
    border: 'border-fd-border',
    surface: 'bg-fd-secondary',
    chip: 'border border-fd-border bg-fd-card text-fd-muted-foreground',
    label: 'Common misconception',
  },
  why: {
    border: 'border-fd-border',
    surface: 'bg-fd-secondary',
    chip: 'bg-fd-primary text-fd-primary-foreground',
    label: 'Why it matters',
  },
  warning: {
    border: 'border-fd-border',
    surface: 'bg-fd-secondary',
    chip: 'border border-fd-border bg-fd-card text-fd-muted-foreground',
    label: 'Warning',
  },
} as const;

/** Tinted callout used for misconceptions and "why it matters" notes. */
export function LessonNote({
  variant = 'why',
  title,
  children,
}: {
  variant?: keyof typeof NOTE_VARIANTS;
  title?: string;
  children: ReactNode;
}) {
  const style = NOTE_VARIANTS[variant];
  return (
    <div className={`not-prose my-6 rounded-md border p-5 ${style.border} ${style.surface}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-[0.08em] uppercase ${style.chip}`}>
          {style.label}
        </span>
        {title ? <span className="text-sm font-medium text-fd-foreground">{title}</span> : null}
      </div>
      <div className="space-y-2 text-sm leading-[1.65] text-fd-muted-foreground [&_p]:my-0 [&_strong]:text-fd-foreground">
        {children}
      </div>
    </div>
  );
}

/** A single term/definition card. */
export function Flashcard({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-md border border-dashed border-fd-border bg-fd-secondary p-5">
      <div className="text-[11px] font-medium tracking-[0.14em] text-fd-muted-foreground uppercase">
        Flashcard
      </div>
      <div className="mt-1 text-base font-medium text-fd-foreground">{term}</div>
      <div className="mt-2 text-sm leading-[1.65] text-fd-muted-foreground">{children}</div>
    </div>
  );
}

/** Check-yourself panel used between modules. */
export function QuickRecall({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="not-prose my-8 rounded-md border border-fd-border bg-fd-card p-5">
      <div className="mb-3 flex items-center gap-2 border-b border-fd-border pb-3">
        <span className="h-1.5 w-1.5 rounded-full bg-fd-primary" aria-hidden />
        <span className="text-sm font-medium text-fd-foreground">{title}</span>
      </div>
      <div className="text-sm leading-[1.65] text-fd-muted-foreground [&_li]:my-1 [&_ol]:my-3 [&_p]:my-0">
        {children}
      </div>
    </div>
  );
}

/**
 * Explain — replacement for ConceptCard walls.
 * Renders What it is / How it works as flowing prose, not a card grid.
 * One idea per block. Keeps working memory small (teach skill).
 */
export function Explain({
  title,
  what,
  children,
}: {
  title: string;
  what: string;
  children: ReactNode;
}) {
  return (
    <section className="my-6">
      <h3 className="text-base font-semibold text-fd-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-[1.7] text-fd-muted-foreground">
        <strong className="text-fd-foreground">What it is — </strong>
        {what}
      </p>
      <div className="mt-2 space-y-2 text-sm leading-[1.7] text-fd-muted-foreground [&_p]:my-0 [&_strong]:text-fd-foreground [&_code]:rounded [&_code]:bg-fd-secondary [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px]">
        <p>
          <strong className="text-fd-foreground">How it works — </strong>
        </p>
        {children}
      </div>
    </section>
  );
}

/**
 * TryIt — tight feedback-loop retrieval practice (teach skill).
 * Use 2-4 options of equal length so formatting gives no hints.
 * Answer goes in <details> so retrieval happens before reveal.
 */
export function TryIt({
  question,
  options,
  answer,
  why,
  children,
}: {
  question?: string;
  options?: string[];
  answer?: string;
  why?: string;
  children?: ReactNode;
}) {
  if (children) {
    return (
      <div className="not-prose my-6 rounded-md border border-fd-border bg-fd-card p-5">
        <div className="text-[11px] font-medium tracking-[0.14em] text-fd-muted-foreground uppercase">
          Try it — hands-on practice
        </div>
        <div className="mt-2 text-sm leading-[1.65] text-fd-muted-foreground [&_li]:my-1 [&_p]:my-2 [&_strong]:text-fd-foreground">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="not-prose my-6 rounded-md border border-fd-border bg-fd-card p-5">
      <div className="text-[11px] font-medium tracking-[0.14em] text-fd-muted-foreground uppercase">
        Try it — recall from memory
      </div>
      {question ? <p className="mt-2 text-sm font-medium text-fd-foreground">{question}</p> : null}
      {options && options.length > 0 ? (
        <ol className="mt-2 list-[upper-alpha] space-y-1 pl-5 text-sm text-fd-muted-foreground">
          {options.map((opt) => (
            <li key={opt}>{opt}</li>
          ))}
        </ol>
      ) : null}
      {answer ? (
        <details className="mt-3 text-sm text-fd-muted-foreground">
          <summary className="cursor-pointer text-fd-foreground">Reveal answer</summary>
          <p className="mt-2">
            <strong className="text-fd-foreground">{answer}</strong>
            {why ? ` — ${why}` : ''}
          </p>
        </details>
      ) : null}
    </div>
  );
}

/** Single tangible win for this lesson (teach skill: one win per lesson). */
export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-md border-l-2 border-fd-primary bg-fd-secondary p-5">
      <div className="text-[11px] font-medium tracking-[0.14em] text-fd-muted-foreground uppercase">
        Takeaway — one win
      </div>
      <div className="mt-1 text-sm leading-[1.65] text-fd-foreground [&_p]:my-0">{children}</div>
    </div>
  );
}
