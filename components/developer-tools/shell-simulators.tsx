'use client';

import React, { useState } from 'react';
import { Terminal, Folder, Play, RotateCcw, ShieldCheck, Check, X, ArrowRight } from 'lucide-react';

export function ShellCliGuiComparison() {
  const [running, setRunning] = useState<boolean>(false);
  const [cliCount, setCliCount] = useState<number>(0);
  const [guiCount, setGuiCount] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);

  const startRace = () => {
    if (running) return;
    setRunning(true);
    setFinished(false);
    setCliCount(0);
    setGuiCount(0);

    // CLI runs almost instantly (50 folders created in ~100ms)
    setTimeout(() => {
      setCliCount(50);
    }, 120);

    // GUI takes seconds (simulating user clicking New Folder -> Type -> Enter)
    let currentGui = 0;
    const interval = setInterval(() => {
      currentGui += 1;
      setGuiCount(currentGui);
      if (currentGui >= 12) {
        clearInterval(interval);
        setRunning(false);
        setFinished(true);
      }
    }, 200);
  };

  const reset = () => {
    setRunning(false);
    setFinished(false);
    setCliCount(0);
    setGuiCount(0);
  };

  return (
    <div className="not-prose my-8 rounded-xl border border-fd-border bg-fd-card p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-fd-foreground">
            CLI vs GUI: Create 50 Client Folders Race
          </h3>
          <p className="text-xs text-fd-muted-foreground">
            Click Run to witness automation speed vs manual GUI mouse clicks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={running}
            onClick={startRace}
            className="flex items-center gap-1.5 rounded-lg bg-fd-primary px-3 py-1.5 text-xs font-semibold text-fd-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Play className="size-3.5" /> Start Race
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-fd-border bg-fd-background p-1.5 text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* CLI Container */}
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              CLI: mkdir -p client_{'{01..50}'}
            </span>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {cliCount} / 50 folders
            </span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-fd-muted">
            <div
              className="h-full bg-emerald-500 transition-all duration-150"
              style={{ width: `${(cliCount / 50) * 100}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {Array.from({ length: Math.min(cliCount, 30) }).map((_, i) => (
              <Folder key={i} className="size-3 text-emerald-500" />
            ))}
            {cliCount > 30 && <span className="text-[10px] text-emerald-600">+20 more</span>}
          </div>
          {cliCount === 50 && (
            <div className="mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ⚡ Completed in 0.04 seconds (Single syscall)
            </div>
          )}
        </div>

        {/* GUI Container */}
        <div className="rounded-lg border border-fd-border bg-fd-background p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-fd-muted-foreground">
              GUI: Right Click → New Folder → Type
            </span>
            <span className="font-mono text-xs text-fd-muted-foreground">
              {guiCount} / 50 folders
            </span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-fd-muted">
            <div
              className="h-full bg-amber-500 transition-all duration-200"
              style={{ width: `${(guiCount / 50) * 100}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {Array.from({ length: guiCount }).map((_, i) => (
              <Folder key={i} className="size-3 text-amber-500" />
            ))}
          </div>
          {finished && (
            <div className="mt-3 text-xs italic text-amber-600 dark:text-amber-400">
              Human gave up after 12 folders (takes ~3 minutes)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ShellPermissionsCalculator() {
  const [owner, setOwner] = useState({ r: true, w: true, x: true });
  const [group, setGroup] = useState({ r: true, w: false, x: true });
  const [other, setOther] = useState({ r: true, w: false, x: false });

  const calcOctal = (perm: { r: boolean; w: boolean; x: boolean }) =>
    (perm.r ? 4 : 0) + (perm.w ? 2 : 0) + (perm.x ? 1 : 0);

  const octal = `${calcOctal(owner)}${calcOctal(group)}${calcOctal(other)}`;
  const str = `-${owner.r ? 'r' : '-'}${owner.w ? 'w' : '-'}${owner.x ? 'x' : '-'}${group.r ? 'r' : '-'}${group.w ? 'w' : '-'}${group.x ? 'x' : '-'}${other.r ? 'r' : '-'}${other.w ? 'w' : '-'}${other.x ? 'x' : '-'}`;

  return (
    <div className="not-prose my-8 rounded-xl border border-fd-border bg-fd-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-5 text-fd-primary" />
        <h3 className="text-base font-semibold text-fd-foreground">
          Interactive Linux File Permission & Octal Calculator
        </h3>
      </div>
      <p className="mt-0.5 text-xs text-fd-muted-foreground">
        Toggle Read, Write, and Execute bits to observe the chmod octal value and `ls -l` representation.
      </p>

      {/* Output Badge */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-fd-border bg-fd-background p-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Symbolic Mode
          </div>
          <div className="font-mono text-lg font-bold text-fd-foreground">{str}</div>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Chmod Octal
          </div>
          <div className="font-mono text-lg font-bold text-fd-primary">chmod {octal} file.sh</div>
        </div>
      </div>

      {/* Checkboxes Grid */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Owner */}
        <div className="rounded-lg border border-fd-border bg-fd-background/50 p-3">
          <div className="text-xs font-bold text-fd-foreground">Owner (User)</div>
          <div className="mt-2 space-y-1.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={owner.r}
                onChange={(e) => setOwner({ ...owner, r: e.target.checked })}
                className="rounded accent-fd-primary"
              />
              <span>Read (r = 4)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={owner.w}
                onChange={(e) => setOwner({ ...owner, w: e.target.checked })}
                className="rounded accent-fd-primary"
              />
              <span>Write (w = 2)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={owner.x}
                onChange={(e) => setOwner({ ...owner, x: e.target.checked })}
                className="rounded accent-fd-primary"
              />
              <span>Execute (x = 1)</span>
            </label>
          </div>
        </div>

        {/* Group */}
        <div className="rounded-lg border border-fd-border bg-fd-background/50 p-3">
          <div className="text-xs font-bold text-fd-foreground">Group</div>
          <div className="mt-2 space-y-1.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={group.r}
                onChange={(e) => setGroup({ ...group, r: e.target.checked })}
                className="rounded accent-fd-primary"
              />
              <span>Read (r = 4)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={group.w}
                onChange={(e) => setGroup({ ...group, w: e.target.checked })}
                className="rounded accent-fd-primary"
              />
              <span>Write (w = 2)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={group.x}
                onChange={(e) => setGroup({ ...group, x: e.target.checked })}
                className="rounded accent-fd-primary"
              />
              <span>Execute (x = 1)</span>
            </label>
          </div>
        </div>

        {/* Others */}
        <div className="rounded-lg border border-fd-border bg-fd-background/50 p-3">
          <div className="text-xs font-bold text-fd-foreground">Others (World)</div>
          <div className="mt-2 space-y-1.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={other.r}
                onChange={(e) => setOther({ ...other, r: e.target.checked })}
                className="rounded accent-fd-primary"
              />
              <span>Read (r = 4)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={other.w}
                onChange={(e) => setOther({ ...other, w: e.target.checked })}
                className="rounded accent-fd-primary"
              />
              <span>Write (w = 2)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={other.x}
                onChange={(e) => setOther({ ...other, x: e.target.checked })}
                className="rounded accent-fd-primary"
              />
              <span>Execute (x = 1)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
