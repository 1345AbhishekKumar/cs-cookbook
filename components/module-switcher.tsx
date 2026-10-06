'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, ChevronsUpDown } from 'lucide-react';
import { categoryAccents, roadmapItems } from '@/lib/roadmap';

// Every module that owns its own docs section.
const modules = roadmapItems.filter((item) => item.slug !== null);

/** The module whose URL is the longest prefix of the current path. */
function useActiveModule() {
  const pathname = usePathname();

  return modules
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

/**
 * Dropdown for moving between curriculum modules. Rendered in the docs sidebar
 * banner, above the page tree.
 */
export function ModuleSwitcher() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = useActiveModule();
  const ActiveIcon = active?.icon;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Switch module"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2 rounded-md border bg-fd-secondary p-2 text-start text-fd-secondary-foreground transition-colors hover:bg-fd-accent"
      >
        {active && ActiveIcon ? (
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-md border ${categoryAccents[active.category]}`}
          >
            <ActiveIcon className="size-4" strokeWidth={1.5} />
          </span>
        ) : null}

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">
            {active ? active.title : 'Browse modules'}
          </span>
          {active ? (
            <span className="block truncate text-xs text-fd-muted-foreground">
              {active.category}
            </span>
          ) : null}
        </span>

        <ChevronsUpDown className="size-4 shrink-0 text-fd-muted-foreground" />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Curriculum modules"
          className="absolute inset-x-0 top-full z-50 mt-1 max-h-[22rem] overflow-y-auto rounded-md border bg-fd-card p-1 shadow-sm"
        >
          <p className="px-2 py-1.5 text-[11px] font-medium tracking-[0.14em] text-fd-muted-foreground uppercase">
            {modules.length} modules
          </p>

          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = module.href === active?.href;

            return (
              <Link
                key={module.href}
                href={module.href}
                role="option"
                aria-selected={isActive}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-md p-1.5 transition-colors hover:bg-fd-accent ${
                  isActive ? 'bg-fd-secondary' : ''
                }`}
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md border ${categoryAccents[module.category]}`}
                >
                  <Icon className="size-4" strokeWidth={1.5} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium leading-tight">
                    {module.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.8125rem] text-fd-muted-foreground">
                    {module.category}
                  </span>
                </span>

                <Check className={`size-3.5 shrink-0 text-fd-primary ${isActive ? '' : 'invisible'}`} />
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
