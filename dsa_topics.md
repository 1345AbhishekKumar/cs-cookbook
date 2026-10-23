# Data Structures & Algorithms (DSA) Curriculum Audit & Topic Taxonomy

> **Last Updated:** October 2026  
> **Source Directory:** `content/docs/dsa` (53 lesson & reference files across 4 major tracks)  
> **Benchmarked Against:** NeetCode 150 / NeetCode All, Tech Interview Handbook (Blind 75 / Grind 169), CLRS (4th Edition), MIT EECS 6.006 / 6.046, and GeeksforGeeks Master DSA.

---

## Executive Summary

| Category                    | Present in `content/docs/dsa`                                                                                                                                                                                                                                     | Missing / Not Yet Implemented                                                                                                                                                                                                                                                               |
| :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Linear Data Structures**  | Arrays, Dynamic Arrays, Strings, Singly/Doubly/Circular Linked Lists, Stacks, Monotonic Stacks, Queues, Circular Ring Buffers, Deques, Hash Tables (Chaining & Open Addressing).                                                                                  | Skip Lists are covered in Track 4; XOR Linked Lists, Unrolled Linked Lists, Gap Buffers are missing.                                                                                                                                                                                        |
| **Trees & Hierarchies**     | Binary Trees, BSTs, AVL Trees, Red-Black Trees, Binary Heaps (Min/Max), B-Trees, B+ Trees, LSM-Trees / SSTables, QuadTrees, Octrees, K-D Trees, R-Trees / $R^*$ Trees, Merkle Trees.                                                                              | Treaps (Cartesian Trees), Splay Trees, 2-3 / 2-3-4 Trees, Suffix Trees, Link-Cut Trees, van Emde Boas Trees.                                                                                                                                                                                |
| **Search & Range Queries**  | Linear, Binary, Jump, Interpolation, Exponential Search, Segment Tree with Lazy Propagation, Fenwick Tree (BIT), Sparse Table (RMQ).                                                                                                                              | Lowest Common Ancestor (Binary Lifting / RMQ), Persistent Segment Tree, Heavy-Light Decomposition (HLD), Centroid Decomposition.                                                                                                                                                            |
| **Sorting**                 | Bubble, Selection, Insertion, Merge, Quick (Lomuto, Hoare, 3-way Dutch National Flag), Heap, Counting, Radix, Bucket, TimSort.                                                                                                                                    | External K-Way Merge, Quickselect (Median-of-Medians), ShellSort, Tournament Tree Sort.                                                                                                                                                                                                     |
| **Graph Algorithms**        | BFS, Multi-source BFS, DFS (3-color cycle detection), 0-1 BFS with Deques, Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal's MST (with DSU), Prim's MST, Kahn's Topological Sort, Tarjan's SCC, Bridges & Articulation Points.                                    | **Network Flow** (Ford-Fulkerson, Edmonds-Karp, Dinic's, Push-Relabel), **Bipartite Matching** (Hopcroft-Karp), $A^*$ Search, Johnson's Algorithm, Eulerian Path (Hierholzer), Kosaraju SCC, 2-SAT.                                                                                         |
| **Dynamic Programming**     | 1D & 2D DP (State-space reduction, Rolling arrays), 0/1 Knapsack, Unbounded Knapsack, Longest Common Subsequence (LCS), Levenshtein Edit Distance, Longest Increasing Subsequence ($\mathcal{O}(N \log N)$), Interval DP, Tree DP & Re-rooting, Bitmask DP (TSP). | Digit DP, Convex Hull Trick (CHT) / Li Chao Tree, Divide & Conquer DP optimization, Knuth's DP optimization, Broken Profile DP, Expected Value DP.                                                                                                                                          |
| **Strings & Text**          | SSO, Palindromes, Anagrams, Rolling Window, KMP, Rabin-Karp, Tries, Compressed Radix Trees (Patricia), Aho-Corasick Automaton.                                                                                                                                    | Z-Algorithm, Boyer-Moore, Suffix Arrays & LCP (Kasai), Suffix Automaton, Manacher's Algorithm.                                                                                                                                                                                              |
| **Probabilistic & Systems** | Bloom Filters, Cuckoo Filters, HyperLogLog, Count-Min Sketch, $\mathcal{O}(1)$ LRU Cache, $\mathcal{O}(1)$ LFU Cache, Lock-free SPSC Ring Buffer.                                                                                                                 | Count-Min with conservative update, Quotient filters, SimHash.                                                                                                                                                                                                                              |
| **Paradigms & Math**        | Two Pointers, Sliding Window, Backtracking (N-Queens, Combinatorics), Bitwise Toolkit, Euclidean GCD.                                                                                                                                                             | **Dedicated Greedy Module** (Interval Scheduling, Huffman Coding), Dedicated Divide-and-Conquer (Closest Pair, Strassen, FFT), Number Theory (Sieve, Mod Inverse, CRT, Matrix Exponentiation), Game Theory (Minimax, Nim/Sprague-Grundy), Computational Geometry (Convex Hull, Sweep-line). |

---

## Part 1: Topics Available in `content/docs/dsa` (What It Has)

### Track 1: Foundations & Linear Structures

Location: `content/docs/dsa/01-foundations-and-linear-structures`

1. **Complexity & Big-O Notation** (`01-complexity-and-big-o-notation.mdx`)
   - Asymptotic upper, lower, and tight bounds: $\mathcal{O}$, $\Omega$, $\Theta$.
   - Common complexity classes: $\mathcal{O}(1)$, $\mathcal{O}(\log n)$, $\mathcal{O}(n)$, $\mathcal{O}(n \log n)$, $\mathcal{O}(n^2)$, $\mathcal{O}(2^n)$, $\mathcal{O}(n!)$.
   - Space complexity (Heap allocation, call stack frames).
   - Worst-case, best-case, average-case analysis.
   - Real-world production traps (string concatenation loops, accidental quadratic scaling).

2. **Arrays & Dynamic Arrays** (`02-arrays-and-dynamic-arrays.mdx`)
   - Hardware memory layout: Contiguous memory allocation, address calculation formula ($A[i] = B + i \cdot S$).
   - Mechanical sympathy: CPU L1/L2/L3 caches, cache lines (64 bytes), spatial and temporal locality.
   - Static vs. Dynamic arrays, amortized $\mathcal{O}(1)$ push operations, geometric growth factor (1.5x vs 2x).
   - Multidimensional arrays (Row-major vs. Column-major order).
   - Prefix sums, difference arrays foundations, two-pointer arrays.

3. **Strings & String Manipulation** (`03-strings-and-string-manipulation.mdx`)
   - String immutability physics and memory layout across C++, Python, JavaScript/V8.
   - Encodings: ASCII, UTF-8 variable-length encodings, UTF-16 surrogate pairs, grapheme clusters.
   - Small String Optimization (SSO).
   - Core interview string patterns: Palindrome verification, Anagram checking (frequency hashing).
   - Substring vs. Subsequence combinatorics.
   - Pattern matching fundamentals: Naive sliding window, intro to KMP prefix function ($\pi$), and Rabin-Karp polynomial rolling hash.

4. **Linked Lists** (`04-linked-lists.mdx`)
   - Singly Linked Lists, Doubly Linked Lists, Circular Linked Lists.
   - Sentinel / Dummy head/tail node technique.
   - Reversal (iterative and recursive), cycle detection (Floyd’s Tortoise and Hare).
   - Finding merge points, middle element detection in one pass.
   - Linux kernel intrusive linked list architecture (`list_head`).

5. **Stacks & Queues** (`05-stacks-and-queues.mdx`)
   - Stacks (LIFO) and call stack mechanics.
   - Expression conversions & evaluations: Infix, Prefix, and Postfix (Reverse Polish Notation / Shunting-yard foundations).
   - Monotonic Stack pattern (Next Greater Element, Stock Span, Daily Temperatures).
   - Queues (FIFO) and Circular Queue (Ring Buffer) array implementation.
   - Double-Ended Queues (Deques).
   - Queue implementation using two stacks (Amortized $\mathcal{O}(1)$ push/pop proof).
   - Systems case study: LMAX Disruptor ring buffer.

6. **Hash Tables & Hashing** (`06-hash-tables-and-hashing.mdx`)
   - Direct addressing vs. hash tables; Pigeonhole Principle and Birthday Paradox.
   - Hash functions: Division, Multiplication, MurmurHash3, SipHash (cryptographic collision resistance).
   - Collision resolution strategies:
     - Separate chaining (Linked list / balanced tree bins).
     - Open addressing (Linear probing, Quadratic probing, Double hashing).
   - Load factor ($\alpha$), dynamic resizing, tombstone markers for deletion.
   - HashDoS denial-of-service vulnerability and mitigations.
   - Python 3.6+ compact dictionary layout.

7. **Capstone 1**: [Browser History & Undo Engine](file:///e:/lession/Learning-css-framework/CS-cookbook/content/docs/dsa/01-foundations-and-linear-structures/capstone-browser-history-and-undo-engine.mdx)
   - Dual-stack browser forward/back navigation.
   - Transactional command-pattern undo/redo engine.
   - Chromium `NavigationController` and Monaco editor undo tree.

---

### Track 2: Trees, Heaps & Core Patterns

Location: `content/docs/dsa/02-trees-heaps-and-core-patterns`

1. **Binary Trees & Traversals** (`01-binary-trees-and-traversals.mdx`)
   - Binary Tree structural anatomy, full, complete, and degenerate trees.
   - Depth-First Search traversals: Pre-order, In-order, Post-order (recursive & explicit stack iteration).
   - Breadth-First Search (Level-order traversal with queue).
   - Morris In-Order Traversal (threading tree nodes for $\mathcal{O}(1)$ auxiliary space).
   - Tree serialization and deserialization (pre-order string / BFS level arrays).
   - Case studies: Chromium Blink DOM & V8 Abstract Syntax Trees.

2. **Binary Search Trees & Self-Balancing** (`02-binary-search-trees-and-self-balancing.mdx`)
   - BST invariant ($L < P < R$), insertion, lookup, deletion (in-order successor replacement).
   - Tree skewing and degradation to $\mathcal{O}(N)$ linked list.
   - AVL Trees: Strict balance factor ($-1, 0, 1$), Tree rotations (LL, RR, LR, RL).
   - Red-Black Trees: 5 Red-Black invariants, recoloring, rotations, black-height guarantees.
   - Case study: Linux Completely Fair Scheduler (CFS) virtual runtime tree.

3. **Heaps & Priority Queues** (`03-heaps-and-priority-queues.mdx`)
   - Array-mapped complete binary trees (Indices $2i+1$ and $2i+2$).
   - Min-Heap and Max-Heap invariants; Sift-up ($\mathcal{O}(\log N)$) and Sift-down ($\mathcal{O}(\log N)$).
   - Floyd’s Linear Heap Construction: Proof of $\mathcal{O}(N)$ `heapify`.
   - Top-K frequent elements, median of a continuous data stream (Dual Min/Max Heaps).
   - Linux epoll timer queues.

4. **Two Pointers & Sliding Window** (`04-two-pointers-and-sliding-window.mdx`)
   - Converging pointers (Two Sum II, Container With Most Water, 3Sum).
   - Fast and Slow pointer mechanics.
   - Fixed-size sliding windows vs. dynamic variable-length condition-based windows.
   - Sliding Window Maximum via Monotonic Deque ($\mathcal{O}(N)$ time).
   - TCP sliding window and congestion control case study.

5. **Recursion & Backtracking** (`05-recursion-and-backtracking.mdx`)
   - State-space tree search mental model.
   - The Canonical Backtracking 3-step template: `Choose`, `Explore`, `Unchoose`.
   - The big three combinatorial archetypes: Subsets / Power set, Permutations, Combinations.
   - Constraint satisfaction: N-Queens solver with bitmask/boolean conflict arrays.
   - Package manager SAT solving.

6. **Dedicated Module: Searching Algorithms** (`searching-algorithms/`)
   - `searching.mdx`: Discrete vs continuous search spaces, monotonic feasibility predicates.
   - `linear-search.mdx`: Unsorted search, sentinel loop optimization, cache efficiency.
   - `binary-search.mdx`: Zero-bug template, `lower_bound`, `upper_bound`, search on answer space.
   - `jump-search.mdx`: Block jumping in steps of $\sqrt{N}$.
   - `interpolation-search.mdx`: Formula $pos = low + \lfloor \frac{target - arr[low]}{arr[high] - arr[low]} \cdot (high - low) \rfloor$, $\mathcal{O}(\log \log N)$ average.
   - `exponential-search.mdx`: Unbounded / stream search via doubling intervals $[2^{k-1}, 2^k]$.

7. **Dedicated Module: Sorting Algorithms** (`sorting-algorithms/`)
   - `sorting.mdx`: Inversion count, stability, adaptive behavior.
   - `bubble-sort.mdx`: Adjacent swaps, early termination, rabbits & turtles asymmetry.
   - `selection-sort.mdx`: Minimum element selection, unstable nature.
   - `insertion-sort.mdx`: Adaptive online sorting, optimal for small $N \le 32$.
   - `merge-sort.mdx`: Divide-and-conquer, recursion tree, stable $\mathcal{O}(N \log N)$, linked list sort.
   - `quick-sort.mdx`: Lomuto partitioning, Hoare partitioning, Dutch National Flag (3-way) partitioning.
   - `heap-sort.mdx`: In-place sorting using max-heap, unstable $\mathcal{O}(N \log N)$.
   - `hybrid-and-linear-sorts.mdx`: Counting Sort ($\mathcal{O}(N + K)$), Radix Sort (LSD & MSD), Bucket Sort ($\mathcal{O}(N)$ average), and industrial TimSort (runs + galloping mode).

8. **Capstone 2**: [Priority Task Runner & Trie Autocomplete](file:///e:/lession/Learning-css-framework/CS-cookbook/content/docs/dsa/02-trees-heaps-and-core-patterns/capstone-task-scheduler-and-autocomplete.mdx)
   - Dynamic priority queue job scheduling engine with concurrency limits.
   - Prefix trie with frequency ranking for fast autocomplete queries.

---

### Track 3: Graphs, Dynamic Programming & Advanced Algorithms

Location: `content/docs/dsa/03-graphs-dynamic-programming-and-advanced-algorithms`

1. **Graph Fundamentals & Traversals** (`01-graph-fundamentals-and-traversals.mdx`)
   - Memory topologies: Adjacency Matrix, Adjacency List, Compressed Sparse Row (CSR).
   - Breadth-First Search (BFS) and Multi-source BFS (e.g. Rotting Oranges, Shortest distance to water).
   - Depth-First Search (DFS) with 3-color cycle detection (White, Gray, Black) for directed graphs.
   - 0-1 BFS: Shortest path in graphs with edge weights in $\{0, 1\}$ using a Deque in $\mathcal{O}(V + E)$.
   - PyTorch Geometric & GraphBLAS sparse operations.

2. **Shortest Paths & Minimum Spanning Trees** (`02-shortest-paths-and-minimum-spanning-trees.mdx`)
   - Algorithm selector matrix based on negative weights, cycles, and sparsity.
   - Dijkstra's Algorithm (Min-heap priority queue, $\mathcal{O}((V + E) \log V)$).
   - Bellman-Ford Algorithm ($\mathcal{O}(V \cdot E)$): Relaxations and negative-weight cycle detection (arbitrage detection).
   - Floyd-Warshall Algorithm: Dynamic programming all-pairs shortest paths in $\mathcal{O}(V^3)$.
   - Minimum Spanning Trees (MST):
     - Kruskal's Algorithm with Disjoint Set Union (DSU / Union-Find with path compression and rank).
     - Prim's Algorithm (Greedy cut property via priority queue).
   - OSPF and BGP Internet routing protocols.

3. **Topological Sort & Graph Connectivity** (`03-topological-sort-and-connectivity.mdx`)
   - DAG characteristics and dependencies.
   - Kahn’s Algorithm (In-degree queue BFS) and DFS post-order reversal.
   - Cycle detection in DAGs.
   - Strongly Connected Components (SCC): Tarjan’s Algorithm using DFS discovery time and low-link numbers.
   - Network resilience: Bridges and Articulation Points (Cut Vertices) via low-link values.
   - Build system dependency scheduling (Bazel, Turbo).

4. **1D and 2D Dynamic Programming** (`04-dynamic-programming-1d-and-2d.mdx`)
   - Overlapping subproblems, optimal substructure, and memoization vs. tabulation.
   - State-space compression and rolling variables ($\mathcal{O}(N)$ to $\mathcal{O}(1)$ memory).
   - 1D DP: Climbing Stairs, House Robber, Coin Change, Word Break.
   - 2D Grid DP: Unique Paths, Minimum Path Sum, Maximal Square.
   - Relational query optimization: PostgreSQL System R DP join planner.

5. **DP on Subsequences & Knapsack Problems** (`05-dynamic-programming-subsequences-and-knapsack.mdx`)
   - 0/1 Knapsack problem (Reverse inner loop for space optimization).
   - Unbounded Knapsack problem (Forward inner loop for multi-selection).
   - Longest Common Subsequence (LCS) and Levenshtein Edit Distance.
   - Longest Increasing Subsequence (LIS): $\mathcal{O}(N^2)$ DP and $\mathcal{O}(N \log N)$ Patience Sorting with Binary Search (`lower_bound`).
   - Myers Diff algorithm (Git diff) & Elasticsearch fuzzy automaton.

6. **Advanced DP: Interval, Tree & Bitmask** (`06-advanced-dp-interval-tree-and-bitmask.mdx`)
   - Interval DP: Subarray range state transitions (Matrix Chain Multiplication, Burst Balloons).
   - Tree DP: Independent sets on trees, tree diameter, and Re-rooting DP (in-and-out two-pass DP).
   - Bitmask DP: State encoding via binary bit integers, Traveling Salesperson Problem (TSP in $\mathcal{O}(N^2 \cdot 2^N)$).
   - PyTorch tensor contractions and drone delivery route planning.

7. **Capstone 3**: [Dependency Graph & Build System Engine](file:///e:/lession/Learning-css-framework/CS-cookbook/content/docs/dsa/03-graphs-dynamic-programming-and-advanced-algorithms/capstone-dependency-graph-and-build-system.mdx)
   - Parallel wave execution engine using topological levels.
   - Cycle detection and failure boundary isolation.
   - Incremental content-addressable build memoization.

---

### Track 4: Systems Data Structures & Production Mastery

Location: `content/docs/dsa/04-systems-data-structures-and-interview-mastery`

1. **Disk & Database Trees: B-Trees and B+ Trees** (`01-disk-and-database-trees-b-trees-and-b-plus-trees.mdx`)
   - Memory paging vs. block storage: Why balanced BSTs (AVL/Red-Black) create random I/O bottlenecks.
   - B-Tree vs. B+ Tree architectural comparison (data only in leaves, leaf sibling linked list).
   - B+ Tree search, insert, split, merge, borrow operations.
   - Database indexing: MySQL InnoDB clustered index, SQLite page format.

2. **Write-Optimized Storage: LSM-Trees & SSTables** (`02-write-optimized-storage-lsm-trees-and-ss-tables.mdx`)
   - In-place update penalty vs. sequential log append.
   - Write path: Write-Ahead Log (WAL), in-memory MemTable, and Immutable MemTable.
   - SSTable (Sorted String Table) format: Block index, Bloom filters, and trailer.
   - Deletions via Tombstones.
   - Leveled Compaction vs. Size-Tiered Compaction.
   - The RUM Conjecture (Read, Update, Memory trade-offs: RocksDB, Cassandra).

3. **Probabilistic Data Structures** (`03-probabilistic-data-structures.mdx`)
   - Bloom Filters: $k$ independent hash functions, zero false negatives, false positive calculation $p \approx (1 - e^{-kn/m})^k$.
   - Cuckoo Filters: Partial-key cuckoo hashing, support for dynamic element deletion.
   - HyperLogLog (HLL): Cardinality estimation via leading zeros in hash output, harmonic mean, $1.04 / \sqrt{m}$ standard error, millions of elements tracked in 1.5 KB.
   - Count-Min Sketch: Frequency estimation and heavy hitters (DDoS packet monitoring, Top-K streams).

4. **Advanced String & Range Query Structures** (`04-advanced-string-and-range-query-structures.mdx`)
   - Standard Tries vs. Radix Trees / Compressed Patricia Tries.
   - Knuth-Morris-Pratt (KMP) failure table and Aho-Corasick Multi-Pattern Matching Automaton.
   - Fenwick Tree / Binary Indexed Tree (BIT): Isolating lowest set bit with `x & (-x)`, prefix sums and point updates in $\mathcal{O}(\log N)$.
   - Segment Tree: Array representation, Range queries, Point updates, Lazy Propagation for $\mathcal{O}(\log N)$ range updates.
   - Sparse Table: Power-of-two jump pointers ($ST[i][j]$), $\mathcal{O}(N \log N)$ precomputation and $\mathcal{O}(1)$ idempotent Range Minimum Query (RMQ).

5. **Concurrency, Caching & Systems Structures** (`05-concurrency-caching-and-systems-structures.mdx`)
   - $\mathcal{O}(1)$ LRU Cache: Doubly Linked List + Hash Map with node pointer values.
   - $\mathcal{O}(1)$ LFU Cache: Frequency hash map pointing to doubly linked list buckets.
   - Lock-Free Single-Producer Single-Consumer (SPSC) Ring Buffer: Atomic read/write head pointers, memory barriers, cache-line padding (false sharing prevention).
   - Skip Lists: Probabilistic heights, coin flips, $\mathcal{O}(\log N)$ concurrent lookups (Redis Sorted Set).
   - Merkle Trees: Cryptographic hash trees for anti-entropy and distributed consensus.

6. **Spatial & Bitwise Algorithms** (`06-spatial-and-bitwise-algorithms.mdx`)
   - Spatial indexing: QuadTrees (2D space partitioning) and Octrees (3D rendering/physics).
   - K-D Trees ($k$-Dimensional Trees) and $k$-Nearest Neighbors ($k$-NN) pruning.
   - R-Trees and $R^*$ Trees: Minimum Bounding Rectangles (MBR) for geospatial queries (PostGIS).
   - Low-Level Bit Manipulation Toolkit: Bitwise AND, OR, XOR, NOT, shifts, Brian Kernighan’s set-bit counting, power-of-two checks (`n & (n - 1) == 0`), bitmasks.
   - Systems Number Theory: Euclidean GCD, Modular arithmetic, fast exponentiation by squaring.

7. **Capstone 4**: [Production Distributed Key-Value Cache Engine](file:///e:/lession/Learning-css-framework/CS-cookbook/content/docs/dsa/04-systems-data-structures-and-interview-mastery/capstone-production-distributed-key-value-cache.mdx)
   - Sharded consistent hashing ring with virtual nodes.
   - Hybrid LRU-LFU eviction and Bloom filter guard.
   - SSTable disk persistence layer with compaction.

---

## Part 2: Topics Missing from Curriculum (What It Does NOT Have)

The following topics are standard components of senior technical interview syllabi (**NeetCode All**, **Grind 169**), academic algorithm courses (**CLRS 4th Edition**, **MIT 6.006 / 6.046**), or competitive programming tracks, and are currently **absent** from `content/docs/dsa`:

### 1. Network Flow & Cut Algorithms (Graph Theory)

- [ ] **Max-Flow / Min-Cut Theorem**: Theoretical duality between maximum flow and minimum cut capacity.
- [ ] **Ford-Fulkerson Method & Residual Networks**: Augmenting paths, back-edges, and flow conservation.
- [ ] **Edmonds-Karp Algorithm**: BFS-based shortest augmenting path implementation running in $\mathcal{O}(V E^2)$.
- [ ] **Dinic’s Algorithm**: Level graphs, blocking flows, and scaling running in $\mathcal{O}(V^2 E)$ (or $\mathcal{O}(E \sqrt{V})$ on unit networks).
- [ ] **Push-Relabel / Preflow-Push Algorithm**: Highest-label preflow push in $\mathcal{O}(V^3)$.
- [ ] **Bipartite Matching**:
  - Maximum Bipartite Matching via Max Flow reduction.
  - **Hopcroft-Karp Algorithm** running in $\mathcal{O}(E \sqrt{V})$.
  - Assignment Problem & Hungarian Algorithm ($\mathcal{O}(V^3)$).
- [ ] **Minimum Cost Maximum Flow (MCMF)**: Cycle canceling and SPFA / Bellman-Ford augmenting paths.

---

### 2. Advanced Graph Traversals & Shortest Paths

- [ ] **$A^\*$ (A-Star) Search Algorithm**:
  - Heuristic evaluations ($f(n) = g(n) + h(n)$).
  - Admissible and consistent heuristics (Euclidean, Manhattan distance).
  - Pathfinding in video games and robotics.
- [ ] **Johnson’s Algorithm for All-Pairs Shortest Paths**:
  - Reweighting edges using Bellman-Ford potential function ($h(u)$) to eliminate negative weights without changing shortest paths.
  - Running Dijkstra from every vertex in sparse graphs: $\mathcal{O}(V^2 \log V + V E)$ (strictly superior to Floyd-Warshall $\mathcal{O}(V^3)$ on sparse graphs).
- [ ] **Bidirectional Search**:
  - Bidirectional BFS (meeting in the middle, reducing search frontier from $b^d$ to $2 \cdot b^{d/2}$).
  - Bidirectional Dijkstra.
- [ ] **Eulerian Path & Circuit**:
  - Invariants: Degree parity in undirected graphs, in-degree/out-degree balance in directed graphs.
  - **Hierholzer’s Algorithm** running in linear $\mathcal{O}(V + E)$ time.
  - De Bruijn Sequences.
- [ ] **Kosaraju’s 2-Pass Algorithm for SCCs**:
  - Transpose graph construction and post-order stack ordering (simpler conceptual alternative to Tarjan).
- [ ] **2-Satisfiability (2-SAT)**:
  - Boolean satisfiability for 2-variable clauses $(x \lor y)$.
  - Construction of implication graphs and checking if $x$ and $\neg x$ belong to the same SCC.

---

### 3. Dedicated Greedy Algorithmic Paradigm

_(Note: Greedy is mentioned in passing in Kruskal/Dijkstra, but there is no dedicated pedagogical module covering the Greedy Choice Property and Optimal Substructure.)_

- [ ] **Interval Scheduling / Activity Selection Problem**: Proof of optimality by earliest finish time.
- [ ] **Fractional Knapsack Problem**: Greedy value-to-weight ratio.
- [ ] **Huffman Coding**:
  - Lossless data compression.
  - Building optimal prefix trees via Min-Heap.
- [ ] **Job Sequencing with Deadlines**: Greedy penalty minimization (with DSU optimization).
- [ ] **Greedy Jump / Leap Patterns**: Jump Game I & II, Gas Station circular route feasibility.

---

### 4. Divide-and-Conquer Foundations & Classical Problems

_(Note: Merge Sort and Quick Sort are in Track 2, but the broader algorithmic paradigm is missing.)_

- [ ] **Formal Recurrence Solving**:
  - Master Theorem comprehensive cases ($T(n) = a T(n/b) + f(n)$).
  - Akra-Bazzi method for uneven divisions.
  - Recursion tree analysis.
- [ ] **Closest Pair of 2D Points**:
  - Divide-and-conquer $\mathcal{O}(N \log N)$ algorithm with $\delta$-strip geometry pruning.
- [ ] **Strassen’s Matrix Multiplication**:
  - Sub-cubic matrix multiplication in $\mathcal{O}(N^{\log_2 7}) \approx \mathcal{O}(N^{2.807})$.
- [ ] **Fast Fourier Transform (FFT) & Polynomial Multiplication**:
  - Discrete Fourier Transform (DFT), Roots of unity, Cooley-Tukey algorithm in $\mathcal{O}(N \log N)$.
- [ ] **Quickselect / Order Statistics**:
  - Average $\mathcal{O}(N)$ $k$-th smallest element selection.
  - Deterministic Median-of-Medians worst-case $\mathcal{O}(N)$ pivot selection.

---

### 5. Advanced String Algorithms & Suffix Structures

- [ ] **Z-Algorithm**:
  - Linear string pattern matching via $Z$-array ($Z[i]$ = length of longest substring starting at $i$ matching prefix).
- [ ] **Boyer-Moore String Search Algorithm**:
  - Bad Character Rule and Good Suffix Rule heuristics.
  - Right-to-left sub-linear average searching.
- [ ] **Suffix Array & LCP Array**:
  - Suffix Array construction in $\mathcal{O}(N \log^2 N)$ or $\mathcal{O}(N \log N)$.
  - Longest Common Prefix (LCP) Array via Kasai’s algorithm in $\mathcal{O}(N)$.
  - Fast substring lookups and longest repeated substring detection.
- [ ] **Suffix Tree**:
  - Compressed trie of all suffixes.
  - Ukkonen’s linear-time $\mathcal{O}(N)$ on-line construction.
- [ ] **Suffix Automaton (SAM)**:
  - Smallest directed acyclic word graph (DAWG) encoding all substrings in $\mathcal{O}(N)$ states.
- [ ] **Manacher’s Algorithm**:
  - Linear $\mathcal{O}(N)$ discovery of all maximal palindromic substrings.

---

### 6. Advanced Tree & Range Query Data Structures

- [ ] **Lowest Common Ancestor (LCA)**:
  - Binary Lifting / Jump Pointers ($up[v][j]$) in $\mathcal{O}(N \log N)$ preprocessing and $\mathcal{O}(\log N)$ query.
  - Euler Tour + RMQ Sparse Table technique for $\mathcal{O}(1)$ query time.
  - Tarjan's Offline LCA via DSU.
- [ ] **Tree Decompositions**:
  - **Heavy-Light Decomposition (HLD)**: Flattening trees into contiguous paths for Segment Tree range updates along paths in $\mathcal{O}(\log^2 N)$.
  - **Centroid Decomposition**: Divide-and-conquer on trees for path counting in $\mathcal{O}(N \log N)$.
- [ ] **Balanced Tree Variants**:
  - **Treap** (Cartesian Tree combining BST key property and Heap priority property; split and merge operations).
  - **Splay Trees** (Self-adjusting BST via splay-to-root operations, amortized $\mathcal{O}(\log N)$).
  - **2-3 Trees & 2-3-4 Trees** (Classic B-tree foundations).
- [ ] **Persistent Data Structures**:
  - Path copying technique.
  - Fully persistent vs. partially persistent data structures.
  - **Persistent Segment Tree** (Chair Tree / answering range $k$-th queries in $\mathcal{O}(\log N)$).
- [ ] **van Emde Boas Trees (vEB)**:
  - Recursive universe splitting: $\mathcal{O}(\log \log U)$ dynamic predecessor/successor and search operations.
- [ ] **Link-Cut Trees**:
  - Splay-tree based dynamic forest connectivity (amortized $\mathcal{O}(\log N)$ tree path queries and structural re-rooting).

---

### 7. Advanced Heap Architectures

- [ ] **Indexed Priority Queue (IPQ)**:
  - Key-indexed binary heap with an auxiliary index-lookup map, enabling $\mathcal{O}(\log N)$ `decrease_key`, `delete(index)`, and `change_priority`.
- [ ] **$d$-ary Heaps**:
  - Generalization where each node has $d$ children; shallower tree depth optimizing cache access during Dijkstra.
- [ ] **Fibonacci Heaps**:
  - Collection of min-heap-ordered trees.
  - Theoretical milestone: $\mathcal{O}(1)$ amortized `insert` and `decrease_key`, with $\mathcal{O}(\log N)$ amortized `extract_min`.
- [ ] **Binomial Heaps, Leftist Heaps, & Pairing Heaps**:
  - Mergeable heap data structures ($\mathcal{O}(\log N)$ or $\mathcal{O}(1)$ meld).

---

### 8. Advanced Dynamic Programming Techniques

- [ ] **Digit DP**:
  - Counting numbers in an arbitrary range $[A, B]$ that satisfy specific digit properties (e.g., no consecutive equal digits, sum of digits is prime) using states `(index, tight, leading_zeros, mask)`.
- [ ] **Convex Hull Trick (CHT)**:
  - Optimizing DP transitions of the form $dp[i] = \min_{j < i} \{ dp[j] + m_j \cdot x_i + c_j \}$ from $\mathcal{O}(N^2)$ to $\mathcal{O}(N \log N)$ or $\mathcal{O}(N)$.
- [ ] **Li Chao Segment Tree**:
  - Maintaining line segments for dynamic Convex Hull queries in $\mathcal{O}(\log N)$.
- [ ] **Divide-and-Conquer DP Optimization**:
  - Applicable when the optimal split point $opt[i][j]$ is monotonic ($opt[i][j-1] \le opt[i][j] \le opt[i+1][j]$). Reduces complexity from $\mathcal{O}(K \cdot N^2)$ to $\mathcal{O}(K \cdot N \log N)$.
- [ ] **Knuth’s DP Optimization**:
  - Quadrangle inequality optimization reducing interval DP from $\mathcal{O}(N^3)$ to $\mathcal{O}(N^2)$.
- [ ] **Broken Profile DP (Grid Tiling)**:
  - Dynamic programming over incomplete boundaries using bitmask contours.
- [ ] **Probability & Expected Value DP**:
  - Absorbing Markov chains and expectation recurrences.

---

### 9. Extended Disjoint Set Union (DSU) Variants

- [ ] **DSU with Rollback**:
  - Undo stack replacing path compression with union-by-rank only; allows dynamic graph edge insertion and deletion for offline query processing via divide-and-conquer.
- [ ] **Weighted / Potentialized DSU**:
  - Tracking distance or parity differences between connected elements ($dist[u] - dist[v]$) for relative valuation problems.

---

### 10. Number Theory, Mathematics & Cryptography

- [ ] **Extended Euclidean Algorithm**:
  - Solving Bézout's identity: $a \cdot x + b \cdot y = \gcd(a, b)$.
  - Computing Modular Multiplicative Inverse ($a^{-1} \pmod m$).
- [ ] **Prime Sieve Algorithms**:
  - Sieve of Eratosthenes ($\mathcal{O}(N \log \log N)$).
  - Segmented Sieve (Primes in range $[L, R]$ where $R \le 10^{12}, R - L \le 10^6$).
  - Linear Sieve (Euler's Sieve) in $\mathcal{O}(N)$.
- [ ] **Prime Factorization**:
  - Trial division in $\mathcal{O}(\sqrt{N})$.
  - Pollard's Rho heuristic algorithm for large integers.
- [ ] **Euler’s Totient Function $\phi(N)$ & Euler's Theorem**:
  - Coprime counting and modular reductions ($a^{\phi(m)} \equiv 1 \pmod m$).
- [ ] **Chinese Remainder Theorem (CRT)**:
  - Solving systems of simultaneous modular congruences.
- [ ] **Combinatorics & Modulo Arithmetic**:
  - Combinations $\binom{n}{k} \pmod p$ via precomputed factorials and modular inverse.
  - Lucas’ Theorem for large $n, k \pmod p$.
  - Catalan Numbers formula and applications.
- [ ] **Matrix Exponentiation**:
  - Accelerating linear recurrence relations (e.g. $N$-th Fibonacci number in $\mathcal{O}(K^3 \log N)$).

---

### 11. Combinatorial Game Theory

- [ ] **Minimax Algorithm**:
  - Decision rule for two-player zero-sum deterministic games.
- [ ] **Alpha-Beta Pruning**:
  - Search tree branch pruning maintaining $[\alpha, \beta]$ windows.
- [ ] **Nim Game & Sprague-Grundy Theorem**:
  - Impartial games played under normal play convention.
  - Calculating Grundy values ($mex$ function) and XOR sum of game states.

---

### 12. Computational Geometry

- [ ] **Fundamental Geometric Primitives**:
  - 2D Cross product and Dot product.
  - Clockwise vs. Counter-clockwise orientation test (CCW).
- [ ] **Convex Hull Algorithms**:
  - Graham Scan ($\mathcal{O}(N \log N)$ stack algorithm).
  - Andrew’s Monotone Chain algorithm.
  - Jarvis March (Gift Wrapping in $\mathcal{O}(N \cdot H)$).
- [ ] **Sweep-Line Algorithm**:
  - Bentley-Ottmann algorithm for line segment intersections.
- [ ] **Point Location & Polygons**:
  - Point-in-polygon tests (Ray casting method & Winding number).
  - Polygon area calculation via Shoelace formula (Surveyor's formula).

---

### 13. High-Frequency Interview Patterns Missing Dedicated Lessons

- [ ] **Intervals Mastery Pattern**:
  - Dedicated module for: Merge Intervals, Insert Interval, Non-overlapping Intervals, Meeting Rooms I & II, Employee Free Time.
- [ ] **2D Matrix Manipulation Pattern**:
  - Spiral Matrix traversal, In-place Matrix Rotation ($90^\circ$ clockwise/counterclockwise), Island Count / Grid Flood Fill patterns.
- [ ] **Binary Search on Solution Space / Answer Range**:
  - Monotonic predicate verification patterns: Book Allocation, Painter's Partition, Capacity to Ship Packages, Koko Eating Bananas.
- [ ] **Difference Arrays (1D & 2D)**:
  - $\mathcal{O}(1)$ range updates followed by prefix-sum sweeps.
- [ ] **Coordinate Compression**:
  - Mapping sparse large values ($x \in [1, 10^9]$) into dense rank indices ($[0, N-1]$) for segment tree / BIT indexing.
- [ ] **Randomized & Sampling Algorithms**:
  - Reservoir Sampling ($k$ items from a streaming source of unknown size).
  - Fisher-Yates Shuffle ($\mathcal{O}(N)$ unbiased random array permutation).

---

## Part 3: Recommended Roadmap for Future Additions

To achieve complete coverage across both industrial systems engineering and premier competitive/interview standards, the following tracks or modules should be added next:

```
Proposed New Tracks & Modules:
├── Track 05: Greedy Algorithms, Intervals & Combinatorial Math
│   ├── 01-greedy-foundations-and-interval-scheduling.mdx
│   ├── 02-huffman-coding-and-optimal-compression.mdx
│   ├── 03-number-theory-primes-modular-arithmetic-and-crt.mdx
│   ├── 04-matrix-exponentiation-and-combinatorics.mdx
│   └── capstone-rate-limiter-and-huffman-archiver.mdx
│
├── Track 06: Network Flows, Advanced Graphs & Geometry
│   ├── 01-max-flow-min-cut-and-dinics-algorithm.mdx
│   ├── 02-bipartite-matching-and-hopcroft-karp.mdx
│   ├── 03-a-star-pathfinding-and-heuristic-search.mdx
│   ├── 04-eulerian-circuits-and-hierholzers-algorithm.mdx
│   ├── 05-computational-geometry-and-convex-hulls.mdx
│   └── capstone-global-logistics-flow-and-routing-engine.mdx
│
└── Track 07: Advanced Competitive Trees & String Structures
    ├── 01-lowest-common-ancestor-and-binary-lifting.mdx
    ├── 02-treaps-and-splay-trees.mdx
    ├── 03-heavy-light-decomposition-and-tree-queries.mdx
    ├── 04-persistent-segment-trees.mdx
    ├── 05-suffix-arrays-lcp-and-suffix-automata.mdx
    └── capstone-time-traveling-versioned-database.mdx
```
