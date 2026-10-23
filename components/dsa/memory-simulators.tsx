"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutGrid,
  GitCommit,
  Layers,
  ArrowRightLeft,
  Workflow,
  Hash,
  RotateCcw,
  ChevronRight,
  Play,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { S, isSoundEnabled, toggleSound, subscribeSound } from "./audio";

export type MemoryStructure =
  "array" | "list" | "stack" | "queue" | "heap" | "hash";

interface StepDef {
  cap: string;
  chips?: string[];
  run: (isCancelled: () => boolean) => Promise<void>;
}

interface StructureConfig {
  id: MemoryStructure;
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

function drawIn(path: SVGPathElement, dur = 0.45, delay = 0) {
  try {
    const L = path.getTotalLength();
    path.style.strokeDasharray = String(L);
    path.style.strokeDashoffset = String(L);
    path.getBoundingClientRect();
    path.style.transition = `stroke-dashoffset ${dur}s ease ${delay}s`;
    path.style.strokeDashoffset = "0";
  } catch {}
}

function arrowPath(x1: number, y1: number, x2: number, y2: number, bow = 0) {
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2;
  const dx = x2 - x1,
    dy = y2 - y1;
  const l = Math.hypot(dx, dy) || 1;
  return `M${x1} ${y1} Q${mx - (dy / l) * bow} ${my + (dx / l) * bow} ${x2} ${y2}`;
}

function marker(stage: SVGElement, color: string, id = "arw") {
  const d = svgEl("defs", {}, stage);
  const m = svgEl(
    "marker",
    {
      id,
      viewBox: "0 0 10 10",
      refX: 8,
      refY: 5,
      markerWidth: 7,
      markerHeight: 7,
      orient: "auto-start-reverse",
    },
    d
  );
  svgEl("path", { d: "M0 0L10 5L0 10z", fill: color }, m);
}

function flashRect(
  stage: SVGElement,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  parent?: SVGElement
) {
  const r = svgEl(
    "rect",
    {
      x,
      y,
      width: w,
      height: h,
      fill: color,
      rx: 4,
      class: "flash",
    },
    parent || stage
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
  }, 1250);
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
    { size: 40, fill: color, mono: true, weight: 700, opacity: 0.95 },
    g
  );
  t.classList.add("popin");
  S.thud();
  return g;
}

const sleep = (ms: number, isCancelled: () => boolean) =>
  new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(!isCancelled());
    }, ms);
  });

