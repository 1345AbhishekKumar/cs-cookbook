'use client';

import React, { useState } from 'react';
import { Terminal, Folder, File, RefreshCw } from 'lucide-react';

interface FileNode {
  name: string;
  isDir?: boolean;
  children?: FileNode[];
}

interface ActionStep {
  cmd: string;
  output: string[];
  tree: FileNode[];
}

const SIM_ACTIONS: Record<string, ActionStep> = {
  init: {
    cmd: 'uv init my-app',
    output: [
      'Initialized project `my-app` at `/scratch/my-app`',
      'Created `pyproject.toml`',
      'Created `README.md`',
      'Created `.python-version` (3.12)',
      'Created `src/my_app/__init__.py` and `src/my_app/main.py`',
    ],
    tree: [
      {
        name: 'my-app/',
        isDir: true,
        children: [
          { name: '.python-version' },
          { name: 'pyproject.toml' },
          { name: 'README.md' },
          {
            name: 'src/my_app/',
            isDir: true,
            children: [{ name: '__init__.py' }, { name: 'main.py' }],
          },
        ],
      },
    ],
  },
  add: {
    cmd: 'uv add fastapi',
    output: [
      'Resolved 21 packages in 14ms',
      'Prepared 21 packages in 42ms',
      'Installed 21 packages in 18ms',
      ' + anyio==4.4.0',
      ' + fastapi==0.115.0',
      ' + idna==3.8',
      ' + pydantic==2.9.2',
      ' + starlette==0.38.6',
      'Updated `pyproject.toml` with `fastapi>=0.115.0`',
      'Created cryptographic lockfile `uv.lock`',
    ],
    tree: [
      {
        name: 'my-app/',
        isDir: true,
        children: [
          { name: '.python-version' },
          { name: 'pyproject.toml' },
          { name: 'uv.lock' },
          { name: '.venv/ (hardlinks from ~/.cache/uv)' },
          {
            name: 'src/my_app/',
            isDir: true,
            children: [{ name: 'main.py' }],
          },
        ],
      },
    ],
  },
  'add-dev': {
    cmd: 'uv add --dev pytest',
    output: [
      'Resolved 28 packages in 9ms',
      'Installed 7 packages in 12ms',
      ' + iniconfig==2.0.0',
      ' + pluggy==1.5.0',
      ' + pytest==8.3.3',
      'Updated `[dependency-groups] dev` in `pyproject.toml`',
      'Updated `uv.lock`',
    ],
    tree: [
      {
        name: 'my-app/',
        isDir: true,
        children: [
          { name: 'pyproject.toml (with [dependency-groups] dev)' },
          { name: 'uv.lock' },
          { name: '.venv/' },
          { name: 'src/my_app/' },
        ],
      },
    ],
  },
  sync: {
    cmd: 'uv sync --no-dev',
    output: [
      'Resolved 28 packages in 4ms',
      'Uninstalled 7 packages in 6ms',
      ' - pytest==8.3.3',
      ' - pluggy==1.5.0',
      'Audit: Environment matches production dependencies (zero dev bloat)',
    ],
    tree: [
      {
        name: 'my-app/',
        isDir: true,
        children: [
          { name: 'pyproject.toml' },
          { name: 'uv.lock (frozen)' },
          { name: '.venv/ (production only)' },
          { name: 'src/my_app/' },
        ],
      },
    ],
  },
  run: {
    cmd: 'uv run main.py',
    output: [
      'Starting Uvicorn server in isolated project context...',
      'INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)',
      'INFO:     Application startup complete. Ready for requests.',
    ],
    tree: [
      {
        name: 'my-app/',
        isDir: true,
        children: [
          { name: 'pyproject.toml' },
          { name: 'uv.lock' },
          { name: '.venv/' },
          { name: 'main.py' },
        ],
      },
    ],
  },
  tree: {
    cmd: 'uv tree',
    output: [
      'my-app v0.1.0',
      '└── fastapi v0.115.0',
      '    ├── pydantic v2.9.2',
      '    │   ├── annotated-types v0.7.0',
      '    │   └── pydantic-core v2.23.4',
      '    ├── starlette v0.38.6',
      '    │   └── anyio v4.4.0',
      '    │       ├── idna v3.8',
      '    │       └── sniffio v1.3.1',
      '    └── typing-extensions v4.12.2',
    ],
    tree: [
      {
        name: 'my-app/',
        isDir: true,
        children: [
          { name: 'pyproject.toml' },
          { name: 'uv.lock' },
          { name: '.venv/' },
          { name: 'src/' },
        ],
      },
    ],
  },
};

