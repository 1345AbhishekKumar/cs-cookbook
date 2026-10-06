'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles } from 'lucide-react';

interface Subcommand {
  id: string;
  name: string;
  desc: string;
  base: string;
  flags: { id: string; label: string; flag: string; defaultOn?: boolean }[];
  argPlaceholder: string;
  defaultArg: string;
}

const SUBCOMMANDS: Subcommand[] = [
  {
    id: 'add',
    name: 'uv add',
    desc: 'Add dependencies to pyproject.toml & sync lockfile',
    base: 'uv add',
    argPlaceholder: 'package names...',
    defaultArg: 'fastapi uvicorn',
    flags: [
      { id: 'dev', label: 'Dev Dependency (--dev)', flag: '--dev' },
      { id: 'upgrade', label: 'Upgrade (--upgrade)', flag: '--upgrade' },
      { id: 'frozen', label: 'Frozen Lockfile (--frozen)', flag: '--frozen' },
    ],
  },
  {
    id: 'pip-install',
    name: 'uv pip install',
    desc: 'Drop-in pip replacement for active venv',
    base: 'uv pip install',
    argPlaceholder: 'package or requirements file',
    defaultArg: '-r requirements.txt',
    flags: [
      { id: 'system', label: 'System Python (--system)', flag: '--system' },
      { id: 'no-cache', label: 'Disable Cache (--no-cache)', flag: '--no-cache' },
      { id: 'exact', label: 'Exact Match (--exact)', flag: '--exact' },
    ],
  },
  {
    id: 'run',
    name: 'uv run',
    desc: 'Run commands or scripts in ephemeral/project environments',
    base: 'uv run',
    argPlaceholder: 'script or command',
    defaultArg: 'main.py',
    flags: [
      { id: 'with', label: 'With Package (--with ruff)', flag: '--with ruff' },
      { id: 'isolated', label: 'Isolated Env (--isolated)', flag: '--isolated' },
    ],
  },
  {
    id: 'python-install',
    name: 'uv python install',
    desc: 'Download & install standalone managed Python versions',
    base: 'uv python install',
    argPlaceholder: 'version',
    defaultArg: '3.12 3.13',
    flags: [
      { id: 'reinstall', label: 'Force Reinstall (--reinstall)', flag: '--reinstall' },
    ],
  },
];

export function UvCommandBuilder() {
  const [selectedSub, setSelectedSub] = useState<string>('add');
  const [activeFlags, setActiveFlags] = useState<Record<string, boolean>>({});
  const [argument, setArgument] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const sub = SUBCOMMANDS.find((s) => s.id === selectedSub) || SUBCOMMANDS[0];
  const currentArg = argument !== '' ? argument : sub.defaultArg;

  const toggleFlag = (flagId: string) => {
    setActiveFlags((prev) => ({ ...prev, [flagId]: !prev[flagId] }));
  };

  const selectedFlagStrings = sub.flags
    .filter((f) => activeFlags[f.id])
    .map((f) => f.flag)
    .join(' ');

  const fullCommand = `${sub.base} ${selectedFlagStrings ? selectedFlagStrings + ' ' : ''}${currentArg}`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose my-8 rounded-xl border border-fd-border bg-fd-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-emerald-500" />
        <h3 className="text-base font-semibold text-fd-foreground">
          Interactive uv Command Builder
        </h3>
      </div>
      <p className="mt-0.5 text-xs text-fd-muted-foreground">
        Pick a workflow, toggle flags, and see the exact syntax constructed in real time.
      </p>

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-2 border-b border-fd-border pb-3">
        {SUBCOMMANDS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSelectedSub(s.id);
              setActiveFlags({});
              setArgument('');
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedSub === s.id
                ? 'bg-emerald-600 text-white'
                : 'bg-fd-muted/50 text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-xs text-fd-muted-foreground">{sub.desc}</p>

        {/* Arguments input */}
        <div className="mt-3">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Target Arguments
          </label>
          <input
            type="text"
            value={argument || sub.defaultArg}
            onChange={(e) => setArgument(e.target.value)}
            placeholder={sub.argPlaceholder}
            className="mt-1 w-full rounded-md border border-fd-border bg-fd-background px-3 py-1.5 font-mono text-xs text-fd-foreground focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Flag toggles */}
        <div className="mt-3">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Options & Flags
          </label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {sub.flags.map((f) => {
              const isOn = !!activeFlags[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFlag(f.id)}
                  className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                    isOn
                      ? 'border-emerald-500 bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-400'
                      : 'border-fd-border bg-fd-background text-fd-muted-foreground hover:border-fd-primary/40 hover:text-fd-foreground'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Output CLI Box */}
        <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-950/20 bg-slate-950 p-3 text-emerald-400 dark:border-emerald-500/20">
          <div className="flex items-center gap-2 overflow-x-auto font-mono text-xs">
            <span className="text-slate-500">$</span>
            <span className="whitespace-nowrap font-bold">{fullCommand}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="ml-3 flex shrink-0 items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-700"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
