'use client';

import { useState } from 'react';

/**
 * 8-Bit Binary Switchboard — exact port of the interactive lab from
 * `basic_concepts/05_binary_counting_and_conversion.html`.
 *
 * Click the 8 bit switches to toggle them ON (1) / OFF (0) and observe the
 * real-time binary, decimal, hexadecimal, and ASCII calculation.
 */

const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

function asciiLabel(total: number): string {
  if (total === 0) return '[NUL]';
  if (total < 32) return `[CTRL ${total}]`;
  if (total === 32) return '[SPACE]';
  if (total <= 126) return `'${String.fromCharCode(total)}'`;
  if (total === 127) return '[DEL]';
  return `[Extended: ${total}]`;
}

export function BinarySwitchboard() {
  // bits[0] = Bit 7 (128, MSB) … bits[7] = Bit 0 (1, LSB)
  const [bits, setBits] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);

  const toggle = (i: number) =>
    setBits((prev) => prev.map((v, idx) => (idx === i ? (v === 0 ? 1 : 0) : v)));

  let total = 0;
  let binaryStr = '';
  for (let i = 0; i < 8; i++) {
    if (bits[i] === 1) total += WEIGHTS[i];
    binaryStr += bits[i];
  }
  const hex = `0x${total.toString(16).padStart(2, '0').toUpperCase()}`;

  return (
    <div className="not-prose my-6 rounded-xl border border-fd-border bg-fd-card p-5">
      <p className="mb-1 text-sm font-bold text-fd-foreground">
        Interactive 8-Bit Binary Switchboard
      </p>
      <p className="mb-4 text-xs text-fd-muted-foreground">
        Click the 8 individual bit switches to toggle them ON (1) or OFF (0)
        and observe the real-time decimal and hexadecimal calculation:
      </p>
      <div className="mb-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {WEIGHTS.map((w, i) => (
          <div key={w} className="flex flex-col items-center gap-1">
            <span className="font-mono text-xs font-bold text-fd-foreground">{w}</span>
            <span className="font-mono text-[10px] text-fd-muted-foreground">
              2<sup>{7 - i}</sup>
            </span>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={bits[i] === 1}
              aria-label={`Bit ${7 - i} (weight ${w})`}
              className={`w-full rounded-md border-2 py-2 font-mono text-base font-bold transition-colors ${
                bits[i] === 1
                  ? 'border-green-600 bg-green-600/10 text-green-600 dark:text-green-400'
                  : 'border-fd-border bg-fd-muted/40 text-fd-muted-foreground hover:border-fd-muted-foreground'
              }`}
            >
              {bits[i]}
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md border border-fd-border p-3 text-center">
          <div className="text-[10px] uppercase tracking-wide text-fd-muted-foreground">
            Binary String
          </div>
          <div className="font-mono text-sm font-bold text-fd-foreground">{binaryStr}</div>
        </div>
        <div className="rounded-md border border-fd-border p-3 text-center">
          <div className="text-[10px] uppercase tracking-wide text-fd-muted-foreground">
            Decimal Total
          </div>
          <div className="font-mono text-sm font-bold text-green-600 dark:text-green-400">
            {total}
          </div>
        </div>
        <div className="rounded-md border border-fd-border p-3 text-center">
          <div className="text-[10px] uppercase tracking-wide text-fd-muted-foreground">
            Hexadecimal
          </div>
          <div className="font-mono text-sm font-bold text-fd-foreground">{hex}</div>
        </div>
        <div className="rounded-md border border-fd-border p-3 text-center">
          <div className="text-[10px] uppercase tracking-wide text-fd-muted-foreground">
            ASCII Symbol
          </div>
          <div className="font-mono text-sm font-bold text-fd-foreground">
            {asciiLabel(total)}
          </div>
        </div>
      </div>
    </div>
  );
}
