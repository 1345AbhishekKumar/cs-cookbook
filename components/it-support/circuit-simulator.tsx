'use client';

import { useState } from 'react';

/**
 * Live Circuit Simulator — exact port of the interactive lab from
 * `basic_concepts/04_logic_gates_and_circuits.html`.
 *
 * Source logic: xorVal = A ^ B; notVal = NOT(xor); out1 = A AND notVal;
 * out2 = xor. Toggle inputs A and B to watch the signal propagate through
 * the XOR → NOT → AND chain in real time.
 */
export function CircuitSimulator() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const xorVal = a ^ b;
  const notVal = xorVal === 0 ? 1 : 0;
  const out1Val = a === 1 && notVal === 1 ? 1 : 0;
  const out2Val = xorVal;

  const pill = (on: boolean) =>
    `rounded px-1.5 py-0.5 font-mono text-xs font-bold ${
      on ? 'bg-green-600 text-white' : 'bg-fd-muted text-fd-muted-foreground'
    }`;

  const toggleBtn = (on: boolean) =>
    `flex items-center gap-2 rounded-md border-2 px-3 py-1.5 font-mono text-sm font-bold transition-colors ${
      on
        ? 'border-green-600 bg-green-600/10 text-green-600 dark:text-green-400'
        : 'border-fd-border bg-fd-card text-fd-foreground hover:border-fd-muted-foreground'
    }`;

  const readout = (v: number) =>
    `font-mono text-lg font-bold ${v === 1 ? 'text-green-600 dark:text-green-400' : 'text-fd-muted-foreground'}`;

  return (
    <div className="not-prose my-6 rounded-xl border border-fd-border bg-fd-card p-5">
      <p className="mb-1 text-sm font-bold text-fd-foreground">
        Live Circuit Simulation
      </p>
      <p className="mb-4 text-xs text-fd-muted-foreground">
        Toggle inputs A and B to watch electrical signals propagate through the
        XOR, NOT, and AND gates in real time:
      </p>
      <div className="mb-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setA(a === 0 ? 1 : 0)}
          className={toggleBtn(a === 1)}
          aria-pressed={a === 1}
        >
          Input A: <span className={pill(a === 1)}>{a === 1 ? '1 (ON)' : '0 (OFF)'}</span>
        </button>
        <button
          type="button"
          onClick={() => setB(b === 0 ? 1 : 0)}
          className={toggleBtn(b === 1)}
          aria-pressed={b === 1}
        >
          Input B: <span className={pill(b === 1)}>{b === 1 ? '1 (ON)' : '0 (OFF)'}</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-2 rounded-md border border-fd-border bg-fd-muted/40 p-4 font-mono text-sm">
        <div>
          <span className="text-fd-muted-foreground">XOR Gate: </span>
          <strong className={readout(xorVal)}>{xorVal}</strong>
        </div>
        <div>
          <span className="text-fd-muted-foreground">NOT(XOR): </span>
          <strong className={readout(notVal)}>{notVal}</strong>
        </div>
        <div>
          <span className="text-fd-foreground">Output 1 (AND): </span>
          <strong className={readout(out1Val)}>{out1Val}</strong>
        </div>
        <div>
          <span className="text-fd-foreground">Output 2 (XOR): </span>
          <strong className={readout(out2Val)}>{out2Val}</strong>
        </div>
      </div>
      <p className="mt-3 text-xs text-fd-muted-foreground">
        Four switch positions, four truth-table rows — the toggles above always
        agree with the combined circuit table in this lesson.
      </p>
    </div>
  );
}
