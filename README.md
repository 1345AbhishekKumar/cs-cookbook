# Learning Roadmap (CS Cookbook)

A comprehensive, interactive curriculum and technical reference manual spanning foundational computer science, systems engineering, distributed architecture, full-stack web engineering, and modern production AI.

Powered by **Next.js 16 (App Router & Turbopack)**, **React 19**, **Fumadocs**, and **Tailwind CSS v4**, this platform features 860+ in-depth lessons, interactive browser simulators, KaTeX-rendered mathematical proofs, and executable architecture diagrams.

---

## Table of Contents

- [Overview](#overview)
- [Curriculum Tracks](#curriculum-tracks)
- [Interactive Features & Simulators](#interactive-features--simulators)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Running the Development Server](#running-the-development-server)
- [Available Scripts](#available-scripts)
- [Troubleshooting & Performance Tips](#troubleshooting--performance-tips)
- [LLM & AI Integration](#llm--ai-integration)
- [Contributing](#contributing)

---

## Overview

The **Learning Roadmap** is structured into progressive tracks designed to take an engineer from raw computing fundamentals up to designing distributed systems and deploying production-grade AI agents:

- **Concept-first with physical intuition**: Mechanical sympathy, memory layouts, network packets, and operating system kernels.
- **Hands-on interactive learning**: Embedded browser-based simulators for logic gates, binary math, subnets, packet journeys, Git workflows, and API architectures.
- **Production-grade depth**: Deep dives into PostgreSQL internals, ACID guarantees, B-Trees, Linux kernel schedulers (EEVDF), epoll/io_uring, eBPF, LangGraph, and multi-agent systems.

---

## Curriculum Tracks

The syllabus comprises 16 core modules arranged into 5 major tracks:

### 1. Foundations
| Module | Slug | Description |
|---|---|---|
| **Computer Basics** | `/docs/computer-basics` | Bits & bytes, binary arithmetic, hardware abstraction, von Neumann architecture, intro to programming. |
| **Developer Tools** | `/docs/developer-tools` | Terminal & shells (Bash, PowerShell), package managers (npm, pnpm, bun, deno), Python tooling (pip, uv), and Git. |
| **Learn Python** | `/docs/learn-python` | Python syntax, data structures, algorithms, Big-O complexity, paradigms, and idiomatic practices. |
| **Operating Systems** | `/docs/operating-system` | CPU scheduling (EEVDF), futexes, virtual memory, VFS & Page Cache, epoll & io_uring, cgroups v2, and eBPF. |

### 2. Systems & Data
| Module | Slug | Description |
|---|---|---|
| **Computer Networking** | `/docs/computer-networking` | OSI & TCP/IP stack, routing & switching, subnetting/CIDR, DNS, HTTP/1-2-3, TLS handshake, and network security. |
| **Databases, SQL & Data Systems** | `/docs/databases-sql` | Relational modeling, query optimization, indexing (B-Trees, Hash, LSM), ACID transactions, isolation levels, sharding, and consensus. |
| **PostgreSQL** | `/docs/postgresql` | Installation, `psql`, PostgreSQL data types, EXPLAIN ANALYZE, MVCC, write-ahead logs (WAL), backups, roles, replication, and extensions. |

### 3. Architecture
| Module | Slug | Description |
|---|---|---|
| **Full Stack Development** | `/docs/full-stack-development` | Web foundations (HTML/CSS/JS/TS), React 19, FastAPI backends, Next.js full-stack apps, and Electron desktop development. |
| **System Design & Backend Architecture** | `/docs/system-design` | Distributed systems, microservices vs monoliths, load balancing, message brokers, caching strategies, rate limiting, and CAP theorem. |
| **DevOps, CI/CD & Performance** | `/docs/devops-cicd-performance` | Docker containers, Kubernetes orchestration, CI/CD pipelines, observability (metrics, logs, traces), and profiling. |
| **Code with AI** | `/docs/code-with-ai` | AI-assisted development, LLM prompting for code, context engineering, spec-driven coding, and agent-assisted workflows. |

### 4. AI & Intelligence
| Module | Slug | Description |
|---|---|---|
| **AI / ML Foundations** | `/docs/ai-ml-foundations` | Math for ML (linear algebra, calculus, probability), classical algorithms, loss functions, backprop, and neural networks. |
| **AI Agents (Loops, Graphs, Swarms)** | `/docs/ai-agents` | ReAct loops, tool calling, planning strategies, memory systems, stateful graph workflows (LangGraph), and multi-agent coordination. |

### 5. Resources & References
| Module | Slug | Description |
|---|---|---|
| **Projects** | `/docs/projects` | Hands-on, end-to-end milestone projects to synthesize multiple modules into portfolio-grade applications. |
| **Cheatsheets** | `/docs/cheatsheets` | One-page high-density reference cards, memory anchors, and quick-lookup command sheets. |
| **Books Library** | `/docs/books` | Curated reading list of seminal textbooks, classic papers, and essential computer science literature. |

---

## Interactive Features & Simulators

The documentation includes custom, interactive client-side components to reinforce complex concepts:

- **Circuit Simulator & Binary Switchboard**: Interactive logic gates and byte-level manipulation (`components/it-support`).
- **Developer Tools Simulators**: Linux permissions calculator, interactive Git graph visualizer, and uv vs pip benchmark comparisons (`components/developer-tools`).
- **Networking Simulators**: Port inspector, CIDR subnet calculator, NAT translator, and packet journey visualizers (`components/computer-networking`).
- **API Architecture Playground**: Interactive REST vs GraphQL over-fetching visualizer, gRPC streaming demo, and API key security sandbox (`components/api-design`).
- **Mermaid & KaTeX**: Diagrammatic system architectures via Mermaid.js and typographic mathematical formulas rendered via KaTeX.
- **Module Switcher**: Quick-jump dropdown located in the docs sidebar banner to seamlessly jump between tracks.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Documentation Engine**: [Fumadocs](https://fumadocs.dev/) (`fumadocs-ui`, `fumadocs-core`, `fumadocs-mdx`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with an OpenAI-inspired editorial monochrome theme
- **Content Format**: MDX with syntax highlighting, custom React component shortcodes, and remark/rehype plugins
- **Diagrams & Math**: [Mermaid.js](https://mermaid.js.org/), [KaTeX](https://katex.org/), `remark-math`, `rehype-katex`
- **Animations & Icons**: [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/), [GSAP](https://gsap.com/)
- **Type Checking**: TypeScript 7

---

## Project Structure

```text
CS-cookbook/
├── app/
│   ├── (home)/              # Landing page with roadmap table of contents & filter pills
│   ├── docs/
│   │   ├── [[...slug]]/     # Dynamic MDX documentation route
│   │   └── layout.tsx       # DocsLayout wrapper with sidebar & ModuleSwitcher
│   ├── api/search/          # Fumadocs search route handler
│   ├── llms.txt/            # Route handler for LLM-readable index
│   ├── llms-full.txt/       # Full corpus export route handler for LLMs
│   ├── global.css           # Tailwind CSS v4 imports & monochrome theme overrides
│   └── layout.tsx           # Root HTML layout with Fumadocs RootProvider
├── components/
│   ├── mdx.tsx              # MDX custom component registry
│   ├── module-switcher.tsx  # Curriculum module switcher in docs sidebar
│   ├── roadmap-grid.tsx     # Filterable module grid on homepage
│   ├── api-design/          # Interactive API design simulators
│   ├── computer-networking/ # Interactive network & CIDR simulators
│   ├── developer-tools/     # Interactive Git & CLI simulators
│   └── it-support/          # Interactive hardware & binary simulators
├── content/
│   └── docs/                # 860+ MDX lesson files organized by module slug
├── lib/
│   ├── layout.shared.tsx    # Shared Fumadocs layout options & nav settings
│   ├── roadmap.ts           # Roadmap catalog, module metadata, categories & icons
│   ├── shared.ts            # Site configuration, route constants, and Git links
│   └── source.ts            # Fumadocs loader instance and content sources
├── public/                  # Static assets and images
├── next.config.mjs          # Next.js configuration with Fumadocs MDX wrapper & redirects
├── source.config.ts         # Fumadocs MDX collection configuration, plugins, & KaTeX
└── package.json             # Scripts and dependencies
```

---

## Getting Started

### Prerequisites

- **Node.js**: v20.x or higher (v22+ recommended)
- **Package Manager**: `npm`, `pnpm`, or `bun`

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/CS-cookbook.git
   cd CS-cookbook
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

### Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server with Turbopack. |
| `npm run build` | Compiles the production build. |
| `npm run start` | Runs the compiled production server. |
| `npm run types:check` | Generates Next.js types and runs `tsc --noEmit` to verify type safety. |

---

## Troubleshooting & Performance Tips

### Cold Compile Wait Time (~30–45s)
Because there are **860+ MDX files** in `content/docs`, on the **very first request** after starting `npm run dev` on a clean cache, Next.js and Fumadocs compile the dynamic documentation tree:

```text
○ Compiling /docs/[[...slug]] ...
✓ Finished writing to filesystem cache in 34.3s
```

> **Important**: Do not stop or restart the server during this step. Next.js streams HTML chunks during compilation; stopping the server interrupts the stream, leaving the browser with un-hydrated, unclickable HTML. Once the filesystem cache is written, all subsequent page loads take **100–300ms**.

### Do Not Routinely Delete `.next`
Deleting `.next` purges the Turbopack filesystem cache, forcing the entire 35+ second cold compilation to run again on the next page view. Only delete `.next` if you have corrupted build artifacts or updated core dependencies.

---

## LLM & AI Integration

This repository implements the [`/llms.txt`](https://llmstxt.org/) specification for feeding content directly into AI assistants and LLMs:

- `/llms.txt`: A concise markdown summary and link index of all curriculum sections.
- `/llms-full.txt`: A full text concatenation of documentation pages for deep context retrieval.
- `/docs/[...slug]/content.md`: Raw Markdown endpoint for any individual documentation page.

---

## Contributing

1. Create a feature branch (`git checkout -b feature/new-lesson`).
2. Add your content in MDX under `content/docs/<module>/`.
3. If introducing interactive React widgets, register them in `components/mdx.tsx`.
4. Run `npm run types:check` to ensure type consistency.
5. Submit a pull request.
# cs-cookbook