export function UvTerminalSimulator() {
  const [history, setHistory] = useState<
    { prompt: string; out: string[] }[]
  >([
    {
      prompt: 'developer@workstation:~$',
      out: [
        '# Interactive UV Simulator — click an operation below to execute commands and inspect the live virtual file tree:',
      ],
    },
  ]);

  const [currentTree, setCurrentTree] = useState<FileNode[]>([
    { name: 'scratch/', isDir: true, children: [] },
  ]);

  const runCommand = (actionKey: string) => {
    if (actionKey === 'reset') {
      setHistory([
        {
          prompt: 'developer@workstation:~$',
          out: ['# State reset to empty scratch directory.'],
        },
      ]);
      setCurrentTree([{ name: 'scratch/', isDir: true, children: [] }]);
      return;
    }

    const action = SIM_ACTIONS[actionKey];
    if (!action) return;

    setHistory((prev) => [
      ...prev,
      {
        prompt: `developer@workstation:~/scratch$ ${action.cmd}`,
        out: action.output,
      },
    ]);
    setCurrentTree(action.tree);
  };

  const renderNodes = (nodes: FileNode[], depth = 0) => {
    return (
      <div className="space-y-1 font-mono text-xs">
        {nodes.map((node, i) => (
          <div key={i} style={{ paddingLeft: `${depth * 14}px` }}>
            <div className="flex items-center gap-1.5 text-fd-foreground/90">
              {node.isDir ? (
                <Folder className="size-3.5 text-amber-500" />
              ) : (
                <File className="size-3.5 text-emerald-500" />
              )}
              <span className={node.isDir ? 'font-bold text-amber-600 dark:text-amber-400' : ''}>
                {node.name}
              </span>
            </div>
            {node.children && renderNodes(node.children, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-fd-border bg-slate-950 text-slate-200 shadow-md">
      {/* Titlebar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-500/80" />
            <div className="size-3 rounded-full bg-amber-500/80" />
            <div className="size-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono text-xs text-slate-400">
            uv-interactive-shell — zsh
          </span>
        </div>
        <button
          type="button"
          onClick={() => runCommand('reset')}
          className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700"
        >
          <RefreshCw className="size-3" /> Reset
        </button>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 divide-y divide-slate-800 md:grid-cols-3 md:divide-x md:divide-y-0">
        {/* Terminal output */}
        <div className="col-span-2 max-h-80 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
          {history.map((h, idx) => (
            <div key={idx} className="mb-3">
              <div className="font-bold text-emerald-400">{h.prompt}</div>
              {h.out.map((line, lIdx) => (
                <div
                  key={lIdx}
                  className={
                    line.startsWith(' +')
                      ? 'text-emerald-300'
                      : line.startsWith(' -')
                      ? 'text-red-400'
                      : line.startsWith('#')
                      ? 'italic text-slate-400'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Virtual File Tree */}
        <div className="bg-slate-900/40 p-4">
          <div className="mb-2.5 flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Virtual File Tree
            </span>
          </div>
          <div className="mt-2">{renderNodes(currentTree)}</div>
        </div>
      </div>

      {/* Action Chips */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 bg-slate-900/60 p-3">
        <span className="text-[11px] font-semibold text-slate-400">Simulate:</span>
        <button
          type="button"
          onClick={() => runCommand('init')}
          className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-xs text-emerald-300 hover:border-emerald-500 hover:bg-slate-750"
        >
          uv init my-app
        </button>
        <button
          type="button"
          onClick={() => runCommand('add')}
          className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-xs text-emerald-300 hover:border-emerald-500 hover:bg-slate-750"
        >
          uv add fastapi
        </button>
        <button
          type="button"
          onClick={() => runCommand('add-dev')}
          className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-xs text-emerald-300 hover:border-emerald-500 hover:bg-slate-750"
        >
          uv add --dev pytest
        </button>
        <button
          type="button"
          onClick={() => runCommand('sync')}
          className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-xs text-emerald-300 hover:border-emerald-500 hover:bg-slate-750"
        >
          uv sync --no-dev
        </button>
        <button
          type="button"
          onClick={() => runCommand('run')}
          className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-xs text-emerald-300 hover:border-emerald-500 hover:bg-slate-750"
        >
          uv run main.py
        </button>
        <button
          type="button"
          onClick={() => runCommand('tree')}
          className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-xs text-emerald-300 hover:border-emerald-500 hover:bg-slate-750"
        >
          uv tree
        </button>
      </div>
    </div>
  );
}
