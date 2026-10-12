import defaultMdxComponents from "fumadocs-ui/mdx";
import dynamic from "next/dynamic";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { File, Folder, Files } from "fumadocs-ui/components/files";
import {
  Card as FumadocsCard,
  Cards as FumadocsCards,
} from "fumadocs-ui/components/card";
import { TypeTable } from "fumadocs-ui/components/type-table";
import * as LucideIcons from "lucide-react";
import type { MDXComponents } from "mdx/types";
import type { ImgHTMLAttributes } from "react";
import { ModuleOverview } from "@/components/module-overview";
import { ConceptCard } from "@/components/cs101/concept-card";
import {
  AnalogyCard,
  Concepts,
  Explain,
  Flashcard,
  LessonIntro,
  LessonNote,
  QuickRecall,
  Takeaway,
  TryIt,
} from "@/components/cs101/lesson-blocks";

// Helper skeleton for lazy interactive simulators
const SimLoader = () => (
  <div className="not-prose my-6 flex h-48 w-full animate-pulse items-center justify-center rounded-xl border border-fd-border bg-fd-card/50 text-xs text-fd-muted-foreground font-mono">
    Loading interactive simulator...
  </div>
);

const cardIconCache = new Map<string, any>();

function resolveCardIcon(icon: React.ReactNode): React.ReactNode {
  if (typeof icon !== "string") return icon;
  const clean = icon.trim().replace(/^['"]|['"]$/g, "");
  if (!clean) return icon;

  if (cardIconCache.has(clean)) {
    const Cached = cardIconCache.get(clean);
    return Cached ? <Cached className="size-4" /> : icon;
  }

  const pascal = clean
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  const IconComp =
    (LucideIcons.icons as Record<string, any>)[clean] ||
    (LucideIcons.icons as Record<string, any>)[pascal];

  cardIconCache.set(clean, IconComp || null);

  if (IconComp) {
    const Component = IconComp as React.ComponentType<{ className?: string }>;
    return <Component className="size-4" />;
  }
  return icon;
}

const Card = (props: React.ComponentProps<typeof FumadocsCard>) => {
  return <FumadocsCard {...props} icon={resolveCardIcon(props.icon)} />;
};

// Dynamic imports for heavy interactive client simulators to eliminate route compilation bottlenecks
const Mermaid = dynamic(
  () => import("@/components/mermaid").then((mod) => mod.Mermaid),
  {
    loading: () => (
      <div className="not-prose my-6 h-32 animate-pulse rounded-md border border-fd-border bg-fd-card/50" />
    ),
  }
);
const Bookshelf = dynamic(
  () => import("@/components/bookshelf").then((mod) => mod.Bookshelf),
  {
    loading: () => (
      <div className="not-prose my-6 h-48 animate-pulse rounded-md border border-fd-border bg-fd-card/50" />
    ),
  }
);
const LessonDiagram = dynamic(
  () =>
    import("@/components/intro-to-programming/lesson-diagram").then(
      (mod) => mod.LessonDiagram
    ),
  {
    loading: () => (
      <div className="not-prose my-6 h-48 animate-pulse rounded-md border border-fd-border bg-fd-card/50" />
    ),
  }
);
const ModuleDiagram = dynamic(
  () =>
    import("@/components/cs101/module-diagram").then(
      (mod) => mod.ModuleDiagram
    ),
  {
    loading: () => (
      <div className="not-prose my-6 h-48 animate-pulse rounded-md border border-fd-border bg-fd-card/50" />
    ),
  }
);
const CircuitSimulator = dynamic(
  () =>
    import("@/components/it-support/circuit-simulator").then(
      (mod) => mod.CircuitSimulator
    ),
  { loading: SimLoader }
);
const BinarySwitchboard = dynamic(
  () =>
    import("@/components/it-support/binary-switchboard").then(
      (mod) => mod.BinarySwitchboard
    ),
  { loading: SimLoader }
);
const RgbMixer = dynamic(
  () => import("@/components/it-support/rgb-mixer").then((mod) => mod.RgbMixer),
  { loading: SimLoader }
);
const OopSimulator = dynamic(
  () =>
    import("@/components/cs101/oop-simulator").then((mod) => mod.OopSimulator),
  { loading: SimLoader }
);
const LinuxCommandsExplorer = dynamic(
  () =>
    import("@/components/developer-tools/linux-commands-explorer").then(
      (mod) => mod.LinuxCommandsExplorer
    ),
  { loading: SimLoader }
);
const UvBenchmarkLab = dynamic(
  () =>
    import("@/components/developer-tools/uv-benchmark-lab").then(
      (mod) => mod.UvBenchmarkLab
    ),
  { loading: SimLoader }
);
const UvCommandBuilder = dynamic(
  () =>
    import("@/components/developer-tools/uv-command-builder").then(
      (mod) => mod.UvCommandBuilder
    ),
  { loading: SimLoader }
);
const UvTerminalSimulator = dynamic(
  () =>
    import("@/components/developer-tools/uv-terminal-simulator").then(
      (mod) => mod.UvTerminalSimulator
    ),
  { loading: SimLoader }
);
const GitGraphSimulator = dynamic(
  () =>
    import("@/components/developer-tools/git-graph-simulator").then(
      (mod) => mod.GitGraphSimulator
    ),
  { loading: SimLoader }
);
const ShellCliGuiComparison = dynamic(
  () =>
    import("@/components/developer-tools/shell-simulators").then(
      (mod) => mod.ShellCliGuiComparison
    ),
  { loading: SimLoader }
);
const ShellPermissionsCalculator = dynamic(
  () =>
    import("@/components/developer-tools/shell-simulators").then(
      (mod) => mod.ShellPermissionsCalculator
    ),
  { loading: SimLoader }
);
const BashSimulator = dynamic(
  () =>
    import("@/components/developer-tools/bash-simulator").then(
      (mod) => mod.BashSimulator
    ),
  { loading: SimLoader }
);
const PowershellPipelineDemo = dynamic(
  () =>
    import("@/components/developer-tools/powershell-demo").then(
      (mod) => mod.PowershellPipelineDemo
    ),
  { loading: SimLoader }
);
const PortInspector = dynamic(
  () =>
    import("@/components/computer-networking/networking-simulators").then(
      (mod) => mod.PortInspector
    ),
  { loading: SimLoader }
);
const CidrCalculator = dynamic(
  () =>
    import("@/components/computer-networking/networking-simulators").then(
      (mod) => mod.CidrCalculator
    ),
  { loading: SimLoader }
);
const FirewallSimulator = dynamic(
  () =>
    import("@/components/computer-networking/networking-simulators").then(
      (mod) => mod.FirewallSimulator
    ),
  { loading: SimLoader }
);
const NatTranslator = dynamic(
  () =>
    import("@/components/computer-networking/networking-simulators").then(
      (mod) => mod.NatTranslator
    ),
  { loading: SimLoader }
);
const K8sServiceSimulator = dynamic(
  () =>
    import("@/components/computer-networking/networking-simulators").then(
      (mod) => mod.K8sServiceSimulator
    ),
  { loading: SimLoader }
);
const PacketJourneyFlow = dynamic(
  () =>
    import("@/components/computer-networking/networking-simulators").then(
      (mod) => mod.PacketJourneyFlow
    ),
  { loading: SimLoader }
);
const ApiRequestLifecycleDemo = dynamic(
  () =>
    import("@/components/api-design/api-fundamentals-simulator").then(
      (mod) => mod.ApiRequestLifecycleDemo
    ),
  { loading: SimLoader }
);
const ApiTypesExplorer = dynamic(
  () =>
    import("@/components/api-design/api-fundamentals-simulator").then(
      (mod) => mod.ApiTypesExplorer
    ),
  { loading: SimLoader }
);
const RestBookPlayground = dynamic(
  () =>
    import("@/components/api-design/api-fundamentals-simulator").then(
      (mod) => mod.RestBookPlayground
    ),
  { loading: SimLoader }
);
const GraphqlOverfetchingDemo = dynamic(
  () =>
    import("@/components/api-design/api-fundamentals-simulator").then(
      (mod) => mod.GraphqlOverfetchingDemo
    ),
  { loading: SimLoader }
);
const GrpcStreamingDemo = dynamic(
  () =>
    import("@/components/api-design/api-fundamentals-simulator").then(
      (mod) => mod.GrpcStreamingDemo
    ),
  { loading: SimLoader }
);
const ApiArchitectureChooser = dynamic(
  () =>
    import("@/components/api-design/api-fundamentals-simulator").then(
      (mod) => mod.ApiArchitectureChooser
    ),
  { loading: SimLoader }
);
const ApiKeySecuritySimulator = dynamic(
  () =>
    import("@/components/api-design/api-fundamentals-simulator").then(
      (mod) => mod.ApiKeySecuritySimulator
    ),
  { loading: SimLoader }
);
const WorkflowLifecycleSimulator = dynamic(
  () =>
    import("@/components/github-actions/workflow-lifecycle-simulator").then(
      (mod) => mod.WorkflowLifecycleSimulator
    ),
  { loading: SimLoader }
);
const MatrixRunnerSimulator = dynamic(
  () =>
    import("@/components/github-actions/matrix-runner-simulator").then(
      (mod) => mod.MatrixRunnerSimulator
    ),
  { loading: SimLoader }
);
const SecretsAndEnvSimulator = dynamic(
  () =>
    import("@/components/github-actions/secrets-and-env-simulator").then(
      (mod) => mod.SecretsAndEnvSimulator
    ),
  { loading: SimLoader }
);
const ActionAuthoringChooser = dynamic(
  () =>
    import("@/components/github-actions/action-authoring-chooser").then(
      (mod) => mod.ActionAuthoringChooser
    ),
  { loading: SimLoader }
);

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // External docs images (e.g. Wikimedia Special:FilePath redirect URLs with
    // ?width= params) break next/image optimization, which requires configured
    // hosts AND fetchable direct image files. Render as plain <img> so the
    // browser follows redirects natively.
    // eslint-disable-next-line @next/next/no-img-element
    img: ((
      props: ImgHTMLAttributes<HTMLImageElement> & {
        src?: string | { src: string; width?: number; height?: number };
      }
    ) => {
      const raw = props.src as unknown;
      const resolvedSrc =
        typeof raw === "object" && raw !== null && "src" in raw
          ? (raw as { src: string }).src
          : (raw as string | undefined);
      return <img {...props} src={resolvedSrc} loading="lazy" />;
    }) as NonNullable<MDXComponents["img"]>,
    // Raw <script> tags inside MDX never execute as React components and trip
    // Next.js's "Encountered a script tag" warning. Drop them explicitly.
    // Interactive lesson demos keep their <script> source visible because it
    // lives inside ```html code fences (rendered as pre/code, not script).
    script: (() => null) as unknown as NonNullable<MDXComponents["script"]>,
    Tab,
    Tabs,
    Step,
    Steps,
    Card,
    Cards: FumadocsCards,
    Accordion,
    Accordions,
    File,
    Folder,
    Files,
    TypeTable,
    ConceptCard,
    ModuleDiagram,
    OopSimulator,
    Mermaid,
    LessonDiagram,
    ModuleOverview,
    Bookshelf,
    LessonIntro,
    Concepts,
    AnalogyCard,
    LessonNote,
    Flashcard,
    QuickRecall,
    Explain,
    TryIt,
    Takeaway,
    CircuitSimulator,
    BinarySwitchboard,
    RgbMixer,
    LinuxCommandsExplorer,
    UvBenchmarkLab,
    UvCommandBuilder,
    UvTerminalSimulator,
    GitGraphSimulator,
    ShellCliGuiComparison,
    ShellPermissionsCalculator,
    BashSimulator,
    PowershellPipelineDemo,
    PortInspector,
    CidrCalculator,
    FirewallSimulator,
    NatTranslator,
    K8sServiceSimulator,
    PacketJourneyFlow,
    ApiRequestLifecycleDemo,
    ApiTypesExplorer,
    RestBookPlayground,
    GraphqlOverfetchingDemo,
    GrpcStreamingDemo,
    ApiArchitectureChooser,
    ApiKeySecuritySimulator,
    WorkflowLifecycleSimulator,
    MatrixRunnerSimulator,
    SecretsAndEnvSimulator,
    ActionAuthoringChooser,
    ...components,
  } as MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
