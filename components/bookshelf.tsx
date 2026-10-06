import { BOOK_CATEGORIES, books } from '@/lib/books';

/** The whole reading list, grouped by category, driven by `lib/books.ts`. */
export function Bookshelf() {
  const groups = BOOK_CATEGORIES.map((category) => ({
    category,
    items: books.filter((book) => book.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="not-prose my-6 space-y-10">
      {groups.map((group) => (
        <section key={group.category}>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="text-sm font-medium tracking-[0.14em] text-fd-foreground uppercase">
              {group.category}
            </h3>
            <span className="rounded-full bg-fd-secondary px-2 py-0.5 text-[11px] text-fd-muted-foreground">
              {group.items.length}
            </span>
            <span className="h-px flex-1 bg-fd-border" aria-hidden />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {group.items.map((book) => (
              <article
                key={book.title}
                className="flex h-full flex-col rounded-md border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-foreground/25 hover:bg-fd-accent"
              >
                <h4 className="text-sm font-medium text-fd-foreground">{book.title}</h4>
                <p className="mt-0.5 text-xs text-fd-muted-foreground">
                  {book.author}
                  {book.year ? ` · ${book.year}` : ''}
                </p>
                <p className="mt-2 text-sm leading-[1.65] text-fd-muted-foreground">{book.note}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
