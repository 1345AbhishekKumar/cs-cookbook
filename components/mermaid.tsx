'use client';

import { useEffect, useState } from 'react';
import type { Mermaid as MermaidType } from 'mermaid';

/**
 * Renders a Mermaid diagram from a ```` ```mermaid ```` code block.
 *
 * `remarkMdxMermaid` (see `source.config.ts`) rewrites mermaid fences into
 * `<Mermaid chart="..." />` at build time, so lesson authors only write the
 * diagram source.
 *
 * Mermaid needs the DOM, so the diagram is drawn on the client. The theme is
 * rebuilt whenever the site flips between light and dark mode: mermaid's own
 * palettes are colourful, so both modes are rebuilt from the monochrome
 * `--color-fd-*` tokens to stay in step with the rest of the docs.
 */

type Mode = 'light' | 'dark';

/** Monochrome palettes shared by every mermaid diagram type used in the docs. */
const PALETTES: Record<Mode, Record<string, string>> = {
  light: {
    background: '#ffffff',
    primaryColor: '#ffffff',
    primaryTextColor: '#000000',
    primaryBorderColor: '#000000',
    secondaryColor: '#f1f1f1',
    secondaryTextColor: '#000000',
    secondaryBorderColor: 'rgb(0 0 0 / 0.35)',
    tertiaryColor: '#fafafa',
    tertiaryTextColor: '#000000',
    tertiaryBorderColor: 'rgb(0 0 0 / 0.2)',
    lineColor: '#8f8f8f',
    textColor: '#000000',
    mainBkg: '#ffffff',
    nodeBorder: '#000000',
    nodeTextColor: '#000000',
    clusterBkg: '#fafafa',
    clusterBorder: 'rgb(0 0 0 / 0.18)',
    titleColor: '#000000',
    edgeLabelBackground: '#ffffff',
    labelBackground: '#ffffff',
    noteBkgColor: '#f1f1f1',
    noteTextColor: '#000000',
    noteBorderColor: 'rgb(0 0 0 / 0.25)',
    actorBkg: '#ffffff',
    actorBorder: 'rgb(0 0 0 / 0.45)',
    actorTextColor: '#000000',
    actorLineColor: '#8f8f8f',
    signalColor: '#000000',
    signalTextColor: '#000000',
    labelBoxBkgColor: '#f1f1f1',
    labelBoxBorderColor: 'rgb(0 0 0 / 0.25)',
    labelTextColor: '#000000',
    loopTextColor: '#000000',
    activationBkgColor: '#f1f1f1',
    activationBorderColor: 'rgb(0 0 0 / 0.45)',
    sequenceNumberColor: '#ffffff',
    altBackground: '#fafafa',
    sectionBkgColor: '#fafafa',
    altSectionBkgColor: '#ffffff',
    sectionBkgColor2: '#f1f1f1',
    gridColor: 'rgb(0 0 0 / 0.12)',
    taskBkgColor: '#f1f1f1',
    taskTextColor: '#000000',
    taskTextOutsideColor: '#000000',
    taskBorderColor: 'rgb(0 0 0 / 0.25)',
    doneTaskBkgColor: '#e5e5e5',
    doneTaskBorderColor: 'rgb(0 0 0 / 0.25)',
    activeTaskBkgColor: '#ffffff',
    activeTaskBorderColor: '#000000',
    critBkgColor: '#f1f1f1',
    critBorderColor: '#000000',
    todayLineColor: '#000000',
    pie1: '#111111',
    pie2: '#555555',
    pie3: '#888888',
    pie4: '#bbbbbb',
    pie5: '#dddddd',
    pieTitleTextColor: '#000000',
    pieSectionTextColor: '#ffffff',
    pieLegendTextColor: '#000000',
    pieStrokeColor: '#ffffff',
    pieOuterStrokeColor: '#000000',
  },
  dark: {
    background: '#0a0a0a',
    primaryColor: '#0f0f0f',
    primaryTextColor: '#fafafa',
    primaryBorderColor: '#fafafa',
    secondaryColor: '#161616',
    secondaryTextColor: '#fafafa',
    secondaryBorderColor: 'rgb(255 255 255 / 0.45)',
    tertiaryColor: '#121212',
    tertiaryTextColor: '#fafafa',
    tertiaryBorderColor: 'rgb(255 255 255 / 0.3)',
    lineColor: '#8f8f8f',
    textColor: '#fafafa',
    mainBkg: '#0f0f0f',
    nodeBorder: '#fafafa',
    nodeTextColor: '#fafafa',
    clusterBkg: '#121212',
    clusterBorder: 'rgb(255 255 255 / 0.2)',
    titleColor: '#fafafa',
    edgeLabelBackground: '#0a0a0a',
    labelBackground: '#0a0a0a',
    noteBkgColor: '#161616',
    noteTextColor: '#fafafa',
    noteBorderColor: 'rgb(255 255 255 / 0.3)',
    actorBkg: '#0f0f0f',
    actorBorder: 'rgb(255 255 255 / 0.5)',
    actorTextColor: '#fafafa',
    actorLineColor: '#8f8f8f',
    signalColor: '#fafafa',
    signalTextColor: '#fafafa',
    labelBoxBkgColor: '#161616',
    labelBoxBorderColor: 'rgb(255 255 255 / 0.3)',
    labelTextColor: '#fafafa',
    loopTextColor: '#fafafa',
    activationBkgColor: '#161616',
    activationBorderColor: 'rgb(255 255 255 / 0.5)',
    sequenceNumberColor: '#000000',
    altBackground: '#121212',
    sectionBkgColor: '#121212',
    altSectionBkgColor: '#0f0f0f',
    sectionBkgColor2: '#161616',
    gridColor: 'rgb(255 255 255 / 0.14)',
    taskBkgColor: '#161616',
    taskTextColor: '#fafafa',
    taskTextOutsideColor: '#fafafa',
    taskBorderColor: 'rgb(255 255 255 / 0.3)',
    doneTaskBkgColor: '#262626',
    doneTaskBorderColor: 'rgb(255 255 255 / 0.3)',
    activeTaskBkgColor: '#0a0a0a',
    activeTaskBorderColor: '#fafafa',
    critBkgColor: '#161616',
    critBorderColor: '#fafafa',
    todayLineColor: '#fafafa',
    pie1: '#fafafa',
    pie2: '#bbbbbb',
    pie3: '#888888',
    pie4: '#555555',
    pie5: '#333333',
    pieTitleTextColor: '#fafafa',
    pieSectionTextColor: '#000000',
    pieLegendTextColor: '#fafafa',
    pieStrokeColor: '#0a0a0a',
    pieOuterStrokeColor: '#fafafa',
  },
};

