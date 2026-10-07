'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  Layers, 
  GitPullRequest, 
  GitCommit, 
  Calendar, 
  Sliders, 
  ChevronRight,
  AlertTriangle,
  Server
} from 'lucide-react';

interface Step {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  duration: string;
  command?: string;
  logs: string[];
}

interface Job {
  id: string;
  name: string;
  runner: string;
  needs: string[];
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  steps: Step[];
}

export function WorkflowLifecycleSimulator() {
  const [triggerType, setTriggerType] = useState<'push' | 'pull_request' | 'dispatch' | 'schedule'>('push');
  const [shouldFail, setShouldFail] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeJobId, setActiveJobId] = useState<string>('lint');
  const [selectedSpeed, setSelectedSpeed] = useState<number>(1);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const initialJobs: Job[] = [
    {
      id: 'lint',
      name: 'Lint & Format',
      runner: 'ubuntu-24.04',
      needs: [],
      status: 'pending',
      steps: [
        { id: 's1', name: 'Checkout Code', status: 'pending', duration: '1s', command: 'actions/checkout@v4', logs: ['Syncing repository at refs/heads/main', 'Fetched 142 commits in 0.8s'] },
        { id: 's2', name: 'Setup Node 20', status: 'pending', duration: '2s', command: 'actions/setup-node@v4', logs: ['Found Node.js in toolcache: v20.12.0', 'Resolved npm binary at /usr/local/bin/npm'] },
        { id: 's3', name: 'Run ESLint & Prettier', status: 'pending', duration: '3s', command: 'npm run lint', logs: ['Checking 48 files across src/', '0 errors, 0 warnings found. Code conforms to styleguide.'] }
      ]
    },
    {
      id: 'test',
      name: 'Unit Tests',
      runner: 'ubuntu-24.04',
      needs: [],
      status: 'pending',
      steps: [
        { id: 't1', name: 'Checkout Code', status: 'pending', duration: '1s', command: 'actions/checkout@v4', logs: ['Initialized working directory', 'HEAD is now at 8f3d1b "feat: update pipeline"'] },
        { id: 't2', name: 'Restore npm Cache', status: 'pending', duration: '1s', command: 'actions/cache@v4', logs: ['Cache hit: Linux-node-cache-a94f8b', 'Restored 184MB node_modules in 1.1s'] },
        { id: 't3', name: 'Execute Test Suite', status: 'pending', duration: '4s', command: 'npm test -- --coverage', logs: ['RUN test/auth.test.ts', 'PASS test/auth.test.ts (24 tests)', 'Coverage: 94.2% statements covered'] }
      ]
    },
    {
      id: 'build',
      name: 'Build Container',
      runner: 'ubuntu-24.04',
      needs: ['lint', 'test'],
      status: 'pending',
      steps: [
        { id: 'b1', name: 'Docker Buildx Setup', status: 'pending', duration: '2s', command: 'docker/setup-buildx-action@v3', logs: ['Instantiating builder: buildx-instance-01', 'Platforms supported: linux/amd64, linux/arm64'] },
        { id: 'b2', name: 'Build Multi-Arch Image', status: 'pending', duration: '5s', command: 'docker build -t app:sha-8f3d1b .', logs: ['[1/4] FROM node:20-alpine AS base', '[2/4] COPY package.json package-lock.json ./', '[3/4] RUN npm ci --omit=dev', '[4/4] EXPOSE 3000', 'Built image digest: sha256:4b910fa2...'] },
        { id: 'b3', name: 'Record Image Digest Output', status: 'pending', duration: '1s', command: 'echo "digest=sha256:4b910fa2" >> $GITHUB_OUTPUT', logs: ['Wrote step output: digest=sha256:4b910fa2'] }
      ]
    },
    {
      id: 'deploy',
      name: 'Deploy to Staging',
      runner: 'ubuntu-24.04',
      needs: ['build'],
      status: 'pending',
      steps: [
        { id: 'd1', name: 'Assume AWS IAM Role (OIDC)', status: 'pending', duration: '2s', command: 'aws-actions/configure-aws-credentials@v4', logs: ['Requesting JWT ID Token from GitHub OIDC provider', 'STS:AssumeRoleWithWebIdentity successful', 'Session token expires in 3600s'] },
        { id: 'd2', name: 'Update ECS Task Definition', status: 'pending', duration: '3s', command: 'aws ecs update-service --cluster staging', logs: ['Updated task definition: web-service:42', 'Waiting for steady state in service deployment...', 'Deployment complete. Healthy replicas: 2/2'] }
      ]
    }
  ];

  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const resetSimulator = () => {
    setIsRunning(false);
    setJobs(initialJobs);
    setActiveJobId('lint');
  };

  useEffect(() => {
    if (!isRunning) return;

    let timer: NodeJS.Timeout;
    const intervalMs = 1200 / selectedSpeed;

    timer = setInterval(() => {
      setJobs((prevJobs) => {
        // Deep clone
        const newJobs = prevJobs.map((j) => ({
          ...j,
          steps: j.steps.map((s) => ({ ...s }))
        }));

        // Find jobs ready to run
        for (const job of newJobs) {
          if (job.status === 'pending') {
            const dependenciesMet = job.needs.every((depId) => {
              const depJob = newJobs.find((j) => j.id === depId);
              return depJob?.status === 'success';
            });

            const dependencyFailed = job.needs.some((depId) => {
              const depJob = newJobs.find((j) => j.id === depId);
              return depJob?.status === 'failed' || depJob?.status === 'skipped';
            });

            if (dependencyFailed) {
              job.status = 'skipped';
              job.steps.forEach((s) => (s.status = 'skipped'));
            } else if (dependenciesMet) {
              job.status = 'running';
              job.steps[0].status = 'running';
              setActiveJobId(job.id);
              return newJobs;
            }
          } else if (job.status === 'running') {
            // Advance steps in current running job
            const currentStepIdx = job.steps.findIndex((s) => s.status === 'running');
            if (currentStepIdx !== -1) {
              // Should test step fail?
              if (shouldFail && job.id === 'test' && currentStepIdx === 2) {
                job.steps[currentStepIdx].status = 'failed';
                job.steps[currentStepIdx].logs.push('FAIL test/auth.test.ts: Expected status 200, received 500');
                job.steps[currentStepIdx].logs.push('Process completed with exit code 1');
                job.status = 'failed';
              } else {
                job.steps[currentStepIdx].status = 'success';
                if (currentStepIdx + 1 < job.steps.length) {
                  job.steps[currentStepIdx + 1].status = 'running';
                } else {
                  job.status = 'success';
                }
              }
              return newJobs;
            }
          }
        }

        // Check if all completed
        const allDone = newJobs.every((j) => j.status !== 'pending' && j.status !== 'running');
        if (allDone) {
          setIsRunning(false);
        }

        return newJobs;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, shouldFail, selectedSpeed]);

  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-rose-500 animate-pulse" />;
      case 'running':
        return <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />;
      case 'skipped':
        return <div className="w-3 h-3 rounded-full bg-slate-600" />;
      default:
        return <div className="w-3 h-3 rounded-full border border-slate-600" />;
    }
  };

  return (
    <div className="my-8 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <h3 className="text-lg font-bold text-slate-100">Interactive Pipeline Simulator (DAG & Jobs)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Observe parallel execution, dependencies with <code className="text-cyan-400">needs:</code>, failure cascades, and real runner logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={jobs.every((j) => j.status !== 'pending' && j.status !== 'running')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              isRunning 
                ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950'
            }`}
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? 'Running...' : 'Trigger Workflow'}
          </button>

          <button
            onClick={resetSimulator}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Simulator Options Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-400 font-semibold block mb-1">Trigger Event (on:):</span>
          <div className="grid grid-cols-2 gap-1">
            {[
              { id: 'push', label: 'push (main)', icon: GitCommit },
              { id: 'pull_request', label: 'pull_request', icon: GitPullRequest },
              { id: 'dispatch', label: 'workflow_dispatch', icon: Sliders },
              { id: 'schedule', label: 'schedule (cron)', icon: Calendar },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => { setTriggerType(t.id as any); resetSimulator(); }}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded transition ${
                    triggerType === t.id ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-slate-400 font-semibold block mb-1">Execution Simulation:</span>
          <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-800/60 rounded border border-slate-700/60 hover:bg-slate-800">
            <input
              type="checkbox"
              checked={shouldFail}
              onChange={(e) => setShouldFail(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
            />
            <span className="text-slate-300">
              Inject Unit Test Failure (demonstrate <code className="text-rose-400">needs</code> halt)
            </span>
          </label>
        </div>

        <div>
          <span className="text-slate-400 font-semibold block mb-1">Simulation Speed:</span>
          <div className="flex gap-2">
            {[1, 2, 4].map((speed) => (
              <button
                key={speed}
                onClick={() => setSelectedSpeed(speed)}
                className={`flex-1 py-1.5 rounded font-mono text-center transition ${
                  selectedSpeed === speed ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DAG Visualization Canvas */}
      <div className="my-5 p-5 rounded-lg bg-slate-900/60 border border-slate-800/80">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>Workflow Execution Graph (Directed Acyclic Graph)</span>
          <span className="text-slate-500 font-mono">.github/workflows/production-pipeline.yml</span>
        </div>

        {/* DAG Grid */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
          {/* Stage 1: Parallel Jobs */}
          <div className="flex flex-col gap-3 w-full md:w-1/3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 text-center">Stage 1: Parallel Execution</span>
            {jobs.slice(0, 2).map((job) => (
              <div
                key={job.id}
                onClick={() => setActiveJobId(job.id)}
                className={`cursor-pointer rounded-lg p-3 border transition flex items-center justify-between shadow-sm ${
                  activeJobId === job.id ? 'ring-2 ring-cyan-500 bg-slate-800 border-cyan-500/50' : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{job.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Server className="w-3 h-3 text-slate-500" />
                      {job.runner}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
            <div className="h-0.5 w-8 bg-slate-700" />
            <span className="text-[10px] font-mono text-slate-400 mt-1">needs: [lint, test]</span>
          </div>

          {/* Stage 2: Build */}
          <div className="flex flex-col gap-3 w-full md:w-1/4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 text-center">Stage 2: Artifact Creation</span>
            {jobs.slice(2, 3).map((job) => (
              <div
                key={job.id}
                onClick={() => setActiveJobId(job.id)}
                className={`cursor-pointer rounded-lg p-3 border transition flex items-center justify-between shadow-sm ${
                  activeJobId === job.id ? 'ring-2 ring-cyan-500 bg-slate-800 border-cyan-500/50' : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{job.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Server className="w-3 h-3 text-slate-500" />
                      {job.runner}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
            <div className="h-0.5 w-8 bg-slate-700" />
            <span className="text-[10px] font-mono text-slate-400 mt-1">needs: [build]</span>
          </div>

          {/* Stage 3: Deploy */}
          <div className="flex flex-col gap-3 w-full md:w-1/4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 text-center">Stage 3: Cloud Release</span>
            {jobs.slice(3, 4).map((job) => (
              <div
                key={job.id}
                onClick={() => setActiveJobId(job.id)}
                className={`cursor-pointer rounded-lg p-3 border transition flex items-center justify-between shadow-sm ${
                  activeJobId === job.id ? 'ring-2 ring-cyan-500 bg-slate-800 border-cyan-500/50' : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{job.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Server className="w-3 h-3 text-slate-500" />
                      {job.runner}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Pane: Steps & Live Console Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Step Breakdown for Selected Job */}
        <div className="bg-slate-900/90 rounded-lg border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-slate-200">
                Steps inside <span className="text-cyan-400">{activeJob.name}</span>
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400">Sequential Execution</span>
          </div>

          <div className="space-y-2">
            {activeJob.steps.map((step, idx) => (
              <div
                key={step.id}
                className="p-2.5 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500">{idx + 1}.</span>
                  {getStatusIcon(step.status)}
                  <div>
                    <div className="text-xs font-semibold text-slate-300">{step.name}</div>
                    {step.command && (
                      <code className="text-[11px] text-slate-500 font-mono">{step.command}</code>
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {step.duration}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Runner Terminal Window */}
        <div className="bg-black/90 rounded-lg border border-slate-800 p-4 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-semibold">Runner Console Output</span>
              </div>
              <span className="text-[11px] text-slate-500">{activeJob.runner} (ephemeral)</span>
            </div>

            <div 
              ref={logContainerRef}
              className="space-y-1 max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800"
            >
              <div className="text-slate-600">##[group]Runner Environment Initialized</div>
              <div className="text-slate-500">Virtual Environment: Ubuntu 24.04 LTS (x64)</div>
              <div className="text-slate-500">GITHUB_WORKSPACE: /home/runner/work/repo/repo</div>
              <div className="text-slate-600">##[endgroup]</div>

              {activeJob.steps.map((s) => (
                <div key={s.id} className="mt-2">
                  <div className="text-cyan-400 font-bold">
                    &gt; {s.name} {s.status === 'running' && <span className="animate-pulse">⏳</span>}
                  </div>
                  {s.logs.map((line, lIdx) => (
                    <div 
                      key={lIdx} 
                      className={
                        line.includes('FAIL') || line.includes('exit code 1') 
                          ? 'text-rose-400 font-semibold' 
                          : line.includes('PASS') || line.includes('successful') 
                            ? 'text-emerald-400' 
                            : 'text-slate-400'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
            <span>Status: {activeJob.status.toUpperCase()}</span>
            <span>Trigger: {triggerType}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
