import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ImgHTMLAttributes } from 'react';
import { Bookshelf } from '@/components/bookshelf';
import { Mermaid } from '@/components/mermaid';
import { ModuleOverview } from '@/components/module-overview';
import { LessonDiagram } from '@/components/intro-to-programming/lesson-diagram';
import { CircuitSimulator } from '@/components/it-support/circuit-simulator';
import { BinarySwitchboard } from '@/components/it-support/binary-switchboard';
import { RgbMixer } from '@/components/it-support/rgb-mixer';
import { ConceptCard } from '@/components/cs101/concept-card';
import { ModuleDiagram } from '@/components/cs101/module-diagram';
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
} from '@/components/cs101/lesson-blocks';
import { LinuxCommandsExplorer } from '@/components/developer-tools/linux-commands-explorer';
import { UvBenchmarkLab } from '@/components/developer-tools/uv-benchmark-lab';
import { UvCommandBuilder } from '@/components/developer-tools/uv-command-builder';
import { UvTerminalSimulator } from '@/components/developer-tools/uv-terminal-simulator';
import { GitGraphSimulator } from '@/components/developer-tools/git-graph-simulator';
import {
  ShellCliGuiComparison,
  ShellPermissionsCalculator,
} from '@/components/developer-tools/shell-simulators';
import { BashSimulator } from '@/components/developer-tools/bash-simulator';
import { PowershellPipelineDemo } from '@/components/developer-tools/powershell-demo';
import {
  PortInspector,
  CidrCalculator,
  FirewallSimulator,
  NatTranslator,
  K8sServiceSimulator,
  PacketJourneyFlow,
} from '@/components/computer-networking/networking-simulators';
import {
  ApiRequestLifecycleDemo,
  ApiTypesExplorer,
  RestBookPlayground,
  GraphqlOverfetchingDemo,
  GrpcStreamingDemo,
  ApiArchitectureChooser,
  ApiKeySecuritySimulator,
} from '@/components/api-design/api-fundamentals-simulator';
import { WorkflowLifecycleSimulator } from '@/components/github-actions/workflow-lifecycle-simulator';
import { MatrixRunnerSimulator } from '@/components/github-actions/matrix-runner-simulator';
import { SecretsAndEnvSimulator } from '@/components/github-actions/secrets-and-env-simulator';
import { ActionAuthoringChooser } from '@/components/github-actions/action-authoring-chooser';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // External docs images (e.g. Wikimedia Special:FilePath redirect URLs with
    // ?width= params) break next/image optimization, which requires configured
    // hosts AND fetchable direct image files. Render as plain <img> so the
    // browser follows redirects natively.
    // eslint-disable-next-line @next/next/no-img-element
    img: ((props: ImgHTMLAttributes<HTMLImageElement> & {
      src?: string | { src: string; width?: number; height?: number };
    }) => {
      const raw = props.src as unknown;
      const resolvedSrc =
        typeof raw === 'object' && raw !== null && 'src' in raw
          ? (raw as { src: string }).src
          : (raw as string | undefined);
      return <img {...props} src={resolvedSrc} loading="lazy" />;
    }) as NonNullable<MDXComponents['img']>,
    // Raw <script> tags inside MDX never execute as React components and trip
    // Next.js's "Encountered a script tag" warning. Drop them explicitly.
    // Interactive lesson demos keep their <script> source visible because it
    // lives inside ```html code fences (rendered as pre/code, not script).
    script: (() => null) as unknown as NonNullable<MDXComponents['script']>,
    ConceptCard,
    ModuleDiagram,
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
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
