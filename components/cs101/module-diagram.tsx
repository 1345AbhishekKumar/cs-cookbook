import type { CSSProperties } from 'react';

type NodeSpec = {
  id: string;
  label: string;
  x: number;
  y: number;
  sub?: string;
};

type EdgeSpec = {
  from: string;
  to: string;
  label?: string;
};

type DiagramSpec = {
  width: number;
  height: number;
  nodes: NodeSpec[];
  edges: EdgeSpec[];
};

/**
 * Animated diagrams for the CS 101 lesson.
 *
 * Each diagram is a small node/edge graph rendered as inline SVG. Edges flow
 * (animated dashes + a travelling dot) and nodes pulse. Animations use SMIL so
 * they need no client JavaScript or global CSS.
 */
const DIAGRAMS: Record<string, DiagramSpec> = {
  overview: {
    width: 760,
    height: 470,
    nodes: [
      { id: 'hw', label: 'Hardware', x: 170, y: 60, sub: 'bits, CPU, RAM' },
      { id: 'data', label: 'Data & Encoding', x: 170, y: 150 },
      { id: 'os', label: 'OS & Shell', x: 170, y: 240 },
      { id: 'lang', label: 'Languages', x: 170, y: 330 },
      { id: 'vars', label: 'Variables & Memory', x: 170, y: 420 },
      { id: 'ds', label: 'Data Structures', x: 590, y: 60 },
      { id: 'algo', label: 'Algorithms', x: 590, y: 150 },
      { id: 'bigo', label: 'Big-O', x: 590, y: 240 },
      { id: 'para', label: 'Paradigms & OOP', x: 590, y: 330 },
      { id: 'conc', label: 'Concurrency & Networks', x: 590, y: 420 },
    ],
    edges: [
      { from: 'hw', to: 'data' },
      { from: 'data', to: 'os' },
      { from: 'os', to: 'lang' },
      { from: 'lang', to: 'vars' },
      { from: 'vars', to: 'ds', label: 'next stage' },
      { from: 'ds', to: 'algo' },
      { from: 'algo', to: 'bigo' },
      { from: 'bigo', to: 'para' },
      { from: 'para', to: 'conc' },
    ],
  },
  m1: {
    width: 760,
    height: 400,
    nodes: [
      { id: 'kernel', label: 'OS Kernel', x: 380, y: 60, sub: '+ device drivers' },
      { id: 'cpu', label: 'CPU', x: 200, y: 200, sub: 'fetch / decode / execute' },
      { id: 'ram', label: 'RAM', x: 570, y: 200, sub: 'addressed byte cells' },
      { id: 'io', label: 'Input', x: 200, y: 340, sub: 'keyboard, mouse' },
      { id: 'out', label: 'Output', x: 570, y: 340, sub: 'screen, speaker' },
    ],
    edges: [
      { from: 'kernel', to: 'cpu' },
      { from: 'kernel', to: 'ram' },
      { from: 'cpu', to: 'ram', label: 'address bus' },
      { from: 'io', to: 'cpu', label: 'bytes in' },
      { from: 'cpu', to: 'out', label: 'bytes out' },
    ],
  },
  m2: {
    width: 760,
    height: 470,
    nodes: [
      { id: 'bit', label: 'Bit', x: 120, y: 120, sub: '0 or 1' },
      { id: 'nibble', label: 'Nibble', x: 380, y: 120, sub: '4 bits' },
      { id: 'byte', label: 'Byte', x: 640, y: 120, sub: '8 bits / 256 values' },
      { id: 'hex', label: 'Hexadecimal', x: 380, y: 260, sub: 'one digit = 4 bits' },
      { id: 'char', label: 'Char Encoding', x: 640, y: 260, sub: 'ASCII / UTF-8' },
      { id: 'int', label: 'Integer', x: 120, y: 260, sub: 'signed / unsigned' },
      { id: 'float', label: 'Floating Point', x: 380, y: 400, sub: 'IEEE 754' },
      { id: 'endian', label: 'Endianness', x: 640, y: 400, sub: 'big / little' },
    ],
    edges: [
      { from: 'bit', to: 'nibble' },
      { from: 'nibble', to: 'byte' },
      { from: 'byte', to: 'hex' },
      { from: 'hex', to: 'char' },
      { from: 'byte', to: 'int' },
      { from: 'int', to: 'float' },
      { from: 'float', to: 'endian' },
    ],
  },
  m3: {
    width: 760,
    height: 430,
    nodes: [
      { id: 'remote', label: 'Remote Host', x: 90, y: 90, sub: 'another machine' },
      { id: 'ssh', label: 'SSH', x: 300, y: 90, sub: 'encrypted tunnel' },
      { id: 'cli', label: 'CLI', x: 90, y: 250, sub: 'text in / text out' },
      { id: 'shell', label: 'Shell', x: 300, y: 250, sub: 'bash, zsh' },
      { id: 'syscall', label: 'System Calls', x: 510, y: 250, sub: 'fork, execve' },
      { id: 'kernel', label: 'Kernel', x: 690, y: 250, sub: 'Ring 0' },
      { id: 'hw', label: 'Hardware', x: 690, y: 380, sub: 'CPU, RAM, devices' },
    ],
    edges: [
      { from: 'cli', to: 'shell' },
      { from: 'shell', to: 'syscall' },
      { from: 'syscall', to: 'kernel' },
      { from: 'kernel', to: 'hw' },
      { from: 'shell', to: 'ssh' },
      { from: 'ssh', to: 'remote' },
    ],
  },
  m4: {
    width: 760,
    height: 390,
    nodes: [
      { id: 'src', label: 'Source Code', x: 110, y: 190, sub: 'human readable' },
      { id: 'comp', label: 'Compiler', x: 400, y: 90, sub: 'lex, parse, optimise' },
      { id: 'exe', label: 'Executable', x: 660, y: 90, sub: 'native binary' },
      { id: 'interp', label: 'Interpreter', x: 400, y: 290, sub: 'line by line' },
      { id: 'jit', label: 'JIT / Bytecode', x: 660, y: 290, sub: 'hot path to native' },
    ],
    edges: [
      { from: 'src', to: 'comp', label: 'whole file' },
      { from: 'comp', to: 'exe' },
      { from: 'src', to: 'interp', label: 'at runtime' },
      { from: 'interp', to: 'jit' },
    ],
  },
  m5: {
    width: 760,
    height: 410,
    nodes: [
      { id: 'var', label: 'Variable', x: 130, y: 120, sub: 'a name' },
      { id: 'ptr', label: 'Pointer', x: 130, y: 320, sub: 'holds an address' },
      { id: 'stack', label: 'Stack', x: 420, y: 90, sub: 'fast, scoped, LIFO' },
      { id: 'heap', label: 'Heap', x: 420, y: 300, sub: 'long-lived objects' },
      { id: 'value', label: 'Value + Type', x: 660, y: 90, sub: 'int, float, char' },
      { id: 'gc', label: 'Garbage Collector', x: 660, y: 300, sub: 'frees the unused' },
    ],
    edges: [
      { from: 'var', to: 'stack' },
      { from: 'var', to: 'heap' },
      { from: 'stack', to: 'value' },
      { from: 'var', to: 'ptr' },
      { from: 'ptr', to: 'heap' },
      { from: 'heap', to: 'gc' },
    ],
  },
  m6: {
    width: 760,
    height: 430,
    nodes: [
      { id: 'array', label: 'Array', x: 130, y: 90, sub: 'index O(1)' },
      { id: 'list', label: 'Linked List', x: 400, y: 90, sub: 'insert O(1)' },
      { id: 'stack', label: 'Stack', x: 660, y: 90, sub: 'LIFO' },
      { id: 'queue', label: 'Queue', x: 130, y: 260, sub: 'FIFO' },
      { id: 'hash', label: 'Hash Map', x: 400, y: 260, sub: 'key lookup O(1)' },
      { id: 'tree', label: 'Tree', x: 660, y: 260, sub: 'sorted / nested' },
      { id: 'graph', label: 'Graph', x: 400, y: 400, sub: 'arbitrary edges' },
    ],
    edges: [
      { from: 'array', to: 'list' },
      { from: 'list', to: 'stack' },
      { from: 'array', to: 'queue' },
      { from: 'list', to: 'hash' },
      { from: 'hash', to: 'tree' },
      { from: 'hash', to: 'graph' },
      { from: 'tree', to: 'graph' },
    ],
  },
  m7: {
    width: 760,
    height: 430,
    nodes: [
      { id: 'fn', label: 'Function', x: 130, y: 90, sub: 'named block' },
      { id: 'args', label: 'Arguments', x: 400, y: 90, sub: 'input values' },
      { id: 'if', label: 'if / else', x: 130, y: 260, sub: 'branch' },
      { id: 'loop', label: 'for / while', x: 400, y: 260, sub: 'repeat' },
      { id: 'rec', label: 'Recursion', x: 660, y: 260, sub: 'calls itself' },
      { id: 'base', label: 'Base Case', x: 660, y: 400, sub: 'stops the recursion' },
      { id: 'callstack', label: 'Call Stack', x: 400, y: 400, sub: 'active calls' },
    ],
    edges: [
      { from: 'fn', to: 'args' },
      { from: 'args', to: 'if' },
      { from: 'if', to: 'loop' },
      { from: 'loop', to: 'rec' },
      { from: 'rec', to: 'base' },
      { from: 'base', to: 'callstack' },
    ],
  },
  m8: {
    width: 760,
    height: 470,
    nodes: [
      { id: 'n', label: 'Input size n', x: 130, y: 240, sub: 'grows over time' },
      { id: 'o1', label: 'O(1)', x: 520, y: 60, sub: 'constant' },
      { id: 'olog', label: 'O(log n)', x: 520, y: 160, sub: 'binary search' },
      { id: 'on', label: 'O(n)', x: 520, y: 260, sub: 'single scan' },
      { id: 'onlogn', label: 'O(n log n)', x: 520, y: 360, sub: 'good sorting' },
      { id: 'on2', label: 'O(n²)', x: 520, y: 450, sub: 'nested loops' },
    ],
    edges: [
      { from: 'n', to: 'o1' },
      { from: 'n', to: 'olog' },
      { from: 'n', to: 'on' },
      { from: 'n', to: 'onlogn' },
      { from: 'onlogn', to: 'on2', label: 'worse' },
    ],
  },
  m9: {
    width: 760,
    height: 430,
    nodes: [
      { id: 'class', label: 'Class', x: 160, y: 110, sub: 'the blueprint' },
      { id: 'obj', label: 'Object', x: 480, y: 110, sub: 'an instance' },
      { id: 'fields', label: 'Fields', x: 480, y: 280, sub: 'data / state' },
      { id: 'methods', label: 'Methods', x: 480, y: 400, sub: 'behaviour' },
      { id: 'encaps', label: 'Encapsulation', x: 160, y: 280 },
      { id: 'inherit', label: 'Inheritance', x: 160, y: 400 },
    ],
    edges: [
      { from: 'class', to: 'obj' },
      { from: 'class', to: 'encaps' },
      { from: 'encaps', to: 'inherit' },
      { from: 'obj', to: 'fields' },
      { from: 'obj', to: 'methods' },
      { from: 'fields', to: 'methods' },
    ],
  },
  m10: {
    width: 760,
    height: 430,
    nodes: [
      { id: 'client', label: 'Client', x: 110, y: 90, sub: 'browser' },
      { id: 'dns', label: 'DNS', x: 360, y: 60, sub: 'URL → IP' },
      { id: 'tcp', label: 'TCP', x: 360, y: 160, sub: '3-way handshake' },
      { id: 'tls', label: 'TLS', x: 360, y: 260, sub: 'encryption' },
      { id: 'http', label: 'HTTP', x: 360, y: 360, sub: 'request / response' },
      { id: 'server', label: 'Server', x: 650, y: 360, sub: 'HTML / API' },
      { id: 'threads', label: 'Threads', x: 650, y: 160, sub: 'concurrency' },
    ],
    edges: [
      { from: 'client', to: 'dns' },
      { from: 'dns', to: 'tcp' },
      { from: 'tcp', to: 'tls' },
      { from: 'tls', to: 'http' },
      { from: 'http', to: 'server' },
      { from: 'server', to: 'threads' },
    ],
  },
};

