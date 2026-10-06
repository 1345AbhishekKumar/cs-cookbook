'use client';

import React, { useState } from 'react';
import { Terminal, Filter, Layers, ArrowRight, Play, CheckCircle } from 'lucide-react';

interface ProcessObj {
  id: number;
  name: string;
  cpu: number;
  workingSetMB: number;
}

const INITIAL_PROCESSES: ProcessObj[] = [
  { id: 1044, name: 'code', cpu: 14.2, workingSetMB: 480 },
  { id: 2190, name: 'chrome', cpu: 68.5, workingSetMB: 1420 },
  { id: 3108, name: 'node', cpu: 52.1, workingSetMB: 390 },
  { id: 4120, name: 'slack', cpu: 4.8, workingSetMB: 512 },
  { id: 5092, name: 'powershell', cpu: 1.2, workingSetMB: 64 },
];

export function PowershellPipelineDemo() {
  const [pipelineStage, setPipelineStage] = useState<number>(0);

  const stages = [
    {
      cmdlet: 'Get-Process',
      desc: 'Emits a stream of System.Diagnostics.Process .NET objects into the pipeline.',
      filter: (p: ProcessObj[]) => p,
      columns: ['Id', 'ProcessName', 'CPU (s)', 'WorkingSet (MB)'],
    },
    {
      cmdlet: 'Get-Process | Where-Object { $_.CPU -gt 20 }',
      desc: 'Inspects the numeric .CPU property on each object, filtering out processes with CPU ≤ 20 without regex text parsing.',
      filter: (p: ProcessObj[]) => p.filter((x) => x.cpu > 20),
      columns: ['Id', 'ProcessName', 'CPU (s)', 'WorkingSet (MB)'],
    },
    {
      cmdlet: 'Get-Process | Where-Object { $_.CPU -gt 20 } | Select-Object ProcessName, WorkingSet',
      desc: 'Projects only the requested properties into custom PSCustomObjects.',
      filter: (p: ProcessObj[]) => p.filter((x) => x.cpu > 20),
      columns: ['ProcessName', 'WorkingSet (MB)'],
    },
  ];

  const current = stages[pipelineStage];
  const items = current.filter(INITIAL_PROCESSES);

  return (
    <div className="not-prose my-8 rounded-xl border border-fd-border bg-fd-card p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-sky-500" />
          <h3 className="text-base font-semibold text-fd-foreground">
            Interactive PowerShell Pipeline: Objects, Not Text
          </h3>
        </div>
        <div className="flex gap-1.5">
          {stages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPipelineStage(idx)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                pipelineStage === idx
                  ? 'bg-sky-600 text-white'
                  : 'bg-fd-muted text-fd-muted-foreground hover:bg-fd-muted/80'
              }`}
            >
              Stage {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-sky-500/20 bg-sky-950/20 p-3 font-mono text-xs text-sky-300">
        <span className="text-sky-500">PS &gt; </span>
        <strong>{current.cmdlet}</strong>
      </div>
      <p className="mt-2 text-xs text-fd-muted-foreground">{current.desc}</p>

      {/* Structured Object Table */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-fd-border">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-fd-border bg-fd-muted/50 font-mono text-[11px] text-fd-muted-foreground">
            <tr>
              {current.columns.map((col) => (
                <th key={col} className="px-3 py-2 font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-fd-border font-mono">
            {items.map((row) => (
              <tr key={row.id} className="hover:bg-fd-muted/20">
                {current.columns.includes('Id') && (
                  <td className="px-3 py-2 text-fd-muted-foreground">{row.id}</td>
                )}
                <td className="px-3 py-2 font-bold text-sky-500">{row.name}</td>
                {current.columns.includes('CPU (s)') && (
                  <td className="px-3 py-2 text-fd-foreground">{row.cpu.toFixed(1)}</td>
                )}
                <td className="px-3 py-2 text-fd-foreground">{row.workingSetMB} MB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
