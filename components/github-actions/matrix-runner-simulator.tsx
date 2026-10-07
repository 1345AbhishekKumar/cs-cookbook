'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Layers, 
  Grid, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Settings2,
  Filter
} from 'lucide-react';

interface MatrixJob {
  id: string;
  os: string;
  version: string;
  status: 'pending' | 'queued' | 'running' | 'success' | 'failed';
  progress: number;
}

export function MatrixRunnerSimulator() {
  const [selectedOS, setSelectedOS] = useState<string[]>(['ubuntu-latest', 'windows-latest', 'macos-latest']);
  const [selectedVersions, setSelectedVersions] = useState<string[]>(['18', '20', '22']);
  const [excludeWindowsOld, setExcludeWindowsOld] = useState<boolean>(true);
  const [failFast, setFailFast] = useState<boolean>(true);
  const [maxParallel, setMaxParallel] = useState<number>(3);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [jobs, setJobs] = useState<MatrixJob[]>([]);

  // Compute Cartesian product
  const computeCombinations = () => {
    const list: MatrixJob[] = [];
    selectedOS.forEach((os) => {
      selectedVersions.forEach((version) => {
        // Check exclude
        if (excludeWindowsOld && os === 'windows-latest' && version === '18') {
          return;
        }
        list.push({
          id: `${os}-node${version}`,
          os,
          version,
          status: 'pending',
          progress: 0
        });
      });
    });
    return list;
  };

  useEffect(() => {
    setJobs(computeCombinations());
  }, [selectedOS, selectedVersions, excludeWindowsOld]);

  const toggleOS = (os: string) => {
    if (selectedOS.includes(os)) {
      if (selectedOS.length > 1) setSelectedOS(selectedOS.filter((x) => x !== os));
    } else {
      setSelectedOS([...selectedOS, os]);
    }
  };

  const toggleVersion = (ver: string) => {
    if (selectedVersions.includes(ver)) {
      if (selectedVersions.length > 1) setSelectedVersions(selectedVersions.filter((x) => x !== ver));
    } else {
      setSelectedVersions([...selectedVersions, ver]);
    }
  };

  const handleStart = () => {
    setJobs((prev) => prev.map((j) => ({ ...j, status: 'queued', progress: 0 })));
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setJobs(computeCombinations());
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setJobs((prevJobs) => {
        const next = prevJobs.map((j) => ({ ...j }));

        const runningCount = next.filter((j) => j.status === 'running').length;
        const availableSlots = maxParallel - runningCount;

        // Pick queued jobs up to maxParallel
        if (availableSlots > 0) {
          let slotted = 0;
          for (const job of next) {
            if (job.status === 'queued' && slotted < availableSlots) {
              job.status = 'running';
              slotted++;
            }
          }
        }

        // Advance running jobs
        for (const job of next) {
          if (job.status === 'running') {
            job.progress += Math.floor(Math.random() * 25) + 15;
            if (job.progress >= 100) {
              job.progress = 100;
              job.status = 'success';
            }
          }
        }

        const allFinished = next.every((j) => j.status === 'success' || j.status === 'failed');
        if (allFinished) {
          setIsRunning(false);
        }

        return next;
      });
    }, 600);

    return () => clearInterval(timer);
  }, [isRunning, maxParallel]);

  return (
    <div className="my-8 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-slate-100">Matrix Strategy & Parallelism Playground</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate dimensional fan-out, <code className="text-amber-400">include/exclude</code> filters, and concurrency worker pool limits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStart}
            disabled={isRunning || jobs.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            Launch Matrix ({jobs.length} Jobs)
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
        {/* Dimensions */}
        <div>
          <span className="font-semibold text-slate-300 block mb-2">Dimension A: Operating System</span>
          <div className="flex flex-wrap gap-1.5">
            {['ubuntu-latest', 'windows-latest', 'macos-latest'].map((os) => (
              <button
                key={os}
                onClick={() => toggleOS(os)}
                className={`px-2.5 py-1.5 rounded transition ${
                  selectedOS.includes(os) ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {os}
              </button>
            ))}
          </div>

          <span className="font-semibold text-slate-300 block mt-3 mb-2">Dimension B: Node.js Version</span>
          <div className="flex gap-1.5">
            {['18', '20', '22'].map((ver) => (
              <button
                key={ver}
                onClick={() => toggleVersion(ver)}
                className={`px-3 py-1.5 rounded transition ${
                  selectedVersions.includes(ver) ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Node v{ver}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div>
          <span className="font-semibold text-slate-300 block mb-2">Matrix Constraints & Filters:</span>
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-800/60 border border-slate-700 mb-2">
            <input
              type="checkbox"
              checked={excludeWindowsOld}
              onChange={(e) => setExcludeWindowsOld(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="text-slate-300">
              <code className="text-amber-400">exclude:</code> windows-latest + Node 18
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-800/60 border border-slate-700">
            <input
              type="checkbox"
              checked={failFast}
              onChange={(e) => setFailFast(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="text-slate-300">
              <code className="text-cyan-400">fail-fast:</code> cancel all on first failure
            </span>
          </label>
        </div>

        {/* Concurrency Worker Pool */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-slate-300">Concurrency (max-parallel):</span>
            <span className="font-mono text-cyan-400 font-bold">{maxParallel} Runners</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={maxParallel}
            onChange={(e) => setMaxParallel(Number(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-800 rounded cursor-pointer"
          />
          <p className="text-[11px] text-slate-400 mt-2">
            Limits active runners to prevent saturating billing limits or overwhelming downstream database test instances.
          </p>
        </div>
      </div>

      {/* Live Runner Grid */}
      <div className="my-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span>Active Worker Matrix Instances ({jobs.length} jobs)</span>
          <span className="font-mono text-slate-500">
            Running: {jobs.filter((j) => j.status === 'running').length} / Queued: {jobs.filter((j) => j.status === 'queued').length} / Succeeded: {jobs.filter((j) => j.status === 'success').length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`p-3.5 rounded-lg border transition ${
                job.status === 'running' 
                  ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950' 
                  : job.status === 'success'
                    ? 'bg-slate-900/60 border-emerald-500/50'
                    : 'bg-slate-900/30 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {job.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {job.status === 'running' && <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />}
                  {job.status === 'queued' && <Clock className="w-4 h-4 text-amber-400" />}
                  {job.status === 'pending' && <div className="w-3 h-3 rounded-full border border-slate-600" />}
                  <span className="text-xs font-bold text-slate-200">{job.os}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  Node {job.version}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-3">
                <div 
                  className={`h-full transition-all duration-300 ${
                    job.status === 'success' ? 'bg-emerald-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${job.progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2">
                <span>{job.status.toUpperCase()}</span>
                <span>{job.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