function boxSize(node: NodeSpec) {
  return {
    w: Math.max(84, node.label.length * 7.4 + 28),
    h: node.sub ? 48 : 36,
  };
}

function borderOffset(dx: number, dy: number, halfW: number, halfH: number) {
  const sx = dx === 0 ? Number.POSITIVE_INFINITY : halfW / Math.abs(dx);
  const sy = dy === 0 ? Number.POSITIVE_INFINITY : halfH / Math.abs(dy);
  const s = Math.min(sx, sy);
  return { x: dx * s, y: dy * s };
}

const figureStyle: CSSProperties = {};

export function ModuleDiagram({ id, caption }: { id: string; caption?: string }) {
  const spec = DIAGRAMS[id];
  if (!spec) return null;

  const byId = new Map(spec.nodes.map((node) => [node.id, node]));
  const accent = 'var(--color-fd-primary)';
  const surface = 'var(--color-fd-background)';
  const border = 'var(--color-fd-border)';

  return (
    <figure
      className="not-prose my-6 overflow-hidden rounded-md border border-fd-border bg-fd-card p-4"
      style={figureStyle}
    >
      <svg
        viewBox={`0 0 ${spec.width} ${spec.height}`}
        className="h-auto w-full"
        role="img"
        aria-label={caption ?? 'Lesson diagram'}
      >
        <defs>
          <pattern id={`cs101-dots-${id}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="var(--color-fd-foreground)" opacity="0.05" />
          </pattern>
          <radialGradient id={`cs101-glow-${id}`} cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.10" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <marker id={`cs101-arrow-${id}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={accent} opacity="0.6" />
          </marker>
        </defs>

        <rect width={spec.width} height={spec.height} fill={`url(#cs101-dots-${id})`} />
        <rect width={spec.width} height={spec.height} fill={`url(#cs101-glow-${id})`} />

        {spec.edges.map((edge, i) => {
          const a = byId.get(edge.from);
          const b = byId.get(edge.to);
          if (!a || !b) return null;

          const sa = boxSize(a);
          const sb = boxSize(b);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const start = borderOffset(dx, dy, sa.w / 2, sa.h / 2);
          const end = borderOffset(-dx, -dy, sb.w / 2, sb.h / 2);
          const x1 = a.x + start.x;
          const y1 = a.y + start.y;
          const x2 = b.x + end.x;
          const y2 = b.y + end.y;

          return (
            <g key={`${edge.from}-${edge.to}-${i}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={accent}
                strokeWidth="1.6"
                strokeOpacity="0.5"
                strokeDasharray="6 6"
                markerEnd={`url(#cs101-arrow-${id})`}
              >
                <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.4s" repeatCount="indefinite" />
              </line>
              <circle r="3" fill={accent}>
                <animateMotion dur="2.6s" repeatCount="indefinite" path={`M ${x1} ${y1} L ${x2} ${y2}`} />
              </circle>
              {edge.label ? (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--color-fd-muted-foreground)"
                >
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {spec.nodes.map((node, i) => {
          const { w, h } = boxSize(node);
          return (
            <g key={node.id}>
              <rect
                x={node.x - w / 2}
                y={node.y - h / 2}
                width={w}
                height={h}
                rx="9"
                fill={surface}
                stroke={border}
                strokeWidth="1.2"
              />
              <rect
                x={node.x - w / 2}
                y={node.y - h / 2}
                width={w}
                height={h}
                rx="9"
                fill="none"
                stroke={accent}
                strokeWidth="1.6"
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  values="0;0.55;0"
                  dur="3.4s"
                  begin={`${(i % 5) * 0.35}s`}
                  repeatCount="indefinite"
                />
              </rect>
              <text
                x={node.x}
                y={node.sub ? node.y - 2 : node.y + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="var(--color-fd-foreground)"
              >
                {node.label}
              </text>
              {node.sub ? (
                <text
                  x={node.x}
                  y={node.y + 13}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="var(--color-fd-muted-foreground)"
                >
                  {node.sub}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {caption ? (
        <figcaption className="mt-3 border-t border-fd-border pt-3 text-center text-xs text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
