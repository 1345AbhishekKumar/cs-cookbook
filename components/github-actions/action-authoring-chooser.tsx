'use client';

import React, { useState } from 'react';
import { 
  GitBranch, 
  Package, 
  Boxes, 
  Code2, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function ActionAuthoringChooser() {
  const [hasMarketplace, setHasMarketplace] = useState<boolean>(false);
  const [crossRepoReuse, setCrossRepoReuse] = useState<boolean>(true);
  const [enforceEntirePipeline, setEnforceEntirePipeline] = useState<boolean>(false);
  const [needsExternalDeps, setNeedsExternalDeps] = useState<boolean>(false);
  const [preferredLang, setPreferredLang] = useState<'ts' | 'docker'>('ts');
  const [copied, setCopied] = useState<boolean>(false);

  // Compute recommendation
  let recommendation = {
    type: 'Composite Action',
    badge: 'Lightweight & Flexible',
    color: 'border-emerald-500 text-emerald-400',
    description: 'Bundle multiple shell steps and actions into a reusable unit without the overhead of building containers or JavaScript bundles.',
    code: `name: 'Setup & Cache Environment'
description: 'Installs project CLI tools and warms package cache'
inputs:
  node-version:
    description: 'Target Node version'
    required: false
    default: '20'
outputs:
  cache-hit:
    description: 'Whether cache was restored'
    value: \${{ steps.cache.outputs.cache-hit }}
runs:
  using: 'composite'
  steps:
    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: \${{ inputs.node-version }}
      shell: bash

    - name: Run Install
      run: npm ci
      shell: bash`
  };

  if (hasMarketplace) {
    recommendation = {
      type: 'Marketplace Action (SHA Pinned)',
      badge: 'Zero Maintenance Effort',
      color: 'border-cyan-500 text-cyan-400',
      description: 'Use a verified, well-maintained action from the GitHub Marketplace. Pin by immutable commit SHA for supply-chain security.',
      code: `- name: Checkout Repository
  uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
  with:
    fetch-depth: 0`
    };
  } else if (!crossRepoReuse) {
    recommendation = {
      type: 'Taskfile / Makefile Script',
      badge: 'Local First DevX',
      color: 'border-amber-500 text-amber-400',
      description: 'Keep CI logic in an external script (Taskfile/Makefile) executable both locally and in CI to avoid "push-and-pray" iteration.',
      code: `version: '3'

tasks:
  build:
    desc: 'Build application artifact'
    cmds:
      - npm run compile
      - npm run package

# Inside GitHub Actions workflow:
# - run: task build`
    };
  } else if (enforceEntirePipeline) {
    recommendation = {
      type: 'Reusable Workflow (workflow_call)',
      badge: 'Strict Organization Gate',
      color: 'border-purple-500 text-purple-400',
      description: 'Enforce standard security scans, compliance, and deployment pipelines across multiple repositories in your company.',
      code: `name: Organization Standard Deploy
on:
  workflow_call:
    inputs:
      target-env:
        required: true
        type: string
    secrets:
      DEPLOY_KEY:
        required: true

jobs:
  compliance-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Deploying to \${{ inputs.target-env }}"`
    };
  } else if (needsExternalDeps) {
    if (preferredLang === 'ts') {
      recommendation = {
        type: 'TypeScript Action with Rollup/ncc',
        badge: 'Fastest Native Startup',
        color: 'border-blue-500 text-blue-400',
        description: 'Native Node.js execution. Bundles TypeScript and node_modules into a single dist/index.js. Best DX with @actions/core.',
        code: `name: 'Custom Metadata Processor'
description: 'Parses git commits and creates release summaries'
inputs:
  token:
    description: 'GitHub Token'
    required: true
outputs:
  version:
    description: 'Calculated semver'
runs:
  using: 'node20'
  main: 'dist/index.js'`
      };
    } else {
      recommendation = {
        type: 'Docker / Container Action',
        badge: 'Any Language (Python/Go/Rust)',
        color: 'border-rose-500 text-rose-400',
        description: 'Execute your custom action in any programming language inside a container image. Best when heavy native OS packages are needed.',
        code: `name: 'Python Vulnerability Scanner'
description: 'Runs custom security AST inspection'
inputs:
  scan-path:
    description: 'Directory to scan'
    default: '.'
runs:
  using: 'docker'
  image: 'Dockerfile' # Or prebuilt registry image: 'docker://ghcr.io/org/scanner:v1'`
      };
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(recommendation.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <div>
          <h3 className="text-lg font-bold text-slate-100">Action Architecture Decision Engine</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Answer 4 questions to find the optimal reusability pattern for your team.
          </p>
        </div>
      </div>

      {/* Decision Tree Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
        {/* Q1 */}
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="font-semibold text-slate-300 block mb-2">1. Does a reputable public marketplace action exist?</span>
          <div className="flex gap-2">
            <button
              onClick={() => setHasMarketplace(true)}
              className={`flex-1 py-1.5 rounded transition ${
                hasMarketplace ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Yes (Marketplace)
            </button>
            <button
              onClick={() => setHasMarketplace(false)}
              className={`flex-1 py-1.5 rounded transition ${
                !hasMarketplace ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              No (Custom Logic)
            </button>
          </div>
        </div>

        {/* Q2 */}
        <div className={`p-3 rounded-lg bg-slate-900 border border-slate-800 transition ${hasMarketplace ? 'opacity-40 pointer-events-none' : ''}`}>
          <span className="font-semibold text-slate-300 block mb-2">2. Need to share logic across multiple workflows / repos?</span>
          <div className="flex gap-2">
            <button
              onClick={() => setCrossRepoReuse(true)}
              className={`flex-1 py-1.5 rounded transition ${
                crossRepoReuse ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Yes (Multi-Repo / Cross-Workflow)
            </button>
            <button
              onClick={() => setCrossRepoReuse(false)}
              className={`flex-1 py-1.5 rounded transition ${
                !crossRepoReuse ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              No (Single Repo Only)
            </button>
          </div>
        </div>

        {/* Q3 */}
        <div className={`p-3 rounded-lg bg-slate-900 border border-slate-800 transition ${hasMarketplace || !crossRepoReuse ? 'opacity-40 pointer-events-none' : ''}`}>
          <span className="font-semibold text-slate-300 block mb-2">3. Enforce entire workflow security gates & deployment rules?</span>
          <div className="flex gap-2">
            <button
              onClick={() => setEnforceEntirePipeline(true)}
              className={`flex-1 py-1.5 rounded transition ${
                enforceEntirePipeline ? 'bg-purple-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Yes (Standardized Workflow)
            </button>
            <button
              onClick={() => setEnforceEntirePipeline(false)}
              className={`flex-1 py-1.5 rounded transition ${
                !enforceEntirePipeline ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              No (Just a Step / Task)
            </button>
          </div>
        </div>

        {/* Q4 */}
        <div className={`p-3 rounded-lg bg-slate-900 border border-slate-800 transition ${hasMarketplace || !crossRepoReuse || enforceEntirePipeline ? 'opacity-40 pointer-events-none' : ''}`}>
          <span className="font-semibold text-slate-300 block mb-2">4. Requires external language libraries or packages?</span>
          <div className="flex gap-2">
            <button
              onClick={() => setNeedsExternalDeps(true)}
              className={`flex-1 py-1.5 rounded transition ${
                needsExternalDeps ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Yes (TypeScript / Python / Go)
            </button>
            <button
              onClick={() => setNeedsExternalDeps(false)}
              className={`flex-1 py-1.5 rounded transition ${
                !needsExternalDeps ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              No (Standard Bash / Shell)
            </button>
          </div>

          {needsExternalDeps && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setPreferredLang('ts')}
                className={`flex-1 py-1 rounded text-[11px] ${preferredLang === 'ts' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                TypeScript / Node
              </button>
              <button
                onClick={() => setPreferredLang('docker')}
                className={`flex-1 py-1 rounded text-[11px] ${preferredLang === 'docker' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                Docker / Python / Go
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Output Box */}
      <div className={`p-4 rounded-lg bg-slate-900 border-2 ${recommendation.color.split(' ')[0]} transition-all`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h4 className="text-base font-bold text-slate-100">{recommendation.type}</h4>
          </div>
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300">
            {recommendation.badge}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4">{recommendation.description}</p>

        {/* Code Scaffolding */}
        <div className="relative">
          <div className="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-t border border-b-0 border-slate-800 text-[11px] font-mono text-slate-400">
            <span>action.yml / definition boilerplate</span>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 hover:text-slate-200 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-3 rounded-b bg-black/90 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
            {recommendation.code}
          </pre>
        </div>
      </div>
    </div>
  );
}
