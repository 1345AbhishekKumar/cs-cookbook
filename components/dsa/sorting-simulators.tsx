"use client";

import React, { useEffect, useRef, useState, useCallback, useId } from "react";
import { sound, isSoundEnabled, toggleSound, subscribeSound } from "./audio";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

export type SortAlgorithm =
  "bubble" | "selection" | "insertion" | "merge" | "quick" | "heap";

export interface SimulatorProps {
  className?: string;
}

interface Step {
  cap: string;
  chips?: string[];
  run: () => Promise<void>;
}

interface BarElement {
  g: SVGGElement;
  r: SVGRectElement;
  t: SVGTextElement;
}

interface AlgoMeta {
  id: SortAlgorithm;
  name: string;
  title: string;
  color: string;
  badge: string;
  tag: string;
  intro: string;
  icon: React.ReactNode;
}

const C = {
  ink: "#e7edfb",
  mut: "#8fa0bf",
  dim: "#5d6d8f",
  amber: "#f5c04e",
  teal: "#45d6c4",
  coral: "#ff7b6b",
  green: "#7adf8e",
  violet: "#a08bff",
  sky: "#58c7f3",
};

const V0 = [9, 4, 12, 6, 14, 3, 8, 11];
const BW = 44;
const GAP = 12;
const BASE = 390;
const SC = 19.5;
const N_BARS = V0.length;
const TOTAL_BARS_WIDTH = N_BARS * BW + (N_BARS - 1) * GAP;
const X0 = (900 - TOTAL_BARS_WIDTH) / 2; // 232

const ALGOS: Record<SortAlgorithm, AlgoMeta> = {
  bubble: {
    id: "bubble",
    name: "BUBBLE",
    title: "Bubble Sort",
    color: C.coral,
    badge: "O(n²) · In-Place · Stable",
    tag: "LESSON 07 · BUBBLE SORT",
    intro:
      "Lesson 07·1 — <b>Bubble sort</b>. Neighbours compared, big values float right. Press <b>▶ PLAY ALL</b>, or step through with <b>STEP ▸</b>.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 14 14" fill="currentColor">
        <circle cx="3" cy="11" r="2" />
        <circle cx="7" cy="7" r="2" />
        <circle cx="11" cy="3" r="2" />
      </svg>
    ),
  },
  selection: {
    id: "selection",
    name: "SELECT",
    title: "Selection Sort",
    color: C.amber,
    badge: "O(n²) · O(n) Swaps · In-Place",
    tag: "LESSON 07 · SELECTION SORT",
    intro:
      "Lesson 07·2 — <b>Selection sort</b>. Find the minimum in the unsorted tail, swap it to the front. Press <b>▶ PLAY ALL</b>.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 14 14">
        <circle
          cx="7"
          cy="7"
          r="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M7 0v3M7 11v3M0 7h3M11 7h3"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
  insertion: {
    id: "insertion",
    name: "INSERT",
    title: "Insertion Sort",
    color: C.green,
    badge: "O(n²) · Best O(n) · Stable",
    tag: "LESSON 07 · INSERTION SORT",
    intro:
      "Lesson 07·3 — <b>Insertion sort</b>. Build sorted order one card at a time, sliding larger values right. Press <b>▶ PLAY ALL</b>.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 14 14">
        <path
          d="M7 1v7m0 0L4.5 5.5M7 8l2.5-2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <rect x="1" y="10.5" width="12" height="2.5" fill="currentColor" />
      </svg>
    ),
  },
  merge: {
    id: "merge",
    name: "MERGE",
    title: "Merge Sort",
    color: C.sky,
    badge: "O(n log n) · O(n) Aux · Stable",
    tag: "LESSON 07 · MERGE SORT",
    intro:
      "Lesson 07·4 — <b>Merge sort</b>. Split to atoms (log n levels), merge back in sorted order (n writes). Press <b>▶ PLAY ALL</b>.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 14 14">
        <path
          d="M1 3h4l2 4h6M1 11h4l2-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  quick: {
    id: "quick",
    name: "QUICK",
    title: "Quick Sort",
    color: C.violet,
    badge: "O(n log n) Avg · In-Place",
    tag: "LESSON 07 · QUICK SORT",
    intro:
      "Lesson 07·5 — <b>Quick sort</b>. Choose a pivot, partition smaller left and larger right, recurse. Press <b>▶ PLAY ALL</b>.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 14 14">
        <circle cx="7" cy="7" r="2" fill="currentColor" />
        <path
          d="M7 1v2.5M7 10.5V13M1 7h2.5M10.5 7H13"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
  heap: {
    id: "heap",
    name: "HEAP",
    title: "Heap Sort",
    color: C.teal,
    badge: "O(n log n) · In-Place · O(1) Aux",
    tag: "LESSON 07 · HEAP SORT",
    intro:
      "Lesson 07·6 — <b>Heap sort</b>. Turn the array into a max-heap, repeatedly swap the root to the tail. Press <b>▶ PLAY ALL</b>.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 14 14">
        <g fill="currentColor">
          <circle cx="7" cy="3" r="2" />
          <circle cx="3" cy="11" r="2" />
          <circle cx="11" cy="11" r="2" />
        </g>
        <path
          d="M6 4.5 4 9M8 4.5 10 9"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    ),
  },
};

// ============================================================================
// SIMULATOR CORE ENGINE
// ============================================================================

