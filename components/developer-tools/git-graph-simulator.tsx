'use client';

import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

interface Stage {
  title: string;
  command: string;
  explanation: string;
  workingTree: string[];
  stagingArea: string[];
  commits: { id: string; msg: string; branch?: string; parent?: string }[];
  head: string;
}

const STAGES: Stage[] = [
  {
    title: '1. Clean Working Tree',
    command: 'git status',
    explanation: 'Repository is initialized. HEAD points to main, with commit C0 as base.',
    workingTree: ['app.py (unmodified)'],
    stagingArea: [],
    commits: [{ id: 'C0', msg: 'initial commit', branch: 'main' }],
    head: 'main -> C0',
  },
  {
    title: '2. Modify File in Working Directory',
    command: 'echo "print(\'hello\')" >> app.py',
    explanation: 'File changes exist only in your working tree on disk. Git sees untracked changes.',
    workingTree: ['app.py (modified +1 line)'],
    stagingArea: [],
    commits: [{ id: 'C0', msg: 'initial commit', branch: 'main' }],
    head: 'main -> C0',
  },
  {
    title: '3. Stage Changes to Index',
    command: 'git add app.py',
    explanation: 'The staging area (index) captures a snapshot ready to be committed.',
    workingTree: ['app.py (staged)'],
    stagingArea: ['app.py (snapshot blob prepared)'],
    commits: [{ id: 'C0', msg: 'initial commit', branch: 'main' }],
    head: 'main -> C0',
  },
  {
    title: '4. Commit Snapshot to DAG History',
    command: 'git commit -m "add hello message"',
    explanation: 'Git creates commit C1 referencing parent C0. Main advances to C1.',
    workingTree: ['app.py (clean)'],
    stagingArea: [],
    commits: [
      { id: 'C0', msg: 'initial commit' },
      { id: 'C1', msg: 'add hello message', branch: 'main', parent: 'C0' },
    ],
    head: 'main -> C1',
  },
  {
    title: '5. Create & Checkout Feature Branch',
    command: 'git checkout -b feature/auth',
    explanation: 'A branch in Git is just a lightweight 41-byte pointer. HEAD now points to feature/auth.',
    workingTree: ['app.py (clean)'],
    stagingArea: [],
    commits: [
      { id: 'C0', msg: 'initial commit' },
      { id: 'C1', msg: 'add hello message', parent: 'C0' },
    ],
    head: 'feature/auth -> C1',
  },
  {
    title: '6. New Commit on Feature Branch',
    command: 'git commit -m "implement oauth logic"',
    explanation: 'Commit C2 is created. Only feature/auth advances; main remains at C1.',
    workingTree: ['auth.py (clean)'],
    stagingArea: [],
    commits: [
      { id: 'C0', msg: 'initial commit' },
      { id: 'C1', msg: 'add hello message', branch: 'main', parent: 'C0' },
      { id: 'C2', msg: 'implement oauth logic', branch: 'feature/auth', parent: 'C1' },
    ],
    head: 'feature/auth -> C2',
  },
];

export function GitGraphSimulator() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const stage = STAGES[currentStep];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= STAGES.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="not-prose my-8 rounded-xl border border-fd-border bg-fd-card p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
            <GitBranch className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-fd-foreground">
              Interactive Git DAG & Three-Tree Lifecycle Simulator
            </h3>
            <p className="text-xs text-fd-muted-foreground">
              Visualizing Working Directory, Index / Staging Area, and Commit History.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 rounded-md bg-fd-primary px-3 py-1.5 text-xs font-medium text-fd-primary-foreground hover:opacity-90"
          >
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            disabled={currentStep >= STAGES.length - 1}
            onClick={() => setCurrentStep((p) => Math.min(p + 1, STAGES.length - 1))}
            className="flex items-center gap-1 rounded-md border border-fd-border bg-fd-background px-2.5 py-1.5 text-xs text-fd-foreground hover:bg-fd-muted disabled:opacity-40"
          >
            Next <ChevronRight className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            className="rounded-md border border-fd-border bg-fd-background p-1.5 text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground"
            title="Reset"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Current Step Banner */}
      <div className="mt-4 rounded-lg border border-fd-border bg-fd-background p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-orange-500">{stage.title}</span>
          <span className="font-mono text-fd-muted-foreground">Step {currentStep + 1} of {STAGES.length}</span>
        </div>
        <div className="mt-1 font-mono text-xs font-semibold text-fd-foreground">
          $ {stage.command}
        </div>
        <p className="mt-1 text-xs text-fd-muted-foreground">{stage.explanation}</p>
      </div>

      {/* Visual Three-State Columns */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Working Directory */}
        <div className="rounded-lg border border-fd-border bg-fd-background/50 p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-fd-muted-foreground">
            1. Working Directory
          </div>
          <div className="mt-2 space-y-1.5">
            {stage.workingTree.length === 0 ? (
              <span className="text-xs italic text-fd-muted-foreground">Empty</span>
            ) : (
              stage.workingTree.map((item, i) => (
                <div key={i} className="rounded bg-fd-muted/60 px-2 py-1 font-mono text-[11px] text-fd-foreground">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Staging Area / Index */}
        <div className="rounded-lg border border-fd-border bg-fd-background/50 p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
            2. Staging Area (Index)
          </div>
          <div className="mt-2 space-y-1.5">
            {stage.stagingArea.length === 0 ? (
              <span className="text-xs italic text-fd-muted-foreground">No staged changes</span>
            ) : (
              stage.stagingArea.map((item, i) => (
                <div key={i} className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 font-mono text-[11px] text-amber-700 dark:text-amber-300">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Commit History */}
        <div className="rounded-lg border border-fd-border bg-fd-background/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
              3. Commit History (DAG)
            </span>
            <span className="font-mono text-[10px] text-fd-muted-foreground">
              HEAD: {stage.head}
            </span>
          </div>
          <div className="mt-2 space-y-1.5">
            {stage.commits.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <GitCommit className="size-3 text-emerald-500" />
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{c.id}</span>
                  <span className="truncate text-fd-foreground/80">{c.msg}</span>
                </div>
                {c.branch && (
                  <span className="rounded bg-emerald-600 px-1.5 py-0.2 text-[9px] font-bold text-white">
                    {c.branch}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
