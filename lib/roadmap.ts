import {
  BookOpen,
  Bot,
  Brain,
  CodeXml,
  Compass,
  Cpu,
  Database,
  Gauge,
  Globe,
  Hammer,
  Layers,
  Network,
  NotebookText,
  Rocket,
  Server,
  Sparkles,
  Terminal,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type RoadmapCategory =
  | 'Foundations'
  | 'Systems & Data'
  | 'Architecture'
  | 'AI & Intelligence'
  | 'Resources';

export interface RoadmapItem {
  title: string;
  description: string;
  category: RoadmapCategory;
  tags: string[];
  icon: LucideIcon;
  /** Docs slug for this module, or `null` for entries that link elsewhere. */
  slug: string | null;
  href: string;
}

export const roadmapItems: RoadmapItem[] = [
  {
    title: 'Computer Basics',
    description:
      'Foundational mindset, computer science fundamentals from bits to networks, and a gentle intro to programming.',
    category: 'Foundations',
    tags: ['CS Fundamentals', 'Programming Intro', 'Learning Strategy'],
    icon: Compass,
    slug: 'computer-basics',
    href: '/docs/computer-basics',
  },
  {
    title: 'Developer Tools',
    description:
      'Daily local workflow: terminal and shells (Linux Bash, PowerShell), JS package managers (npm, pnpm, bun, deno), Python tooling (pip, uv), and Git.',
    category: 'Foundations',
    tags: ['Terminal & Shells', 'npm / pnpm / bun / deno', 'pip & uv + Git'],
    icon: Hammer,
    slug: 'developer-tools',
    href: '/docs/developer-tools',
  },
  {
    title: 'Learn Python',
    description:
      'Python-first programming: syntax, control flow, functions, data structures, algorithms (Big-O), and paradigms.',
    category: 'Foundations',
    tags: ['Python Syntax', 'Data Structures', 'Algorithms'],
    icon: CodeXml,
    slug: 'learn-python',
    href: '/docs/learn-python',
  },
  {
    title: 'Operating Systems',
    description:
      'How operating systems work: CPU scheduling (EEVDF), futexes, virtual memory, VFS & Page Cache, epoll & io_uring, cgroups v2, and eBPF.',
    category: 'Foundations',
    tags: ['Scheduling & Concurrency', 'Virtual Memory & I/O', 'Containers & eBPF'],
    icon: Terminal,
    slug: 'operating-system',
    href: '/docs/operating-system',
  },
  {
    title: 'Computer Networking',
    description:
      'How networks move your bits: the OSI and TCP/IP models, routing and switching, subnetting, DNS, HTTP/HTTPS, and security basics.',
    category: 'Systems & Data',
    tags: ['TCP/IP', 'DNS & HTTP', 'Network Security'],
    icon: Network,
    slug: 'computer-networking',
    href: '/docs/computer-networking',
  },
  {
    title: 'Databases, SQL & Data-Intensive Systems',
    description:
      'Relational modeling, query optimization, indexing (B-Trees, Hash), ACID transactions, isolation levels, NoSQL, replication, and caching.',
    category: 'Systems & Data',
    tags: ['SQL Tuning', 'ACID Transactions', 'Distributed Storage'],
    icon: Database,
    slug: 'databases-sql',
    href: '/docs/databases-sql',
  },
  {
    title: 'PostgreSQL',
    description:
      'Hands-on PostgreSQL from zero to production: install and psql, data types, indexes and EXPLAIN, transactions and MVCC, backups, roles and security, tuning, replication, and extensions.',
    category: 'Systems & Data',
    tags: ['psql & Data Types', 'Indexes & EXPLAIN', 'Backups & Replication'],
    icon: Server,
    slug: 'postgresql',
    href: '/docs/postgresql',
  },
  {
    title: 'Full Stack Development',
    description:
      'End-to-end web engineering: web foundations (HTML, CSS, JS, TS), modern frontend (React), server runtimes (Node.js, FastAPI), and integrated stacks (Next.js, Electron).',
    category: 'Architecture',
    tags: ['Web Foundations', 'React & Full-Stack', 'APIs & Runtimes'],
    icon: Globe,
    slug: 'full-stack-development',
    href: '/docs/full-stack-development',
  },
  {
    title: 'System Design & Distributed Systems',
    description:
      'From single-server monoliths to planetary architectures: DDIA foundations, storage engines, replication, partitioning, consensus (Raft/Paxos), and Kafka streaming.',
    category: 'Architecture',
    tags: ['DDIA Foundations', 'Replication & Sharding', 'Consensus & Streaming'],
    icon: Layers,
    slug: 'system-design',
    href: '/docs/system-design',
  },
  {
    title: 'DevOps, CI/CD & Performance',
    description:
      'Containerization with Docker, Kubernetes orchestration, automated CI/CD pipelines, observability (metrics, logs, traces), and profiling.',
    category: 'Architecture',
    tags: ['Docker & K8s', 'CI/CD Pipelines', 'Observability'],
    icon: Gauge,
    slug: 'devops-cicd-performance',
    href: '/docs/devops-cicd-performance',
  },
  {
    title: 'Code with AI',
    description:
      'AI-assisted software engineering: AI coding tools, prompt engineering for code, context management, test-driven development with AI, and autonomous agent workflows.',
    category: 'Architecture',
    tags: ['AI Coding Tools', 'Context & Prompts', 'Agent Workflows'],
    icon: Bot,
    slug: 'code-with-ai',
    href: '/docs/code-with-ai',
  },
  {
    title: 'AI / ML Foundations',
    description:
      'Mathematics for ML (linear algebra, multivariate calculus, probability), classical algorithms, loss functions, backprop, and neural networks.',
    category: 'AI & Intelligence',
    tags: ['Linear Algebra', 'Backpropagation', 'Deep Learning'],
    icon: Brain,
    slug: 'ai-ml-foundations',
    href: '/docs/ai-ml-foundations',
  },
  {
    title: 'AI Agents (Loops, Graphs, Swarms)',
    description:
      'ReAct loops, function/tool calling, planning strategies, memory management, stateful graph workflows (LangGraph), and multi-agent coordination.',
    category: 'AI & Intelligence',
    tags: ['Agent Loops', 'Tool Calling', 'Multi-Agent Swarms'],
    icon: Workflow,
    slug: 'ai-agents',
    href: '/docs/ai-agents',
  },
  {
    title: 'Projects',
    description:
      'Learn by building: guided projects that combine modules into real systems you can ship and show.',
    category: 'Resources',
    tags: ['Hands-On Builds', 'Portfolio', 'End-to-End'],
    icon: Rocket,
    slug: 'projects',
    href: '/docs/projects',
  },
  {
    title: 'Cheatsheets',
    description:
      'Condensed one-page references that compress a whole track into tables and memory anchors you can revise at a glance.',
    category: 'Resources',
    tags: ['Quick Reference', 'Memory Anchors', 'Revision'],
    icon: NotebookText,
    slug: 'cheatsheets',
    href: '/docs/cheatsheets',
  },
  {
    title: 'Books Library',
    description:
      'Curated reading list of landmark engineering books, seminal research papers, and essential literature for lifetime mastery.',
    category: 'Resources',
    tags: ['Seminal Books', 'Research Papers', 'Recommended Reading'],
    icon: BookOpen,
    slug: 'books',
    href: '/docs/books',
  },
  {
    title: 'Extra',
    description:
      'Supplementary materials, bonus guides, advanced topics, and additional engineering resources.',
    category: 'Resources',
    tags: ['Supplementary', 'Bonus Guides', 'Advanced Topics'],
    icon: Sparkles,
    slug: 'extra',
    href: '/docs/extra',
  },
];

// Styling per roadmap category, used by both the icon tile and the chip.
// Deliberately monochrome: the design system has no accent hues, so every
// track shares the same quiet hairline-on-ash treatment and stays a record so
// call sites can keep indexing by category.
const trackChip = 'border-fd-border bg-fd-secondary text-fd-muted-foreground';

export const categoryAccents: Record<RoadmapCategory, string> = {
  Foundations: trackChip,
  'Systems & Data': trackChip,
  Architecture: trackChip,
  'AI & Intelligence': trackChip,
  Resources: trackChip,
};

/** The category that the "AI Modules" view narrows the roadmap down to. */
export const AI_CATEGORY: RoadmapCategory = 'AI & Intelligence';

export type RoadmapView = 'all' | 'ai';

export const ROADMAP_VIEWS: { id: RoadmapView; label: string; description: string }[] = [
  {
    id: 'all',
    label: 'All Modules',
    description:
      'The full curriculum, from foundational computer science through systems, architecture, and production AI.',
  },
  {
    id: 'ai',
    label: 'AI Modules',
    description:
      'The AI & Intelligence track only — model foundations, RAG, agents, and production inference.',
  },
];

/** Narrow the roadmap to the modules that belong to a given view. */
export function filterRoadmap(items: RoadmapItem[], view: RoadmapView): RoadmapItem[] {
  return view === 'ai' ? items.filter((item) => item.category === AI_CATEGORY) : items;
}

/** Look a roadmap module up by its docs slug. */
export function getRoadmapModule(slug: string): RoadmapItem | undefined {
  return roadmapItems.find((item) => item.slug === slug);
}
