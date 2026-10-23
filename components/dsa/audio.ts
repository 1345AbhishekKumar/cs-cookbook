// components/dsa/audio.ts
/**
 * Procedural Web Audio API synthesizer for React DSA visualizers.
 * Provides SSR protection, chromatic pitch mapping, and synthesis primitives.
 */

export interface ToneOptions {
  f: number;
  f2?: number;
  t: number;
  g?: number;
  type?: OscillatorType;
  delay?: number;
}

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let soundEnabled = true;
const listeners = new Set<(enabled: boolean) => void>();

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  listeners.forEach((listener) => {
    try {
      listener(enabled);
    } catch {
      // ignore callback failures
    }
  });
}

export function toggleSound(): boolean {
  setSoundEnabled(!soundEnabled);
  return soundEnabled;
}

export function subscribeSound(
  callback: (enabled: boolean) => void
): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtxClass) return null;
      audioCtx = new AudioCtxClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.16;
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function initAudio(): void {
  getAudioContext();
}

// User-interaction unlock for browsers with strict auto-play policies
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    if (soundEnabled) {
      getAudioContext();
    }
  };
  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });
}

export function playTone(options: ToneOptions): void {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;

    const t0 = ctx.currentTime + (options.delay || 0);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = options.type || "sine";
    osc.frequency.setValueAtTime(options.f, t0);
    if (options.f2) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(1, options.f2),
        t0 + options.t
      );
    }

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(options.g ?? 0.4, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + options.t);

    osc.connect(g);
    g.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + options.t + 0.03);
  } catch {
    // Ignore audio policy/context errors silently
  }
}

export function playHiss(t: number, g: number, fq: number, delay = 0): void {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;

    const len = Math.floor(ctx.sampleRate * t);
    if (len <= 0) return;

    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }

    const s = ctx.createBufferSource();
    s.buffer = buf;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = fq;
    bp.Q.value = 1.2;

    const ga = ctx.createGain();
    ga.gain.value = g;

    s.connect(bp);
    bp.connect(ga);
    ga.connect(masterGain);

    s.start(ctx.currentTime + delay);
  } catch {
    // Ignore hiss generation errors silently
  }
}

export const tick = (k = 0): void => {
  playTone({ f: 470 + k * 34, t: 0.07, g: 0.22 });
};

export const pop = (): void => {
  playTone({ f: 320, f2: 640, t: 0.16, g: 0.4 });
};

export const thud = (): void => {
  playTone({ f: 130, f2: 70, t: 0.18, g: 0.5 });
  playHiss(0.08, 0.06, 300);
};

export const pluck = (k = 0): void => {
  playTone({ f: 600 + k * 45, t: 0.13, g: 0.3, type: "triangle" });
};

export const jump = (): void => {
  playHiss(0.16, 0.1, 1000);
  playTone({ f: 720, t: 0.09, g: 0.25, delay: 0.03 });
};

export const chime = (): void => {
  playTone({ f: 660, t: 0.3, g: 0.3 });
  playTone({ f: 880, t: 0.36, g: 0.24, delay: 0.08 });
};

export const slide = (): void => {
  playHiss(0.22, 0.07, 520);
};

export const swap = (): void => {
  playTone({ f: 520, t: 0.07, g: 0.3 });
  playTone({ f: 390, t: 0.08, g: 0.3, delay: 0.09 });
};

export const up = (k = 0): void => {
  playTone({ f: 360 + k * 85, f2: (360 + k * 85) * 1.4, t: 0.13, g: 0.35 });
};

export const down = (k = 0): void => {
  const startF = 600 - k * 85;
  playTone({ f: startF, f2: Math.max(30, startF * 0.6), t: 0.15, g: 0.35 });
};

export const note = (val = 0): void => {
  playTone({ f: 260 + val * 28, t: 0.1, g: 0.26 });
};

export const hop = (k = 0): void => {
  playTone({ f: 300 + k * 70, f2: (300 + k * 70) * 1.8, t: 0.15, g: 0.35 });
};

export const hash = (): void => {
  playTone({ f: 220, type: "square", t: 0.06, g: 0.16 });
  playTone({ f: 330, type: "square", t: 0.06, g: 0.16, delay: 0.07 });
  playTone({ f: 262, type: "square", t: 0.08, g: 0.16, delay: 0.14 });
};

export const S = {
  tick,
  pop,
  thud,
  pluck,
  jump,
  chime,
  slide,
  swap,
  up,
  down,
  note,
  hop,
  hash,
};

export const sound = S;

export default S;
