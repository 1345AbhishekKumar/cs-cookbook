'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Layers, 
  FileCode, 
  Check, 
  AlertOctagon 
} from 'lucide-react';

export function SecretsAndEnvSimulator() {
  const [activeEnvironment, setActiveEnvironment] = useState<'staging' | 'production'>('staging');
  const [activeScope, setActiveScope] = useState<'workflow' | 'job' | 'step'>('step');
  const [maskSecrets, setMaskSecrets] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<string>('secrets');

  const variables = [
    { name: 'APP_ENV', scope: 'workflow', value: 'cloud-native', sensitive: false },
    { name: 'JOB_WORKER_ID', scope: 'job', value: 'runner-node-04', sensitive: false },
    { name: 'STEP_TEMP_FILE', scope: 'step', value: '/tmp/build.log', sensitive: false },
    { 
      name: 'DATABASE_PASSWORD', 
      scope: 'environment', 
      value: activeEnvironment === 'staging' ? 'stage_s3cr3t_pass!' : 'prod_super_ultra_key_99!', 
      sensitive: true 
    },
    { 
      name: 'API_SECRET_TOKEN', 
      scope: 'repository', 
      value: 'ghp_live_tok_998471203', 
      sensitive: true 
    }
  ];

  return (
    <div className="my-8 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100">Variables, Secrets & Log Masking Inspector</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explore hierarchy scoping, repository vs environment secrets, and GitHub Actions automatic runner log redaction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMaskSecrets(!maskSecrets)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {maskSecrets ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
            {maskSecrets ? 'Log Masking: ACTIVE (***)' : 'Reveal Secrets (DEBUG)'}
          </button>
        </div>
      </div>

      {/* Target Environment Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
        <div>
          <span className="font-semibold text-slate-300 block mb-2">Target Deployment Environment:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveEnvironment('staging')}
              className={`flex-1 py-2 px-3 rounded font-medium transition ${
                activeEnvironment === 'staging' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              environment: staging
            </button>
            <button
              onClick={() => setActiveEnvironment('production')}
              className={`flex-1 py-2 px-3 rounded font-medium transition ${
                activeEnvironment === 'production' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              environment: production
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Production environments can require manual approvals, wait timers, and restricted branch protections.
          </p>
        </div>

        <div>
          <span className="font-semibold text-slate-300 block mb-2">Inspecting Execution Scope:</span>
          <div className="flex gap-2">
            {(['workflow', 'job', 'step'] as const).map((sc) => (
              <button
                key={sc}
                onClick={() => setActiveScope(sc)}
                className={`flex-1 py-2 rounded capitalize font-medium transition ${
                  activeScope === sc ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {sc} level
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {activeScope === 'workflow' && 'Workflow env variables are inherited by every job and step across the pipeline.'}
            {activeScope === 'job' && 'Job env variables are isolated to that single runner instance and do NOT cross to other jobs.'}
            {activeScope === 'step' && 'Step variables are isolated to a single script execution unless written to $GITHUB_ENV.'}
          </p>
        </div>
      </div>

      {/* Variables & Secrets Table */}
      <div className="my-4 overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Variable / Secret Name</th>
              <th className="py-2.5 px-3">Scope / Type</th>
              <th className="py-2.5 px-3">Syntax Access</th>
              <th className="py-2.5 px-3">Runner Value / Masking</th>
              <th className="py-2.5 px-3">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950 font-mono">
            {variables.map((item) => {
              const isAvailable = 
                item.scope === 'workflow' ? true :
                item.scope === 'job' ? (activeScope === 'job' || activeScope === 'step') :
                item.scope === 'step' ? activeScope === 'step' :
                true;

              return (
                <tr key={item.name} className={isAvailable ? 'text-slate-300' : 'text-slate-600 bg-slate-900/20'}>
                  <td className="py-2.5 px-3 font-semibold flex items-center gap-2">
                    {item.sensitive ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Key className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{item.name}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{item.scope}</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">
                    {item.sensitive ? `\${{ secrets.${item.name} }}` : `\${{ env.${item.name} }}`}
                  </td>
                  <td className="py-2.5 px-3 font-semibold">
                    {item.sensitive && maskSecrets ? (
                      <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/60">
                        ***
                      </span>
                    ) : (
                      <span className={item.sensitive ? 'text-rose-400' : 'text-emerald-400'}>
                        {item.value}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {isAvailable ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800">
                        VISIBLE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-600 text-[10px]">
                        UNSET / OUT OF SCOPE
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Runner Shell Demonstration Box */}
      <div className="mt-4 p-4 rounded-lg bg-black/90 border border-slate-800 font-mono text-xs">
        <div className="text-slate-500 mb-2"># Simulated Runner Log Output:</div>
        <div className="text-cyan-400">$ echo "Running database migration with token: $DATABASE_PASSWORD"</div>
        <div className="text-slate-300 mt-1">
          Running database migration with token: {maskSecrets ? '***' : (activeEnvironment === 'staging' ? 'stage_s3cr3t_pass!' : 'prod_super_ultra_key_99!')}
        </div>
        <div className="text-slate-500 mt-3"># Attempting to persist runtime value for next step:</div>
        <div className="text-cyan-400">$ echo "BUILD_SHA=a1b2c3d" &gt;&gt; $GITHUB_ENV</div>
        <div className="text-emerald-400 mt-1">✓ Appended to $GITHUB_ENV: Available in subsequent steps on this runner!</div>
      </div>
    </div>
  );
}
