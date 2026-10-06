'use client';

import { useState } from 'react';

/**
 * 24-Bit RGB Pixel Mixer — exact port of the interactive lab from
 * `basic_concepts/03_computer_language_and_character_encoding.html`.
 *
 * Adjust each 8-bit channel (0–255) to see how the computer mixes Red,
 * Green, and Blue light into pixels. Default: rgb(66, 133, 244) • #4285F4.
 */
export function RgbMixer() {
  const [r, setR] = useState(66);
  const [g, setG] = useState(133);
  const [b, setB] = useState(244);

  const hex =
    '#' +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, '0').toUpperCase())
      .join('');

  // Same perceived-luminance rule as the source lab.
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  const textColor = luminance > 128 ? '#000000' : '#FFFFFF';

  const slider = (
    label: string,
    value: number,
    set: (v: number) => void,
    accent: string,
  ) => (
    <div className="flex items-center gap-3">
      <span className={`w-24 font-mono text-xs font-bold ${accent}`}>{label}:</span>
      <input
        type="range"
        min={0}
        max={255}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        aria-label={`${label} channel 0 to 255`}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-fd-muted"
      />
      <span className="w-10 text-right font-mono text-xs text-fd-foreground">
        {value}
      </span>
    </div>
  );

  return (
    <div className="not-prose my-6 rounded-xl border border-fd-border bg-fd-card p-5">
      <p className="mb-1 text-sm font-bold text-fd-foreground">
        24-Bit RGB Pixel Simulation
      </p>
      <p className="mb-4 text-xs text-fd-muted-foreground">
        Adjust each 8-bit channel (0 to 255) to see how the computer mixes Red,
        Green, and Blue light into pixels:
      </p>
      <div className="mb-4 flex flex-col gap-3">
        {slider('RED (R)', r, setR, 'text-red-500')}
        {slider('GREEN (G)', g, setG, 'text-green-600 dark:text-green-400')}
        {slider('BLUE (B)', b, setB, 'text-blue-500')}
      </div>
      <div
        role="status"
        aria-live="polite"
        style={{ backgroundColor: `rgb(${r}, ${g}, ${b})`, color: textColor }}
        className="rounded-md p-4 text-center font-mono text-sm font-bold transition-colors"
      >
        rgb({r}, {g}, {b}) • {hex}
      </div>
    </div>
  );
}