let diagramCount = 0;

function configure(mermaid: MermaidType, mode: Mode) {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    fontFamily: 'inherit',
    themeVariables: {
      ...PALETTES[mode],
      fontSize: '14px',
    },
    flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis', padding: 12 },
    sequence: { useMaxWidth: true, mirrorActors: false, actorMargin: 40 },
    state: { useMaxWidth: true },
    class: { useMaxWidth: true },
    er: { useMaxWidth: true },
    pie: { useMaxWidth: true },
    mindmap: { useMaxWidth: true },
    timeline: { useMaxWidth: true },
    journey: { useMaxWidth: true },
    gantt: { useMaxWidth: true },
  });
}

export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<Mode>('light');

  // Mirror the theme toggle: watch the `dark` class that next-themes writes to <html>.
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setMode(root.classList.contains('dark') ? 'dark' : 'light');
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-diagram-${(diagramCount += 1)}`;

    import('mermaid')
      .then((mod) => {
        if (cancelled) return null;
        const mermaid = mod.default;
        configure(mermaid, mode);
        return mermaid.render(id, chart);
      })
      .then((res) => {
        if (!cancelled && res) {
          setSvg(res.svg);
        }
      })
      .catch((err) => {
        console.error('Mermaid render error:', err);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [chart, mode]);

  if (failed) {
    // Never break a lesson because a diagram failed to parse — show the source instead.
    return (
      <figure className="not-prose my-6 rounded-md border border-fd-border bg-fd-card p-4">
        <pre className="overflow-x-auto text-xs text-fd-muted-foreground">
          <code>{chart}</code>
        </pre>
      </figure>
    );
  }

  return (
    <figure className="not-prose my-6 rounded-md border border-fd-border bg-fd-card p-4 text-fd-foreground">
      <div
        aria-busy={svg === null}
        className="mermaid-wrapper [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full transition-opacity duration-200"
        style={{ opacity: svg === null ? 0 : 1 }}
        dangerouslySetInnerHTML={{ __html: svg ?? '' }}
      />
      {caption ? (
        <figcaption className="mt-3 text-center text-xs text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
