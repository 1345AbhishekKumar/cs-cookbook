# Developer Tools Full Parity Implementation Plan

> **Goal:** Bridge all remaining interactive gaps between the original `tools-learn` HTML files and the `components/developer-tools` suite in CS-cookbook, achieving 100% feature and interactive parity.

**Architecture:**
1. Build reusable interactive UI primitives (a resilient `<Quiz>` component).
2. Expand `components/developer-tools/shell-simulators.tsx` with the 3 missing interactive widgets from `shell_CLI.html` (Redirection, Loop Stepper, Conditional Chaining).
3. Enhance `components/developer-tools/git-graph-simulator.tsx` with scenario switching (Fast-forward merge, 3-way merge, rebase).
4. Create a new `components/developer-tools/package-manager-matrix.tsx` for `bun`, `npm`, `pnpm`, and `yarn` (command translator, hard link visualizer, benchmarks).
5. Embed all components into their respective MDX documentation pages and verify with `npm run build`.

**Tech Stack:** Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS, Lucide React, Fumadocs MDX.

---

### Task 1: Reusable Interactive Quiz Component

**Files:**
- Create: `components/developer-tools/quiz.tsx`
- Modify: `components/mdx.tsx`

**Step 1: Write `components/developer-tools/quiz.tsx`**
- Implement `<Quiz question="..." options={[...]} answerIndex={0} explanation="..." />`.
- Supports single-choice selection, immediate color-coded feedback (emerald for correct, red for incorrect), explanation box upon selection, and a reset button.

**Step 2: Register in `components/mdx.tsx`**
- Import `Quiz` from `@/components/developer-tools/quiz`.
- Export `Quiz` in `getMDXComponents()`.

**Step 3: Verification**
- Run: `npx tsc --noEmit` to verify type safety.

---

### Task 2: Implement Missing Shell Simulators

**Files:**
- Modify: `components/developer-tools/shell-simulators.tsx`
- Modify: `components/mdx.tsx`
- Modify: `content/docs/developer-tools/shell-cli.mdx`

**Step 1: Add new simulators in `components/developer-tools/shell-simulators.tsx`**
1. `ShellRedirectionSimulator`:
   - Interactive toggle for overwrite (`>`) vs append (`>>`) vs stderr redirect (`2> error.log`).
   - Live simulated file buffer output showing text appending or truncating.
2. `ShellLoopStepper`:
   - Stepper for `for file in server1.log server2.log server3.log; do gzip "$file"; done`.
   - Visual step-by-step state tracker showing `$file` variable substitution and file compression state.
3. `ShellConditionalsRunner`:
   - Slider or toggle to simulate command exit code (`0` vs `1`).
   - Visual execution path showing whether `cmd1 && cmd2 || cmd3` short-circuits.

**Step 2: Export in `components/mdx.tsx`**
- Register `ShellRedirectionSimulator`, `ShellLoopStepper`, `ShellConditionalsRunner`.

**Step 3: Embed in `content/docs/developer-tools/shell-cli.mdx`**
- Add `<ShellRedirectionSimulator />` under *I/O Redirection*.
- Add `<ShellLoopStepper />` under *Loops & Iteration*.
- Add `<ShellConditionalsRunner />` under *Exit Status & Conditionals*.

---

### Task 3: Expand Git Graph Simulator with Advanced Scenarios

**Files:**
- Modify: `components/developer-tools/git-graph-simulator.tsx`
- Modify: `content/docs/developer-tools/git.mdx`

**Step 1: Add Scenario Selector to `GitGraphSimulator`**
- Support 3 selectable modes:
  1. `Three Trees & Staging Lifecycle` (existing stages 1–6)
  2. `Fast-Forward vs 3-Way Merge` (visualizing divergent branches merging with a merge commit C4)
  3. `Rebase onto Main` (visualizing C2 and C3 replay onto updated main commit C4)

**Step 2: Test & Embed in `content/docs/developer-tools/git.mdx`**
- Ensure `<GitGraphSimulator />` handles tab switching smoothly on client side.

---

### Task 4: Unified Package Manager Explorer Component

**Files:**
- Create: `components/developer-tools/package-manager-matrix.tsx`
- Modify: `components/mdx.tsx`
- Modify: `content/docs/developer-tools/bun-vs-npm.mdx`
- Modify: `content/docs/developer-tools/pnpm.mdx`

**Step 1: Write `components/developer-tools/package-manager-matrix.tsx`**
- Component: `PackageManagerMatrix`
  1. **Command Rosetta Stone**: Select action (Install, Add Prod, Add Dev, Global, Run, Remove, Lockfile sync) -> displays syntax across `npm`, `yarn`, `pnpm`, and `bun` with copy button.
  2. **Disk Storage Visualizer**: Interactive toggle showing how `pnpm` uses a single content-addressable hard link store vs `npm` duplicating `node_modules` across 5 projects (saving ~80% disk space).
  3. **Speed Benchmark Comparison**: Interactive bars comparing cold install, warm cache, and script startup times.

**Step 2: Register in `components/mdx.tsx`**
- Export `PackageManagerMatrix`.

**Step 3: Embed in MDX pages**
- Place `<PackageManagerMatrix />` at the top of `content/docs/developer-tools/bun-vs-npm.mdx` and `content/docs/developer-tools/pnpm.mdx`.

---

### Task 5: Port Interactive Quizzes to `git.mdx` and `uv.mdx`

**Files:**
- Modify: `content/docs/developer-tools/uv.mdx`
- Modify: `content/docs/developer-tools/git.mdx`

**Step 1: Add UV Quizzes to `uv.mdx`**
- Port the 4 quizzes from `tools-learn/UV.html` (e.g. resolution engine, global cache, `uvx` ephemeral execution, lockfile determinism).

**Step 2: Add Milestone Quizzes to `git.mdx`**
- Place interactive `<Quiz />` checkpoints at key milestones:
  - After Module 5 (Three Trees & Staging)
  - After Module 15 (Branching & Detached HEAD)
  - After Module 25 (Merge vs Rebase)
  - After Module 33 (Reflog & Recovery)

---

### Task 6: Full Build & Static Page Generation Verification

**Step 1: Run TypeScript Check**
```powershell
npx tsc --noEmit
```
Expected: 0 errors.

**Step 2: Run Production Build**
```powershell
npm run build
```
Expected: All 816+ static routes compile successfully with zero Turbopack/Next.js warnings or hydration mismatches.