/* ================= LESSON 1 · ARRAY MEMORY ================= */
function buildArray(
  stage: SVGSVGElement,
  acc: string,
  isCancelled: () => boolean
) {
  marker(stage, acc);
  const CW = 80,
    X0 = 90,
    Y = 196,
    H = 64,
    N0 = 8;
  const vals = [12, 4, 9, 33, 7, 21, 5, 18];

  const strip = svgEl(
    "rect",
    {
      x: X0,
      y: Y,
      width: N0 * CW,
      height: H,
      fill: "#152036",
      stroke: "#31446e",
      opacity: 0,
      rx: 6,
    },
    stage
  );

  const dividers: SVGLineElement[] = [];
  for (let i = 1; i < N0; i++) {
    const l = svgEl(
      "line",
      {
        x1: X0 + i * CW,
        y1: Y,
        x2: X0 + i * CW,
        y2: Y + H,
        stroke: "#31446e",
        "stroke-width": 1.5,
        opacity: 0,
      },
      stage
    );
    dividers.push(l);
  }

  const vg: { g: SVGGElement; t: SVGTextElement }[] = [];
  for (let i = 0; i < N0; i++) {
    const g = svgEl("g", {}, stage);
    place(g, X0 + i * CW + CW / 2, Y + H / 2 + 7);
    const t = txt(
      0,
      0,
      String(vals[i]),
      { size: 21, weight: 600, fill: "#e7edfb", mono: true },
      g
    );
    g.style.opacity = "0";
    vg.push({ g, t });
  }

  const addrs: SVGTextElement[] = [];
  for (let i = 0; i < N0; i++) {
    const a = txt(
      X0 + i * CW + CW / 2,
      Y + H + 24,
      "0x" + (0x100 + i * 8).toString(16).toUpperCase(),
      { size: 11, fill: "#5d6d8f", mono: true, opacity: 0 },
      stage
    );
    addrs.push(a);
  }

  const banner = svgEl("g", {}, stage);
  banner.style.opacity = "0";
  svgEl(
    "rect",
    {
      x: 238,
      y: 44,
      width: 424,
      height: 42,
      rx: 6,
      fill: "#12203a",
      stroke: "#31446e",
    },
    banner
  );
  txt(
    450,
    71,
    "addr(i) = base + i × size = 0x100 + i × 8",
    { size: 15, fill: acc, mono: true, weight: 600 },
    banner
  );

  const ptr = svgEl("g", {}, stage);
  ptr.style.opacity = "0";
  svgEl("polygon", { points: "0,0 -11,-16 11,-16", fill: acc }, ptr);
  const ptrLbl = txt(
    0,
    -30,
    "i = 0",
    { size: 14, fill: acc, mono: true, weight: 600 },
    ptr
  );
  place(ptr, X0 + CW / 2, Y - 24);

  let nCells = N0;

  const steps: StepDef[] = [
    {
      cap: `An array is one <b>unbroken block of memory</b>. Every cell is the same size and sits flush against its neighbour — that “contiguous” part is the whole trick.`,
      run: async () => {
        strip.style.transition = "opacity .5s";
        strip.style.opacity = "1";
        S.slide();
        if (!(await sleep(300, isCancelled))) return;

        dividers.forEach((l, i) => {
          l.style.transition = `opacity .3s ${i * 0.05}s`;
          l.style.opacity = "1";
        });

        for (let i = 0; i < N0; i++) {
          if (isCancelled()) return;
          const v = vg[i];
          place(v.g, X0 + i * CW + CW / 2, Y + H / 2 + 7 - 26);
          v.g.style.transition =
            "opacity .3s, transform .4s cubic-bezier(.3,1.4,.4,1)";
          v.g.style.opacity = "1";
          place(
            v.g,
            X0 + i * CW + CW / 2,
            Y + H / 2 + 7,
            0.4,
            "cubic-bezier(.3,1.4,.4,1)"
          );
          S.tick(i);
          if (!(await sleep(70, isCancelled))) return;
        }
        await sleep(200, isCancelled);
      },
    },
    {
      cap: `Identical cells mean addresses are pure arithmetic: <code>addr(i) = base + i × size</code>. No searching, no lookup table — one multiply, one add.`,
      run: async () => {
        for (let i = 0; i < N0; i++) {
          if (isCancelled()) return;
          addrs[i].style.transition = `opacity .35s ${i * 0.06}s`;
          addrs[i].style.opacity = "1";
          S.tick(i);
          if (!(await sleep(50, isCancelled))) return;
        }
        flashRect(stage, X0, Y, CW, H, acc);
        S.pluck(2);
        banner.style.transition = "opacity .45s, transform .45s";
        banner.style.transform = "translateY(-8px)";
        banner.style.opacity = "1";
        await sleep(500, isCancelled);
      },
    },
    {
      cap: `Random access: to read index 5, the machine computes the address and jumps <b>straight there</b>. Index 5 or index 5 000 000 — same single step. That is <code>O(1)</code>.`,
      run: async () => {
        ptrLbl.textContent = "i = 5";
        ptr.style.transition = "opacity .25s";
        ptr.style.opacity = "1";
        if (!(await sleep(250, isCancelled))) return;

        S.jump();
        place(
          ptr,
          X0 + 5 * CW + CW / 2,
          Y - 24,
          0.35,
          "cubic-bezier(.2,.9,.3,1)"
        );
        if (!(await sleep(380, isCancelled))) return;

        flashRect(stage, X0 + 5 * CW, Y, CW, H, acc);
        S.chime();
        floatTxt(stage, X0 + 5 * CW + CW / 2, Y - 58, "O(1) READ", acc);
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Appending is just as cheap — if there is free room after the block, the array simply <b>continues the row</b>. One write, <code>O(1)</code>.`,
      run: async () => {
        const i = nCells;
        const r = svgEl(
          "rect",
          {
            x: X0 + i * CW,
            y: Y,
            width: CW,
            height: H,
            fill: "#152036",
            stroke: "#31446e",
            opacity: 0,
            rx: 6,
          },
          stage
        );
        r.style.transition = "opacity .4s";
        r.style.opacity = "1";
        S.slide();
        if (!(await sleep(300, isCancelled))) return;

        const a = txt(
          X0 + i * CW + CW / 2,
          Y + H + 24,
          "0x140",
          { size: 11, fill: "#5d6d8f", mono: true, opacity: 0 },
          stage
        );
        a.style.transition = "opacity .3s";
        a.style.opacity = "1";

        const g = svgEl("g", {}, stage);
        place(g, X0 + i * CW + CW / 2, Y - 20);
        txt(0, 0, "50", { size: 21, weight: 600, fill: acc, mono: true }, g);
        g.style.transition =
          "transform .5s cubic-bezier(.3,1.2,.4,1), opacity .2s";
        g.style.opacity = "1";
        place(
          g,
          X0 + i * CW + CW / 2,
          Y + H / 2 + 7,
          0.5,
          "cubic-bezier(.3,1.2,.4,1)"
        );

        S.pop();
        ptrLbl.textContent = "i = 8";
        place(ptr, X0 + i * CW + CW / 2, Y - 24, 0.4);
        floatTxt(stage, X0 + i * CW + CW / 2, Y - 58, "O(1) APPEND", acc);
        nCells++;
        await sleep(650, isCancelled);
      },
    },
    {
      cap: `Inserting in the middle is the bill: to free index 2, <b>every later value shuffles one cell right</b> — <code>O(n)</code> work, and with no spare cell, the tail falls off. Growing the block means copying all of it.`,
      run: async () => {
        ptrLbl.textContent = "i = 2";
        place(ptr, X0 + 2 * CW + CW / 2, Y - 24, 0.35);
        S.jump();
        if (!(await sleep(400, isCancelled))) return;

        floatTxt(stage, X0 + 2 * CW + CW / 2, Y - 58, "insert(2, 77)", acc);
        if (!(await sleep(500, isCancelled))) return;

        for (let i = vg.length - 1; i >= 2; i--) {
          const v = vg[i];
          v.g.style.transition = `transform .55s cubic-bezier(.3,.8,.3,1) ${(vg.length - 1 - i) * 0.07}s, opacity .5s ${(vg.length - 1 - i) * 0.07}s`;
          place(v.g, X0 + (i + 1) * CW + CW / 2, Y + H / 2 + 7);
          if (i >= nCells - 1) v.g.style.opacity = "0";
          S.tick(vg.length - 1 - i);
        }
        if (!(await sleep(1150, isCancelled))) return;

        const g = svgEl("g", {}, stage);
        place(g, X0 + 2 * CW + CW / 2, Y - 30);
        txt(0, 0, "77", { size: 21, weight: 700, fill: acc, mono: true }, g);
        g.style.transition =
          "transform .4s cubic-bezier(.3,1.1,.4,1), opacity .15s";
        g.style.opacity = "1";
        place(
          g,
          X0 + 2 * CW + CW / 2,
          Y + H / 2 + 7,
          0.4,
          "cubic-bezier(.3,1.1,.4,1)"
        );
        vg.splice(2, 0, { g, t: g.firstChild as SVGTextElement });
        S.thud();
        flashRect(stage, X0 + 2 * CW, Y, CW, H, acc);
        await sleep(500, isCancelled);
      },
    },
    {
      cap: `Recap — <b>Array</b>: instant reads by index, cheap appends, expensive middle inserts. Choose it when access-by-index matters more than reshaping.<span class="text-xs text-fd-muted-foreground block mt-2">*append is amortized O(1): occasionally the block must grow and copy everything.</span>`,
      chips: ["READ O(1)", "APPEND O(1)*", "INSERT O(n)"],
      run: async () => {
        S.chime();
        flashRect(stage, X0, Y, nCells * CW, H, acc);
        await sleep(400, isCancelled);
      },
    },
  ];

  return { steps };
}

/* ================= LESSON 2 · LINKED LIST ================= */
function buildList(
  stage: SVGSVGElement,
  acc: string,
  isCancelled: () => boolean
) {
  marker(stage, acc);
  interface NodeDef {
    x: number;
    y: number;
    v: string;
    g?: SVGGElement;
    box?: SVGRectElement;
  }
  const nodes: NodeDef[] = [
    { x: 70, y: 84, v: "3" },
    { x: 300, y: 58, v: "7" },
    { x: 520, y: 168, v: "2" },
    { x: 700, y: 84, v: "9" },
  ];

  function makeNode(n: NodeDef) {
    const g = svgEl("g", {}, stage);
    place(g, n.x, n.y);
    const box = svgEl(
      "rect",
      {
        width: 96,
        height: 44,
        rx: 8,
        fill: "#152036",
        stroke: "#31446e",
        "stroke-width": 1.5,
      },
      g
    );
    svgEl(
      "line",
      { x1: 58, y1: 6, x2: 58, y2: 38, stroke: "#31446e", "stroke-width": 1.5 },
      g
    );
    txt(29, 29, n.v, { size: 19, weight: 600, fill: "#e7edfb", mono: true }, g);
    svgEl("circle", { cx: 77, cy: 22, r: 5, fill: acc }, g);
    g.style.opacity = "0";
    n.g = g;
    n.box = box;
    return g;
  }

  nodes.forEach(makeNode);

  const nul = svgEl("g", {}, stage);
  place(nul, 826, 96);
  svgEl(
    "rect",
    {
      width: 44,
      height: 24,
      rx: 5,
      fill: "none",
      stroke: "#31446e",
      "stroke-dasharray": "4 3",
    },
    nul
  );
  txt(22, 16, "∅", { size: 14, fill: "#5d6d8f" }, nul);
  nul.style.opacity = "0";

  const badge = svgEl("g", {}, stage);
  svgEl("rect", { width: 64, height: 24, rx: 6, fill: acc }, badge);
  txt(
    32,
    16,
    "HEAD",
    { size: 12, fill: "#0b1120", mono: true, weight: 600 },
    badge
  );
  svgEl(
    "line",
    {
      x1: 32,
      y1: 24,
      x2: 32,
      y2: 42,
      stroke: acc,
      "stroke-width": 2,
      "marker-end": "url(#arw)",
    },
    badge
  );
  badge.style.opacity = "0";
  place(badge, nodes[0].x + 16, nodes[0].y - 52);

  const arrows: SVGPathElement[] = [];
  function addArrow(a: NodeDef, b: NodeDef, bow = 0, dur = 0.5) {
    const p = svgEl(
      "path",
      {
        d: arrowPath(a.x + 96, a.y + 22, b.x, b.y + 22, bow),
        fill: "none",
        stroke: acc,
        "stroke-width": 2.2,
        "marker-end": "url(#arw)",
      },
      stage
    );
    drawIn(p, dur);
    arrows.push(p);
    return p;
  }

  const ring = svgEl(
    "circle",
    { r: 36, fill: "none", stroke: acc, "stroke-width": 2.5, opacity: 0 },
    stage
  );
  place(ring, nodes[0].x + 48, nodes[0].y + 22);

  const hops = txt(
    868,
    44,
    "hops: 0",
    { size: 13, fill: "#5d6d8f", mono: true, anchor: "end" },
    stage
  );
  let nodeE: NodeDef | null = null;

  const steps: StepDef[] = [
    {
      cap: `A linked list scatters its nodes anywhere in memory. Each node carries two things: a <b>value</b>, and a <b>pointer</b> — the address of the next node.`,
      run: async () => {
        for (const n of nodes) {
          if (isCancelled()) return;
          if (n.g) {
            n.g.style.transition = "opacity .35s";
            n.g.style.opacity = "1";
            if (n.box) pulseEl(n.box);
            S.pop();
          }
          if (!(await sleep(280, isCancelled))) return;
        }
        await sleep(150, isCancelled);
      },
    },
    {
      cap: `You enter at <code>HEAD</code>. The chain of arrows is the only glue — there are no index numbers to compute here.`,
      run: async () => {
        badge.style.transition = "opacity .4s";
        badge.style.opacity = "1";
        S.pluck(0);
        if (!(await sleep(350, isCancelled))) return;

        addArrow(nodes[0], nodes[1], -14);
        S.pluck(1);
        if (!(await sleep(420, isCancelled))) return;

        addArrow(nodes[1], nodes[2], 18);
        S.pluck(2);
        if (!(await sleep(420, isCancelled))) return;

        addArrow(nodes[2], nodes[3], 14);
        S.pluck(3);
        if (!(await sleep(420, isCancelled))) return;

        const p = svgEl(
          "path",
          {
            d: arrowPath(796, 106, 824, 108, 0),
            fill: "none",
            stroke: acc,
            "stroke-width": 2.2,
            "marker-end": "url(#arw)",
          },
          stage
        );
        drawIn(p, 0.35);
        nul.style.transition = "opacity .4s";
        nul.style.opacity = "1";
        S.tick(4);
        await sleep(400, isCancelled);
      },
    },
    {
      cap: `Want element #4? You walk: head, hop, hop, hop. <b>k arrows = k hops</b>, so access by position is <code>O(n)</code> — no jumping allowed.`,
      run: async () => {
        ring.style.transition = "opacity .3s";
        ring.style.opacity = "1";
        S.tick(0);
        if (!(await sleep(350, isCancelled))) return;

        for (let i = 1; i < 4; i++) {
          if (isCancelled()) return;
          place(ring, nodes[i].x + 48, nodes[i].y + 22, 0.4);
          S.up(i);
          hops.textContent = "hops: " + i;
          if (!(await sleep(480, isCancelled))) return;
        }
        hops.setAttribute("fill", acc);
        floatTxt(stage, 450, 300, "4 hops to reach #4", acc);
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `But insertion is nearly free. Point the new node at the old head, then move the <code>HEAD</code> label over. <b>Two rewires, <code>O(1)</code> — nothing shifts.</b>`,
      run: async () => {
        nodeE = { x: 70, y: 300, v: "5" };
        makeNode(nodeE);
        if (nodeE.g) {
          nodeE.g.style.transition =
            "opacity .35s, transform .5s cubic-bezier(.3,1.2,.4,1)";
          place(nodeE.g, nodeE.x, nodeE.y + 24);
          nodeE.g.style.opacity = "1";
          place(nodeE.g, nodeE.x, nodeE.y, 0.5, "cubic-bezier(.3,1.2,.4,1)");
          S.pop();
        }
        if (!(await sleep(550, isCancelled))) return;

        const arrEA = svgEl(
          "path",
          {
            d: arrowPath(
              nodeE.x + 96,
              nodeE.y + 22,
              nodes[0].x,
              nodes[0].y + 22,
              -40
            ),
            fill: "none",
            stroke: acc,
            "stroke-width": 2.2,
            "marker-end": "url(#arw)",
          },
          stage
        );
        drawIn(arrEA, 0.5);
        S.pluck(4);
        if (!(await sleep(550, isCancelled))) return;

        place(badge, nodeE.x + 16, nodeE.y - 52, 0.5);
        S.pluck(5);
        floatTxt(stage, nodeE.x + 140, nodeE.y - 20, "HEAD moved — O(1)", acc);
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Deletion is the same trick reversed: rewire the previous node's pointer <b>past</b> the victim. The skipped node is orphaned, then freed.`,
      run: async () => {
        if (arrows[1]) {
          arrows[1].style.transition = "opacity .5s";
          arrows[1].style.opacity = "0";
        }
        if (!(await sleep(400, isCancelled))) return;

        const p = svgEl(
          "path",
          {
            d: arrowPath(
              nodes[0].x + 96,
              nodes[0].y + 22,
              nodes[2].x,
              nodes[2].y + 22,
              26
            ),
            fill: "none",
            stroke: acc,
            "stroke-width": 2.2,
            "marker-end": "url(#arw)",
          },
          stage
        );
        drawIn(p, 0.55);
        S.pluck(2);
        if (!(await sleep(600, isCancelled))) return;

        if (nodes[1].g) {
          nodes[1].g.style.transition = "opacity .6s, transform .6s";
          nodes[1].g.style.opacity = "0.15";
          place(nodes[1].g, nodes[1].x, nodes[1].y + 16, 0.6);
          S.down(2);
        }
        floatTxt(stage, nodes[1].x + 48, nodes[1].y - 8, "node freed", acc);
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Recap — <b>Linked List</b>: <code>O(1)</code> insert/remove where you already stand, <code>O(n)</code> to find anything. Built for collections that grow and shrink.`,
      chips: ["ACCESS O(n)", "INSERT O(1)", "DELETE O(1)"],
      run: async () => {
        S.chime();
        const allNodes = nodeE ? [nodeE, ...nodes] : nodes;
        allNodes.forEach((n, i) => {
          setTimeout(() => {
            if (n.box) pulseEl(n.box);
          }, i * 90);
        });
        await sleep(500, isCancelled);
      },
    },
  ];

  return { steps };
}

/* ================= LESSON 3 · STACK ================= */
function buildStack(
  stage: SVGSVGElement,
  acc: string,
  isCancelled: () => boolean
) {
  const cx = 320,
    BW = 150,
    BH = 52,
    baseY = 392;
  const shades = ["#ff9c86", "#ff7b6b", "#ff5f52", "#e8503f"];

  const plat = svgEl("g", {}, stage);
  plat.style.opacity = "0";
  svgEl(
    "rect",
    {
      x: cx - BW / 2 - 14,
      y: baseY,
      width: BW + 28,
      height: 13,
      rx: 3,
      fill: "#1c2a47",
      stroke: "#31446e",
    },
    plat
  );
  svgEl(
    "line",
    {
      x1: cx - BW / 2 - 2,
      y1: 120,
      x2: cx - BW / 2 - 2,
      y2: baseY,
      stroke: "#31446e",
      "stroke-dasharray": "3 6",
      opacity: 0.6,
    },
    plat
  );
  svgEl(
    "line",
    {
      x1: cx + BW / 2 + 2,
      y1: 120,
      x2: cx + BW / 2 + 2,
      y2: baseY,
      stroke: "#31446e",
      "stroke-dasharray": "3 6",
      opacity: 0.6,
    },
    plat
  );

  const top = svgEl("g", {}, stage);
  svgEl("polygon", { points: "0,0 16,-10 16,10", fill: acc }, top);
  txt(52, 5, "TOP", { size: 14, fill: acc, mono: true, weight: 600 }, top);
  top.style.opacity = "0";
  place(top, cx + BW / 2 + 16, baseY - 26);

  interface BlockDef {
    g: SVGGElement;
    letter: string;
    y: number;
  }
  const blocks: BlockDef[] = [];

  function pushBlock(letter: string, k: number) {
    const g = svgEl("g", {}, stage);
    svgEl(
      "rect",
      {
        x: -BW / 2,
        y: -BH,
        width: BW,
        height: BH,
        rx: 7,
        fill: shades[k % 4],
        stroke: "rgba(0,0,0,.25)",
        "stroke-width": 1.5,
      },
      g
    );
    txt(
      0,
      -BH / 2 + 7,
      letter,
      { size: 20, weight: 700, fill: "#2a0e08", mono: true },
      g
    );
    place(g, cx, 120);
    g.style.opacity = "0";
    g.style.transition =
      "transform .5s cubic-bezier(.35,.9,.35,1), opacity .15s";
    g.style.opacity = "1";
    const y = baseY - BH * (k + 1);
    place(g, cx, y, 0.5, "cubic-bezier(.35,.9,.35,1)");
    blocks.push({ g, letter, y });
    return g;
  }

  function popBlock() {
    const b = blocks.pop();
    if (!b) return "";
    b.g.style.transition =
      "transform .55s cubic-bezier(.4,.2,.7,.4), opacity .55s";
    place(
      b.g,
      cx + 280,
      blocks.length ? blocks[blocks.length - 1].y - BH - 140 : baseY - BH - 160,
      0.55,
      "ease-in"
    );
    b.g.style.opacity = "0";
    setTimeout(() => {
      try {
        b.g.remove();
      } catch {}
    }, 600);
    return b.letter;
  }

  const steps: StepDef[] = [
    {
      cap: `A stack is a pile with one rule: you may only touch the <b>top</b>. Think plates on a spring loader.`,
      run: async () => {
        plat.style.transition = "opacity .5s";
        plat.style.opacity = "1";
        S.slide();
        await sleep(500, isCancelled);
      },
    },
    {
      cap: `<code>push A</code>, <code>push B</code>, <code>push C</code> — each new item lands on top, and <code>TOP</code> always tracks the newest arrival.`,
      run: async () => {
        const letters = ["A", "B", "C"];
        for (let k = 0; k < letters.length; k++) {
          if (isCancelled()) return;
          const L = letters[k];
          pushBlock(L, k);
          S.up(k);
          floatTxt(stage, cx, 100, "push " + L, acc);
          top.style.transition =
            "opacity .3s, transform .45s cubic-bezier(.3,.8,.3,1)";
          top.style.opacity = "1";
          place(top, cx + BW / 2 + 16, baseY - BH * (k + 1) - BH / 2, 0.45);
          if (!(await sleep(800, isCancelled))) return;
        }
        await sleep(400, isCancelled);
      },
    },
    {
      cap: `<code>pop</code> can only lift the top item. <b>C arrived last — so C leaves first.</b>`,
      run: async () => {
        pulseEl(top);
        if (!(await sleep(350, isCancelled))) return;
        floatTxt(stage, cx, 100, "pop → C", acc);
        popBlock();
        S.down(0);
        place(top, cx + BW / 2 + 16, baseY - BH * blocks.length - BH / 2, 0.45);
        await sleep(700, isCancelled);
      },
    },
    {
      cap: `pop again → B. This is <b>LIFO: Last-In, First-Out</b>. The newest entry is always the one served.`,
      run: async () => {
        floatTxt(stage, cx, 100, "pop → B", acc);
        popBlock();
        S.down(1);
        place(top, cx + BW / 2 + 16, baseY - BH * blocks.length - BH / 2, 0.45);
        if (!(await sleep(400, isCancelled))) return;
        floatTxt(
          stage,
          cx,
          baseY - BH * blocks.length - BH - 30,
          "last in → first out",
          acc,
          17
        );
        await sleep(700, isCancelled);
      },
    },
    {
      cap: `Both push and pop are <code>O(1)</code> — the bottom is never touched. That is exactly what undo history, browser back buttons and the call stack need.`,
      run: async () => {
        S.chime();
        pulseEl(top);
        floatTxt(stage, cx, 100, "push / pop = O(1)", acc);
        await sleep(700, isCancelled);
      },
    },
    {
      cap: `Recap — <b>Stack</b>: LIFO, <code>O(1)</code> push &amp; pop. Anywhere there is history or nesting, a stack is doing the work.`,
      chips: ["UNDO HISTORY", "BROWSER BACK", "CALL STACK", "DFS"],
      run: async () => {
        S.chime();
        await sleep(300, isCancelled);
      },
    },
  ];

  return { steps };
}

/* ================= LESSON 4 · QUEUE ================= */
function buildQueue(
  stage: SVGSVGElement,
  acc: string,
  isCancelled: () => boolean
) {
  const lane = svgEl("g", {}, stage);
  lane.style.opacity = "0";
  svgEl(
    "rect",
    {
      x: 150,
      y: 192,
      width: 560,
      height: 74,
      rx: 12,
      fill: "#152036",
      stroke: "#31446e",
    },
    lane
  );
  txt(
    150,
    178,
    "◂ FRONT",
    { size: 13, fill: acc, mono: true, weight: 600, anchor: "start" },
    lane
  );
  txt(
    710,
    178,
    "REAR ▸",
    { size: 13, fill: acc, mono: true, weight: 600, anchor: "end" },
    lane
  );
  for (let i = 0; i < 7; i++) {
    svgEl(
      "line",
      {
        x1: 224 + i * 74,
        y1: 200,
        x2: 224 + i * 74,
        y2: 258,
        stroke: "#31446e",
        opacity: 0.5,
      },
      lane
    );
  }

  const tray = svgEl("g", {}, stage);
  tray.style.opacity = "0";
  svgEl(
    "rect",
    {
      x: 34,
      y: 64,
      width: 126,
      height: 74,
      rx: 10,
      fill: "none",
      stroke: acc,
      "stroke-dasharray": "5 4",
    },
    tray
  );
  txt(97, 52, "SERVED", { size: 12, fill: acc, mono: true, weight: 600 }, tray);

  interface QueueItem {
    g: SVGGElement;
    letter: string;
  }
  const items: QueueItem[] = [];
  const slotX = (i: number) => 168 + i * 74;

  function enqueue(letter: string, k: number) {
    const g = svgEl("g", {}, stage);
    svgEl(
      "rect",
      {
        x: -29,
        y: -29,
        width: 58,
        height: 58,
        rx: 9,
        fill: acc,
        opacity: 0.92 - k * 0.08,
      },
      g
    );
    txt(
      0,
      7,
      letter,
      { size: 21, weight: 700, fill: "#08240f", mono: true },
      g
    );
    place(g, 800, 229);
    g.style.transition = "transform .6s cubic-bezier(.25,.9,.3,1), opacity .2s";
    g.style.opacity = "1";
    place(g, slotX(items.length) + 29, 229, 0.6, "cubic-bezier(.25,.9,.3,1)");
    items.push({ g, letter });
    return g;
  }

  function dequeue() {
    const it = items.shift();
    if (!it) return "";
    it.g.style.transition =
      "transform .65s cubic-bezier(.4,.1,.5,1), opacity .65s";
    place(it.g, 97, 101, 0.65);
    it.g.style.opacity = "0";
    setTimeout(() => {
      try {
        it.g.remove();
      } catch {}
    }, 700);
    items.forEach((o, i) => {
      o.g.style.transition = "transform .5s cubic-bezier(.3,.8,.3,1)";
      place(o.g, slotX(i) + 29, 229, 0.5);
    });
    return it.letter;
  }

  const steps: StepDef[] = [
    {
      cap: `A queue is a line at a counter: newcomers join at the <b>REAR</b>, and service happens at the <b>FRONT</b>.`,
      run: async () => {
        lane.style.transition = "opacity .5s";
        lane.style.opacity = "1";
        S.slide();
        if (!(await sleep(300, isCancelled))) return;
        tray.style.transition = "opacity .5s";
        tray.style.opacity = "1";
        await sleep(400, isCancelled);
      },
    },
    {
      cap: `<code>enqueue A, B, C</code> — each new item takes its place at the back of the line. No pushing in.`,
      run: async () => {
        const letters = ["A", "B", "C"];
        for (let k = 0; k < letters.length; k++) {
          if (isCancelled()) return;
          const L = letters[k];
          enqueue(L, k);
          S.up(k);
          floatTxt(stage, 620, 160, "enqueue " + L, acc);
          if (!(await sleep(750, isCancelled))) return;
        }
        await sleep(400, isCancelled);
      },
    },
    {
      cap: `The front holds the <b>oldest</b> item. A arrived first — so A is next to be served.`,
      run: async () => {
        const r = svgEl(
          "rect",
          {
            x: slotX(0) - 4,
            y: 196,
            width: 66,
            height: 66,
            rx: 11,
            fill: "none",
            stroke: acc,
            "stroke-width": 2.5,
          },
          stage
        );
        pulseEl(r);
        S.pluck(1);
        floatTxt(stage, slotX(0) + 29, 160, "oldest", acc);
        if (!(await sleep(800, isCancelled))) return;
        r.remove();
      },
    },
    {
      cap: `<code>dequeue</code> serves the front: <b>A leaves first</b>, and everyone else shuffles one step forward.`,
      run: async () => {
        floatTxt(stage, 300, 160, "dequeue → A", acc);
        dequeue();
        S.chime();
        await sleep(800, isCancelled);
      },
    },
    {
      cap: `dequeue again → B. This is <b>FIFO: First-In, First-Out</b> — fair, ordered, predictable.`,
      run: async () => {
        floatTxt(stage, 300, 160, "dequeue → B", acc);
        dequeue();
        S.chime();
        if (!(await sleep(500, isCancelled))) return;
        floatTxt(stage, 430, 300, "first in → first out", acc, 17);
        await sleep(700, isCancelled);
      },
    },
    {
      cap: `Recap — <b>Queue</b>: FIFO, <code>O(1)</code> at both ends. Printer spools, CPU schedulers, message buffers and breadth-first search all run on it.`,
      chips: ["PRINTER SPOOL", "CPU SCHEDULER", "MESSAGE BUFFER", "BFS"],
      run: async () => {
        S.chime();
        await sleep(300, isCancelled);
      },
    },
  ];

  return { steps };
}

/* ================= LESSON 5 · HEAP ================= */
function buildHeap(
  stage: SVGSVGElement,
  acc: string,
  isCancelled: () => boolean
) {
  const P = [
    [450, 88],
    [268, 184],
    [632, 184],
    [176, 280],
    [360, 280],
    [544, 280],
    [728, 280],
  ];
  const gE = svgEl("g", {}, stage);
  const gN = svgEl("g", {}, stage);
  const gA = svgEl("g", {}, stage);

  const formula = txt(
    44,
    40,
    "children of i → 2i+1, 2i+2   ·   parent of i → ⌊(i−1)/2⌋",
    { size: 13, fill: acc, mono: true, anchor: "start", opacity: 0 },
    stage
  );

  const cw = 66,
    gap = 12,
    total = 6 * cw + 5 * gap,
    x0 = 450 - total / 2,
    y0 = 376;
  const cells: { r: SVGRectElement; t: SVGTextElement }[] = [];
  const aidx: SVGTextElement[] = [];

  for (let i = 0; i < 6; i++) {
    const x = x0 + i * (cw + gap);
    const r = svgEl(
      "rect",
      {
        x,
        y: y0,
        width: cw,
        height: 50,
        rx: 8,
        fill: "#152036",
        stroke: "#31446e",
        opacity: 0,
      },
      gA
    );
    const t = txt(
      x + cw / 2,
      y0 + 32,
      "·",
      { size: 19, weight: 600, fill: "#e7edfb", mono: true, opacity: 0 },
      gA
    );
    const a = txt(
      x + cw / 2,
      y0 + 66,
      String(i),
      { size: 11, fill: "#5d6d8f", mono: true, opacity: 0 },
      gA
    );
    cells.push({ r, t });
    aidx.push(a);
  }

  const edges: Record<string, SVGLineElement> = {};
  function edge(i: number, j: number, delayDraw = false) {
    const l = svgEl(
      "line",
      {
        x1: P[i][0],
        y1: P[i][1],
        x2: P[j][0],
        y2: P[j][1],
        stroke: "#3d3f6e",
        "stroke-width": 2,
      },
      gE
    );
    edges[i + "-" + j] = l;
    if (delayDraw) l.style.opacity = "0";
    return l;
  }

  interface HeapNode {
    g: SVGGElement;
    c: SVGCircleElement;
    t: SVGTextElement;
    val: number;
  }

  const slot: (HeapNode | null)[] = new Array(6).fill(null);

  function makeNode(val: number, si: number) {
    const g = svgEl("g", {}, gN);
    place(g, P[si][0], P[si][1]);
    const c = svgEl(
      "circle",
      { r: 27, fill: "#232247", stroke: acc, "stroke-width": 2 },
      g
    );
    const t = txt(
      0,
      7,
      String(val),
      { size: 17, weight: 700, fill: "#e7edfb", mono: true },
      g
    );
    g.style.opacity = "0";
    const n: HeapNode = { g, c, t, val };
    slot[si] = n;
    return n;
  }

  function syncArr() {
    for (let i = 0; i < 6; i++) {
      cells[i].t.textContent = slot[i] ? String(slot[i]!.val) : "·";
    }
  }

  function flashCell(i: number) {
    cells[i].r.setAttribute("fill", "#2c2a55");
    setTimeout(() => {
      cells[i].r.setAttribute("fill", "#152036");
    }, 700);
  }

  async function swap(i: number, j: number) {
    const a = slot[i];
    const b = slot[j];
    if (!a || !b) return;
    a.g.style.transition = "transform .55s cubic-bezier(.35,.8,.3,1)";
    b.g.style.transition = "transform .55s cubic-bezier(.35,.8,.3,1)";
    place(a.g, P[j][0], P[j][1], 0.55);
    place(b.g, P[i][0], P[i][1], 0.55);
    slot[i] = b;
    slot[j] = a;
    S.swap();
    if (!(await sleep(600, isCancelled))) return;
    syncArr();
    flashCell(i);
    flashCell(j);
  }

  edge(0, 1, true);
  edge(0, 2, true);
  edge(1, 3, true);
  edge(1, 4, true);

  const init = [50, 30, 40, 20, 10];
  init.forEach((v, i) => makeNode(v, i));
  syncArr();
  cells.forEach((c) => (c.t.style.opacity = "0"));

  const steps: StepDef[] = [
    {
      cap: `A binary heap is a tree packed into an array. Max-heap rule: <b>every parent ≥ its children</b> — so the maximum always sits at the root. Children of index <code>i</code> live at <code>2i+1</code> and <code>2i+2</code>.`,
      run: async () => {
        formula.style.transition = "opacity .5s";
        formula.style.opacity = "1";
        for (let i = 0; i < 5; i++) {
          if (isCancelled()) return;
          const n = slot[i];
          if (n) {
            n.g.style.transition = "opacity .35s";
            n.g.style.opacity = "1";
            pulseEl(n.c);
            S.tick(i);
          }
          if (!(await sleep(160, isCancelled))) return;
        }

        Object.values(edges).forEach((l, i) => {
          l.style.transition = `opacity .4s ${i * 0.08}s`;
          l.style.opacity = "1";
        });

        cells.forEach((c, i) => {
          c.r.style.transition = `opacity .35s ${i * 0.06}s`;
          c.t.style.transition = `opacity .35s ${i * 0.06}s`;
          c.r.style.opacity = "1";
          c.t.style.opacity = "1";
        });

        aidx.forEach((a, i) => {
          a.style.transition = `opacity .35s ${i * 0.06}s`;
          a.style.opacity = "1";
        });
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Insert <b>45</b>: it takes the next free slot — this keeps the tree completely filled, left to right. The shape never gets lopsided.`,
      run: async () => {
        const e = edge(2, 5);
        drawIn(e, 0.4);
        const n = makeNode(45, 5);
        n.g.style.transition = "opacity .3s";
        n.g.style.opacity = "1";
        pulseEl(n.c);
        S.pop();
        syncArr();
        cells[5].t.style.opacity = "1";
        flashCell(5);
        floatTxt(stage, P[5][0], P[5][1] + 52, "new node at index 5", acc, 13);
        await sleep(800, isCancelled);
      },
    },
    {
      cap: `Now <b>bubble up</b>: 45 &gt; 40, so they swap. Then 45 &lt; 50, so it stops. At most <code>O(log n)</code> swaps — the height of the tree.`,
      run: async () => {
        floatTxt(
          stage,
          (P[5][0] + P[2][0]) / 2 + 30,
          P[5][1] - 38,
          "45 > 40 → swap",
          acc
        );
        if (!(await sleep(650, isCancelled))) return;
        await swap(5, 2);
        if (isCancelled()) return;
        floatTxt(stage, P[2][0] - 40, P[2][1] - 44, "45 < 50 → stop", acc);
        if (slot[0]) pulseEl(slot[0].c);
        S.pluck(3);
        await sleep(750, isCancelled);
      },
    },
    {
      cap: `<code>extractMax</code>: the root is removed and <b>50 is returned</b> — always the biggest item, in O(1) to find.`,
      run: async () => {
        const root = slot[0];
        if (!root) return;
        pulseEl(root.c);
        if (!(await sleep(400, isCancelled))) return;

        root.g.style.transition =
          "transform .55s ease-in, opacity .55s ease-in";
        place(root.g, P[0][0], P[0][1] - 95, 0.55, "ease-in");
        root.g.style.opacity = "0";
        S.chime();
        floatTxt(stage, P[0][0], P[0][1] - 50, "max = 50 → returned", acc);
        setTimeout(() => {
          try {
            root.g.remove();
          } catch {}
        }, 600);
        slot[0] = null;
        await sleep(700, isCancelled);
      },
    },
    {
      cap: `Move the last leaf (<b>40</b>) to the root, then <b>bubble down</b> — always swapping with the bigger child. One swap restores the heap rule. <code>O(log n)</code>.`,
      run: async () => {
        const last = slot[5];
        slot[5] = null;
        if (edges["2-5"]) {
          edges["2-5"].style.transition = "opacity .4s";
          edges["2-5"].style.opacity = "0";
        }
        if (last) {
          last.g.style.transition = "transform .65s cubic-bezier(.3,.8,.3,1)";
          place(last.g, P[0][0], P[0][1], 0.65);
          slot[0] = last;
        }
        syncArr();
        flashCell(0);
        flashCell(5);
        S.slide();
        if (!(await sleep(800, isCancelled))) return;

        floatTxt(
          stage,
          P[0][0] + 90,
          P[0][1] - 30,
          "40 < 45 → swap with bigger child",
          acc,
          13
        );
        if (!(await sleep(700, isCancelled))) return;
        await swap(0, 2);
        if (isCancelled()) return;

        slot.forEach((n) => {
          if (n) pulseEl(n.c);
        });
        S.chime();
        floatTxt(stage, 450, 340, "heap rule restored ✓", acc);
        await sleep(700, isCancelled);
      },
    },
    {
      cap: `Recap — <b>Heap</b>: <code>O(1)</code> peek, <code>O(log n)</code> insert &amp; extract. This powers priority queues, Dijkstra and heapsort.<span class="text-xs text-fd-muted-foreground block mt-2">Not to be confused with OS “heap memory” — same word, different idea.</span>`,
      chips: ["PRIORITY QUEUE", "DIJKSTRA", "HEAPSORT", "PEEK O(1)"],
      run: async () => {
        S.chime();
        await sleep(300, isCancelled);
      },
    },
  ];

  return { steps };
}

/* ================= LESSON 6 · HASH LOOKUP ================= */
function buildHash(
  stage: SVGSVGElement,
  acc: string,
  isCancelled: () => boolean
) {
  marker(stage, acc);
  const BX = 470,
    BW = 50,
    GAP = 8,
    TOP = 172,
    BOT = 372;
  const gB = svgEl("g", {}, stage);
  gB.style.opacity = "0";

  for (let i = 0; i < 7; i++) {
    const x = BX + i * (BW + GAP);
    svgEl(
      "path",
      {
        d: `M${x} ${TOP} V${BOT} H${x + BW} V${TOP}`,
        fill: "none",
        stroke: "#31446e",
        "stroke-width": 1.5,
      },
      gB
    );
    txt(
      x + BW / 2,
      BOT + 20,
      String(i),
      { size: 12, fill: "#5d6d8f", mono: true },
      gB
    );
  }
  txt(
    BX + 3 * BW + 25,
    TOP - 26,
    "BUCKETS — index = key mod 7",
    { size: 11, fill: "#8fa0bf", mono: true },
    gB
  );

  const box = svgEl("g", {}, stage);
  box.style.opacity = "0";
  const boxR = svgEl(
    "rect",
    {
      x: 250,
      y: 152,
      width: 180,
      height: 96,
      rx: 10,
      fill: "#12203a",
      stroke: acc,
      "stroke-width": 1.5,
    },
    box
  );
  txt(
    340,
    190,
    "h(k) = k mod 7",
    { size: 15, fill: acc, mono: true, weight: 600 },
    box
  );
  txt(
    340,
    218,
    "HASH FUNCTION",
    { size: 9.5, fill: "#5d6d8f", mono: true },
    box
  );

  const badge = txt(
    340,
    278,
    "",
    { size: 14, fill: acc, mono: true, weight: 600 },
    stage
  );

  const card = svgEl("g", {}, stage);
  svgEl(
    "rect",
    {
      width: 110,
      height: 70,
      rx: 9,
      fill: "#152036",
      stroke: acc,
      "stroke-width": 1.5,
    },
    card
  );
  const cardT = txt(
    55,
    45,
    "",
    { size: 26, weight: 700, fill: "#e7edfb", mono: true },
    card
  );
  txt(55, -12, "KEY", { size: 10, fill: "#5d6d8f", mono: true }, card);
  place(card, 60, 164);
  card.style.opacity = "0";

  interface ChipDef {
    g: SVGGElement;
    r: SVGRectElement;
    t: SVGTextElement;
    key: number;
  }
  const buckets: ChipDef[][] = [[], [], [], [], [], [], []];
  const bx = (i: number) => BX + i * (BW + GAP) + BW / 2;
  const slotY = (i: number, k: number) => BOT - 20 - k * 32;

  function chip(key: number): ChipDef {
    const g = svgEl("g", {}, stage);
    const r = svgEl(
      "rect",
      {
        x: -22,
        y: -14,
        width: 44,
        height: 28,
        rx: 5,
        fill: "#1c2c4e",
        stroke: "#3d5580",
      },
      g
    );
    const t = txt(
      0,
      6,
      String(key),
      { size: 14, weight: 600, fill: "#e7edfb", mono: true },
      g
    );
    return { g, r, t, key };
  }

  async function toBox(key: number) {
    if (isCancelled()) return;
    cardT.textContent = String(key);
    place(card, 60, 164);
    card.style.opacity = "1";
    card.style.transition =
      "transform .5s cubic-bezier(.4,.7,.4,1), opacity .5s";
    if (!(await sleep(380, isCancelled))) return;

    place(card, 285, 165, 0.5);
    if (!(await sleep(540, isCancelled))) return;

    pulseEl(boxR);
    S.hash();
    if (!(await sleep(480, isCancelled))) return;
    card.style.opacity = "0";
  }

  async function insert(key: number) {
    if (isCancelled()) return;
    await toBox(key);
    if (isCancelled()) return;

    const b = key % 7;
    badge.textContent = `${key} mod 7 = ${b}`;
    const c = chip(key);
    place(c.g, 436, 196);
    c.g.style.transition = "transform .5s cubic-bezier(.3,.9,.35,1)";
    if (!(await sleep(60, isCancelled))) return;

    place(c.g, bx(b), slotY(b, buckets[b].length), 0.5);
    buckets[b].push(c);
    if (!(await sleep(520, isCancelled))) return;
    S.thud();
  }

  async function beam(b: number) {
    if (isCancelled()) return null;
    const l = svgEl(
      "line",
      {
        x1: 432,
        y1: 200,
        x2: bx(b),
        y2: TOP - 8,
        stroke: acc,
        "stroke-width": 2,
        "marker-end": "url(#arw)",
      },
      stage
    );
    drawIn(l, 0.45);
    S.pluck(2);
    await sleep(540, isCancelled);
    return l;
  }

  async function walk(key: number, b: number) {
    const list = buckets[b];
    let stepsN = 0;
    for (let k = list.length - 1; k >= 0; k--) {
      if (isCancelled()) return { stepsN, found: false };
      const c = list[k];
      stepsN++;
      pulseEl(c.r);
      S.tick(k);
      if (!(await sleep(480, isCancelled))) return { stepsN, found: false };

      if (c.key === key) {
        c.r.setAttribute("stroke", "#7adf8e");
        c.r.setAttribute("fill", "#173a26");
        c.t.setAttribute("fill", "#7adf8e");
        return { stepsN, found: true };
      }
      c.g.style.transition = "opacity .35s";
      c.g.style.opacity = "0.4";
    }
    return { stepsN, found: false };
  }

  const steps: StepDef[] = [
    {
      cap: `Hash lookup abandons searching entirely. Instead of comparing, you <b>compute the address</b>: a function turns the key into a bucket number. No scanning, no order — pure arithmetic.`,
      run: async () => {
        box.style.transition = "opacity .5s";
        box.style.opacity = "1";
        S.pluck(0);
        if (!(await sleep(350, isCancelled))) return;
        gB.style.transition = "opacity .5s";
        gB.style.opacity = "1";
        S.pluck(1);
        if (!(await sleep(400, isCancelled))) return;
        card.style.opacity = "1";
        await sleep(250, isCancelled);
      },
    },
    {
      cap: `Load the table: each key flies through <code>h(k) = k mod 7</code> and drops into its bucket. Watch bucket 5: both 12 and 19 land there — a <b>collision</b>, handled by chaining them together.`,
      run: async () => {
        for (const k of [12, 25, 38, 8, 19]) {
          if (isCancelled()) return;
          await insert(k);
        }
        floatTxt(stage, bx(5), TOP - 40, "collision — chained", acc, 13);
        await sleep(650, isCancelled);
      },
    },
    {
      cap: `Search for <b>25</b>: hash it → 25 mod 7 = 4, walk straight to bucket 4, take the item. <b>One step, no comparisons.</b> This is the <code>O(1)</code> promise.`,
      run: async () => {
        await toBox(25);
        badge.textContent = "25 mod 7 = 4 → bucket 4";
        await beam(4);
        const r = await walk(25, 4);
        S.chime();
        floatTxt(
          stage,
          bx(4),
          TOP - 40,
          `direct hit — ${r.stepsN} step`,
          "#7adf8e",
          14
        );
        await sleep(700, isCancelled);
      },
    },
    {
      cap: `Search for <b>12</b>: hash says bucket 5, but two keys live there. Walk the chain: 19 ≠ 12… then 12 ✓. Collisions cost extra steps — that cost is governed by the <b>load factor</b> (items ÷ buckets).`,
      run: async () => {
        await toBox(12);
        badge.textContent = "12 mod 7 = 5 → bucket 5";
        await beam(5);
        const r = await walk(12, 5);
        S.chime();
        floatTxt(
          stage,
          bx(5),
          TOP - 40,
          `found after ${r.stepsN} chain checks`,
          "#7adf8e",
          14
        );
        await sleep(700, isCancelled);
      },
    },
    {
      cap: `Search for <b>40</b>: bucket 5 again — check 19, check 12, end of chain. <b>Not found, and proven in 2 steps.</b> Even a miss never scans the whole table.`,
      run: async () => {
        buckets[5].forEach((c) => {
          c.g.style.opacity = "1";
          c.r.setAttribute("stroke", "#3d5580");
          c.r.setAttribute("fill", "#1c2c4e");
          c.t.setAttribute("fill", "#e7edfb");
        });
        await toBox(40);
        badge.textContent = "40 mod 7 = 5 → bucket 5";
        await beam(5);
        await walk(40, 5);
        if (!(await sleep(250, isCancelled))) return;
        stamp(stage, bx(5), 266, "MISS", "#ff7b6b");
        await sleep(600, isCancelled);
      },
    },
    {
      cap: `Recap — <b>Hash lookup</b>: average <code>O(1)</code>, worst <code>O(n)</code> if every key collides. The trade: extra memory, and no ordering — hashing finds, it never sorts.`,
      chips: [
        "AVG O(1)",
        "WORST O(n) ALL COLLIDE",
        "EXTRA MEMORY",
        "LOSES ORDER",
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
const CONFIGS: Record<MemoryStructure, StructureConfig> = {
  array: {
    id: "array",
    name: "Array Memory",
    title: "Contiguous Array Memory Simulator",
    kicker: "LESSON 01 · CONTIGUOUS BLOCK",
    complexity: "O(1) ACCESS",
    tag: "LESSON 01 · ARRAY MEMORY",
    notesTag: "ARRAY",
    color: "#f5c04e",
    intro:
      "Lesson 01 — the contiguous array. Press <b>▶ PLAY ALL</b>, or step through with <b>STEP ▸</b>. Sound on for the full tutorial feel.",
    icon: LayoutGrid,
    build: buildArray,
  },
  list: {
    id: "list",
    name: "Linked List",
    title: "Linked List Pointer Simulator",
    kicker: "LESSON 02 · POINTER CHASING",
    complexity: "O(1) INSERT",
    tag: "LESSON 02 · LINKED LIST",
    notesTag: "LINKED LIST",
    color: "#45d6c4",
    intro:
      "Lesson 02 — the linked list. Nodes scattered in memory, glued together by pointers. Press <b>▶ PLAY ALL</b> to begin.",
    icon: GitCommit,
    build: buildList,
  },
  stack: {
    id: "stack",
    name: "Stack",
    title: "Stack (LIFO) Simulator",
    kicker: "LESSON 03 · LAST-IN, FIRST-OUT",
    complexity: "O(1) PUSH/POP",
    tag: "LESSON 03 · STACK",
    notesTag: "STACK · LIFO",
    color: "#ff7b6b",
    intro:
      "Lesson 03 — the stack. Last-In, First-Out. Press <b>▶ PLAY ALL</b> and watch the pile grow.",
    icon: Layers,
    build: buildStack,
  },
  queue: {
    id: "queue",
    name: "Queue",
    title: "Queue (FIFO) Pipeline Simulator",
    kicker: "LESSON 04 · FIRST-IN, FIRST-OUT",
    complexity: "O(1) PIPELINE",
    tag: "LESSON 04 · QUEUE",
    notesTag: "QUEUE · FIFO",
    color: "#7adf8e",
    intro:
      "Lesson 04 — the queue. First-In, First-Out. Press <b>▶ PLAY ALL</b> to join the line.",
    icon: ArrowRightLeft,
    build: buildQueue,
  },
  heap: {
    id: "heap",
    name: "Binary Heap",
    title: "Binary Heap Tree & Array Simulator",
    kicker: "LESSON 05 · COMPLETE TREE",
    complexity: "O(log n) SIFT",
    tag: "LESSON 05 · HEAP",
    notesTag: "BINARY HEAP",
    color: "#a08bff",
    intro:
      "Lesson 05 — the binary heap. A tree wearing an array's clothes. Press <b>▶ PLAY ALL</b> to begin.",
    icon: Workflow,
    build: buildHeap,
  },
  hash: {
    id: "hash",
    name: "Hash Table",
    title: "Hash Lookup & Collision Simulator",
    kicker: "LESSON 06.6 · ARITHMETIC ADDRESSING",
    complexity: "O(1) AVG",
    tag: "LESSON 06.6 · HASH LOOKUP",
    notesTag: "HASH LOOKUP",
    color: "#58c7f3",
    intro:
      "Lesson 06·6 — <b>Hash lookup</b>. Skip searching entirely: compute the address. Press <b>▶ PLAY ALL</b>.",
    icon: Hash,
    build: buildHash,
  },
};

/* ================= BASE SIMULATOR ================= */
interface SimulatorProps {
  structure: MemoryStructure;
}

function BaseMemorySimulator({ structure }: SimulatorProps) {
  const config = CONFIGS[structure] || CONFIGS.array;
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

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

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

    while (stage.firstChild) {
      stage.removeChild(stage.firstChild);
    }

    const currentEpoch = epochRef.current;
    const isCancelled = () => epochRef.current !== currentEpoch;

    const defs = svgEl("defs", {}, stage);
    const pattern = svgEl(
      "pattern",
      {
        id: `grid-${structure}`,
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

      .sink { transition: opacity .6s, transform .6s; }
    `;

    svgEl("rect", { width: 900, height: 470, fill: "#0b1120", rx: 8 }, stage);
    svgEl(
      "rect",
      { width: 900, height: 470, fill: `url(#grid-${structure})`, rx: 8 },
      stage
    );

    const built = config.build(stage, config.color, isCancelled);
    stepsRef.current = built.steps;
  }, [structure, config]);

  useEffect(() => {
    resetStage();
    return () => {
      epochRef.current++;
    };
  }, [resetStage]);

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

    if (beatRef.current >= stepsRef.current.length) {
      resetStage();
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

/* ================= 6 STANDALONE WRAPPERS ================= */
export function ArrayMemorySimulator() {
  return <BaseMemorySimulator structure="array" />;
}

export function LinkedListSimulator() {
  return <BaseMemorySimulator structure="list" />;
}

export function StackSimulator() {
  return <BaseMemorySimulator structure="stack" />;
}

export function QueueSimulator() {
  return <BaseMemorySimulator structure="queue" />;
}

export function HeapStructureSimulator() {
  return <BaseMemorySimulator structure="heap" />;
}

export function HashLookupSimulator() {
  return <BaseMemorySimulator structure="hash" />;
}

/* ================= UNIFIED MEMORY SIMULATOR ================= */
export interface MemorySimulatorProps {
  structure?: MemoryStructure;
}

export function MemorySimulator({ structure = "array" }: MemorySimulatorProps) {
  return <BaseMemorySimulator structure={structure} />;
}

export default MemorySimulator;
