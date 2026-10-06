# Stanford CS329A: Self-Improving AI Agents — Implementation Plan

> **Goal:** Create an exhaustive, production-grade documentation curriculum based on Stanford CS329A (*Self-Improving AI Agents*) in `content/docs/ai-agents/self-improving-ai-agents/`, completely distinct from `self-evolving-agents`, equipped with rich Mermaid diagrams, mathematical formulations, seminal paper citations, and practical Python implementations.

**Architecture:**
1. Dedicated directory: `content/docs/ai-agents/self-improving-ai-agents/`.
2. Navigation registration: Configure `self-improving-ai-agents/meta.json` and integrate into `content/docs/ai-agents/meta.json` and `content/docs/ai-agents/index.mdx`.
3. 10 Comprehensive MDX lessons covering the full 9-part lecture series:
   - `index.mdx`: Course syllabus, navigation map, prerequisites, and learning roadmap.
   - `01-paradigm-shift-and-scaling-foundations.mdx`: Lecture 1 (Scaling limits, 3 stages, pass@k, o1/R1 emergence).
   - `02-test-time-compute-scaling-and-search.mdx`: Lecture 2 (Repeated sampling, coverage vs voting, Snell's Pareto frontier, Archon).
   - `03-robust-verification-and-reward-models.mdx`: Lecture 3 (Generation-verification gap, ORMs vs PRMs, Math-Shepherd, Goodhart's law).
   - `04-grounded-feedback-tools-and-code.mdx`: Lecture 4 (ReAct loops, RLEF 2-tier testing, Reflexion verbal memory).
   - `05-planning-mcts-and-multi-step-reasoning.mdx`: Lecture 5 (LATS, Tree of Thoughts, MCTS for language agents, SPRINT).
   - `06-train-time-scaling-and-scaling-rl.mdx`: Lecture 6 (STaR rationalization, GRPO without critic, RLVR, DAPO).
   - `07-deep-research-and-scaled-systems.mdx`: Lecture 7 (AlphaCode 1/2 clustering & filtering, Deep Research, Agentic Context Engineering).
   - `08-agentic-evaluations-and-benchmarking.mdx`: Lecture 8 (Evaluation crisis, GAIA, SWE-bench, GDPVal, DeepScholar-Bench).
   - `09-frontiers-self-generation-and-safety.mdx`: Lecture 9 (Multi-agent fine-tuning, Absolute Zero self-generation, Intelligence per Watt, Safety).
4. Rigorous verification: Run Next.js / Fumadocs build checks (`npx tsc --noEmit` / `npm run build`) to ensure zero broken links, invalid JSX/MDX, or malformed Mermaid blocks.

**Tech Stack:** Next.js 16, React 19, Fumadocs MDX, Tailwind CSS, Lucide React, KaTeX, Mermaid.

---

### Task 1: Directory Setup & Root Navigation Wiring

**Files:**
- Create: `content/docs/ai-agents/self-improving-ai-agents/meta.json`
- Modify: `content/docs/ai-agents/meta.json`
- Modify: `content/docs/ai-agents/index.mdx`

**Step 1: Create `self-improving-ai-agents/meta.json`**
Configure page ordering and sidebar title:
```json
{
  "title": "Self-Improving AI Agents (CS329A)",
  "icon": "BrainCircuit",
  "pages": [
    "index",
    "01-paradigm-shift-and-scaling-foundations",
    "02-test-time-compute-scaling-and-search",
    "03-robust-verification-and-reward-models",
    "04-grounded-feedback-tools-and-code",
    "05-planning-mcts-and-multi-step-reasoning",
    "06-train-time-scaling-and-scaling-rl",
    "07-deep-research-and-scaled-systems",
    "08-agentic-evaluations-and-benchmarking",
    "09-frontiers-self-generation-and-safety"
  ]
}
```

**Step 2: Update `content/docs/ai-agents/meta.json`**
Add `"self-improving-ai-agents"` directly after `"agent-engineer"` and before `"self-evolving-agents"`.

**Step 3: Update `content/docs/ai-agents/index.mdx`**
Add the sub-module card/bullet with description highlighting the Stanford CS329A lecture series.

**Step 4: Verification**
Verify JSON syntax and path integrity using `python -m json.tool`.

---

### Task 2: Create Course Index & Syllabus Roadmap (`index.mdx`)

**Files:**
- Create: `content/docs/ai-agents/self-improving-ai-agents/index.mdx`

**Content Specification:**
- **Title**: *Self-Improving AI Agents (Stanford CS329A)*
- **Description**: Master test-time compute scaling, process reward models (PRMs), environment feedback loops, MCTS planning (LATS), train-time RL scaling (GRPO/STaR), deep research agents, and long-horizon evaluations.
- **Instructors & Provenance**: Stanford University CS329A (Prof. Azalia Mirhoseini, guest lecturers).
- **Core Architecture Diagram**: Full 4-stage pipeline diagram showing how pre-trained models transition through inference search, verification, and weight bootstrapping.
- **Course Matrix**: Table mapping each module to its prerequisite papers, algorithmic paradigms, and practical implementations.

---

### Task 3: Module 01 — The Paradigm Shift & Scaling Foundations

**Files:**
- Create: `content/docs/ai-agents/self-improving-ai-agents/01-paradigm-shift-and-scaling-foundations.mdx`
- **Source**: Transcript Part 1 (`6YnLB0XbTnI`)
- **Key Concepts**:
  - The exhaustion of pre-training scaling laws (Kaplan, Chinchilla) and the compute/data wall.
  - The 3-stage lifecycle: Pre-training (compression) $\to$ Post-training (alignment/RL) $\to$ Test-time compute (dynamic inference search).
  - Pass@1 vs Pass@$k$ mathematics and probability of discovery under repeated attempts.
  - The genesis of reasoning models: OpenAI o1, DeepSeek-R1, and Sakana AI's *The AI Scientist*.
- **Mermaid Diagram**: Three-stage compute allocation model vs capability curves.
- **Code Implementation**: Exact hypergeometric unbiased estimator for $\text{pass}@k$ in Python.

---

### Task 4: Module 02 — Test-Time Compute Scaling & Search

**Files:**
- Create: `content/docs/ai-agents/self-improving-ai-agents/02-test-time-compute-scaling-and-search.mdx`
- **Source**: Transcript Part 2 (`-Ggc37xLj_Y`)
- **Key Concepts**:
  - *Large Language Monkeys* (Brown et al., 2024): Infinite monkey theorem in LLMs; Coverage vs Majority Voting.
  - Snell et al. (2024): Optimal test-time compute allocation; Trading inference FLOPs for model size.
  - Parallel generation (Best-of-$N$) vs Sequential revision (Tree search/Re-prompting).
  - *Archon*: Architecture search framework for multi-agent inference pipelines (generators, verifiers, rankers).
- **Mermaid Diagrams**:
  1. Coverage curve vs Majority voting curve as $N \to 1000$.
  2. Difficulty-aware compute routing flow (Greedy $\to$ Best-of-$N$ $\to$ Search).
- **Code Implementation**: Python Best-of-$N$ search harness with budget controller, temperature scaling, and Pareto-frontier evaluator.

---

### Task 5: Module 03 — Robust Verification & Reward Models

**Files:**
- Create: `content/docs/ai-agents/self-improving-ai-agents/03-robust-verification-and-reward-models.mdx`
- **Source**: Transcript Part 3 (`p7TdPUcPoik`)
- **Key Concepts**:
  - The Generation-Verification Gap: Why verifying is asymptotically easier than generating, and how imperfect verifiers fail.
  - Outcome Reward Models (ORMs) vs Process Reward Models (PRMs).
  - OpenAI GSM8K (Cobbe et al., 2021) and PRM800K (Lightman et al., 2023).
  - *Math-Shepherd* (Wang et al., 2023): Automated step-level verification via Monte Carlo tree rollouts.
  - Verifier Over-optimization (Goodhart's Law in LLM inference): Why accuracy drops after $N > 400$ samples.
- **Mermaid Diagrams**:
  1. ORM vs PRM scoring pipeline comparison.
  2. Math-Shepherd Monte Carlo rollout credit assignment tree.
- **Code Implementation**: Step-level PRM evaluator with Monte Carlo rollout value estimation.

---

### Task 6: Module 04 — Learning from Feedback with Tools & Code

**Files:**
- Create: `content/docs/ai-agents/self-improving-ai-agents/04-grounded-feedback-tools-and-code.mdx`
- **Source**: Transcript Part 4 (`Lxh9RF5S-K0`)
- **Key Concepts**:
  - Grounding models in external environments: Moving past hallucinations with code execution and APIs.
  - *ReAct* (Yao et al., 2022): Interleaved `Thought -> Action -> Observation` loops on HotpotQA and ALFWorld.
  - *RLEF*: Grounding code LLMs in execution feedback; Two-tier test strategy (public tests vs held-out tests); Hybrid token/turn-level policy.
  - *Reflexion* (Shinn et al., 2023): Verbal reinforcement learning via episodic memory without weight updates.
- **Mermaid Diagrams**:
  1. ReAct execution trace with environment interaction.
  2. Reflexion self-critique loop with persistent episodic memory buffer.
- **Code Implementation**: Sandboxed Python agent execution loop with automated test-driven feedback, error categorization, and `ReflexionMemory`.

---

### Task 7: Module 05 — Planning, MCTS & Multi-Step Reasoning

**Files:**
- Create: `content/docs/ai-agents/self-improving-ai-agents/05-planning-mcts-and-multi-step-reasoning.mdx`
- **Source**: Transcript Part 5 (`Ml_fp9XkB8Y`)
- **Key Concepts**:
  - Why greedy agents drift and fail on long-horizon tasks (compounding error rates).
  - *Language Agent Tree Search (LATS)* (Zhou et al., ICML 2024): Integrating Monte Carlo Tree Search (MCTS), external state observations, and verbal reflections.
  - Tree of Thoughts (ToT) vs Reasoning via Planning (RAP) vs Graph of Thoughts (GoT).
  - Action reversibility: Handling non-reversible operations (mutating state, sending requests) vs reversible sandboxes.
  - *SPRINT*: Parallel plan generation and execution.
- **Mermaid Diagrams**:
  1. Full MCTS 4-step cycle adapted for language agents (Selection, Expansion, Evaluation, Backpropagation).
  2. State decision tree with pruning and backtracking markers.
- **Code Implementation**: Production-grade Python MCTS / LATS tree search implementation with UCT scoring and backtracking.

---

### Task 8: Module 06 — Train-Time Scaling & Scaling Reinforcement Learning

**Files:**
- Create: `content/docs/ai-agents/self-improving-ai-agents/06-train-time-scaling-and-scaling-rl.mdx`
- **Source**: Transcript Part 6 (`yVnmHSAy3ck`)
- **Key Concepts**:
  - Converting inference-time compute insights into model weights.
  - *STaR* (Self-Taught Reasoner, Zelikman et al., 2022): Rationale generation, rationale filtering, and rationalization on failure.
  - DeepSeekMath & *Group Relative Policy Optimization (GRPO)*: Eliminating the critic network in PPO; Sampling $G$ trajectories and normalizing relative group advantage.
  - Reinforcement Learning with Verifiable Rewards (RLVR): Deterministic oracles for math and code.
  - *DAPO*: Direct Alignment for Policy Optimization; Mitigating reasoning length explosion and exploration collapse.
- **Mermaid Diagrams**:
  1. STaR rationalization bootstrapping loop.
  2. GRPO architecture vs traditional Actor-Critic PPO architecture.
- **Code Implementation**: Complete PyTorch implementation of GRPO group advantage calculation and loss function.

---

### Task 9: Module 07 — Deep Research & Scaled Autonomous Systems

**Files:**
- Create: `content/docs/ai-agents/self-improving-ai-agents/07-deep-research-and-scaled-systems.mdx`
- **Source**: Transcript Part 7 (`Uni9dqyuuDM`)
- **Key Concepts**:
  - DeepMind *AlphaCode 1 & 2*: Sampling up to $10^6$ completions; Generating synthetic test inputs from problem descriptions; Output-signature clustering; Selecting 10 optimal candidate submissions.
  - Deep Research Agent Architectures (OpenAI Deep Research, Stanford STORM): Recursive query planning, multi-hop web retrieval, source credibility evaluation, hallucination pruning.
  - *Agentic Context Engineering (ACE)*: Managing context window saturation, dynamic scratchpads, and hierarchical memory compaction over 100+ turns.
- **Mermaid Diagrams**:
  1. AlphaCode massive sampling, filtering, and clustering pipeline.
  2. Deep Research recursive decomposition and citation verification loop.
- **Code Implementation**: Output-signature clustering and centroid selection algorithm in Python.

---

### Task 10: Module 08 — Agentic Evaluations & Long-Horizon Benchmarks

**Files:**
- Create: `content/docs/ai-agents/self-improving-ai-agents/08-agentic-evaluations-and-benchmarking.mdx`
- **Source**: Transcript Part 8 (`8JAqLnTaZu4`)
- **Key Concepts**:
  - The Evaluation Crisis: Why static benchmarks (MMLU, GSM8K) fail for agents (data contamination, absence of dynamic environments).
  - *GAIA* (General AI Assistants): Multimodal, tool-assisted evaluation designed for low human error and high AI difficulty.
  - *SWE-bench & SWE-bench Verified*: Evaluating software agents on 2,294 real-world GitHub issues using isolated Docker environments and unit test suites.
  - *GDPVal* (OpenAI): Economically valuable long-horizon tasks across law, finance, and engineering.
  - *DeepScholar-Bench*: Long-horizon PhD-level scientific paper synthesis.
- **Mermaid Diagrams**:
  1. SWE-bench Dockerized execution harness with fail-to-pass / pass-to-pass test matrices.
  2. Time-horizon capability spectrum (15s $\to$ 15m $\to$ 2h $\to$ multi-day tasks).
- **Code Implementation**: Python evaluation runner harness mimicking SWE-bench patch verification in an isolated subprocess.

---

### Task 11: Module 09 — Future Research Areas, Self-Generation & Safety

**Files:**
- Create: `content/docs/ai-agents/self-improving-ai-agents/09-frontiers-self-generation-and-safety.mdx`
- **Source**: Transcript Part 9 (`AyO6wyu4DEg`)
- **Key Concepts**:
  - Multi-Agent Fine-Tuning: Overcoming model collapse by training heterogeneous specialist agents that generate diverse reasoning trajectories and cross-critique.
  - *Absolute Zero & Environment Self-Generation*: Autonomous agents that propose their own problems, synthesize verifiable test environments, and climb self-generated curricula.
  - The Efficiency Frontier: *Intelligence per Watt* and *Intelligence per Dollar*; Open-weight local models (Qwen-32B, DeepSeek) vs frontier hosted APIs.
  - Open Theoretical Bottlenecks: Limits of intrinsic self-correction; Catastrophic forgetting during continuous self-improvement; Alignment and safety boundaries for recursive self-improving agents.
- **Mermaid Diagrams**:
  1. Absolute Zero self-directed task proposal and curriculum progression loop.
  2. Intelligence per Watt Pareto efficiency frontier.
- **Code Implementation**: Self-proposing task generator and synthetic unit test synthesizer demonstrating autonomous curriculum creation.

---

### Task 12: Documentation Integrity, Links & Fumadocs Build Verification

**Files:**
- Test all created `.mdx` files against the project build system.
- Verify cross-links between lessons, navigation buttons (`[Next: ... →]`), frontmatters, and icons.

**Verification Steps:**
1. Check that all files exist and have valid YAML frontmatter (`title`, `description`, `icon`).
2. Run markdown/MDX linting or TypeScript check (`npx tsc --noEmit` or `npm run build`).
3. Ensure all Mermaid code blocks compile without parse errors.
4. Verify sidebar navigation renders `Self-Improving AI Agents (CS329A)` cleanly and separately from `Self-Evolving Agents`.
