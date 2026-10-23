"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Split,
  CornerDownRight,
  Gauge,
  Activity,
  RotateCcw,
  ChevronRight,
  Play,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { S, isSoundEnabled, toggleSound, subscribeSound } from "./audio";

export type SearchAlgorithm =
  "linear" | "binary" | "jump" | "interpolation" | "exponential";

interface StepDef {
  cap: string;
  chips?: string[];
  run: (isCancelled: () => boolean) => Promise<void>;
}

interface AlgorithmConfig {
  id: SearchAlgorithm;
  name: string;
  title: string;
  kicker: string;
  complexity: string;
  tag: string;
  notesTag: string;
  color: string;
  intro: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  build: (
    stage: SVGSVGElement,
    color: string,
    isCancelled: () => boolean
  ) => {
    steps: StepDef[];
    cleanup?: () => void;
  };
}

const NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
  parent?: SVGElement | null
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) {
    e.setAttribute(k, String(attrs[k]));
  }
  if (parent) parent.appendChild(e);
  return e;
}

function txt(
  x: number,
  y: number,
  str: string,
  o: {
    size?: number;
    fill?: string;
    anchor?: "start" | "middle" | "end";
    weight?: number | string;
    mono?: boolean;
    opacity?: number;
  } = {},
  parent?: SVGElement | null
) {
  const t = svgEl(
    "text",
    {
      x,
      y,
      "font-size": o.size || 14,
      fill: o.fill || "#e7edfb",
      "text-anchor": o.anchor || "middle",
      "font-weight": o.weight || 500,
      "font-family": o.mono
        ? "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
        : "ui-sans-serif, system-ui, sans-serif",
    },
    parent
  );
  if (o.opacity !== undefined) t.setAttribute("opacity", String(o.opacity));
  t.textContent = str;
  return t;
}

function place(
  g: SVGElement,
  x: number,
  y: number,
  dur?: number,
  ease?: string
) {
  if (dur) {
    g.style.transition = `transform ${dur}s ${ease || "cubic-bezier(.3,.8,.3,1)"}`;
  } else {
    g.style.transition = "none";
  }
  g.style.transform = `translate(${x}px, ${y}px)`;
}

function flashRect(
  stage: SVGElement,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  const r = svgEl(
    "rect",
    {
      x,
      y,
      width: w,
      height: h,
      fill: color,
      rx: 6,
      class: "flash",
    },
    stage
  );
  setTimeout(() => {
    try {
      r.remove();
    } catch {}
  }, 850);
  return r;
}

function floatTxt(
  stage: SVGElement,
  x: number,
  y: number,
  str: string,
  color: string,
  size = 15
) {
  const t = txt(
    x,
    y,
    str,
    {
      size,
      fill: color,
      anchor: "middle",
      mono: true,
      weight: 600,
    },
    stage
  );
  t.classList.add("floattxt");
  setTimeout(() => {
    try {
      t.remove();
    } catch {}
  }, 1300);
  return t;
}

function pulseEl(el: SVGElement) {
  el.classList.remove("pulse");
  void el.getBoundingClientRect();
  el.classList.add("pulse");
}

function stamp(
  stage: SVGElement,
  x: number,
  y: number,
  str: string,
  color: string
) {
  const g = svgEl("g", {}, stage);
  g.setAttribute("transform", `rotate(-7 ${x} ${y})`);
  const t = txt(
    x,
    y,
    str,
    { size: 42, fill: color, mono: true, weight: 700, opacity: 0.95 },
    g
  );
  t.classList.add("popin");
  S.thud();
  return g;
}

function row(
  stage: SVGElement,
  vals: number[],
  x0: number,
  y: number,
  cw: number,
  h: number,
  o: { size?: number } = {}
) {
  return vals.map((v, i) => {
    const g = svgEl("g", {}, stage);
    place(g, x0 + i * cw, y);
    const r = svgEl(
      "rect",
      {
        x: 2,
        y: 0,
        width: cw - 4,
        height: h,
        rx: 6,
        fill: "#152036",
        stroke: "#31446e",
        "stroke-width": 1.5,
      },
      g
    );
    const t = txt(
      cw / 2,
      h / 2 + 7,
      String(v),
      {
        size: o.size || 18,
        weight: 600,
        fill: "#e7edfb",
        mono: true,
      },
      g
    );
    txt(
      cw / 2,
      h + 18,
      String(i),
      {
        size: 10.5,
        fill: "#5d6d8f",
        mono: true,
      },
      g
    );
    return { g, r, t, val: v };
  });
}

function targetBadge(
  stage: SVGElement,
  x: number,
  y: number,
  val: number | string,
  color: string
) {
  const g = svgEl("g", {}, stage);
  place(g, x, y);
  svgEl(
    "rect",
    { width: 172, height: 40, rx: 8, fill: "#12203a", stroke: color },
    g
  );
  const t = txt(
    86,
    26,
    "TARGET = " + val,
    {
      size: 15,
      fill: color,
      mono: true,
      weight: 700,
    },
    g
  );
  return { g, t };
}

function cursorArrow(stage: SVGElement, color: string) {
  const g = svgEl("g", {}, stage);
  svgEl("polygon", { points: "0,0 -11,-16 11,-16", fill: color }, g);
  return g;
}

function hopTo(
  g: SVGElement,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  dur: number,
  h: number,
  isCancelled: () => boolean
): Promise<void> {
  return new Promise((res) => {
    const n = Math.max(2, Math.round(dur * 60));
    let i = 0;
    function f() {
      if (isCancelled()) return;
      i++;
      const t = i / n;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t - Math.sin(Math.PI * t) * h;
      g.style.transform = `translate(${x}px, ${y}px)`;
      if (t < 1) requestAnimationFrame(f);
      else res();
    }
    requestAnimationFrame(f);
  });
}

const sleep = (ms: number, isCancelled: () => boolean) =>
  new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(!isCancelled());
    }, ms);
  });

