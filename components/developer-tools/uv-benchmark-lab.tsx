'use client';

import React, { useState } from 'react';
import { Gauge, Zap, DollarSign, Clock, CircleCheck } from 'lucide-react';

const BENCHMARK_DATA: Record<number, {
  name: string;
  pkgs: string;
  pip: string;
  poetry: string;
  uv: string;
  pipWidth: number;
  poetryWidth: number;
  uvWidth: number;
  savedTime: string;
  savedCost: string;
  speedup: string;
}> = {
  1: {
    name: 'Minimal Web Service (FastAPI + Pydantic + Uvicorn)',
    pkgs: '3 packages (12 resolved)',
    pip: '12.0s',
    poetry: '7.8s',
    uv: '0.15s',
    pipWidth: 35,
    poetryWidth: 24,
    uvWidth: 2,
    savedTime: '1.2 hrs / month',
    savedCost: '$55 / month',
    speedup: '80x faster',
  },
  2: {
    name: 'Data Science & API Stack (Pandas + NumPy + Scikit-learn + FastAPI)',
    pkgs: '~15 packages (65 resolved)',
    pip: '45.0s',
    poetry: '24.5s',
    uv: '0.42s',
    pipWidth: 80,
    poetryWidth: 48,
    uvWidth: 3,
    savedTime: '4.1 hrs / month',
    savedCost: '$190 / month',
    speedup: '107x faster',
  },
  3: {
    name: 'Generative AI & ML Stack (PyTorch + Transformers + Accelerate + LangChain)',
    pkgs: '45+ packages (180+ resolved)',
    pip: '185.0s',
    poetry: '94.0s',
    uv: '1.85s',
    pipWidth: 100,
    poetryWidth: 62,
    uvWidth: 4,
    savedTime: '16.5 hrs / month',
    savedCost: '$780 / month',
    speedup: '100x faster',
  },
};

export function UvBenchmarkLab() {
  const [tier, setTier] = useState<number>(2);
  const current = BENCHMARK_DATA[tier];

  return (
    <div className="not-prose my-8 rounded-xl border border-fd-border bg-fd-card p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
            <Zap className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-fd-foreground">
              Interactive Benchmark Lab: Resolution & Install Speed
            </h3>
            <p className="text-xs text-fd-muted-foreground">
              Adjust project stack size to simulate real-world CI pipeline time & cost savings with uv.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CircleCheck className="size-3.5" />
          {current.speedup}
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-medium text-fd-foreground">
          <span>Project Complexity: <strong>{current.name}</strong></span>
          <span className="text-fd-muted-foreground">{current.pkgs}</span>
        </div>
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={tier}
          onChange={(e) => setTier(Number(e.target.value))}
          className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-fd-muted accent-emerald-500"
        />
        <div className="mt-1 flex justify-between text-[11px] text-fd-muted-foreground">
          <span>1. Microservice</span>
          <span>2. Data Science & API</span>
          <span>3. GenAI / ML Pipeline</span>
        </div>
      </div>

      {/* Benchmark Bars */}
      <div className="mt-6 space-y-3.5 rounded-lg border border-fd-border/70 bg-fd-background/50 p-4">
        {/* pip */}
        <div>
          <div className="flex justify-between text-xs font-medium text-fd-foreground">
            <span className="flex items-center gap-2">
              <span className="font-mono text-red-500">pip (uncached)</span>
            </span>
            <span className="font-mono text-fd-muted-foreground">{current.pip}</span>
          </div>
          <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-fd-muted">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-300"
              style={{ width: `${current.pipWidth}%` }}
            />
          </div>
        </div>

        {/* poetry */}
        <div>
          <div className="flex justify-between text-xs font-medium text-fd-foreground">
            <span className="flex items-center gap-2">
              <span className="font-mono text-blue-500">poetry</span>
            </span>
            <span className="font-mono text-fd-muted-foreground">{current.poetry}</span>
          </div>
          <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-fd-muted">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${current.poetryWidth}%` }}
            />
          </div>
        </div>

        {/* uv */}
        <div>
          <div className="flex justify-between text-xs font-bold text-fd-foreground">
            <span className="flex items-center gap-2">
              <span className="font-mono text-emerald-500">uv (astral)</span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[10px] text-emerald-600 dark:text-emerald-400">
                Rust Engine
              </span>
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">{current.uv}</span>
          </div>
          <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-fd-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${Math.max(current.uvWidth, 3)}%` }}
            />
          </div>
        </div>
      </div>

      {/* CI Savings Cards */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg border border-fd-border bg-fd-background p-3.5">
          <div className="rounded-md bg-amber-500/10 p-2 text-amber-500">
            <Clock className="size-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-fd-muted-foreground">
              Developer & CI Wait Time Saved
            </div>
            <div className="font-mono text-base font-bold text-fd-foreground">
              {current.savedTime}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-fd-border bg-fd-background p-3.5">
          <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-500">
            <DollarSign className="size-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-fd-muted-foreground">
              GitHub Actions / Cloud CI Bill Reduction
            </div>
            <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
              {current.savedCost}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
