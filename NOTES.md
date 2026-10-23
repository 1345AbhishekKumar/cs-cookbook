# Teaching Notes

- **User Goal**: Found existing DSA lessons in `content/docs/dsa` overly dense, disjointed, and difficult to comprehend. Requested rewriting using the `/teach` skill principles.
- **Workflow & Approval**:
  - Phase 1: Complexity & Big-O Notation rewritten, refined with intuitive Section 03 ("Double the Input" test) and Section 05 (Chef's kitchen auxiliary space vs input space).
  - Phase 2: All remaining lessons across Track 1 (Arrays, Strings, Linked Lists, Stacks & Queues, Hash Tables) overhauled using parallel subagents, `/teach` skill principles, and web-grounded exam/interview topics.
- **Track 1 Status**:
  - `01-complexity-and-big-o-notation.mdx`: Complete & verified.
  - `02-arrays-and-dynamic-arrays.mdx`: Complete with full array taxonomy, 1D/2D RMO & CMO address formulas + numerical derivations, jagged, circular, sparse triplet representation, parallel arrays, and geometric growth.
  - `03-strings-and-string-manipulation.mdx`: Complete with immutability physics, ASCII vs UTF-8, substring vs subsequence combinatorics, and KMP LPS table tracing.
  - `04-linked-lists.mdx`: Complete with SLL/DLL/CLL/Skip lists, dummy nodes, 3-pointer reversal, and Floyd's cycle detection proof.
  - `05-stacks-and-queues.mdx`: Complete with LIFO/FIFO, Infix-to-Postfix conversion, Postfix evaluation trace tables, Circular Queue modulo arithmetic, and Monotonic stacks.
  - `06-hash-tables-and-hashing.mdx`: Complete with hash function construction, Separate Chaining vs Open Addressing (Linear, Quadratic, Double Hashing), load factor, tombstones, and SIMD Swiss Tables.
  - `index.mdx`: Curriculum cards updated to reflect new lesson contents.
- **Pedagogical Strategy**:
  - Keep working memory load low: Avoid front-loading complex Master Theorem, potential functions, and hardware microbenchmarks into the introductory Big-O lesson.
  - Section 03 Intuition Anchor: The "Double the Input" test ($n \to 2n$) serves as the core mental model for distinguishing $O(1)$ ($+0$), $O(\log n)$ ($+1$ step), $O(n)$ ($2\times$), $O(n \log n)$ ($\approx 2.1\times$), $O(n^2)$ ($4\times$), and $O(2^n)$ (squares).
  - Section 05 Space Complexity: Grounded in the "Chef's Kitchen" analogy (Customer's crate vs. Chef's auxiliary bowls). Emphasized Auxiliary Space vs Input Space, the hidden recursive Call Stack frames ($O(n)$ stack space), and In-Place ($O(1)$) vs Out-of-Place ($O(n)$) memory layout with step diagrams and interactive `<TryIt>` checks.
  - Ground each complexity class in a physical everyday metaphor (Lockers, Higher/Lower game, Airport line, 8-card MergeSort levels, Handshake dinner party, Toggle padlock) accompanied by visual step diagrams and immediate `<TryIt>` checks.
  - Progressive disclosure:
    1. The problem: Why stopwatch benchmarking fails.
    2. The core intuition: Counting growth rates as $n \to \infty$.
    3. The Big-O Hierarchy Ladder with clear operational examples.
    4. The 3-Step Code Audit Technique for real-world code.
    5. Hidden production complexity traps (e.g. `arr.includes()` in loops).
    6. Time vs. Space complexity trade-offs.
    7. Best, worst, and average cases ($O$, $\Omega$, $\Theta$).
  - Reinforce with design system components: `LessonIntro`, `Concepts`, `AnalogyCard`, `Explain`, `LessonNote`, `TryIt`, `Takeaway`.
  - Ensure tight feedback loops with equal-length quiz options and hidden explanations.