/* ================= 1 · LINEAR SEARCH ================= */
function buildLinear(
  stage: SVGSVGElement,
  acc: string,
  isCancelled: () => boolean
) {
  const vals = [14, 31, 8, 23, 47, 5, 19, 36, 11, 28];
  const X0 = 50,
    Y = 226,
    CW = 80,
    H = 60;
  const cells = row(stage, vals, X0, Y, CW, H, { size: 20 });
  cells.forEach((c) => (c.g.style.opacity = "0"));

  const tb = targetBadge(stage, 50, 52, 23, acc);
  tb.g.style.opacity = "0";

  const cur = cursorArrow(stage, acc);
  const lbl = txt(
    0,
    -30,
    "checks: 0",
    { size: 13, fill: acc, mono: true, weight: 600 },
    cur
  );
  place(cur, X0 + CW / 2, Y - 26);
  cur.style.opacity = "0";

  let checks = 0;
  function dim(i: number) {
    cells[i].r.setAttribute("fill", "#0d1526");
    cells[i].t.setAttribute("fill", "#5d6d8f");
  }
  function lit(i: number) {
    cells[i].r.setAttribute("fill", "#152036");
    cells[i].t.setAttribute("fill", "#e7edfb");
    cells[i].r.setAttribute("stroke", "#31446e");
  }

  async function check(i: number, found: boolean) {
    if (isCancelled()) return;
    place(cur, X0 + i * CW + CW / 2, Y - 26, 0.3);
    S.tick(i);
    cells[i].r.setAttribute("stroke", acc);
    if (!(await sleep(280, isCancelled))) return;

    checks++;
    lbl.textContent = "checks: " + checks;
    if (found) {
      flashRect(stage, X0 + i * CW + 2, Y, CW - 4, H, "#7adf8e");
      cells[i].r.setAttribute("stroke", "#7adf8e");
      S.chime();
      floatTxt(
        stage,
        X0 + i * CW + CW / 2,
        Y - 66,
        "23 = 23 ✓ FOUND at index " + i,
        "#7adf8e",
        16
      );
    } else {
      floatTxt(
        stage,
        X0 + i * CW + CW / 2,
        Y - 66,
        vals[i] + " ≠ 23",
        "#8fa0bf",
        14
      );
      dim(i);
    }
  }

  const steps: StepDef[] = [
    {
      cap: `<b>Linear search</b> is the honest method: look at each element in order until you find the target — or run out of elements. It makes zero assumptions: the data does not need to be sorted.`,
      run: async () => {
        tb.g.style.transition = "opacity .4s";
        tb.g.style.opacity = "1";
        for (let i = 0; i < vals.length; i++) {
          if (isCancelled()) return;
          cells[i].g.style.transition = "opacity .3s";
          cells[i].g.style.opacity = "1";
          S.tick(i);
          if (!(await sleep(70, isCancelled))) return;
        }
        await sleep(250, isCancelled);
      },
    },
    {
      cap: `The rule is one line: <code>if a[i] == target → done</code>. Otherwise move right and repeat. Watch the counter — every comparison costs one step.`,
      run: async () => {
        cur.style.transition = "opacity .25s";
        cur.style.opacity = "1";
        if (!(await sleep(300, isCancelled))) return;
        await check(0, false);
        if (!(await sleep(420, isCancelled))) return;
        await check(1, false);
        await sleep(400, isCancelled);
      },
    },
    {
      cap: `Keep scanning… and there it is: <b>23 at index 3, found in 4 checks</b>. An early hit is the best case — just <code>O(1)</code>.`,
      run: async () => {
        await check(2, false);
        if (!(await sleep(420, isCancelled))) return;
        await check(3, true);
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Now the bad news. If the target is missing — say <b>99</b> — there is no shortcut: you must inspect <b>every single cell</b> before you can say “not here”. That is the worst case.`,
      run: async () => {
        for (let i = 0; i < 10; i++) lit(i);
        tb.t.textContent = "TARGET = 99";
        checks = 0;
        lbl.textContent = "checks: 0";
        if (!(await sleep(400, isCancelled))) return;
        for (let i = 0; i < 10; i++) {
          if (isCancelled()) return;
          place(cur, X0 + i * CW + CW / 2, Y - 26);
          S.tick(i);
          dim(i);
          checks++;
          lbl.textContent = "checks: " + checks;
          if (!(await sleep(95, isCancelled))) return;
        }
        if (!(await sleep(250, isCancelled))) return;
        stamp(stage, 450, Y + H + 86, "NOT FOUND", "#ff7b6b");
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Cost summary: <b>best</b> — first cell, <code>O(1)</code>. <b>worst &amp; average</b> — proportional to n, <code>O(n)</code>. Double the data, double the work. Every time.`,
      chips: ["BEST O(1)", "AVERAGE O(n)", "WORST O(n)", "NO SORT NEEDED"],
      run: async () => {
        S.chime();
        await sleep(300, isCancelled);
      },
    },
    {
      cap: `Use linear search when data is <b>unsorted, small, or arriving as a stream</b>. For anything bigger and sorted, halving beats scanning — that is the next tab.`,
      run: async () => {
        S.chime();
        await sleep(300, isCancelled);
      },
    },
  ];

  return { steps };
}

/* ================= 2 · BINARY SEARCH ================= */
function buildBinary(
  stage: SVGSVGElement,
  acc: string,
  isCancelled: () => boolean
) {
  const vals = [2, 5, 9, 14, 21, 27, 33, 38, 44, 51, 57, 63, 70, 78, 85];
  const X0 = 30,
    CW = 56,
    H = 56,
    Y = 214;
  const cells = row(stage, vals, X0, Y, CW, H, { size: 16 });
  cells.forEach((c) => (c.g.style.opacity = "0"));

  const tb = targetBadge(stage, 40, 42, 57, acc);
  tb.g.style.opacity = "0";

  const note = txt(
    866,
    58,
    "sorted ✓",
    { size: 13, fill: acc, mono: true, anchor: "end", opacity: 0 },
    stage
  );

  function tri(label: string, above = false) {
    const g = svgEl("g", {}, stage);
    if (above) {
      svgEl("polygon", { points: "0,0 -9,-14 9,-14", fill: acc }, g);
      txt(0, -26, label, { size: 12, fill: acc, mono: true, weight: 600 }, g);
    } else {
      svgEl("polygon", { points: "0,0 -9,14 9,14", fill: acc }, g);
      txt(0, 30, label, { size: 12, fill: acc, mono: true, weight: 600 }, g);
    }
    g.style.opacity = "0";
    return g;
  }

  const loM = tri("lo");
  const hiM = tri("hi");
  const midM = tri("mid", true);
  const cx = (i: number) => X0 + i * CW + CW / 2;

  function discard(a: number, b: number) {
    for (let i = a; i <= b; i++) {
      cells[i].g.style.transition = "opacity .5s, transform .5s";
      cells[i].g.style.opacity = "0.15";
      place(cells[i].g, X0 + i * CW, Y + 16, 0.5);
    }
    S.slide();
  }

  async function probe(m: number) {
    if (isCancelled()) return;
    place(midM, cx(m), Y - 24, 0.45);
    midM.style.opacity = "1";
    S.jump();
    if (!(await sleep(520, isCancelled))) return;
    pulseEl(cells[m].r);
  }

  const steps: StepDef[] = [
    {
      cap: `Binary search demands one thing: <b>sorted data</b>. Given that, it never scans — each probe destroys half the suspects at once. Target: <b>57</b> among 15 values.`,
      run: async () => {
        for (let i = 0; i < vals.length; i++) {
          if (isCancelled()) return;
          cells[i].g.style.transition = "opacity .25s";
          cells[i].g.style.opacity = "1";
          if (!(await sleep(35, isCancelled))) return;
        }
        tb.g.style.transition = "opacity .4s";
        tb.g.style.opacity = "1";
        S.pluck(0);
        note.style.transition = "opacity .4s";
        note.style.opacity = "1";
        if (!(await sleep(350, isCancelled))) return;

        place(loM, cx(0), Y + H + 22);
        place(hiM, cx(14), Y + H + 22);
        loM.style.transition = "opacity .4s";
        hiM.style.transition = "opacity .4s";
        loM.style.opacity = "1";
        hiM.style.opacity = "1";
        S.pluck(1);
        await sleep(450, isCancelled);
      },
    },
    {
      cap: `Probe the <b>middle</b>: a[7] = 38. Since 38 &lt; 57, the target can only be to the right — the entire left half is eliminated in one comparison. <b>15 suspects → 7.</b>`,
      run: async () => {
        await probe(7);
        floatTxt(stage, cx(7), Y - 72, "a[7] = 38 < 57 → go RIGHT", acc);
        if (!(await sleep(800, isCancelled))) return;
        discard(0, 7);
        place(loM, cx(8), Y + H + 22, 0.5);
        floatTxt(stage, 250, Y + H + 64, "15 → 7", acc, 18);
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Probe the middle of what remains: a[11] = 63. Too big — the right half dies. <b>7 → 3.</b> The search space is collapsing geometrically.`,
      run: async () => {
        await probe(11);
        floatTxt(stage, cx(11), Y - 72, "a[11] = 63 > 57 → go LEFT", acc);
        if (!(await sleep(800, isCancelled))) return;
        discard(11, 14);
        place(hiM, cx(10), Y + H + 22, 0.5);
        floatTxt(stage, 640, Y + H + 64, "7 → 3", acc, 18);
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Probe again: a[9] = 51. Too small — go right. <b>3 → 1.</b> One candidate left.`,
      run: async () => {
        await probe(9);
        floatTxt(stage, cx(9), Y - 72, "a[9] = 51 < 57 → go RIGHT", acc);
        if (!(await sleep(800, isCancelled))) return;
        discard(8, 9);
        place(loM, cx(10), Y + H + 22, 0.5);
        floatTxt(stage, 430, Y + H + 64, "3 → 1", acc, 18);
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Final probe: a[10] = <b>57 — hit</b>. Four comparisons found a needle in a haystack of fifteen. If the range ever empties, the value is absent — proven, not guessed.`,
      run: async () => {
        await probe(10);
        flashRect(stage, X0 + 10 * CW + 2, Y, CW - 4, H, "#7adf8e");
        cells[10].r.setAttribute("stroke", "#7adf8e");
        S.chime();
        floatTxt(
          stage,
          cx(10),
          Y - 72,
          "57 = 57 ✓ FOUND — 4 probes total",
          "#7adf8e",
          16
        );
        await sleep(800, isCancelled);
      },
    },
    {
      cap: `Halving is brutal: <code>log₂(1 000 000 000) ≈ 30</code>. A billion items, thirty checks. This is the single biggest speed-up in basic computer science.`,
      chips: [
        "O(log n)",
        "REQUIRES SORTED DATA",
        "DIVIDE & CONQUER",
        "10⁹ ITEMS ≈ 30 PROBES",
      ],
      run: async () => {
        const g = svgEl("g", {}, stage);
        place(g, 450, 398);
        svgEl(
          "rect",
          {
            x: -300,
            y: -24,
            width: 600,
            height: 46,
            rx: 8,
            fill: "#12203a",
            stroke: acc,
          },
          g
        );
        txt(
          0,
          6,
          "n = 1 000 000 000 → log₂ n ≈ 30 checks",
          { size: 16, fill: acc, mono: true, weight: 600 },
          g
        );
        S.chime();
        await sleep(500, isCancelled);
      },
    },
  ];

  return { steps };
}

/* ================= 3 · JUMP SEARCH ================= */
function buildJump(
  stage: SVGSVGElement,
  acc: string,
  isCancelled: () => boolean
) {
  const vals = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59, 63];
  const X0 = 34,
    CW = 52,
    H = 54,
    Y = 222;
  const cells = row(stage, vals, X0, Y, CW, H, { size: 15 });
  cells.forEach((c) => (c.g.style.opacity = "0"));

  const tb = targetBadge(stage, 40, 42, 43, acc);
  tb.g.style.opacity = "0";

  const blks: SVGGElement[] = [];
  for (let b = 0; b < 4; b++) {
    const g = svgEl("g", {}, stage);
    g.style.opacity = "0";
    const x = X0 + b * 4 * CW,
      y = Y + H + 34;
    svgEl(
      "path",
      {
        d: `M${x + 4} ${y - 6} v6 H${x + 4 * CW - 4} v-6`,
        fill: "none",
        stroke: "#31446e",
        "stroke-width": 1.5,
      },
      g
    );
    txt(
      x + 2 * CW,
      y + 18,
      "block " + b,
      { size: 10.5, fill: "#5d6d8f", mono: true },
      g
    );
    blks.push(g);
  }

  const jmp = svgEl("g", {}, stage);
  svgEl("polygon", { points: "0,0 -9,-14 9,-14", fill: acc }, jmp);
  svgEl(
    "line",
    { x1: 0, y1: -14, x2: 0, y2: -28, stroke: acc, "stroke-width": 2 },
    jmp
  );
  place(jmp, X0 - 24, Y - 24);
  jmp.style.opacity = "0";

  const stat = txt(
    866,
    42,
    "jumps: 0 · checks: 0",
    { size: 12, fill: acc, mono: true, anchor: "end", opacity: 0 },
    stage
  );

  let jumps = 0,
    checks = 0;
  const cx = (i: number) => X0 + i * CW + CW / 2;

  async function hopToIdx(i: number, msg: string) {
    if (isCancelled()) return;
    const m = jmp.style.transform.match(
      /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/
    );
    const x0 = m ? +m[1] : X0 - 24,
      y0 = Y - 24;
    S.hop(jumps);
    await hopTo(jmp, x0, y0, cx(i), Y - 24, 0.55, 64, isCancelled);
    if (isCancelled()) return;
    jumps++;
    stat.textContent = `jumps: ${jumps} · checks: ${checks}`;
    S.thud();
    pulseEl(cells[i].r);
    floatTxt(stage, cx(i), Y - 78, msg, acc, 14);
    await sleep(750, isCancelled);
  }

  const steps: StepDef[] = [
    {
      cap: `Jump search splits the difference between scanning and halving. Sorted data, n = 16, so we leap in blocks of <code>√16 = 4</code>. Jump block-to-block until we overshoot — then scan that one block.`,
      run: async () => {
        for (let i = 0; i < 16; i++) {
          if (isCancelled()) return;
          cells[i].g.style.transition = "opacity .2s";
          cells[i].g.style.opacity = "1";
          if (!(await sleep(22, isCancelled))) return;
        }
        tb.g.style.transition = "opacity .4s";
        tb.g.style.opacity = "1";
        S.pluck(0);
        for (const b of blks) {
          if (isCancelled()) return;
          b.style.transition = "opacity .4s";
          b.style.opacity = "1";
          if (!(await sleep(140, isCancelled))) return;
        }
        stat.style.transition = "opacity .4s";
        stat.style.opacity = "1";
        await sleep(300, isCancelled);
      },
    },
    {
      cap: `Only compare the <b>last element of each block</b>. Jump to index 3: value 15. Since 15 &lt; 43, the whole first block is too small — eliminated without looking inside.`,
      run: async () => {
        jmp.style.opacity = "1";
        await hopToIdx(3, "15 < 43 → skip block 0");
      },
    },
    {
      cap: `Jump, jump: 31 &lt; 43 kills block 1… then we land on 47 ≥ 43. Overshoot! The target can only live in <b>block 2</b> (indices 8–11).`,
      run: async () => {
        await hopToIdx(7, "31 < 43 → skip block 1");
        await hopToIdx(11, "47 ≥ 43 → it is in block 2!");
        if (isCancelled()) return;
        for (let i = 8; i <= 11; i++) {
          cells[i].r.setAttribute("stroke", acc);
        }
        S.pluck(3);
        await sleep(400, isCancelled);
      },
    },
    {
      cap: `Now a tiny linear scan inside one block: 35 ≠ 43, 39 ≠ 43, and index 10 — <b>43, found</b>. Total bill: 3 jumps + 3 checks.`,
      run: async () => {
        for (const i of [8, 9]) {
          if (isCancelled()) return;
          place(jmp, cx(i), Y - 24, 0.3);
          S.tick(i);
          checks++;
          stat.textContent = `jumps: ${jumps} · checks: ${checks}`;
          floatTxt(stage, cx(i), Y - 78, vals[i] + " ≠ 43", "#8fa0bf", 13);
          cells[i].r.setAttribute("fill", "#0d1526");
          cells[i].t.setAttribute("fill", "#5d6d8f");
          if (!(await sleep(560, isCancelled))) return;
        }
        if (isCancelled()) return;
        place(jmp, cx(10), Y - 24, 0.3);
        S.tick(2);
        checks++;
        stat.textContent = `jumps: ${jumps} · checks: ${checks}`;
        flashRect(stage, X0 + 10 * CW + 2, Y, CW - 4, H, "#7adf8e");
        cells[10].r.setAttribute("stroke", "#7adf8e");
        S.chime();
        floatTxt(stage, cx(10), Y - 78, "FOUND at index 10", "#7adf8e", 15);
        await sleep(700, isCancelled);
      },
    },
    {
      cap: `Why √n? Worst case is n/m jumps plus m checks; the minimum of that sum sits at <code>m = √n</code>, giving <code>O(√n)</code> ≈ 8 steps for n = 64. Between linear and binary — and it only ever moves <b>forward</b>.`,
      chips: [
        "O(√n)",
        "SORTED DATA",
        "FORWARD-ONLY SEEKING",
        "BLOCK SIZE m = √n",
      ],
      run: async () => {
        S.chime();
        await sleep(300, isCancelled);
      },
    },
    {
      cap: `Recap — <b>Jump search</b>: cheaper than full scanning, simpler than binary, and ideal where backwards seeks are expensive — huge sorted files, even magnetic tape.`,
      run: async () => {
        S.chime();
        await sleep(300, isCancelled);
      },
    },
  ];

  return { steps };
}

/* ================= 4 · INTERPOLATION SEARCH ================= */
function buildInterp(
  stage: SVGSVGElement,
  acc: string,
  isCancelled: () => boolean
) {
  const vals = [10, 22, 35, 48, 61, 73, 86, 94, 107, 120];
  const X0 = 50,
    CW = 80,
    H = 56,
    Y = 252;
  const cells = row(stage, vals, X0, Y, CW, H, { size: 17 });
  cells.forEach((c) => (c.g.style.opacity = "0"));

  const tb = targetBadge(stage, 40, 52, 94, acc);
  tb.g.style.opacity = "0";

  const ruler = svgEl(
    "line",
    {
      x1: X0,
      y1: 214,
      x2: X0 + 10 * CW,
      y2: 214,
      stroke: "#31446e",
      "stroke-width": 1.5,
      opacity: 0,
    },
    stage
  );

  const needle = svgEl("g", {}, stage);
  svgEl(
    "line",
    { x1: 0, y1: 0, x2: 0, y2: -30, stroke: acc, "stroke-width": 2.5 },
    needle
  );
  svgEl("circle", { cy: -36, r: 6, fill: acc }, needle);
  svgEl("polygon", { points: "0,0 -6,-10 6,-10", fill: acc }, needle);
  place(needle, X0 + CW / 2, 214);
  needle.style.opacity = "0";

  const ban = svgEl("g", {}, stage);
  ban.style.opacity = "0";
  svgEl(
    "rect",
    {
      x: 240,
      y: 40,
      width: 616,
      height: 66,
      rx: 8,
      fill: "#12203a",
      stroke: "#31446e",
    },
    ban
  );
  txt(
    548,
    66,
    "pos = lo + (target − a[lo]) · (hi − lo) ÷ (a[hi] − a[lo])",
    { size: 14, fill: acc, mono: true, weight: 600 },
    ban
  );
  const numLine = txt(
    548,
    92,
    "",
    { size: 14, fill: "#e7edfb", mono: true },
    ban
  );

  const loT = txt(
    X0 + CW / 2,
    Y + H + 40,
    "lo = 0",
    { size: 12, fill: acc, mono: true, opacity: 0 },
    stage
  );
  const hiT = txt(
    X0 + 9 * CW + CW / 2,
    Y + H + 40,
    "hi = 9",
    { size: 12, fill: acc, mono: true, opacity: 0 },
    stage
  );

  const cx = (i: number) => X0 + i * CW + CW / 2;

  const steps: StepDef[] = [
    {
      cap: `Interpolation search stops probing the middle and starts <b>guessing by value</b>. Searching 94 in 10…120? A human thumbs the phone book toward “S” — this formula does the same. Needs sorted <i>and</i> evenly spread data.`,
      run: async () => {
        for (let i = 0; i < 10; i++) {
          if (isCancelled()) return;
          cells[i].g.style.transition = "opacity .25s";
          cells[i].g.style.opacity = "1";
          if (!(await sleep(40, isCancelled))) return;
        }
        tb.g.style.transition = "opacity .4s";
        tb.g.style.opacity = "1";
        S.pluck(0);
        ban.style.transition = "opacity .5s";
        ban.style.opacity = "1";
        ruler.style.transition = "opacity .5s";
        ruler.style.opacity = "0.8";
        loT.style.transition = "opacity .4s";
        hiT.style.transition = "opacity .4s";
        loT.style.opacity = "1";
        hiT.style.opacity = "1";
        needle.style.transition = "opacity .4s";
        needle.style.opacity = "1";
        await sleep(500, isCancelled);
      },
    },
    {
      cap: `Probe 1: the formula weighs where 94 sits between 10 and 120 and lands near index <b>6.87 → 6</b>. Reading a[6] = 86: too small, so the left side is discarded. One probe, 7 cells gone.`,
      run: async () => {
        numLine.textContent = "pos = 0 + (94−10)·9 ÷ (120−10) = 6.87 → 6";
        needle.style.transition = "transform .8s cubic-bezier(.3,.7,.3,1)";
        place(needle, cx(6), 214, 0.8);
        S.slide();
        if (!(await sleep(900, isCancelled))) return;

        pulseEl(cells[6].r);
        S.tick(6);
        floatTxt(stage, cx(6), Y - 64, "a[6] = 86 < 94 → go right", acc);
        if (!(await sleep(750, isCancelled))) return;

        for (let i = 0; i <= 6; i++) {
          cells[i].g.style.transition = "opacity .4s";
          cells[i].g.style.opacity = "0.22";
        }
        place(loT, cx(7), Y + H + 40, 0.4);
        loT.textContent = "lo = 7";
        await sleep(450, isCancelled);
      },
    },
    {
      cap: `Probe 2: range shrunk to indices 7–9. The formula recomputes → <b>7.47 → 7</b>. And a[7] = <b>94 — hit in two probes</b>. Binary needed three here.`,
      run: async () => {
        numLine.textContent = "pos = 7 + (94−86)·2 ÷ (120−86) = 7.47 → 7";
        place(needle, cx(7), 214, 0.7);
        S.slide();
        if (!(await sleep(800, isCancelled))) return;

        pulseEl(cells[7].r);
        S.tick(7);
        if (!(await sleep(300, isCancelled))) return;

        flashRect(stage, X0 + 7 * CW + 2, Y, CW - 4, H, "#7adf8e");
        cells[7].r.setAttribute("stroke", "#7adf8e");
        S.chime();
        floatTxt(
          stage,
          cx(7),
          Y - 64,
          "94 = 94 ✓ FOUND — 2 probes",
          "#7adf8e",
          16
        );
        await sleep(750, isCancelled);
      },
    },
    {
      cap: `The catch: the guess is only good when values are <b>evenly spread</b>. Clustered or skewed data makes interpolation degenerate to <code>O(n)</code> — worse than binary's guarantee.`,
      run: async () => {
        numLine.textContent = "skewed data → bad guesses → O(n) worst case";
        numLine.setAttribute("fill", "#ff7b6b");
        S.down(1);
        pulseEl(ban);
        await sleep(700, isCancelled);
      },
    },
    {
      cap: `Cost: <code>O(log log n)</code> average on uniform data — asymptotically faster than binary — with <code>O(n)</code> worst case. Speed bought with an assumption.`,
      chips: ["AVG O(log log n)", "WORST O(n)", "SORTED + UNIFORM VALUES"],
      run: async () => {
        S.chime();
        await sleep(300, isCancelled);
      },
    },
    {
      cap: `Recap — <b>Interpolation search</b>: binary's safe default loses to it on large, uniform datasets (IDs, timestamps, dictionaries). When in doubt, binary.`,
      run: async () => {
        S.chime();
        await sleep(300, isCancelled);
      },
    },
  ];

  return { steps };
}

/* ================= 5 · EXPONENTIAL SEARCH ================= */
function buildExp(
  stage: SVGSVGElement,
  acc: string,
  isCancelled: () => boolean
) {
  const vals = [4, 9, 15, 22, 28, 36, 41, 49, 58, 64, 72, 81, 88, 95, 103, 111];
  const X0 = 34,
    CW = 52,
    H = 54,
    Y = 226;
  const cells = row(stage, vals, X0, Y, CW, H, { size: 14 });
  cells.forEach((c) => (c.g.style.opacity = "0"));

  const tb = targetBadge(stage, 40, 44, 88, acc);
  tb.g.style.opacity = "0";

  const note = txt(
    866,
    60,
    "size unknown ⋯",
    { size: 13, fill: "#8fa0bf", mono: true, anchor: "end", opacity: 0 },
    stage
  );

  const jmp = svgEl("g", {}, stage);
  svgEl("polygon", { points: "0,0 -9,-14 9,-14", fill: acc }, jmp);
  svgEl(
    "line",
    { x1: 0, y1: -14, x2: 0, y2: -28, stroke: acc, "stroke-width": 2 },
    jmp
  );
  place(jmp, X0 + CW / 2, Y - 24);
  jmp.style.opacity = "0";

  const win = svgEl(
    "rect",
    {
      x: X0 + 8 * CW - 3,
      y: Y - 8,
      width: 8 * CW + 6,
      height: H + 16,
      rx: 9,
      fill: "none",
      stroke: acc,
      "stroke-dasharray": "6 5",
      "stroke-width": 2,
      opacity: 0,
    },
    stage
  );

  const winLbl = txt(
    X0 + 12 * CW,
    Y + H + 34,
    "search window [8, 15]",
    { size: 12, fill: acc, mono: true, opacity: 0 },
    stage
  );

  const cx = (i: number) => X0 + i * CW + CW / 2;

  async function hop(fromX: number, toX: number, label: string) {
    if (isCancelled()) return;
    const m = jmp.style.transform.match(
      /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/
    );
    const startX = m ? +m[1] : fromX;
    S.hop(Math.round(toX / 50));
    await hopTo(jmp, startX, Y - 24, toX, Y - 24, 0.5, 58, isCancelled);
    if (isCancelled()) return;
    S.thud();
    floatTxt(stage, toX, Y - 84, label, acc, 13);
    await sleep(650, isCancelled);
  }

  async function probe(i: number) {
    if (isCancelled()) return;
    place(jmp, cx(i), Y - 24, 0.4);
    S.jump();
    if (!(await sleep(450, isCancelled))) return;
    pulseEl(cells[i].r);
  }

  const steps: StepDef[] = [
    {
      cap: `Exponential search solves a problem binary cannot: <b>you don't know how big the data is</b> — an unbounded stream, a live log, an infinite sequence. So you find the boundary first.`,
      run: async () => {
        for (let i = 0; i < 16; i++) {
          if (isCancelled()) return;
          cells[i].g.style.transition = "opacity .2s";
          cells[i].g.style.opacity = "1";
          if (!(await sleep(22, isCancelled))) return;
        }
        tb.g.style.transition = "opacity .4s";
        tb.g.style.opacity = "1";
        note.style.transition = "opacity .4s";
        note.style.opacity = "1";
        S.pluck(0);
        await sleep(400, isCancelled);
      },
    },
    {
      cap: `Phase 1 — <b>double the reach</b>: probe index 1, then 2, 4, 8… Each hop costs one comparison and covers twice the ground. Stop the moment you overshoot the target.`,
      run: async () => {
        jmp.style.opacity = "1";
        await hop(cx(0), cx(1), "i=1 · 9 < 88");
        await hop(cx(1), cx(2), "i=2 · 15 < 88");
        await hop(cx(2), cx(4), "i=4 · 28 < 88");
        await hop(cx(4), cx(8), "i=8 · 58 < 88");
        if (isCancelled()) return;
        S.hop(6);
        const m = jmp.style.transform.match(
          /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/
        );
        const curX = m ? +m[1] : cx(8);
        await hopTo(jmp, curX, Y - 24, 886, Y - 24, 0.5, 64, isCancelled);
        if (isCancelled()) return;
        floatTxt(stage, 812, Y - 84, "i=16 → past the end!", "#ff7b6b", 13);
        S.down(1);
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Overshot at 16, last safe probe was 8 — so the target must live in <b>[8, 15]</b>. The exponential phase found a finite window in only <code>log₂</code> hops.`,
      run: async () => {
        win.style.transition = "opacity .5s";
        win.style.opacity = "1";
        winLbl.style.transition = "opacity .5s";
        winLbl.style.opacity = "1";
        S.pluck(2);
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Phase 2 — ordinary <b>binary search inside the window</b>. a[11] = 81 &lt; 88 → left part out. a[13] = 95 &gt; 88 → right part out.`,
      run: async () => {
        await probe(11);
        floatTxt(stage, cx(11), Y - 84, "81 < 88 → lo = 12", acc);
        for (let i = 8; i <= 11; i++) {
          cells[i].g.style.transition = "opacity .4s";
          cells[i].g.style.opacity = "0.2";
        }
        if (!(await sleep(700, isCancelled))) return;

        await probe(13);
        floatTxt(stage, cx(13), Y - 84, "95 > 88 → hi = 12", acc);
        for (let i = 13; i <= 15; i++) {
          cells[i].g.style.transition = "opacity .4s";
          cells[i].g.style.opacity = "0.2";
        }
        await sleep(700, isCancelled);
      },
    },
    {
      cap: `Final probe: a[12] = <b>88 — found</b>. Five doubling hops, three binary probes. Total cost <code>O(log i)</code> — it depends on <b>where</b> the target sits, not on how large the data is.`,
      run: async () => {
        await probe(12);
        flashRect(stage, X0 + 12 * CW + 2, Y, CW - 4, H, "#7adf8e");
        cells[12].r.setAttribute("stroke", "#7adf8e");
        S.chime();
        floatTxt(stage, cx(12), Y - 84, "88 = 88 ✓ FOUND", "#7adf8e", 15);
        await sleep(750, isCancelled);
      },
    },
    {
      cap: `Recap — <b>Exponential search</b>: the tool for unbounded or huge sorted data, and it's fastest when the target sits near the front. Doubling finds the fence; binary finds the needle.`,
      chips: [
        "O(log i)",
        "UNBOUNDED / STREAMING DATA",
        "FAST WHEN TARGET IS NEAR",
        "DOUBLING + BINARY",
      ],
      run: async () => {
        S.chime();
        await sleep(300, isCancelled);
      },
    },
  ];

  return { steps };
}

/* ================= CONFIG MAP ================= */
const CONFIGS: Record<SearchAlgorithm, AlgorithmConfig> = {
  linear: {
    id: "linear",
    name: "Linear Search",
    title: "Linear Search Simulator",
    kicker: "LESSON 06.1 · THE HONEST SCAN",
    complexity: "O(n)",
    tag: "LESSON 06.1 · LINEAR SEARCH",
    notesTag: "LINEAR SEARCH",
    color: "#f5c04e",
    intro:
      "Lesson 06·1 — <b>Linear search</b>. The honest scan: check each element, one by one. Press <b>▶ PLAY ALL</b>, or step with <b>STEP ▸</b>.",
    icon: Search,
    build: buildLinear,
  },
  binary: {
    id: "binary",
    name: "Binary Search",
    title: "Binary Search Simulator",
    kicker: "LESSON 06.2 · GEOMETRIC HALVING",
    complexity: "O(log n)",
    tag: "LESSON 06.2 · BINARY SEARCH",
    notesTag: "BINARY SEARCH",
    color: "#45d6c4",
    intro:
      "Lesson 06·2 — <b>Binary search</b>. Sorted data lets you destroy half the suspects per probe. Press <b>▶ PLAY ALL</b>.",
    icon: Split,
    build: buildBinary,
  },
  jump: {
    id: "jump",
    name: "Jump Search",
    title: "Jump Search Simulator",
    kicker: "LESSON 06.3 · SQUARE-ROOT LEAPS",
    complexity: "O(√n)",
    tag: "LESSON 06.3 · JUMP SEARCH",
    notesTag: "JUMP SEARCH",
    color: "#ff7b6b",
    intro:
      "Lesson 06·3 — <b>Jump search</b>. Leap in √n-sized blocks, then scan the last one. Press <b>▶ PLAY ALL</b>.",
    icon: CornerDownRight,
    build: buildJump,
  },
  interpolation: {
    id: "interpolation",
    name: "Interpolation Search",
    title: "Interpolation Search Simulator",
    kicker: "LESSON 06.4 · VALUE GUESSING",
    complexity: "O(log log n)",
    tag: "LESSON 06.4 · INTERPOLATION",
    notesTag: "INTERPOLATION",
    color: "#7adf8e",
    intro:
      "Lesson 06·4 — <b>Interpolation search</b>. Guess where the value lives, like thumbing a phone book. Press <b>▶ PLAY ALL</b>.",
    icon: Gauge,
    build: buildInterp,
  },
  exponential: {
    id: "exponential",
    name: "Exponential Search",
    title: "Exponential Search Simulator",
    kicker: "LESSON 06.5 · UNBOUNDED STREAM",
    complexity: "O(log i)",
    tag: "LESSON 06.5 · EXPONENTIAL",
    notesTag: "EXPONENTIAL",
    color: "#a08bff",
    intro:
      "Lesson 06·5 — <b>Exponential search</b>. Double your reach until you overshoot, then binary-search the window. Press <b>▶ PLAY ALL</b>.",
    icon: Activity,
    build: buildExp,
  },
};

/* ================= BASE COMPONENT ================= */
interface SimulatorProps {
  algorithm: SearchAlgorithm;
}

function BaseSearchSimulator({ algorithm }: SimulatorProps) {
  const config = CONFIGS[algorithm] || CONFIGS.linear;
  const stageRef = useRef<SVGSVGElement | null>(null);

  const [beat, setBeat] = useState<number>(0);
  const [caption, setCaption] = useState<string>(config.intro);
  const [chips, setChips] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(() => isSoundEnabled());

  const epochRef = useRef<number>(0);
  const beatRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const isBusyRef = useRef<boolean>(false);
  const stepsRef = useRef<StepDef[]>([]);

  // Keep isPlayingRef in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Audio subscribe
  useEffect(() => {
    return subscribeSound((enabled) => setSoundOn(enabled));
  }, []);

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) {
      S.pluck(2);
    }
  };

  // Re-initialize stage
  const resetStage = useCallback(() => {
    epochRef.current++;
    beatRef.current = 0;
    setBeat(0);
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsBusy(false);
    isBusyRef.current = false;
    setCaption(config.intro);
    setChips([]);

    const stage = stageRef.current;
    if (!stage) return;

    // Clear SVG stage
    while (stage.firstChild) {
      stage.removeChild(stage.firstChild);
    }

    const currentEpoch = epochRef.current;
    const isCancelled = () => epochRef.current !== currentEpoch;

    // Background rect + subtle grid defs
    const defs = svgEl("defs", {}, stage);
    const pattern = svgEl(
      "pattern",
      {
        id: `grid-${algorithm}`,
        width: 30,
        height: 30,
        patternUnits: "userSpaceOnUse",
      },
      defs
    );
    svgEl(
      "path",
      {
        d: "M 30 0 L 0 0 0 30",
        fill: "none",
        stroke: "rgba(140, 170, 230, 0.06)",
        "stroke-width": 1,
      },
      pattern
    );

    const styleEl = svgEl("style", {}, defs);
    styleEl.textContent = `
      .popin { animation: popin .45s cubic-bezier(.3,1.5,.4,1) both; transform-box: fill-box; transform-origin: center; }
      @keyframes popin { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: scale(1); } }

      .pulse { animation: pul .6s ease; transform-box: fill-box; transform-origin: center; }
      @keyframes pul { 0% { transform: scale(1); } 35% { transform: scale(1.18); } 100% { transform: scale(1); } }

      .flash { animation: flashA .8s ease forwards; }
      @keyframes flashA { from { opacity: .6; } to { opacity: 0; } }

      .floattxt { animation: rise 1.25s ease forwards; }
      @keyframes rise { 0% { opacity: 0; transform: translateY(8px); } 18% { opacity: 1; } 100% { opacity: 0; transform: translateY(-28px); } }
    `;

    svgEl("rect", { width: 900, height: 470, fill: "#0b1120", rx: 8 }, stage);
    svgEl(
      "rect",
      { width: 900, height: 470, fill: `url(#grid-${algorithm})`, rx: 8 },
      stage
    );

    // Call build
    const built = config.build(stage, config.color, isCancelled);
    stepsRef.current = built.steps;
  }, [algorithm, config]);

  // Initialize on mount or algorithm change
  useEffect(() => {
    resetStage();
    return () => {
      epochRef.current++;
    };
  }, [resetStage]);

  // Execute a single step
  const executeStep = useCallback(async (): Promise<boolean> => {
    const steps = stepsRef.current;
    const idx = beatRef.current;
    if (!steps || idx >= steps.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      return false;
    }

    const currentEpoch = epochRef.current;
    const isCancelled = () => epochRef.current !== currentEpoch;

    const nextBeat = idx + 1;
    beatRef.current = nextBeat;
    setBeat(nextBeat);

    const step = steps[idx];
    setIsBusy(true);
    isBusyRef.current = true;
    setCaption(step.cap);
    if (step.chips) setChips(step.chips);

    try {
      await step.run(isCancelled);
    } catch {
      // ignore
    } finally {
      if (!isCancelled()) {
        setIsBusy(false);
        isBusyRef.current = false;
      }
    }

    if (!isCancelled()) {
      return beatRef.current < steps.length;
    }
    return false;
  }, []);

  const handleStep = async () => {
    if (isBusyRef.current || beatRef.current >= stepsRef.current.length) return;
    setIsPlaying(false);
    isPlayingRef.current = false;
    await executeStep();
  };

  const handleReset = () => {
    resetStage();
  };

  const handlePlayAll = async () => {
    if (isPlayingRef.current) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    if (isBusyRef.current) return;

    // If completed, reset and restart
    if (beatRef.current >= stepsRef.current.length) {
      resetStage();
      // wait a tick for reset
      await new Promise((r) => setTimeout(r, 60));
    }

    setIsPlaying(true);
    isPlayingRef.current = true;

    const currentEpoch = epochRef.current;
    const isCancelled = () =>
      epochRef.current !== currentEpoch || !isPlayingRef.current;

    while (beatRef.current < stepsRef.current.length && !isCancelled()) {
      const hasNext = await executeStep();
      if (!hasNext || isCancelled()) break;
      await sleep(700, isCancelled);
    }

    if (epochRef.current === currentEpoch) {
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  };

  const Icon = config.icon;

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card/50 shadow-sm text-fd-foreground">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-fd-border bg-fd-secondary/30 px-4 py-3 md:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-fd-border bg-fd-secondary/60 text-fd-foreground">
            <Icon className="h-5 w-5" style={{ color: config.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-wider uppercase text-fd-muted-foreground">
                {config.kicker}
              </span>
              <span
                className="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide uppercase"
                style={{
                  backgroundColor: `${config.color}20`,
                  color: config.color,
                }}
              >
                {config.complexity}
              </span>
            </div>
            <h3 className="m-0 text-base font-semibold leading-tight text-fd-foreground">
              {config.title}
            </h3>
          </div>
        </div>

        <button
          onClick={handleToggleSound}
          type="button"
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-medium transition-colors cursor-pointer ${
            soundOn
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              : "border-fd-border bg-fd-secondary/50 text-fd-muted-foreground hover:bg-fd-secondary"
          }`}
          title="Toggle Web Audio sound synthesizer"
        >
          {soundOn ? (
            <Volume2 className="h-3.5 w-3.5" />
          ) : (
            <VolumeX className="h-3.5 w-3.5" />
          )}
          <span>{soundOn ? "◉ SOUND ON" : "○ SOUND OFF"}</span>
        </button>
      </div>

      {/* Main Grid: Stage (left) + Notes (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] divide-y lg:divide-y-0 lg:divide-x divide-fd-border">
        {/* Stage Field */}
        <div className="flex flex-col bg-slate-950/80">
          <div className="flex items-center justify-between border-b border-fd-border/50 px-4 py-2 font-mono text-[11px] tracking-wider text-fd-muted-foreground">
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              VISUAL FIELD
            </span>
            <span>{config.tag}</span>
          </div>

          <div className="relative w-full aspect-[900/470] overflow-hidden bg-[#0b1120]">
            <svg
              ref={stageRef}
              viewBox="0 0 900 470"
              className="h-full w-full select-none"
            />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-2 border-t border-fd-border bg-fd-secondary/20 p-3 md:px-4">
            <button
              onClick={handleReset}
              disabled={isBusy}
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-fd-border bg-fd-secondary/60 px-3 py-1.5 font-mono text-xs font-semibold text-fd-foreground hover:border-fd-foreground/40 hover:bg-fd-secondary disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              RESET
            </button>
            <button
              onClick={handleStep}
              disabled={isBusy || beat >= stepsRef.current.length}
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-fd-border bg-fd-secondary/60 px-3 py-1.5 font-mono text-xs font-semibold text-fd-foreground hover:border-fd-foreground/40 hover:bg-fd-secondary disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
              STEP ▸
            </button>
            <button
              onClick={handlePlayAll}
              type="button"
              className="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-mono text-xs font-semibold text-slate-950 transition shadow-sm hover:brightness-110 cursor-pointer"
              style={{ backgroundColor: config.color }}
            >
              {isPlaying ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  PAUSE
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  PLAY ALL
                </>
              )}
            </button>
            <span className="ml-auto font-mono text-xs tracking-wider text-fd-muted-foreground font-semibold">
              BEAT {beat} / 6
            </span>
          </div>
        </div>

        {/* Notes Panel */}
        <div className="flex flex-col justify-between bg-fd-card/30 p-4 md:p-5">
          <div>
            <div className="flex items-center justify-between border-b border-fd-border/50 pb-2.5 font-mono text-[10px] tracking-widest uppercase text-fd-muted-foreground">
              <span>LECTURE NOTES</span>
              <span>{config.notesTag}</span>
            </div>

            {/* Caption */}
            <div
              className="mt-3.5 text-sm leading-relaxed text-fd-foreground/90 font-normal min-h-[140px] [&_b]:text-fd-foreground [&_b]:font-semibold [&_code]:font-mono [&_code]:text-xs [&_code]:rounded [&_code]:bg-fd-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:border [&_code]:border-fd-border"
              dangerouslySetInnerHTML={{ __html: caption }}
            />

            {/* Chips */}
            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {chips.map((chip, i) => (
                  <span
                    key={i}
                    className="rounded border px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide"
                    style={{
                      borderColor: `${config.color}50`,
                      color: config.color,
                      backgroundColor: `${config.color}15`,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Diamond Beat Progress Dots */}
          <div className="mt-6 pt-3 border-t border-fd-border/40 flex items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase text-fd-muted-foreground tracking-wider mr-1">
              Progress:
            </span>
            {[1, 2, 3, 4, 5, 6].map((b) => {
              const isDone = b < beat;
              const isCur = b === beat;
              return (
                <div
                  key={b}
                  className={`h-2.5 w-2.5 rotate-45 border transition-all duration-300 ${
                    isDone
                      ? "border-transparent"
                      : isCur
                        ? "ring-2 scale-110"
                        : "border-fd-muted-foreground/30 bg-transparent"
                  }`}
                  style={{
                    backgroundColor:
                      isDone || isCur ? config.color : "transparent",
                    borderColor: isCur ? config.color : undefined,
                    boxShadow: isCur ? `0 0 8px ${config.color}80` : undefined,
                  }}
                  title={`Beat ${b}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= 5 STANDALONE WRAPPERS ================= */
export function LinearSearchSimulator() {
  return <BaseSearchSimulator algorithm="linear" />;
}

export function BinarySearchSimulator() {
  return <BaseSearchSimulator algorithm="binary" />;
}

export function JumpSearchSimulator() {
  return <BaseSearchSimulator algorithm="jump" />;
}

export function InterpolationSearchSimulator() {
  return <BaseSearchSimulator algorithm="interpolation" />;
}

export function ExponentialSearchSimulator() {
  return <BaseSearchSimulator algorithm="exponential" />;
}

/* ================= UNIFIED SEARCH SIMULATOR ================= */
export interface SearchSimulatorProps {
  algorithm?: SearchAlgorithm;
}

export function SearchSimulator({
  algorithm = "linear",
}: SearchSimulatorProps) {
  return <BaseSearchSimulator algorithm={algorithm} />;
}

export const SearchingSimulator = SearchSimulator;

export default SearchSimulator;