function SortingSimulatorEngine({
  algorithm,
  className = "",
}: {
  algorithm: SortAlgorithm;
  className?: string;
}) {
  const meta = ALGOS[algorithm];
  const svgRef = useRef<SVGSVGElement | null>(null);
  const patternId = useId();

  // State
  const [caption, setCaption] = useState<string>(meta.intro);
  const [chips, setChips] = useState<string[]>([]);
  const [currentBeat, setCurrentBeat] = useState<number>(0); // 0 to 6
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(true);

  // Sync with global audio state
  useEffect(() => {
    setSoundActive(isSoundEnabled());
    return subscribeSound((val) => setSoundActive(val));
  }, []);

  // Execution cancellation token ref
  const runIdRef = useRef(0);
  const isPlayingAllRef = useRef(false);
  isPlayingAllRef.current = isPlayingAll;

  // Refs for current step functions
  const stepsRef = useRef<Step[]>([]);
  const currentBeatRef = useRef(0);
  currentBeatRef.current = currentBeat;

  // Helper: wait with abort check
  const createWait = useCallback((runId: number) => {
    return (ms: number): Promise<boolean> => {
      return new Promise((resolve) => {
        if (runIdRef.current !== runId) return resolve(false);
        const timer = setTimeout(() => {
          resolve(runIdRef.current === runId);
        }, ms);
      });
    };
  }, []);

  // Setup / Reset the visualization stage
  const resetStage = useCallback(() => {
    runIdRef.current += 1;
    const currentRunId = runIdRef.current;
    setIsPlayingAll(false);
    isPlayingAllRef.current = false;
    setIsBusy(false);
    setCurrentBeat(0);
    currentBeatRef.current = 0;
    setCaption(meta.intro);
    setChips([]);

    const stage = svgRef.current;
    if (!stage) return;

    // Clear dynamic children
    stage.innerHTML = "";

    const NS = "http://www.w3.org/2000/svg";
    const svgEl = <K extends keyof SVGElementTagNameMap>(
      tag: K,
      attrs: Record<string, string | number> = {},
      parent?: SVGElement
    ): SVGElementTagNameMap[K] => {
      const el = document.createElementNS(NS, tag);
      for (const k in attrs) el.setAttribute(k, String(attrs[k]));
      if (parent) parent.appendChild(el);
      return el;
    };

    const txt = (
      x: number,
      y: number,
      s: string,
      o: {
        size?: number;
        fill?: string;
        anchor?: string;
        weight?: number | string;
        mono?: boolean;
        opacity?: number;
      } = {},
      parent?: SVGElement
    ): SVGTextElement => {
      const t = svgEl(
        "text",
        {
          x,
          y,
          "font-size": o.size || 14,
          fill: o.fill || C.ink,
          "text-anchor": o.anchor || "middle",
          "font-weight": o.weight || 500,
        },
        parent
      );
      if (o.mono) t.setAttribute("font-family", "JetBrains Mono, monospace");
      else t.setAttribute("font-family", "Instrument Sans, sans-serif");
      if (o.opacity !== undefined) t.setAttribute("opacity", String(o.opacity));
      t.textContent = s;
      return t;
    };

    const place = (
      g: SVGElement,
      x: number,
      y: number,
      dur?: number,
      ease?: string
    ) => {
      if (dur) {
        g.style.transition = `transform ${dur}s ${
          ease || "cubic-bezier(.3,.8,.3,1)"
        }`;
      } else {
        g.style.transition = "none";
      }
      g.style.transform = `translate(${x}px,${y}px)`;
    };

    const floatTxt = (
      x: number,
      y: number,
      s: string,
      color: string,
      size = 14
    ) => {
      const t = txt(
        x,
        y,
        s,
        { size, fill: color, anchor: "middle", mono: true, weight: 600 },
        stage
      );
      t.classList.add("floattxt");
      setTimeout(() => {
        try {
          if (t.parentNode) t.parentNode.removeChild(t);
        } catch {}
      }, 1300);
      return t;
    };

    const pulseEl = (el: SVGElement) => {
      el.classList.remove("pulse");
      el.classList.remove("pulse-bar");
      void el.getBoundingClientRect();
      el.classList.add("pulse");
    };

    // Inject SVG defs & inline keyframe styles
    const defs = svgEl("defs", {}, stage);
    defs.innerHTML = `
      <pattern id="grid-${patternId}" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="13" cy="13" r="1" fill="#8caae6" opacity="0.08" />
      </pattern>
      <style>
        .popin { animation: popin .45s cubic-bezier(.3,1.5,.4,1) both; transform-box: fill-box; transform-origin: center; }
        @keyframes popin { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: scale(1); } }

        .pulse, .pulse-bar { animation: pul .6s ease; transform-box: fill-box; transform-origin: center; }
        @keyframes pul { 0% { transform: scale(1); } 35% { transform: scale(1.18); } 100% { transform: scale(1); } }

        .flash { animation: flashA .8s ease forwards; }
        @keyframes flashA { from { opacity: .5; } to { opacity: 0; } }

        .floattxt { animation: rise 1.25s ease forwards; }
        @keyframes rise { 0% { opacity: 0; transform: translateY(8px); } 18% { opacity: 1; } 100% { opacity: 0; transform: translateY(-28px); } }
      </style>
    `;

    // Background rect with subtle dot grid
    svgEl(
      "rect",
      {
        width: 900,
        height: 460,
        fill: `url(#grid-${patternId})`,
      },
      stage
    );

    // Goal label at top-right
    txt(
      870,
      36,
      "GOAL: ASCENDING",
      { size: 11, fill: C.dim, mono: true, anchor: "end", weight: 600 },
      stage
    );

    // Baseline axis
    svgEl(
      "line",
      {
        x1: 140,
        y1: BASE,
        x2: 760,
        y2: BASE,
        stroke: "#22314f",
        "stroke-width": 1.5,
      },
      stage
    );

    // Build bar elements
    const a = V0.slice();
    const bars: BarElement[] = a.map((v, i) => {
      const g = svgEl("g", {}, stage);
      place(g, X0 + i * (BW + GAP), 0);
      const h = v * SC;
      const r = svgEl(
        "rect",
        {
          x: 0,
          y: BASE - h,
          width: BW,
          height: h,
          rx: 5,
          fill: "#24334f",
          stroke: "#3a4f7d",
          "stroke-width": 1.5,
        },
        g
      );
      const t = txt(
        BW / 2,
        BASE - h - 13,
        String(v),
        { size: 15, weight: 600, fill: C.mut, mono: true },
        g
      );

      // Bottom index label
      txt(
        X0 + i * (BW + GAP) + BW / 2,
        BASE + 22,
        String(i),
        { size: 11, fill: C.dim, mono: true },
        stage
      );

      return { g, r, t };
    });

    const isAborted = () => runIdRef.current !== currentRunId;
    const wait = createWait(currentRunId);

    const X = (i: number) => X0 + i * (BW + GAP);

    const calm = (b: BarElement) => {
      b.r.setAttribute("fill", "#24334f");
      b.r.setAttribute("stroke", "#3a4f7d");
      b.t.setAttribute("fill", C.mut);
    };

    const hi = (i: number, color: string) => {
      if (!bars[i]) return;
      bars[i].r.setAttribute("stroke", color);
      bars[i].r.setAttribute("fill", "#31446e");
      bars[i].t.setAttribute("fill", "#ffffff");
    };

    const lock = (i: number) => {
      if (!bars[i]) return;
      bars[i].r.setAttribute("fill", "#143826");
      bars[i].r.setAttribute("stroke", C.green);
      bars[i].t.setAttribute("fill", C.green);
      sound.pluck(0);
    };

    const tweenBar = (i: number, v: number, dur = 240): Promise<void> => {
      return new Promise((res) => {
        if (isAborted() || !bars[i]) return res();
        const b = bars[i];
        const h0 = parseFloat(b.r.getAttribute("height") || "0") || 0;
        const h1 = v * SC;
        const t0 = performance.now();
        b.t.textContent = String(v);

        function f(t: number) {
          if (isAborted()) return res();
          const p = Math.min(1, (t - t0) / dur);
          const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          const h = h0 + (h1 - h0) * e;
          b.r.setAttribute("height", String(h));
          b.r.setAttribute("y", String(BASE - h));
          b.t.setAttribute("y", String(BASE - h - 13));
          if (p < 1) requestAnimationFrame(f);
          else res();
        }
        requestAnimationFrame(f);
      });
    };

    const appear = async () => {
      for (let i = 0; i < N_BARS; i++) {
        if (isAborted()) return;
        pulseEl(bars[i].r);
        sound.note(a[i]);
        await wait(60);
      }
      await wait(200);
    };

    const swapPair = async (i: number, j: number, dur = 0.45) => {
      if (i === j || isAborted()) return;
      [a[i], a[j]] = [a[j], a[i]];
      bars[i].g.style.transition =
        `transform ${dur}s cubic-bezier(.35,.8,.3,1)`;
      bars[j].g.style.transition =
        `transform ${dur}s cubic-bezier(.35,.8,.3,1)`;
      place(bars[i].g, X(j), 0);
      place(bars[j].g, X(i), 0);
      [bars[i], bars[j]] = [bars[j], bars[i]];
      sound.swap();
      await wait(dur * 1000 + 40);
    };

    const setVal = (i: number, v: number) => {
      a[i] = v;
      return tweenBar(i, v);
    };

    const celebrate = async () => {
      for (let i = 0; i < N_BARS; i++) {
        if (isAborted()) return;
        pulseEl(bars[i].r);
        lock(i);
        sound.note(a[i]);
        await wait(70);
      }
      sound.chime();
    };

    const triBelow = (color: string, label: string) => {
      const g = svgEl("g", {}, stage);
      svgEl("polygon", { points: "0,0 -8,13 8,13", fill: color }, g);
      if (label) {
        txt(
          0,
          27,
          label,
          { size: 11, fill: color, mono: true, weight: 600 },
          g
        );
      }
      g.style.opacity = "0";
      return g;
    };

    const pill = (letter: string, x: number, y: number, color: string) => {
      const g = svgEl("g", {}, stage);
      place(g, x, y);
      svgEl(
        "rect",
        {
          x: -28,
          y: -14,
          width: 56,
          height: 26,
          rx: 13,
          fill: "#12203a",
          stroke: color,
        },
        g
      );
      const t = txt(
        0,
        4,
        letter,
        { size: 12, fill: color, mono: true, weight: 600 },
        g
      );
      return { g, t };
    };

    // Shared Bar Chart API
    const B = {
      bars,
      a,
      X,
      BASE,
      BW,
      GAP,
      n: N_BARS,
      calm,
      hi,
      lock,
      tweenBar,
      appear,
      swapPair,
      setVal,
      celebrate,
      pulseEl,
    };

    // ========================================================================
    // ALGORITHM BEATS DEFINITION
    // ========================================================================
    let steps: Step[] = [];

    if (algorithm === "bubble") {
      const acc = meta.color;
      const pass = async (end: number, speed: number, num?: number) => {
        if (num) floatTxt(120, 110, "pass " + num, acc, 15);
        for (let j = 0; j < end; j++) {
          if (isAborted()) return;
          B.hi(j, acc);
          B.hi(j + 1, acc);
          sound.note(Math.max(a[j], a[j + 1]));
          await wait(speed * 0.5);
          if (isAborted()) return;
          if (a[j] > a[j + 1]) {
            await B.swapPair(j, j + 1, (speed * 0.9) / 1000);
          }
          if (isAborted()) return;
          B.calm(B.bars[j]);
          B.calm(B.bars[j + 1]);
          await wait(speed * 0.18);
        }
        B.lock(end);
      };

      steps = [
        {
          cap: `The array stands as <code>[9, 4, 12, 6, 14, 3, 8, 11]</code>. Bubble sort's entire rule: walk the row, compare each pair of <b>neighbours</b>, swap if the left one is bigger. One full walk is a <b>pass</b>.`,
          run: async () => {
            await B.appear();
          },
        },
        {
          cap: `Pass 1: 9 &gt; 4 → swap. 9 &lt; 12 → leave. Watch <b>14</b>, the maximum — every comparison it wins shoves it one slot right. By the pass's end it has bubbled all the way home.`,
          run: async () => {
            await pass(7, 520, 1);
          },
        },
        {
          cap: `One pass, one certainty: the largest remaining value is <b>locked forever</b>. Pass 2 repeats the trick for the next largest — 12 rises and locks at index 6.`,
          run: async () => {
            await pass(6, 420, 2);
          },
        },
        {
          cap: `Pass 3 locks 9… each pass fixes exactly one more value and the unsorted tail shrinks by one. Fast-forwarding through passes 3 to 7.`,
          run: async () => {
            for (let e = 5, p = 3; e >= 1; e--, p++) {
              if (isAborted()) return;
              await pass(e, 140, p);
            }
          },
        },
        {
          cap: `Sorted. Note the escape hatch: a pass with <b>zero swaps</b> proves the array is already ordered, so bubble sort can quit early — its one genuine optimisation.`,
          run: async () => {
            B.lock(0);
            await B.celebrate();
          },
        },
        {
          cap: `Recap — <b>Bubble sort</b>: simple, stable, in-place, and slow at scale. It is taught because it makes the swap visible — it is rarely shipped.`,
          chips: [
            "WORST O(n²)",
            "BEST O(n) WITH EARLY EXIT",
            "STABLE",
            "IN-PLACE",
          ],
          run: async () => {
            sound.chime();
            await wait(300);
          },
        },
      ];
    } else if (algorithm === "selection") {
      const acc = meta.color;
      const scan = triBelow(acc, "scan");
      const minT = txt(
        0,
        96,
        "min ▼",
        { size: 12, fill: acc, mono: true, weight: 600 },
        stage
      );
      minT.style.opacity = "0";

      const round = async (lo: number, speed: number) => {
        let m = lo;
        place(scan, B.X(lo) + B.BW / 2, B.BASE + 42);
        scan.style.opacity = "1";
        B.hi(m, acc);
        place(minT, B.X(m) + B.BW / 2, 96);
        minT.style.opacity = "1";

        for (let j = lo + 1; j < B.n; j++) {
          if (isAborted()) return;
          place(scan, B.X(j) + B.BW / 2, B.BASE + 42, 0.22);
          B.hi(j, acc);
          sound.note(a[j]);
          await wait(speed * 0.6);
          if (isAborted()) return;
          if (a[j] < a[m]) {
            B.calm(B.bars[m]);
            m = j;
            place(minT, B.X(m) + B.BW / 2, 96, 0.22);
            B.hi(m, acc);
            B.pulseEl(B.bars[m].r);
          }
          await wait(speed * 0.25);
        }
        for (let j = lo; j < B.n; j++) B.calm(B.bars[j]);
        if (m !== lo) await B.swapPair(lo, m, 0.45);
        B.lock(lo);
      };

      steps = [
        {
          cap: `Each round has exactly one job: <b>scan the unsorted region, find the smallest value, swap it to the front</b>. The locked region then grows by one. No partial credit — the scan always runs in full.`,
          run: async () => {
            await B.appear();
          },
        },
        {
          cap: `Round 1: the cursor scans while <b>min</b> remembers the smallest value seen so far. 9… then 4… then 3 takes the crown at index 5. One swap, and slot 0 is locked forever.`,
          run: async () => {
            await round(0, 420);
          },
        },
        {
          cap: `Round 2 finds 4 already in place — nothing moves, <b>but the scan still happens</b>. Selection sort pays full comparison price whether work was needed or not.`,
          run: async () => {
            await round(1, 300);
          },
        },
        {
          cap: `Round 3: 6 swaps forward. Round 4: 8 swaps forward. The pattern is fixed — a full scan, then at most one swap per round.`,
          run: async () => {
            await round(2, 260);
            if (isAborted()) return;
            await round(3, 260);
          },
        },
        {
          cap: `The final rounds, fast-forwarded. By the last one, the remaining slot is sorted by pure elimination — nothing left to compare.`,
          run: async () => {
            for (let lo = 4; lo <= 6; lo++) {
              if (isAborted()) return;
              await round(lo, 110);
            }
            B.lock(7);
            scan.style.opacity = "0";
            minT.style.opacity = "0";
          },
        },
        {
          cap: `Recap — <b>Selection sort</b>: always <code>O(n²)</code> comparisons, but at most <b>n−1 swaps</b> — the champion when writing is expensive and movement must be minimal.`,
          chips: [
            "ALWAYS O(n²) COMPARISONS",
            "ONLY O(n) SWAPS",
            "UNSTABLE",
            "IN-PLACE",
          ],
          run: async () => {
            await B.celebrate();
          },
        },
      ];
    } else if (algorithm === "insertion") {
      const acc = meta.color;
      const insert = async (i: number, speed: number) => {
        const key = a[i];
        const bar = B.bars[i];
        bar.g.style.transition = "transform .3s";
        bar.g.style.transform = `translate(${B.X(i)}px, -36px)`;
        bar.r.setAttribute("stroke", acc);
        bar.r.setAttribute("fill", "#2e4633");
        sound.pop();
        floatTxt(B.X(i) + B.BW / 2, 70, "key = " + key, acc, 13);
        await wait(360);
        if (isAborted()) return;

        let j = i - 1;
        while (j >= 0 && a[j] > key) {
          if (isAborted()) return;
          const b = B.bars[j];
          b.g.style.transition = `transform ${
            speed / 1000
          }s cubic-bezier(.3,.8,.3,1)`;
          b.g.style.transform = `translate(${B.X(j + 1)}px, 0px)`;
          sound.note(a[j]);
          await wait(speed);
          a[j + 1] = a[j];
          B.bars[j + 1] = b;
          j--;
        }

        a[j + 1] = key;
        B.bars[j + 1] = bar;
        bar.g.style.transition = "transform .3s cubic-bezier(.3,1.3,.4,1)";
        bar.g.style.transform = `translate(${B.X(j + 1)}px, 0px)`;
        sound.thud();
        await wait(360);
        B.calm(bar);
      };

      steps = [
        {
          cap: `Sorting cards in your hand: pick up the next value, compare leftward, <b>slide bigger values right, drop it in the gap</b>. The left side is always sorted — that is the invariant, and it never breaks.`,
          run: async () => {
            await B.appear();
          },
        },
        {
          cap: `Lift <b>4</b>. Compare with 9 — bigger, so 9 slides right and 4 drops in at the front. One slide, one drop.`,
          run: async () => {
            await insert(1, 380);
          },
        },
        {
          cap: `Lift <b>12</b>. Compare with 9 — smaller, so 12 is already home. <b>Zero slides.</b> This is the superpower: on already-sorted input, insertion sort does almost nothing.`,
          run: async () => {
            await insert(2, 380);
          },
        },
        {
          cap: `Lift <b>6</b>: 12 slides, 9 slides, 4 stops the walk. Drop. The gap marches left until the correct home appears.`,
          run: async () => {
            await insert(3, 340);
          },
        },
        {
          cap: `The rest, quicker: 14 slides nothing, <b>3 slides everything</b>, 8 and 11 settle mid-row. Every single drop leaves the left side sorted again.`,
          run: async () => {
            for (let i = 4; i <= 7; i++) {
              if (isAborted()) return;
              await insert(i, 170);
            }
          },
        },
        {
          cap: `Recap — <b>Insertion sort</b>: <code>O(n)</code> on nearly-sorted data, stable, in-place, and unbeatable for tiny arrays — which is why real systems like Timsort hand small runs to it.`,
          chips: [
            "BEST O(n)",
            "WORST O(n²)",
            "STABLE",
            "GREAT ON NEARLY-SORTED",
          ],
          run: async () => {
            await B.celebrate();
          },
        },
      ];
    } else if (algorithm === "merge") {
      const acc = meta.color;
      const merge = async (
        lo: number,
        mid: number,
        hi: number,
        speed: number
      ) => {
        const L = a.slice(lo, mid + 1);
        const R = a.slice(mid + 1, hi + 1);
        const gL = pill("L · –", B.X(lo) + B.BW / 2, 58, acc);
        const gR = pill("R · –", B.X(mid + 1) + B.BW / 2, 58, acc);
        let pi = 0;
        let pj = 0;

        for (let k = lo; k <= hi; k++) {
          if (isAborted()) break;
          if (pi < L.length) gL.t.textContent = "L · " + L[pi];
          else gL.g.style.opacity = "0.25";
          if (pj < R.length) gR.t.textContent = "R · " + R[pj];
          else gR.g.style.opacity = "0.25";

          let v: number;
          let fromL: boolean;
          if (pi < L.length && (pj >= R.length || L[pi] <= R[pj])) {
            v = L[pi++];
            fromL = true;
          } else {
            v = R[pj++];
            fromL = false;
          }

          B.pulseEl((fromL ? gL : gR).g.firstChild as SVGElement);
          sound.tick(k);
          B.hi(k, acc);
          await B.setVal(k, v);
          if (isAborted()) break;
          sound.note(v);
          B.calm(B.bars[k]);
          await wait(speed);
        }
        gL.g.remove();
        gR.g.remove();
      };

      steps = [
        {
          cap: `Divide and conquer: <b>split</b> the array until every piece is one element — trivially sorted — then <b>merge</b> sorted pieces back together. Splitting is free; merging is where the work lives.`,
          run: async () => {
            await B.appear();
          },
        },
        {
          cap: `The split: 8 → 4 pieces → pairs → singles. Three divisions for eight items — <code>log₂ 8 = 3</code>. Each merge level will touch all 8 values once, which is exactly why the total cost is <code>n × log n</code>.`,
          run: async () => {
            const lv = [[4], [2, 6], [1, 3, 5, 7]];
            for (const l of lv) {
              if (isAborted()) return;
              for (const b of l) {
                const x = B.X(b) - B.GAP / 2;
                const ln = svgEl(
                  "line",
                  {
                    x1: x,
                    y1: 104,
                    x2: x,
                    y2: B.BASE + 8,
                    stroke: C.dim,
                    "stroke-dasharray": "4 5",
                    opacity: "0",
                  },
                  stage
                );
                ln.style.transition = "opacity .4s";
                ln.style.opacity = "0.85";
                sound.tick(b);
              }
              await wait(420);
            }
          },
        },
        {
          cap: `Merge singles into pairs. Two fingers walk the two runs (<b>L</b> and <b>R</b>); the smaller value is copied first. [9]+[4] → [4, 9], and so on down the line.`,
          run: async () => {
            await merge(0, 0, 1, 380);
            if (isAborted()) return;
            await merge(2, 2, 3, 340);
            if (isAborted()) return;
            await merge(4, 4, 5, 340);
            if (isAborted()) return;
            await merge(6, 6, 7, 340);
          },
        },
        {
          cap: `Merge pairs into quarters — same two-finger walk, longer runs. When one run runs dry, the remainder of the other is copied wholesale. No comparisons left to make.`,
          run: async () => {
            await merge(0, 1, 3, 360);
            if (isAborted()) return;
            await merge(4, 5, 7, 300);
          },
        },
        {
          cap: `The final merge: two sorted halves become one sorted array. Every value has been rewritten once per level — three levels, twenty-four writes, fully sorted.`,
          run: async () => {
            await merge(0, 3, 7, 320);
          },
        },
        {
          cap: `Recap — <b>Merge sort</b>: <code>O(n log n)</code> in every case, best or worst, and stable. The price is an auxiliary buffer as large as the array itself.`,
          chips: [
            "O(n log n) ALWAYS",
            "STABLE",
            "O(n) EXTRA MEMORY",
            "DIVIDE & CONQUER",
          ],
          run: async () => {
            await B.celebrate();
          },
        },
      ];
    } else if (algorithm === "quick") {
      const acc = meta.color;
      const jCur = triBelow(acc, "j");

      const partition = async (lo: number, hi: number, speed: number) => {
        const pivot = a[hi];
        B.bars[hi].r.setAttribute("stroke", acc);
        B.bars[hi].r.setAttribute("fill", "#3a3054");
        floatTxt(B.X(hi) + B.BW / 2, 80, "pivot = " + pivot, acc, 14);
        await wait(400);
        if (isAborted()) return hi;

        let i = lo - 1;
        jCur.style.opacity = "1";

        for (let j = lo; j < hi; j++) {
          if (isAborted()) return hi;
          place(jCur, B.X(j) + B.BW / 2, B.BASE + 42, 0.2);
          B.hi(j, acc);
          sound.note(a[j]);
          await wait(speed * 0.62);
          if (isAborted()) return hi;
          if (a[j] < pivot) {
            i++;
            if (i !== j) {
              B.calm(B.bars[j]);
              await B.swapPair(i, j, (speed * 0.8) / 1000);
              if (isAborted()) return hi;
              B.hi(j, acc);
            }
          }
          B.calm(B.bars[j]);
          await wait(speed * 0.2);
        }

        await B.swapPair(i + 1, hi, (speed * 0.9) / 1000);
        if (isAborted()) return hi;
        B.lock(i + 1);
        jCur.style.opacity = "0";
        return i + 1;
      };

      steps = [
        {
          cap: `Pick a <b>pivot</b> — here, always the rightmost value. Partition everything else: smaller values to the left, bigger to the right. The pivot lands in its <b>final home</b>. Then recurse on both sides.`,
          run: async () => {
            await B.appear();
          },
        },
        {
          cap: `Partition around pivot <b>11</b>. The cursor scans; every value smaller than 11 is swapped into the growing left zone. At the end, 11 swaps into the border — index 5, locked forever.`,
          run: async () => {
            await partition(0, 7, 460);
          },
        },
        {
          cap: `Recurse into the left zone with pivot <b>8</b>: smaller values pulled left again, and 8 locks at index 3. Two pivots placed, three sub-problems born.`,
          run: async () => {
            await partition(0, 4, 380);
          },
        },
        {
          cap: `Pivot <b>3</b> swings to the very front and locks; pivot <b>4</b> locks beside it. The lone 9 needs no work — a one-element range is already sorted, for free.`,
          run: async () => {
            await partition(0, 2, 290);
            if (isAborted()) return;
            await partition(1, 2, 290);
            B.lock(4);
            floatTxt(B.X(4) + B.BW / 2, 80, "single — already home", acc, 12);
            await wait(450);
          },
        },
        {
          cap: `Right side: pivot <b>12</b> evicts 14 to its right and locks at index 6; 14 locks alone. Every pivot at home — the array is sorted.`,
          run: async () => {
            await partition(6, 7, 380);
            B.lock(7);
          },
        },
        {
          cap: `Recap — <b>Quick sort</b>: average <code>O(n log n)</code>, in-place, and ferociously fast in practice. The <code>O(n²)</code> worst case needs consistently terrible pivots — real implementations pick them at random.`,
          chips: [
            "AVG O(n log n)",
            "WORST O(n²) — RARE WITH RANDOM PIVOT",
            "IN-PLACE",
            "UNSTABLE",
          ],
          run: async () => {
            await B.celebrate();
          },
        },
      ];
    } else if (algorithm === "heap") {
      const acc = meta.color;
      const sift = async (i: number, n: number, speed: number) => {
        let cur = i;
        while (true) {
          if (isAborted()) return;
          const l = 2 * cur + 1;
          const r = l + 1;
          let m = cur;
          if (l < n && a[l] > a[m]) m = l;
          if (r < n && a[r] > a[m]) m = r;
          if (m === cur) return;

          B.hi(cur, acc);
          B.hi(m, acc);
          await wait(speed * 0.35);
          if (isAborted()) return;
          B.calm(B.bars[cur]);
          B.calm(B.bars[m]);
          await B.swapPair(cur, m, speed / 1000);
          if (isAborted()) return;
          cur = m;
        }
      };

      const harvest = async (end: number, speed: number) => {
        await B.swapPair(0, end, speed / 1000);
        if (isAborted()) return;
        B.lock(end);
        floatTxt(B.X(end) + B.BW / 2, 80, a[end] + " parked", acc, 13);
        await sift(0, end, speed);
      };

      steps = [
        {
          cap: `Heap sort loads the array into a <b>max-heap</b>: a tree where every parent ≥ its children, stored implicitly in the same array — children of <code>i</code> sit at <code>2i+1</code> and <code>2i+2</code>. The biggest value is always at index 0.`,
          run: async () => {
            await B.appear();
          },
        },
        {
          cap: `Build the heap: <b>sift-down</b> from index 3 back to 0. Each sift lets a value sink until the heap rule holds around it. After this sweep, the tallest bar is guaranteed to stand at index 0.`,
          run: async () => {
            for (let i = 3; i >= 0; i--) {
              if (isAborted()) return;
              floatTxt(B.X(i) + B.BW / 2, 80, "sift " + i, acc, 12);
              await sift(i, 8, 440);
            }
          },
        },
        {
          cap: `Harvest: swap the root — the maximum — with the last heap slot, <b>lock that slot</b>, then sift the new root down. 14 is parked at the end, permanently.`,
          run: async () => {
            await harvest(7, 380);
          },
        },
        {
          cap: `Again: 12 surfaces to the root, swaps to the tail, locks. The heap shrinks by one each round while the sorted tail grows by one.`,
          run: async () => {
            await harvest(6, 360);
          },
        },
        {
          cap: `The remaining harvest, fast-forwarded: 11, 9, 8, 6, 4 — each extraction costs one swap and one sift. Nothing is ever re-scanned.`,
          run: async () => {
            for (let e = 5; e >= 1; e--) {
              if (isAborted()) return;
              await harvest(e, 160);
            }
            B.lock(0);
          },
        },
        {
          cap: `Recap — <b>Heap sort</b>: guaranteed <code>O(n log n)</code>, in-place, zero extra memory, no pivot luck. Merge sort is stable; quick sort is usually faster; heap sort is the pessimist's guarantee.`,
          chips: [
            "O(n log n) ALWAYS",
            "IN-PLACE",
            "O(1) EXTRA MEMORY",
            "UNSTABLE",
          ],
          run: async () => {
            await B.celebrate();
          },
        },
      ];
    }

    stepsRef.current = steps;
  }, [algorithm, meta, createWait, patternId]);

  // Execute a single beat
  const runStep = useCallback(async () => {
    const steps = stepsRef.current;
    const idx = currentBeatRef.current;
    if (idx >= steps.length) return;

    setIsBusy(true);
    const nextBeat = idx + 1;
    currentBeatRef.current = nextBeat;
    setCurrentBeat(nextBeat);

    const step = steps[idx];
    setCaption(step.cap);
    if (step.chips) setChips(step.chips);

    try {
      await step.run();
    } catch {
      // Abort gracefully
    } finally {
      setIsBusy(false);
    }
  }, []);

  // Play all beats continuously
  const handlePlayAll = useCallback(async () => {
    if (isPlayingAllRef.current) {
      isPlayingAllRef.current = false;
      setIsPlayingAll(false);
      return;
    }

    if (currentBeatRef.current >= stepsRef.current.length) {
      resetStage();
      await new Promise((r) => setTimeout(r, 60));
    }

    setIsPlayingAll(true);
    isPlayingAllRef.current = true;
    const runId = runIdRef.current;

    while (currentBeatRef.current < stepsRef.current.length) {
      if (!isPlayingAllRef.current || runIdRef.current !== runId) break;
      await runStep();
      if (!isPlayingAllRef.current || runIdRef.current !== runId) break;

      if (currentBeatRef.current < stepsRef.current.length) {
        await new Promise((r) => setTimeout(r, 650));
      }
    }

    if (runIdRef.current === runId) {
      setIsPlayingAll(false);
      isPlayingAllRef.current = false;
    }
  }, [resetStage, runStep]);

  // Initial stage setup
  useEffect(() => {
    resetStage();
    return () => {
      runIdRef.current += 1;
    };
  }, [resetStage]);

  // Handle Sound toggle
  const handleSoundToggle = () => {
    const nextState = toggleSound();
    if (nextState) {
      sound.pluck(2);
    }
  };

  return (
    <div
      className={`my-6 rounded-xl border border-fd-border bg-fd-card/50 p-4 md:p-5 shadow-sm text-fd-foreground ${className}`}
    >
      {/* Header toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-fd-border pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-fd-border/70"
            style={{
              color: meta.color,
              backgroundColor: `${meta.color}15`,
            }}
          >
            {meta.icon}
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-fd-foreground">
              {meta.title}
            </h3>
            <p className="text-xs text-fd-muted-foreground font-mono">
              Field Guide · 6 Beats
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Complexity Badge */}
          <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-500 dark:text-cyan-400 font-semibold">
            {meta.badge}
          </span>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={handleSoundToggle}
            aria-label="Toggle Sound"
            className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-all active:scale-95 ${
              soundActive
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                : "border-fd-border bg-fd-card text-fd-muted-foreground hover:bg-fd-muted"
            }`}
          >
            {soundActive ? "◉ SOUND ON" : "○ SOUND OFF"}
          </button>
        </div>
      </div>

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-4 items-start">
        {/* Left Column: Visual SVG Stage */}
        <div
          className="rounded-lg border border-fd-border bg-[#0b1120] text-slate-100 overflow-hidden shadow-inner flex flex-col"
          style={{
            borderColor: `${meta.color}35`,
          }}
        >
          {/* Stage Sub-header */}
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800/80 bg-[#0d1626] font-mono text-[11px] tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              VISUAL FIELD
            </span>
            <span>{meta.tag}</span>
          </div>

          {/* SVG Animation Stage */}
          <div className="relative w-full aspect-[900/460] bg-[#0b1120]">
            <svg
              ref={svgRef}
              viewBox="0 0 900 460"
              className="w-full h-full block select-none"
              role="img"
              aria-label={`${meta.title} Visualizer`}
            />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 bg-[#0d1626] px-3.5 py-2.5">
            <button
              type="button"
              disabled={isBusy}
              onClick={resetStage}
              className="rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 font-mono text-xs font-semibold text-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none"
            >
              ⟲ RESET
            </button>

            <button
              type="button"
              disabled={isBusy || currentBeat >= 6}
              onClick={() => {
                setIsPlayingAll(false);
                runStep();
              }}
              className="rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 font-mono text-xs font-semibold text-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none"
            >
              STEP ▸
            </button>

            <button
              type="button"
              onClick={handlePlayAll}
              className="rounded px-3.5 py-1.5 font-mono text-xs font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
              style={{
                backgroundColor: isPlayingAll ? "#ff5555" : meta.color,
                color: "#0b1120",
              }}
            >
              {isPlayingAll ? "■ PAUSE" : "▶ PLAY ALL"}
            </button>

            <span className="ml-auto font-mono text-xs font-semibold tracking-wider text-slate-400">
              BEAT {currentBeat} / 6
            </span>
          </div>
        </div>

        {/* Right Column: Lecture Notes Card */}
        <div className="rounded-lg border border-fd-border bg-fd-card/70 p-4 flex flex-col justify-between min-h-[360px] shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-fd-border font-mono text-[11px] tracking-widest text-fd-muted-foreground uppercase">
              <span>LECTURE NOTES</span>
              <span style={{ color: meta.color }} className="font-semibold">
                {meta.name}
              </span>
            </div>

            {/* Beat caption */}
            <div
              className="py-4 text-[13.5px] leading-relaxed text-fd-foreground/90 font-sans min-h-[140px] [&_b]:font-semibold [&_code]:font-mono [&_code]:text-xs [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-fd-muted [&_code]:border [&_code]:border-fd-border"
              style={
                {
                  "--accent-color": meta.color,
                } as React.CSSProperties
              }
              dangerouslySetInnerHTML={{ __html: caption }}
            />

            {/* Complexity chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {chips.map((chip, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border px-2 py-0.5 font-mono text-[10px] tracking-wider font-semibold"
                    style={{
                      borderColor: `${meta.color}60`,
                      backgroundColor: `${meta.color}15`,
                      color: meta.color,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Diamond Beat Progress Dots */}
          <div className="pt-4 border-t border-fd-border mt-4 flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-wider text-fd-muted-foreground">
              BEAT SEQUENCE
            </span>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const isDone = idx < currentBeat;
                const isCurrent = idx === currentBeat;
                return (
                  <div
                    key={idx}
                    className="h-2.5 w-2.5 rotate-45 border transition-all duration-300"
                    style={{
                      backgroundColor: isDone ? meta.color : "transparent",
                      borderColor:
                        isDone || isCurrent ? meta.color : "currentColor",
                      opacity: isDone || isCurrent ? 1 : 0.25,
                      boxShadow: isCurrent
                        ? `0 0 0 3px ${meta.color}35`
                        : undefined,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STANDALONE SIMULATOR COMPONENTS
// ============================================================================

export function BubbleSortSimulator(props: SimulatorProps) {
  return <SortingSimulatorEngine algorithm="bubble" {...props} />;
}

export function SelectionSortSimulator(props: SimulatorProps) {
  return <SortingSimulatorEngine algorithm="selection" {...props} />;
}

export function InsertionSortSimulator(props: SimulatorProps) {
  return <SortingSimulatorEngine algorithm="insertion" {...props} />;
}

export function MergeSortSimulator(props: SimulatorProps) {
  return <SortingSimulatorEngine algorithm="merge" {...props} />;
}

export function QuickSortSimulator(props: SimulatorProps) {
  return <SortingSimulatorEngine algorithm="quick" {...props} />;
}

export function HeapSortSimulator(props: SimulatorProps) {
  return <SortingSimulatorEngine algorithm="heap" {...props} />;
}

// ============================================================================
// UNIFIED EXPORT
// ============================================================================

export function SortingSimulator({
  algorithm = "bubble",
  className,
}: {
  algorithm?: SortAlgorithm;
  className?: string;
}) {
  return <SortingSimulatorEngine algorithm={algorithm} className={className} />;
}

export default SortingSimulator;
