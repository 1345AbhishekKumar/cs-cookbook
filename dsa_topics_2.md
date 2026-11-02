# Master Hierarchical Curriculum: Data Structures & Algorithms

A comprehensive, four-tier reference curriculum covering foundational computational complexity, standard linear and hierarchical data structures, classical algorithmic paradigms, advanced graph theory, dynamic programming, string algorithms, computational geometry, competitive programming techniques, and systems-level storage engines.

---

## Curriculum Overview Matrix

| Tier                                                                     | Category Scope                                                                                                                             | Key Algorithmic Milestones                                                                                                 | Topic Count | Target Proficiency                                                        |
| :----------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- | :---------- | :------------------------------------------------------------------------ |
| **[1. Beginner](#1-beginner)**                                           | Complexity, Arrays, Strings, Lists, Stacks, Queues, Hash Tables, Sorting, Two Pointers, Bitwise, Number Theory Basics                      | Big-O analysis, in-place list reversal, cycle detection, sliding window, prefix sums, binary search, quicksort/mergesort   | 48 Topics   | Technical Screening & Clean Code Execution                                |
| **[2. Intermediate](#2-intermediate)**                                   | Binary Trees, BSTs, Balanced Trees, Heaps, Tries, Monotonic Queues, Backtracking, DP Basics, Graph BFS/DFS, Combinatorics                  | Tree traversals, top-K streaming, 0/1 Knapsack, LIS ($O(N \log N)$), bipartite matching, topological sort, modular inverse | 45 Topics   | Standard Hard LeetCode / Mid-Level Software Engineer                      |
| **[3. Advanced](#3-advanced)**                                           | Disjoint Sets, Segment Trees, Fenwick Trees, Sparse Tables, Shortest Paths, Tree DP, Binary Lifting, KMP, Z-Algorithm, Convex Hull         | Lazy propagation, Dijkstra, Bellman-Ford, Floyd-Warshall, LCA in $O(1)$/$O(\log N)$, digit DP, Manacher's algorithm        | 41 Topics   | Senior Engineering / Competitive Programming (Div. 2)                     |
| **[4. Expert](#4-expert)**                                               | Dynamic/Persistent Segment Trees, Splay/Link-Cut Trees, HLD, Centroid Decomposition, Network Flows, DP Optimizations, Suffix Automata, FFT | Dinic's algorithm, Hopcroft-Karp, Convex Hull Trick, Li Chao Tree, 2-SAT, Aho-Corasick, polynomial multiplication          | 37 Topics   | L6+ Staff Systems Architect / International Grandmaster                   |
| **[5. Systems & Storage](#5-systems--storage-data-structures-appendix)** | B-Trees, LSM-Trees, SSTables, Bloom Filters, HyperLogLog, LRU/LFU Caches, Lock-Free Rings, Skip Lists, Spatial Trees                       | Disk I/O minimization, write amplification reduction, approximate streaming sketches, concurrent primitives                | 16 Topics   | Database Internals, Storage Engines & High-Throughput Distributed Systems |

---

## Table of Contents

- [1. Beginner](#1-beginner)
  - [1.1. Algorithmic Complexity and Asymptotic Analysis](#11-algorithmic-complexity-and-asymptotic-analysis)
  - [1.2. Contiguous and Sequential Data Structures](#12-contiguous-and-sequential-data-structures)
  - [1.3. Linked Data Structures](#13-linked-data-structures)
  - [1.4. Restricted Linear Data Structures](#14-restricted-linear-data-structures)
  - [1.5. Hash-Based Data Structures](#15-hash-based-data-structures)
  - [1.6. Fundamental Searching and Sorting](#16-fundamental-searching-and-sorting)
  - [1.7. Core Array and Pointer Paradigms](#17-core-array-and-pointer-paradigms)
  - [1.8. Recursion and Bitwise Fundamentals](#18-recursion-and-bitwise-fundamentals)
  - [1.9. Foundational Mathematics](#19-foundational-mathematics)
- [2. Intermediate](#2-intermediate)
  - [2.1. Hierarchical Data Structures](#21-hierarchical-data-structures)
  - [2.2. Heaps and Priority Queues](#22-heaps-and-priority-queues)
  - [2.3. String Data Structures and Monotonic Structures](#23-string-data-structures-and-monotonic-structures)
  - [2.4. Search Space and Greedy Paradigms](#24-search-space-and-greedy-paradigms)
  - [2.5. Foundational Dynamic Programming](#25-foundational-dynamic-programming)
  - [2.6. Graph Representations and Traversals](#26-graph-representations-and-traversals)
  - [2.7. Intermediate Modular and Combinatorial Mathematics](#27-intermediate-modular-and-combinatorial-mathematics)
- [3. Advanced](#3-advanced)
  - [3.1. Disjoint Sets and Range Query Data Structures](#31-disjoint-sets-and-range-query-data-structures)
  - [3.2. Advanced Graph Algorithms](#32-advanced-graph-algorithms)
  - [3.3. Advanced Tree Algorithms](#33-advanced-tree-algorithms)
  - [3.4. Advanced Dynamic Programming and Search](#34-advanced-dynamic-programming-and-search)
  - [3.5. String Matching Algorithms](#35-string-matching-algorithms)
  - [3.6. Computational Geometry and Number Theory](#36-computational-geometry-and-number-theory)
- [4. Expert](#4-expert)
  - [4.1. Specialized and Persistent Range Structures](#41-specialized-and-persistent-range-structures)
  - [4.2. Tree Decompositions](#42-tree-decompositions)
  - [4.3. Connectivity, Flows, and Matchings](#43-connectivity-flows-and-matchings)
  - [4.4. Dynamic Programming Optimizations](#44-dynamic-programming-optimizations)
  - [4.5. Advanced String Suffix Structures](#45-advanced-string-suffix-structures)
  - [4.6. Algebraic and Game-Theoretic Algorithms](#46-algebraic-and-game-theoretic-algorithms)
- [5. Systems & Storage Data Structures (Appendix)](#5-systems--storage-data-structures-appendix)
- [6. Complete Curriculum Folder Structure](#6-complete-curriculum-folder-structure)
  - [6.1. Visual Directory Tree](#61-visual-directory-tree)
  - [6.2. Canonical Slash-Delimited Path Directory](#62-canonical-slash-delimited-path-directory)
  - [6.3. Automated Directory Creation Scripts](#63-automated-directory-creation-scripts)

---

## 1. Beginner

### 1.1. Algorithmic Complexity and Asymptotic Analysis

- **1.1.1. Time Complexity Analysis**: Counting fundamental operations, instruction latency, mechanical sympathy, and evaluating execution bounds as input scales ($T(n)$ functions).
- **1.1.2. Space Complexity Analysis**: Auxiliary memory vs. total space, stack frame allocation, heap allocation, memory fragmentation, and in-place algorithmic bounds.
- **1.1.3. Asymptotic Notation**: Formal mathematical definitions of Big-O ($\mathcal{O}$ upper bound), Big-Omega ($\Omega$ lower bound), and Big-Theta ($\Theta$ tight bound); little-o and little-omega.
- **1.1.4. Amortized Analysis**: Aggregate analysis, accounting method, and potential method $\Phi(D_i)$; rigorous analysis of dynamically resized arrays and multi-pop stacks.
- **1.1.5. Recurrence Relations**: Modeling recursive execution times using recursion trees, substitution method, Master Theorem ($T(n) = aT(n/b) + f(n)$), and Akra-Bazzi method.

### 1.2. Contiguous and Sequential Data Structures

- **1.2.1. Static Arrays**: Fixed-size contiguous memory blocks, index-based $\mathcal{O}(1)$ random access, spatial locality, and CPU L1/L2/L3 cache-line utilization (64-byte lines).
- **1.2.2. Dynamic Arrays**: Resizable vector architectures, geometric growth factors ($1.5\times$ to $2\times$), amortized $\mathcal{O}(1)$ push operations, shrink thresholds, and memory reallocation costs.
- **1.2.3. Multidimensional Arrays and Matrices**: Flattened indexing formulas ($i \cdot \text{cols} + j$), row-major vs. column-major memory layout, submatrix bounding boxes, and cache-stride effects.
- **1.2.4. Strings and Character Arrays**: String immutability, ASCII, UTF-8 variable-length encodings, UTF-16 surrogate pairs, grapheme clusters, and Small String Optimization (SSO).

### 1.3. Linked Data Structures

- **1.3.1. Singly Linked Lists**: Node structures with forward pointers, pointer manipulation, in-place iterative and recursive list reversal, sentinel head nodes, and merge point detection.
- **1.3.2. Doubly Linked Lists**: Forward and backward bidirectional traversal, $\mathcal{O}(1)$ arbitrary node deletion given a direct pointer reference, sentinel head/tail nodes.
- **1.3.3. Circular Linked Lists**: Tail node referencing the head, circular ring topologies, split/merge operations, and round-robin scheduling queues.

### 1.4. Restricted Linear Data Structures

- **1.4.1. Stacks**: Last-In-First-Out (LIFO) protocol, call stack mechanics, function activation frames, expression evaluation, operator precedence parsing, and parentheses validation.
- **1.4.2. Queues**: First-In-First-Out (FIFO) protocol, front and rear pointer maintenance, circular array ring buffers to prevent false overflow and memory drift.
- **1.4.3. Double-Ended Queues (Deques)**: Insert and remove operations at both head and tail in $\mathcal{O}(1)$ time; array-based circular buffers and dynamic chunked linked lists.

### 1.5. Hash-Based Data Structures

- **1.5.1. Direct Access Tables**: Array-indexed key-value mapping over bounded universes, trade-offs between memory footprint and access speed.
- **1.5.2. Hash Functions**: Uniform distribution, avalanche effect, polynomial rolling hashes, MurmurHash3, SipHash (cryptographic collision resistance), and preventing HashDoS attacks.
- **1.5.3. Collision Resolution via Separate Chaining**: Linked list and balanced binary tree buckets, expected chain length, and load factor thresholding ($\alpha = N / M$).
- **1.5.4. Collision Resolution via Open Addressing**: Linear probing, quadratic probing, double hashing, cache efficiency, Robin Hood hashing, and tombstone deletion markers.
- **1.5.5. Hash Maps**: Key-value associative mapping, dynamic rehashing, resizing thresholds, amortized $\mathcal{O}(1)$ lookup, insertion, and deletion.
- **1.5.6. Hash Sets**: Distinct item storage, fast membership testing, set union, intersection, set difference, and subset checking.

### 1.6. Fundamental Searching and Sorting

- **1.6.1. Linear Search**: Sequential inspection, sentinel loop optimization, performance on small arrays and modern SIMD vectorization.
- **1.6.2. Binary Search on Sorted Arrays**: Divide-and-conquer logarithmic search, midpoint calculation without integer overflow (`low + (high - low) / 2`), search range invariants.
- **1.6.3. Lower Bound and Upper Bound Search**: Finding the first element $\ge \text{target}$ and first element $> \text{target}$ in monotonic sequences; bisection search.
- **1.6.4. Insertion Sort**: Online adaptive sorting, maintaining a sorted prefix, $\mathcal{O}(N)$ best-case on nearly sorted data, subproblem routine in TimSort.
- **1.6.5. Selection Sort**: Repeated minimum element extraction, unstable $\mathcal{O}(N^2)$ comparison sort, minimizing total write/swap operations.
- **1.6.6. Merge Sort**: Stable divide-and-conquer sorting, recursive tree analysis, $\mathcal{O}(N \log N)$ worst-case time, out-of-place buffer requirements, and inversion counting.
- **1.6.7. Quicksort**: Partitioning schemes (Lomuto, Hoare, Dutch National Flag 3-way), pivot selection strategies (median-of-three, randomized), recursion depth guards (Introsort).
- **1.6.8. Counting Sort**: Non-comparison integer sorting over bounded ranges $[0, K]$, frequency prefix calculation, stable sorting in $\mathcal{O}(N + K)$ time.
- **1.6.9. Radix Sort**: Multi-pass integer and string sorting using Least Significant Digit (LSD) and Most Significant Digit (MSD) passes combined with counting sort.
- **1.6.10. Custom Comparators**: Strict weak ordering axioms, transitive comparisons, multi-key composite sorting, and comparator objects/lambdas.
- **1.6.11. Coordinate Compression**: Mapping sparse, large values into dense rank-order indices ($[0, N-1]$) for array-indexed algorithms.

### 1.7. Core Array and Pointer Paradigms

- **1.7.1. Complete Search and Simulation**: Brute-force state enumeration, state space exhaustion, step-by-step physical simulation, and boundary checks.
- **1.7.2. Two Pointers**: Converging pointers from opposite ends of a sorted array, monotonic boundary reduction (Two Sum II, Container With Most Water, Trapping Rain Water).
- **1.7.3. Fast and Slow Pointers**: Floyd's Tortoise and Hare algorithm, cycle detection in linked lists and arrays, finding list midpoints in a single pass.
- **1.7.4. Fixed-Size Sliding Window**: Maintaining invariant state across a contiguous subarray of static width $K$ in $\mathcal{O}(1)$ incremental transition time.
- **1.7.5. Variable-Size Sliding Window**: Dynamically expanding right boundary and shrinking left boundary to maintain monotonic predicates (Longest Substring Without Repeating Characters).
- **1.7.6. One-Dimensional Prefix Sums**: Precomputing cumulative sums $P[i] = P[i-1] + A[i]$ to answer arbitrary range sum queries $\sum_{k=l}^r A[k]$ in $\mathcal{O}(1)$ time.
- **1.7.7. Two-Dimensional Prefix Sums**: Inclusion-exclusion formula on 2D grids to evaluate subgrid bounding box sums in $\mathcal{O}(1)$ time.
- **1.7.8. Difference Arrays**: Range updates: applying increment $+V$ to interval $[l, r]$ in $\mathcal{O}(1)$ time via $D[l] \mathrel{+}= V$ and $D[r+1] \mathrel{-}= V$, followed by prefix reconstruction.

### 1.8. Recursion and Bitwise Fundamentals

- **1.8.1. Linear and Tail Recursion**: Base cases, call stack unwinding, tail-call optimization (TCO), converting recursive calls to iterative loops.
- **1.8.2. Divide and Conquer Fundamentals**: Problem decomposition into non-overlapping subproblems, conquer step, and recombination of solutions (Binary Search, Merge Sort).
- **1.8.3. Bitwise Operators**: Bitwise AND (`&`), OR (`|`), XOR (`^`), NOT (`~`), left shift (`<<`), right shift (`>>`), arithmetic vs. logical shifts, bit manipulation idioms (`n & (n - 1)`).
- **1.8.4. Bitmask Representation of Sets**: Treating integers as compact boolean arrays, membership test (`mask & (1 << i)`), union, intersection, set difference, and power set enumeration.

### 1.9. Foundational Mathematics

- **1.9.1. Integer Divisibility**: Division algorithm, quotient and remainder, parity, prime vs. composite properties, and prime distribution bounds.
- **1.9.2. Greatest Common Divisor and Euclidean Algorithm**: Euclidean algorithm for $\gcd(a, b)$, Least Common Multiple ($\text{lcm}(a, b) = \frac{a \cdot b}{\gcd(a, b)}$).
- **1.9.3. Sieve of Eratosthenes**: Generating all prime numbers up to $N$ in $\mathcal{O}(N \log \log N)$ time, boolean composite cross-off array, and linear sieve (Euler's sieve).
- **1.9.4. Trial Division Prime Factorization**: Finding prime factors up to $\sqrt{N}$ in $\mathcal{O}(\sqrt{N})$ time, canonical prime factorization theorem.

---

## 2. Intermediate

### 2.1. Hierarchical Data Structures

- **2.1.1. Binary Trees**: Tree terminology (root, leaf, height, depth), full, complete, perfect, and degenerate trees; tree serialization.
- **2.1.2. Preorder, Inorder, and Postorder Traversals**: Recursive depth-first tree walks, explicit stack simulations, and Morris in-order traversal ($\mathcal{O}(1)$ auxiliary space).
- **2.1.3. Level-Order Traversal**: Breadth-first tree search using a queue, calculating tree width, zig-zag traversals, and vertical column traversals.
- **2.1.4. Binary Search Trees (BST)**: Binary search tree invariant ($L < P < R$), search, insert, delete (in-order successor/predecessor replacement), min/max lookups.
- **2.1.5. Balanced Binary Search Trees**: Self-balancing invariants: AVL Trees (balance factors and rotations) and Red-Black Trees (recoloring and rotations).
- **2.1.6. Ordered Sets and Ordered Maps**: Tree-backed associative containers, logarithmic predecessor, successor, and range iteration.
- **2.1.7. Tree Diameter and Subtree Properties**: Calculating the longest path between any two nodes in a tree, subtree sizes, depth calculation, and tree centroids.

### 2.2. Heaps and Priority Queues

- **2.2.1. Binary Heaps**: Array-backed complete binary trees, parent-child index relations ($2i+1, 2i+2$), Min-Heap and Max-Heap invariants, sift-up, sift-down.
- **2.2.2. Priority Queues**: Abstract data type for priority-ordered retrieval, insert ($\mathcal{O}(\log N)$), extract-min/max ($\mathcal{O}(\log N)$), peek ($\mathcal{O}(1)$).
- **2.2.3. Heap Sort**: In-place $\mathcal{O}(N \log N)$ comparison sorting using a binary heap, Floyd's $\mathcal{O}(N)$ linear heap construction algorithm.
- **2.2.4. Top-K Elements and Two-Heap Maintenance**: Streaming top-K largest elements via Min-Heap, continuous median tracking using paired Min-Heap and Max-Heap.

### 2.3. String Data Structures and Monotonic Structures

- **2.3.1. Prefix Trees and Tries**: Character-labeled tree edges, string insertion, lookup, and prefix matching in $\mathcal{O}(L)$ time where $L$ is string length; word dictionaries.
- **2.3.2. Bitwise Tries**: Binary alphabet $\{0, 1\}$ trie over integer bits, maximum XOR pair queries in $\mathcal{O}(\text{bits})$, prefix bit queries.
- **2.3.3. Monotonic Stacks**: Stack with strictly increasing or decreasing elements, solving Next Greater Element, Stock Span, and Largest Rectangle in Histogram.
- **2.3.4. Monotonic Queues**: Double-ended queue maintaining monotonic order, calculating sliding window minimum/maximum in amortized $\mathcal{O}(1)$ per step.

### 2.4. Search Space and Greedy Paradigms

- **2.4.1. Backtracking and State-Space Search**: State exploration via depth-first decision trees, `Choose`, `Explore`, `Unchoose` methodology (N-Queens, Sudoku Solver).
- **2.4.2. Pruning Techniques**: Bounding functions, symmetry breaking, forward checking, branch-and-bound pruning, and constraint satisfaction.
- **2.4.3. Binary Search on the Answer**: Monotonic boolean feasibility functions $P(x)$, minimizing or maximizing parameters across continuous and discrete answer spaces (Koko Eating Bananas, Capacity To Ship Packages).
- **2.4.4. Ternary Search on Unimodal Functions**: Dividing search intervals into three parts to locate local extrema of unimodal or convex functions.
- **2.4.5. Greedy Algorithms with Sorting**: Greedy choice property, optimal substructure, proving optimality via exchange arguments.
- **2.4.6. Interval Scheduling and Merging**: Merging overlapping intervals, maximum non-overlapping interval scheduling, minimum meeting rooms required.
- **2.4.7. Kadane's Algorithm**: Dynamic programming / greedy maximum subarray sum in $\mathcal{O}(N)$ time and $\mathcal{O}(1)$ auxiliary space; circular subarray variations.

### 2.5. Foundational Dynamic Programming

- **2.5.1. Top-Down Memoization**: Recursive formulations augmented with hash map or array caches for overlapping subproblems.
- **2.5.2. Bottom-Up Tabulation**: Iterative table filling following topological evaluation order of subproblem DAGs.
- **2.5.3. Space-Optimized Dynamic Programming**: Rolling arrays and state variable reduction to drop spatial complexity by an order of magnitude.
- **2.5.4. One-Dimensional Dynamic Programming**: Linear recurrences (Fibonacci, Climbing Stairs, House Robber, Coin Change).
- **2.5.5. Multi-Dimensional Grid Dynamic Programming**: Path counting on grids, minimum cost paths, obstacle avoidance, rectangle area state transformations.
- **2.5.6. Zero-One Knapsack**: Item inclusion/exclusion decisions with bounded weights, reverse-loop inner iteration for space compression.
- **2.5.7. Unbounded Knapsack**: Multi-item selection with replacement, forward-loop inner iteration.
- **2.5.8. Subset Sum**: Partitioning problems, boolean reachable state transitions, subset difference minimization.
- **2.5.9. Longest Increasing Subsequence (LIS)**: Standard $\mathcal{O}(N^2)$ dynamic programming recurrence and $\mathcal{O}(N \log N)$ patience sorting with binary search.
- **2.5.10. Longest Common Subsequence (LCS)**: 2D matching matrix recurrence, string reconstruction via back-pointers, shortest common supersequence.
- **2.5.11. Edit Distance (Levenshtein Distance)**: Minimum insert, delete, and replace operations to transform one string into another.

### 2.6. Graph Representations and Traversals

- **2.6.1. Adjacency List and Adjacency Matrix Representations**: Memory bounds ($\mathcal{O}(V^2)$ vs. $\mathcal{O}(V + E)$), edge lookup, degree enumeration, and Compressed Sparse Row (CSR).
- **2.6.2. Implicit Grid Graphs and Flood Fill**: Grid cells as graph vertices, 4-directional and 8-directional edge transitions, connected component coloring, and perimeter calculation.
- **2.6.3. Depth-First Search (DFS)**: Recursive and stack-based traversal, discovery/finish timestamps, tree edges, back edges, forward edges, and cross edges.
- **2.6.4. Breadth-First Search (BFS)**: Queue-based level-order exploration, finding shortest paths in unweighted graphs, multi-source BFS.
- **2.6.5. Connected Components**: Finding and labeling disjoint graph subgraphs in undirected graphs via DFS/BFS.
- **2.6.6. Cycle Detection in Undirected and Directed Graphs**: Parent tracking in undirected graphs; 3-color DFS state tracking (White, Gray, Black) in directed graphs.
- **2.6.7. Bipartite Graph Checking and Two-Coloring**: 2-coloring via BFS/DFS, verifying absence of odd-length cycles.
- **2.6.8. Shortest Paths in Unweighted Graphs**: Single-source shortest paths (SSSP) via breadth-first search in $\mathcal{O}(V + E)$ time; path reconstruction via predecessor maps.

### 2.7. Intermediate Modular and Combinatorial Mathematics

- **2.7.1. Modular Arithmetic**: Addition, subtraction, multiplication modulo $M$, preventing 64-bit integer overflow during intermediate steps.
- **2.7.2. Binary Exponentiation**: Computing $a^b \pmod M$ in $\mathcal{O}(\log b)$ time using repeated squaring.
- **2.7.3. Modular Multiplicative Inverse**: Fermat's Little Theorem for prime moduli ($a^{M-2} \equiv a^{-1} \pmod M$), extended Euclidean algorithm for coprime moduli.
- **2.7.4. Binomial Coefficients and Combinatorics**: Factorial precomputation, calculating $\binom{n}{k} \pmod M$, Pascal's identity, stars and bars technique, and Catalan numbers.

---

## 3. Advanced

### 3.1. Disjoint Sets and Range Query Data Structures

- **3.1.1. Disjoint Set Union (DSU / Union-Find)**: Partitioning elements into disjoint sets, `find` and `union` operations, representative parent tracking.
- **3.1.2. Path Compression and Union by Rank or Size**: Flattens tree structures during lookups, bounding operations to nearly linear $\mathcal{O}(\alpha(N))$ time (Inverse Ackermann).
- **3.1.3. Sparse Tables for Idempotent Range Queries**: Power-of-two jump tables, $\mathcal{O}(N \log N)$ precomputation, $\mathcal{O}(1)$ Range Minimum/Maximum Queries (RMQ).
- **3.1.4. Binary Indexed Trees (Fenwick Trees)**: Tree structure mapped on lowest set bit (`x & (-x)`), $\mathcal{O}(\log N)$ prefix sum queries and point updates.
- **3.1.5. Point Update Range Query Segment Trees**: Complete binary tree representation, range associative queries and single-element updates in $\mathcal{O}(\log N)$ time.
- **3.1.6. Segment Trees with Lazy Propagation**: Deferred range updates using lazy tags, enabling $\mathcal{O}(\log N)$ range modification and range query operations.
- **3.1.7. Order Statistic Trees**: Balanced search trees augmented with subtree sizes, answering $k$-th smallest element and element rank queries in $\mathcal{O}(\log N)$.

### 3.2. Advanced Graph Algorithms

- **3.2.1. Topological Sorting**: Kahn's algorithm (in-degree reduction queue) and DFS post-order reversal for DAG vertex linearizations.
- **3.2.2. Dynamic Programming on Directed Acyclic Graphs**: Evaluating dynamic programming recurrences over topological vertex orders (Longest Path in DAG).
- **3.2.3. Zero-One Breadth-First Search (0-1 BFS)**: Shortest paths on graphs with edge weights in $\{0, 1\}$ using a Deque in $\mathcal{O}(V + E)$ time.
- **3.2.4. Dijkstra's Algorithm**: Single-source shortest paths on non-negative weighted graphs using a min-heap priority queue in $\mathcal{O}((V + E) \log V)$ time.
- **3.2.5. Bellman-Ford Algorithm**: Relaxing all edges $V-1$ times, handling negative edge weights, detecting negative-weight cycles in $\mathcal{O}(V \cdot E)$ time; Shortest Path Faster Algorithm (SPFA).
- **3.2.6. Floyd-Warshall Algorithm**: Dynamic programming all-pairs shortest paths (APSP) in $\mathcal{O}(V^3)$ time, transitive closure computation, negative cycle detection.
- **3.2.7. Kruskal's Algorithm for Minimum Spanning Trees**: Edge sorting followed by greedy selection using Disjoint Set Union in $\mathcal{O}(E \log E)$ time.
- **3.2.8. Prim's Algorithm for Minimum Spanning Trees**: Vertex growth algorithm maintaining cut edges via a priority queue in $\mathcal{O}(E \log V)$ time.
- **3.2.9. Functional Graphs and Successor Graphs**: Directed graphs where out-degree of every vertex is 1, binary lifting for successor navigation, cycle component discovery.
- **3.2.10. Eulerian Paths and Circuits**: Hierholzer's linear $\mathcal{O}(V + E)$ algorithm for finding paths visiting every edge exactly once in directed and undirected graphs.

### 3.3. Advanced Tree Algorithms

- **3.3.1. Subtree Dynamic Programming**: Computing dynamic programming values over subtrees via post-order tree traversals (Maximum Independent Set on Trees).
- **3.3.2. Rerooting Dynamic Programming (In-and-Out DP)**: Two-pass tree traversal technique computing answers for every node as root in $\mathcal{O}(N)$ total time.
- **3.3.3. Euler Tour Technique**: Flattening a tree into a linear array using entry and exit timestamps, transforming subtree operations into contiguous range queries.
- **3.3.4. Binary Lifting**: Jump pointer tables ($up[v][j] = 2^j$-th ancestor), answering ancestor queries in $\mathcal{O}(\log N)$ time.
- **3.3.5. Lowest Common Ancestor (LCA) via Binary Lifting**: Elevating deeper nodes to identical depth, binary stepping to identify Lowest Common Ancestor in $\mathcal{O}(\log N)$ time.
- **3.3.6. Lowest Common Ancestor via Euler Tour and Range Minimum Query**: Reduction of LCA to static Range Minimum Query on Euler tour depth array in $\mathcal{O}(1)$ query time after $\mathcal{O}(N \log N)$ precomputation.
- **3.3.7. Small-to-Large Merging (Sack / DSU on Tree)**: Merging child subtree data structures into the largest child's structure, bounding overall work to $\mathcal{O}(N \log N)$ or $\mathcal{O}(N \log^2 N)$.

### 3.4. Advanced Dynamic Programming and Search

- **3.4.1. Bitmask Dynamic Programming**: Bitmask state representations, subset iteration ($\mathcal{O}(3^N)$), Traveling Salesperson Problem (TSP in $\mathcal{O}(N^2 2^N)$), matching problems.
- **3.4.2. Range and Interval Dynamic Programming**: Subarray range synthesis, transitioning from shorter intervals to longer intervals (Matrix Chain Multiplication, Burst Balloons).
- **3.4.3. Digit Dynamic Programming**: Counting integers in range $[A, B]$ satisfying digit conditions via state tuple `(index, tight, leading_zeros, mask)`.
- **3.4.4. Meet in the Middle**: Dividing search spaces of size $2^N$ into two halves of size $2^{N/2}$, computing half-solutions and recombining via sorting or binary search.

### 3.5. String Matching Algorithms

- **3.5.1. Polynomial Rolling Hash**: Rabin-Karp substring search algorithm, modular arithmetic on rolling character window hashes, handling double hash collisions.
- **3.5.2. Knuth-Morris-Pratt (KMP) Algorithm**: Prefix function $\pi[i]$ (Longest Proper Prefix which is also Suffix), avoiding redundant backtracks in $\mathcal{O}(N + M)$ time.
- **3.5.3. Z-Algorithm**: Computing $Z$-array ($Z[i]$ = length of longest substring starting at $i$ matching prefix of string) in $\mathcal{O}(N)$ linear time.
- **3.5.4. Manacher's Algorithm**: Linear $\mathcal{O}(N)$ algorithm finding all maximal palindromic substrings by exploiting symmetry and mirror bounds.

### 3.6. Computational Geometry and Number Theory

- **3.6.1. Cross Product and Orientation Primitives**: 2D cross product of vectors, clockwise, counter-clockwise, and collinear orientation tests.
- **3.6.2. Line Segment Intersection**: Verifying if two line segments intersect using cross-product orientation tests and bounding box checks.
- **3.6.3. Polygon Area**: Shoelace formula (Gauss's area formula) for computing the area of arbitrary non-self-intersecting polygons in $\mathcal{O}(N)$ time.
- **3.6.4. Sweep Line Algorithms**: Sorting geometric events along an axis, dynamic event processing with balanced search trees.
- **3.6.5. Two-Dimensional Convex Hull**: Graham Scan and Andrew's Monotone Chain algorithms computing the minimum enclosing convex boundary in $\mathcal{O}(N \log N)$ time.
- **3.6.6. Extended Euclidean Algorithm**: Computing integers $x, y$ such that $a \cdot x + b \cdot y = \gcd(a, b)$, finding modular inverses and solving linear Diophantine equations.
- **3.6.7. Euler's Totient Function**: Counting positive integers up to $N$ coprime to $N$, product formula $\phi(N) = N \prod_{p|N} (1 - 1/p)$, and totient sieve.
- **3.6.8. Inclusion-Exclusion Principle**: Computing set union cardinality $|\bigcup A_i| = \sum |A_i| - \sum |A_i \cap A_j| + \dots$, application to counting coprime sets and permutations.
- **3.6.9. Matrix Exponentiation**: Formulating linear recurrences as state-transition matrices, accelerating evaluation to $\mathcal{O}(K^3 \log N)$ time.

---

## 4. Expert

### 4.1. Specialized and Persistent Range Structures

- **4.1.1. Dynamic and Sparse Segment Trees**: Node allocation on demand for coordinates up to $10^9$ without full coordinate compression.
- **4.1.2. Persistent Segment Trees**: Path copying technique, preserving previous versions of data structures, range $k$-th smallest queries (Chairman Tree).
- **4.1.3. Merge Sort Trees and Two-Dimensional Range Queries**: Segment tree where each node holds a sorted vector, answering range frequency and rank queries.
- **4.1.4. Segment Tree Beats**: Maintaining range minimum, maximum, and modulo/clipping updates ($A[i] = \min(A[i], X)$) in amortized $\mathcal{O}(N \log N)$ time.
- **4.1.5. Wavelet Trees**: Recursive alphabet-partitioning tree supporting rank, select, and range quantile queries over arbitrary integer sequences.
- **4.1.6. Square Root Decomposition**: Block decomposition dividing arrays into chunks of size $\sqrt{N}$, processing point updates and block queries in $\mathcal{O}(\sqrt{N})$.
- **4.1.7. Mo's Algorithm**: Offline query reordering via Hilbert curves or $\sqrt{N}$ block sorting, answering $Q$ range queries in $\mathcal{O}((N + Q)\sqrt{N})$.
- **4.1.8. Randomized Treaps and Implicit Treaps**: Cartesian tree combining BST search keys and randomized heap priorities; implicit treaps for dynamic array splitting and rope operations.
- **4.1.9. Splay Trees and Link-Cut Trees**: Splay trees (self-adjusting amortized $\mathcal{O}(\log N)$ BST); Link-Cut Trees maintaining dynamic forests with link and cut operations.

### 4.2. Tree Decompositions

- **4.2.1. Heavy-Light Decomposition (HLD)**: Decomposing trees into heavy and light chains, mapping paths to contiguous segments for $\mathcal{O}(\log^2 N)$ path updates and queries.
- **4.2.2. Centroid Decomposition**: Recursive tree partitioning at centroid vertices (subtrees $\le N/2$), answering tree path distance queries in $\mathcal{O}(N \log N)$ time.
- **4.2.3. Virtual Trees (Auxiliary Trees)**: Compressing a subset of $K$ critical tree nodes and their LCAs into an auxiliary tree of size $\mathcal{O}(K)$ in $\mathcal{O}(K \log K)$ time.
- **4.2.4. Kruskal Reconstruction Tree**: Binary tree built during Kruskal's algorithm, converting bottleneck edge weight queries between nodes into LCA queries.

### 4.3. Connectivity, Flows, and Matchings

- **4.3.1. Kosaraju's and Tarjan's Strongly Connected Components Algorithms**: Decomposition of directed graphs into maximal strongly connected subgraphs via DFS.
- **4.3.2. Two-Satisfiability (2-SAT)**: Solving boolean satisfiability clauses $(x \lor y)$ in linear time using implication graphs and SCC topological orderings.
- **4.3.3. Bridges, Articulation Points, and Biconnected Components**: Identifying critical failure points in undirected graphs using discovery and low-link numbers.
- **4.3.4. Block-Cut Trees**: Tree representation of an undirected graph's biconnected components (blocks) and articulation points (cuts).
- **4.3.5. Maximum Flow and Minimum Cut**: Max-Flow Min-Cut Theorem, Ford-Fulkerson method, Edmonds-Karp shortest augmenting path algorithm.
- **4.3.6. Dinic's Algorithm**: Level graphs constructed via BFS and blocking flows pushed via DFS, running in $\mathcal{O}(V^2 E)$ (and $\mathcal{O}(E \sqrt{V})$ on unit networks).
- **4.3.7. Maximum Bipartite Matching**: Finding maximum matching in bipartite graphs via Hopcroft-Karp algorithm in $\mathcal{O}(E \sqrt{V})$ time.
- **4.3.8. Minimum Cost Maximum Flow (MCMF)**: Augmenting paths with minimum cost using Bellman-Ford, SPFA, or potentials with Dijkstra.
- **4.3.9. Offline Dynamic Connectivity**: Maintaining graph connectivity across an offline sequence of edge insertions and deletions via DSU with rollback and divide-and-conquer over time.

### 4.4. Dynamic Programming Optimizations

- **4.4.1. Convex Hull Trick (CHT)**: Optimizing transitions $dp[i] = \min_{j < i} \{ dp[j] + m_j x_i + c_j \}$ from $\mathcal{O}(N^2)$ to $\mathcal{O}(N)$ or $\mathcal{O}(N \log N)$ by maintaining upper/lower convex hulls of lines.
- **4.4.2. Li Chao Trees**: Segment tree maintaining line or segment envelopes, supporting dynamic line insertion and point evaluation in $\mathcal{O}(\log N)$.
- **4.4.3. Divide and Conquer Dynamic Programming Optimization**: Applicable when transition points satisfy quadrangle monotonicity $opt[i][j-1] \le opt[i][j] \le opt[i+1][j]$, reducing complexity from $\mathcal{O}(K N^2)$ to $\mathcal{O}(K N \log N)$.
- **4.4.4. Knuth's Optimization**: Narrowing subproblem split searches for interval DP satisfying the quadrangle inequality, reducing complexity from $\mathcal{O}(N^3)$ to $\mathcal{O}(N^2)$.
- **4.4.5. Lagrangian Relaxation and Aliens Trick**: Binary searching over Lagrange multipliers (penalties $\lambda$) to remove cardinality constraints $K$ from state spaces.
- **4.4.6. Slope Trick**: Maintaining convex cost functions using sets of slope change points (priority queues of inflection coordinates).
- **4.4.7. Sum Over Subsets (SOS) Dynamic Programming**: Evaluating submask sums $F[mask] = \sum_{sub \subseteq mask} A[sub]$ in $\mathcal{O}(N \cdot 2^N)$ time instead of $\mathcal{O}(3^N)$.
- **4.4.8. Broken Profile Dynamic Programming**: Dynamic programming on grid cells with irregular, jagged, or incomplete profiles using bitmask boundaries.

### 4.5. Advanced String Suffix Structures

- **4.5.1. Aho-Corasick Automaton**: Multi-pattern string matching combining trie structures with KMP failure links and dictionary suffix links in $\mathcal{O}(\sum |P| + |Text|)$.
- **4.5.2. Suffix Arrays and Longest Common Prefix (LCP) Arrays**: Lexicographically sorted suffixes in $\mathcal{O}(N \log N)$ and Kasai's algorithm for linear-time LCP calculation in $\mathcal{O}(N)$.
- **4.5.3. Suffix Automata (SAM)**: Minimal directed acyclic word graph (DAWG) representing all substrings of a string with $\mathcal{O}(N)$ states and transitions.
- **4.5.4. Palindromic Trees (Eertree)**: Directed tree structure encoding all distinct palindromic substrings of a string in $\mathcal{O}(N)$ vertices.

### 4.6. Algebraic and Game-Theoretic Algorithms

- **4.6.1. Fast Fourier Transform (FFT) and Number Theoretic Transform (NTT)**: Polynomial multiplication in $\mathcal{O}(N \log N)$ using complex roots of unity or modular primitive roots.
- **4.6.2. Linear XOR Basis and Gaussian Elimination**: Vector space over $\mathbb{F}_2$, finding maximum XOR subset sums and Gaussian elimination over modular systems.
- **4.6.3. Combinatorial Game Theory and Sprague-Grundy Theorem**: Normal play impartial games, calculating Grundy values ($mex$ function), game decomposition via XOR-sums.

---

## 5. Systems & Storage Data Structures (Appendix)

Data structures foundational to modern database storage engines, distributed key-value stores, and operating systems:

### 5.1. B-Trees & B+ Trees

- **B-Trees**: Multi-way balanced search trees maintaining ordered keys per page, minimizing disk read operations.
- **B+ Trees**: Storage engine index standard; internal nodes hold routing keys only, while leaf nodes form a contiguous doubly linked list for range scans.

### 5.2. Log-Structured Merge-Trees (LSM-Trees) & SSTables

- **MemTable & WAL**: In-memory write buffers (SkipList/rbtree) protected against process crashes via append-only Write-Ahead Logs.
- **Sorted String Tables (SSTables)**: Immutable disk files with block indices and sparse filters.
- **Compaction Strategies**: Leveled Compaction vs. Size-Tiered Compaction for managing read, write, and space amplification.

### 5.3. Probabilistic Filters & Sketches

- **Bloom Filters**: Space-efficient bit arrays with $k$ hash functions; zero false negatives for cache-bypass lookups.
- **Cuckoo Filters**: Fingerprint-based cuckoo hashing filters supporting dynamic deletions.
- **HyperLogLog (HLL)**: Cardinality estimation of billions of distinct records using small constant memory ($1.5 \text{ KB}$).
- **Count-Min Sketch**: Sublinear frequency estimation and heavy-hitter identification in data streams.

### 5.4. Compressed Radix Trees (Patricia Tries)

- **Radix Trees / Patricia Tries**: Prefix trees with edge-compacted non-branching paths for high-performance IP routing tables and associative lookups.

### 5.5. Concurrency & In-Memory Caching Structures

- **LRU Cache ($O(1)$)**: Doubly linked list paired with a hash map for least-recently-used cache eviction.
- **LFU Cache ($O(1)$)**: Frequency-bucketed doubly linked lists for least-frequently-used cache eviction.
- **Lock-Free SPSC Ring Buffer**: Circular buffers utilizing atomic head/tail pointers and memory fences for wait-free producer-consumer pipelines.
- **Skip Lists**: Probabilistic balanced hierarchies for concurrent in-memory ordered storage (e.g., Redis Sorted Sets).
- **Merkle Trees**: Cryptographic hash trees for distributed peer-to-peer anti-entropy and consensus verification.

### 5.6. Multi-Dimensional Spatial Trees

- **QuadTrees & Octrees**: Recursive 2D/3D space partitioning for graphics engines, collision detection, and spatial simulations.
- **K-D Trees**: $k$-dimensional space partitioning for fast nearest neighbor lookups ($k$-NN).
- **R-Trees & $R^\*$ Trees**: Minimum bounding box hierarchies for spatial indices and geographic GIS queries.

---

## 6. Complete Curriculum Folder Structure

This section provides the complete directory hierarchy from **Beginner** to **Expert** (plus **Appendix: Systems & Storage**), formatted for directory creation in repositories, personal knowledge management vaults (e.g., Obsidian, Dendron), or course module layouts.

### 6.1. Visual Directory Tree

```text
dsa/
├── beginner/
│   ├── Algorithmic Complexity and Asymptotic Analysis/
│   │   ├── Time Complexity Analysis/
│   │   ├── Space Complexity Analysis/
│   │   ├── Asymptotic Notation/
│   │   ├── Amortized Analysis/
│   │   └── Recurrence Relations/
│   ├── Contiguous and Sequential Data Structures/
│   │   ├── Static Arrays/
│   │   ├── Dynamic Arrays/
│   │   ├── Multidimensional Arrays and Matrices/
│   │   └── Strings and Character Arrays/
│   ├── Linked Data Structures/
│   │   ├── Singly Linked Lists/
│   │   ├── Doubly Linked Lists/
│   │   └── Circular Linked Lists/
│   ├── Restricted Linear Data Structures/
│   │   ├── Stacks/
│   │   ├── Queues/
│   │   └── Double-Ended Queues (Deques)/
│   ├── Hash-Based Data Structures/
│   │   ├── Direct Access Tables/
│   │   ├── Hash Functions/
│   │   ├── Collision Resolution via Separate Chaining/
│   │   ├── Collision Resolution via Open Addressing/
│   │   ├── Hash Maps/
│   │   └── Hash Sets/
│   ├── Fundamental Searching and Sorting/
│   │   ├── Linear Search/
│   │   ├── Binary Search on Sorted Arrays/
│   │   ├── Lower Bound and Upper Bound Search/
│   │   ├── Insertion Sort/
│   │   ├── Selection Sort/
│   │   ├── Merge Sort/
│   │   ├── Quicksort/
│   │   ├── Counting Sort/
│   │   ├── Radix Sort/
│   │   ├── Custom Comparators/
│   │   └── Coordinate Compression/
│   ├── Core Array and Pointer Paradigms/
│   │   ├── Complete Search and Simulation/
│   │   ├── Two Pointers/
│   │   ├── Fast and Slow Pointers/
│   │   ├── Fixed-Size Sliding Window/
│   │   ├── Variable-Size Sliding Window/
│   │   ├── One-Dimensional Prefix Sums/
│   │   ├── Two-Dimensional Prefix Sums/
│   │   └── Difference Arrays/
│   ├── Recursion and Bitwise Fundamentals/
│   │   ├── Linear and Tail Recursion/
│   │   ├── Divide and Conquer Fundamentals/
│   │   ├── Bitwise Operators/
│   │   └── Bitmask Representation of Sets/
│   └── Foundational Mathematics/
│       ├── Integer Divisibility/
│       ├── Greatest Common Divisor and Euclidean Algorithm/
│       ├── Sieve of Eratosthenes/
│       └── Trial Division Prime Factorization/
├── intermediate/
│   ├── Hierarchical Data Structures/
│   │   ├── Binary Trees/
│   │   ├── Preorder Inorder and Postorder Traversals/
│   │   ├── Level-Order Traversal/
│   │   ├── Binary Search Trees (BST)/
│   │   ├── Balanced Binary Search Trees/
│   │   ├── Ordered Sets and Ordered Maps/
│   │   └── Tree Diameter and Subtree Properties/
│   ├── Heaps and Priority Queues/
│   │   ├── Binary Heaps/
│   │   ├── Priority Queues/
│   │   ├── Heap Sort/
│   │   └── Top-K Elements and Two-Heap Maintenance/
│   ├── String Data Structures and Monotonic Structures/
│   │   ├── Prefix Trees and Tries/
│   │   ├── Bitwise Tries/
│   │   ├── Monotonic Stacks/
│   │   └── Monotonic Queues/
│   ├── Search Space and Greedy Paradigms/
│   │   ├── Backtracking and State-Space Search/
│   │   ├── Pruning Techniques/
│   │   ├── Binary Search on the Answer/
│   │   ├── Ternary Search on Unimodal Functions/
│   │   ├── Greedy Algorithms with Sorting/
│   │   ├── Interval Scheduling and Merging/
│   │   └── Kadane's Algorithm/
│   ├── Foundational Dynamic Programming/
│   │   ├── Top-Down Memoization/
│   │   ├── Bottom-Up Tabulation/
│   │   ├── Space-Optimized Dynamic Programming/
│   │   ├── One-Dimensional Dynamic Programming/
│   │   ├── Multi-Dimensional Grid Dynamic Programming/
│   │   ├── Zero-One Knapsack/
│   │   ├── Unbounded Knapsack/
│   │   ├── Subset Sum/
│   │   ├── Longest Increasing Subsequence (LIS)/
│   │   ├── Longest Common Subsequence (LCS)/
│   │   └── Edit Distance (Levenshtein Distance)/
│   ├── Graph Representations and Traversals/
│   │   ├── Adjacency List and Adjacency Matrix Representations/
│   │   ├── Implicit Grid Graphs and Flood Fill/
│   │   ├── Depth-First Search (DFS)/
│   │   ├── Breadth-First Search (BFS)/
│   │   ├── Connected Components/
│   │   ├── Cycle Detection in Undirected and Directed Graphs/
│   │   ├── Bipartite Graph Checking and Two-Coloring/
│   │   └── Shortest Paths in Unweighted Graphs/
│   └── Intermediate Modular and Combinatorial Mathematics/
│       ├── Modular Arithmetic/
│       ├── Binary Exponentiation/
│       ├── Modular Multiplicative Inverse/
│       └── Binomial Coefficients and Combinatorics/
├── advanced/
│   ├── Disjoint Sets and Range Query Data Structures/
│   │   ├── Disjoint Set Union (DSU and Union-Find)/
│   │   ├── Path Compression and Union by Rank or Size/
│   │   ├── Sparse Tables for Idempotent Range Queries/
│   │   ├── Binary Indexed Trees (Fenwick Trees)/
│   │   ├── Point Update Range Query Segment Trees/
│   │   ├── Segment Trees with Lazy Propagation/
│   │   └── Order Statistic Trees/
│   ├── Advanced Graph Algorithms/
│   │   ├── Topological Sorting/
│   │   ├── Dynamic Programming on Directed Acyclic Graphs/
│   │   ├── Zero-One Breadth-First Search (0-1 BFS)/
│   │   ├── Dijkstra's Algorithm/
│   │   ├── Bellman-Ford Algorithm/
│   │   ├── Floyd-Warshall Algorithm/
│   │   ├── Kruskal's Algorithm for Minimum Spanning Trees/
│   │   ├── Prim's Algorithm for Minimum Spanning Trees/
│   │   ├── Functional Graphs and Successor Graphs/
│   │   └── Eulerian Paths and Circuits/
│   ├── Advanced Tree Algorithms/
│   │   ├── Subtree Dynamic Programming/
│   │   ├── Rerooting Dynamic Programming (In-and-Out DP)/
│   │   ├── Euler Tour Technique/
│   │   ├── Binary Lifting/
│   │   ├── Lowest Common Ancestor (LCA) via Binary Lifting/
│   │   ├── Lowest Common Ancestor via Euler Tour and Range Minimum Query/
│   │   └── Small-to-Large Merging (Sack and DSU on Tree)/
│   ├── Advanced Dynamic Programming and Search/
│   │   ├── Bitmask Dynamic Programming/
│   │   ├── Range and Interval Dynamic Programming/
│   │   ├── Digit Dynamic Programming/
│   │   └── Meet in the Middle/
│   ├── String Matching Algorithms/
│   │   ├── Polynomial Rolling Hash/
│   │   ├── Knuth-Morris-Pratt (KMP) Algorithm/
│   │   ├── Z-Algorithm/
│   │   └── Manacher's Algorithm/
│   └── Computational Geometry and Number Theory/
│       ├── Cross Product and Orientation Primitives/
│       ├── Line Segment Intersection/
│       ├── Polygon Area/
│       ├── Sweep Line Algorithms/
│       ├── Two-Dimensional Convex Hull/
│       ├── Extended Euclidean Algorithm/
│       ├── Euler's Totient Function/
│       ├── Inclusion-Exclusion Principle/
│       └── Matrix Exponentiation/
├── expert/
│   ├── Specialized and Persistent Range Structures/
│   │   ├── Dynamic and Sparse Segment Trees/
│   │   ├── Persistent Segment Trees/
│   │   ├── Merge Sort Trees and Two-Dimensional Range Queries/
│   │   ├── Segment Tree Beats/
│   │   ├── Wavelet Trees/
│   │   ├── Square Root Decomposition/
│   │   ├── Mo's Algorithm/
│   │   ├── Randomized Treaps and Implicit Treaps/
│   │   └── Splay Trees and Link-Cut Trees/
│   ├── Tree Decompositions/
│   │   ├── Heavy-Light Decomposition (HLD)/
│   │   ├── Centroid Decomposition/
│   │   ├── Virtual Trees (Auxiliary Trees)/
│   │   └── Kruskal Reconstruction Tree/
│   ├── Connectivity Flows and Matchings/
│   │   ├── Kosaraju's and Tarjan's Strongly Connected Components Algorithms/
│   │   ├── Two-Satisfiability (2-SAT)/
│   │   ├── Bridges Articulation Points and Biconnected Components/
│   │   ├── Block-Cut Trees/
│   │   ├── Maximum Flow and Minimum Cut/
│   │   ├── Dinic's Algorithm/
│   │   ├── Maximum Bipartite Matching/
│   │   ├── Minimum Cost Maximum Flow (MCMF)/
│   │   └── Offline Dynamic Connectivity/
│   ├── Dynamic Programming Optimizations/
│   │   ├── Convex Hull Trick (CHT)/
│   │   ├── Li Chao Trees/
│   │   ├── Divide and Conquer Dynamic Programming Optimization/
│   │   ├── Knuth's Optimization/
│   │   ├── Lagrangian Relaxation and Aliens Trick/
│   │   ├── Slope Trick/
│   │   ├── Sum Over Subsets (SOS) Dynamic Programming/
│   │   └── Broken Profile Dynamic Programming/
│   ├── Advanced String Suffix Structures/
│   │   ├── Aho-Corasick Automaton/
│   │   ├── Suffix Arrays and Longest Common Prefix (LCP) Arrays/
│   │   ├── Suffix Automata (SAM)/
│   │   └── Palindromic Trees (Eertree)/
│   └── Algebraic and Game-Theoretic Algorithms/
│       ├── Fast Fourier Transform (FFT) and Number Theoretic Transform (NTT)/
│       ├── Linear XOR Basis and Gaussian Elimination/
│       └── Combinatorial Game Theory and Sprague-Grundy Theorem/
└── systems-and-storage/
    ├── B-Trees and B-Plus Trees/
    ├── LSM-Trees and SSTables/
    ├── Probabilistic Filters and Sketches/
    ├── Compressed Radix Trees (Patricia Tries)/
    ├── Concurrency and In-Memory Caching Structures/
    └── Multi-Dimensional Spatial Trees/
```

---

### 6.2. Canonical Slash-Delimited Path Directory

Below is the complete path listing mapping every topic across all tiers:

#### Beginner Tier Paths

```text
beginner/Algorithmic Complexity and Asymptotic Analysis/Time Complexity Analysis
beginner/Algorithmic Complexity and Asymptotic Analysis/Space Complexity Analysis
beginner/Algorithmic Complexity and Asymptotic Analysis/Asymptotic Notation
beginner/Algorithmic Complexity and Asymptotic Analysis/Amortized Analysis
beginner/Algorithmic Complexity and Asymptotic Analysis/Recurrence Relations

beginner/Contiguous and Sequential Data Structures/Static Arrays
beginner/Contiguous and Sequential Data Structures/Dynamic Arrays
beginner/Contiguous and Sequential Data Structures/Multidimensional Arrays and Matrices
beginner/Contiguous and Sequential Data Structures/Strings and Character Arrays

beginner/Linked Data Structures/Singly Linked Lists
beginner/Linked Data Structures/Doubly Linked Lists
beginner/Linked Data Structures/Circular Linked Lists

beginner/Restricted Linear Data Structures/Stacks
beginner/Restricted Linear Data Structures/Queues
beginner/Restricted Linear Data Structures/Double-Ended Queues (Deques)

beginner/Hash-Based Data Structures/Direct Access Tables
beginner/Hash-Based Data Structures/Hash Functions
beginner/Hash-Based Data Structures/Collision Resolution via Separate Chaining
beginner/Hash-Based Data Structures/Collision Resolution via Open Addressing
beginner/Hash-Based Data Structures/Hash Maps
beginner/Hash-Based Data Structures/Hash Sets

beginner/Fundamental Searching and Sorting/Linear Search
beginner/Fundamental Searching and Sorting/Binary Search on Sorted Arrays
beginner/Fundamental Searching and Sorting/Lower Bound and Upper Bound Search
beginner/Fundamental Searching and Sorting/Insertion Sort
beginner/Fundamental Searching and Sorting/Selection Sort
beginner/Fundamental Searching and Sorting/Merge Sort
beginner/Fundamental Searching and Sorting/Quicksort
beginner/Fundamental Searching and Sorting/Counting Sort
beginner/Fundamental Searching and Sorting/Radix Sort
beginner/Fundamental Searching and Sorting/Custom Comparators
beginner/Fundamental Searching and Sorting/Coordinate Compression

beginner/Core Array and Pointer Paradigms/Complete Search and Simulation
beginner/Core Array and Pointer Paradigms/Two Pointers
beginner/Core Array and Pointer Paradigms/Fast and Slow Pointers
beginner/Core Array and Pointer Paradigms/Fixed-Size Sliding Window
beginner/Core Array and Pointer Paradigms/Variable-Size Sliding Window
beginner/Core Array and Pointer Paradigms/One-Dimensional Prefix Sums
beginner/Core Array and Pointer Paradigms/Two-Dimensional Prefix Sums
beginner/Core Array and Pointer Paradigms/Difference Arrays

beginner/Recursion and Bitwise Fundamentals/Linear and Tail Recursion
beginner/Recursion and Bitwise Fundamentals/Divide and Conquer Fundamentals
beginner/Recursion and Bitwise Fundamentals/Bitwise Operators
beginner/Recursion and Bitwise Fundamentals/Bitmask Representation of Sets

beginner/Foundational Mathematics/Integer Divisibility
beginner/Foundational Mathematics/Greatest Common Divisor and Euclidean Algorithm
beginner/Foundational Mathematics/Sieve of Eratosthenes
beginner/Foundational Mathematics/Trial Division Prime Factorization
```

#### Intermediate Tier Paths

```text
intermediate/Hierarchical Data Structures/Binary Trees
intermediate/Hierarchical Data Structures/Preorder Inorder and Postorder Traversals
intermediate/Hierarchical Data Structures/Level-Order Traversal
intermediate/Hierarchical Data Structures/Binary Search Trees (BST)
intermediate/Hierarchical Data Structures/Balanced Binary Search Trees
intermediate/Hierarchical Data Structures/Ordered Sets and Ordered Maps
intermediate/Hierarchical Data Structures/Tree Diameter and Subtree Properties

intermediate/Heaps and Priority Queues/Binary Heaps
intermediate/Heaps and Priority Queues/Priority Queues
intermediate/Heaps and Priority Queues/Heap Sort
intermediate/Heaps and Priority Queues/Top-K Elements and Two-Heap Maintenance

intermediate/String Data Structures and Monotonic Structures/Prefix Trees and Tries
intermediate/String Data Structures and Monotonic Structures/Bitwise Tries
intermediate/String Data Structures and Monotonic Structures/Monotonic Stacks
intermediate/String Data Structures and Monotonic Structures/Monotonic Queues

intermediate/Search Space and Greedy Paradigms/Backtracking and State-Space Search
intermediate/Search Space and Greedy Paradigms/Pruning Techniques
intermediate/Search Space and Greedy Paradigms/Binary Search on the Answer
intermediate/Search Space and Greedy Paradigms/Ternary Search on Unimodal Functions
intermediate/Search Space and Greedy Paradigms/Greedy Algorithms with Sorting
intermediate/Search Space and Greedy Paradigms/Interval Scheduling and Merging
intermediate/Search Space and Greedy Paradigms/Kadane's Algorithm

intermediate/Foundational Dynamic Programming/Top-Down Memoization
intermediate/Foundational Dynamic Programming/Bottom-Up Tabulation
intermediate/Foundational Dynamic Programming/Space-Optimized Dynamic Programming
intermediate/Foundational Dynamic Programming/One-Dimensional Dynamic Programming
intermediate/Foundational Dynamic Programming/Multi-Dimensional Grid Dynamic Programming
intermediate/Foundational Dynamic Programming/Zero-One Knapsack
intermediate/Foundational Dynamic Programming/Unbounded Knapsack
intermediate/Foundational Dynamic Programming/Subset Sum
intermediate/Foundational Dynamic Programming/Longest Increasing Subsequence (LIS)
intermediate/Foundational Dynamic Programming/Longest Common Subsequence (LCS)
intermediate/Foundational Dynamic Programming/Edit Distance (Levenshtein Distance)

intermediate/Graph Representations and Traversals/Adjacency List and Adjacency Matrix Representations
intermediate/Graph Representations and Traversals/Implicit Grid Graphs and Flood Fill
intermediate/Graph Representations and Traversals/Depth-First Search (DFS)
intermediate/Graph Representations and Traversals/Breadth-First Search (BFS)
intermediate/Graph Representations and Traversals/Connected Components
intermediate/Graph Representations and Traversals/Cycle Detection in Undirected and Directed Graphs
intermediate/Graph Representations and Traversals/Bipartite Graph Checking and Two-Coloring
intermediate/Graph Representations and Traversals/Shortest Paths in Unweighted Graphs

intermediate/Intermediate Modular and Combinatorial Mathematics/Modular Arithmetic
intermediate/Intermediate Modular and Combinatorial Mathematics/Binary Exponentiation
intermediate/Intermediate Modular and Combinatorial Mathematics/Modular Multiplicative Inverse
intermediate/Intermediate Modular and Combinatorial Mathematics/Binomial Coefficients and Combinatorics
```

#### Advanced Tier Paths

```text
advanced/Disjoint Sets and Range Query Data Structures/Disjoint Set Union (DSU and Union-Find)
advanced/Disjoint Sets and Range Query Data Structures/Path Compression and Union by Rank or Size
advanced/Disjoint Sets and Range Query Data Structures/Sparse Tables for Idempotent Range Queries
advanced/Disjoint Sets and Range Query Data Structures/Binary Indexed Trees (Fenwick Trees)
advanced/Disjoint Sets and Range Query Data Structures/Point Update Range Query Segment Trees
advanced/Disjoint Sets and Range Query Data Structures/Segment Trees with Lazy Propagation
advanced/Disjoint Sets and Range Query Data Structures/Order Statistic Trees

advanced/Advanced Graph Algorithms/Topological Sorting
advanced/Advanced Graph Algorithms/Dynamic Programming on Directed Acyclic Graphs
advanced/Advanced Graph Algorithms/Zero-One Breadth-First Search (0-1 BFS)
advanced/Advanced Graph Algorithms/Dijkstra's Algorithm
advanced/Advanced Graph Algorithms/Bellman-Ford Algorithm
advanced/Advanced Graph Algorithms/Floyd-Warshall Algorithm
advanced/Advanced Graph Algorithms/Kruskal's Algorithm for Minimum Spanning Trees
advanced/Advanced Graph Algorithms/Prim's Algorithm for Minimum Spanning Trees
advanced/Advanced Graph Algorithms/Functional Graphs and Successor Graphs
advanced/Advanced Graph Algorithms/Eulerian Paths and Circuits

advanced/Advanced Tree Algorithms/Subtree Dynamic Programming
advanced/Advanced Tree Algorithms/Rerooting Dynamic Programming (In-and-Out DP)
advanced/Advanced Tree Algorithms/Euler Tour Technique
advanced/Advanced Tree Algorithms/Binary Lifting
advanced/Advanced Tree Algorithms/Lowest Common Ancestor (LCA) via Binary Lifting
advanced/Advanced Tree Algorithms/Lowest Common Ancestor via Euler Tour and Range Minimum Query
advanced/Advanced Tree Algorithms/Small-to-Large Merging (Sack and DSU on Tree)

advanced/Advanced Dynamic Programming and Search/Bitmask Dynamic Programming
advanced/Advanced Dynamic Programming and Search/Range and Interval Dynamic Programming
advanced/Advanced Dynamic Programming and Search/Digit Dynamic Programming
advanced/Advanced Dynamic Programming and Search/Meet in the Middle

advanced/String Matching Algorithms/Polynomial Rolling Hash
advanced/String Matching Algorithms/Knuth-Morris-Pratt (KMP) Algorithm
advanced/String Matching Algorithms/Z-Algorithm
advanced/String Matching Algorithms/Manacher's Algorithm

advanced/Computational Geometry and Number Theory/Cross Product and Orientation Primitives
advanced/Computational Geometry and Number Theory/Line Segment Intersection
advanced/Computational Geometry and Number Theory/Polygon Area
advanced/Computational Geometry and Number Theory/Sweep Line Algorithms
advanced/Computational Geometry and Number Theory/Two-Dimensional Convex Hull
advanced/Computational Geometry and Number Theory/Extended Euclidean Algorithm
advanced/Computational Geometry and Number Theory/Euler's Totient Function
advanced/Computational Geometry and Number Theory/Inclusion-Exclusion Principle
advanced/Computational Geometry and Number Theory/Matrix Exponentiation
```

#### Expert Tier Paths

```text
expert/Specialized and Persistent Range Structures/Dynamic and Sparse Segment Trees
expert/Specialized and Persistent Range Structures/Persistent Segment Trees
expert/Specialized and Persistent Range Structures/Merge Sort Trees and Two-Dimensional Range Queries
expert/Specialized and Persistent Range Structures/Segment Tree Beats
expert/Specialized and Persistent Range Structures/Wavelet Trees
expert/Specialized and Persistent Range Structures/Square Root Decomposition
expert/Specialized and Persistent Range Structures/Mo's Algorithm
expert/Specialized and Persistent Range Structures/Randomized Treaps and Implicit Treaps
expert/Specialized and Persistent Range Structures/Splay Trees and Link-Cut Trees

expert/Tree Decompositions/Heavy-Light Decomposition (HLD)
expert/Tree Decompositions/Centroid Decomposition
expert/Tree Decompositions/Virtual Trees (Auxiliary Trees)
expert/Tree Decompositions/Kruskal Reconstruction Tree

expert/Connectivity Flows and Matchings/Kosaraju's and Tarjan's Strongly Connected Components Algorithms
expert/Connectivity Flows and Matchings/Two-Satisfiability (2-SAT)
expert/Connectivity Flows and Matchings/Bridges Articulation Points and Biconnected Components
expert/Connectivity Flows and Matchings/Block-Cut Trees
expert/Connectivity Flows and Matchings/Maximum Flow and Minimum Cut
expert/Connectivity Flows and Matchings/Dinic's Algorithm
expert/Connectivity Flows and Matchings/Maximum Bipartite Matching
expert/Connectivity Flows and Matchings/Minimum Cost Maximum Flow (MCMF)
expert/Connectivity Flows and Matchings/Offline Dynamic Connectivity

expert/Dynamic Programming Optimizations/Convex Hull Trick (CHT)
expert/Dynamic Programming Optimizations/Li Chao Trees
expert/Dynamic Programming Optimizations/Divide and Conquer Dynamic Programming Optimization
expert/Dynamic Programming Optimizations/Knuth's Optimization
expert/Dynamic Programming Optimizations/Lagrangian Relaxation and Aliens Trick
expert/Dynamic Programming Optimizations/Slope Trick
expert/Dynamic Programming Optimizations/Sum Over Subsets (SOS) Dynamic Programming
expert/Dynamic Programming Optimizations/Broken Profile Dynamic Programming

expert/Advanced String Suffix Structures/Aho-Corasick Automaton
expert/Advanced String Suffix Structures/Suffix Arrays and Longest Common Prefix (LCP) Arrays
expert/Advanced String Suffix Structures/Suffix Automata (SAM)
expert/Advanced String Suffix Structures/Palindromic Trees (Eertree)

expert/Algebraic and Game-Theoretic Algorithms/Fast Fourier Transform (FFT) and Number Theoretic Transform (NTT)
expert/Algebraic and Game-Theoretic Algorithms/Linear XOR Basis and Gaussian Elimination
expert/Algebraic and Game-Theoretic Algorithms/Combinatorial Game Theory and Sprague-Grundy Theorem
```

#### Systems & Storage Tier Paths (Appendix)

```text
systems-and-storage/B-Trees and B-Plus Trees
systems-and-storage/LSM-Trees and SSTables
systems-and-storage/Probabilistic Filters and Sketches
systems-and-storage/Compressed Radix Trees (Patricia Tries)
systems-and-storage/Concurrency and In-Memory Caching Structures
systems-and-storage/Multi-Dimensional Spatial Trees
```

---

### 6.3. Automated Directory Creation Scripts

To automatically create this entire directory structure on your local machine, run either the PowerShell script (Windows) or the Bash script (macOS/Linux) below.

#### PowerShell (Windows)

```powershell
$paths = @(
    # Beginner
    "beginner/Algorithmic Complexity and Asymptotic Analysis/Time Complexity Analysis",
    "beginner/Algorithmic Complexity and Asymptotic Analysis/Space Complexity Analysis",
    "beginner/Algorithmic Complexity and Asymptotic Analysis/Asymptotic Notation",
    "beginner/Algorithmic Complexity and Asymptotic Analysis/Amortized Analysis",
    "beginner/Algorithmic Complexity and Asymptotic Analysis/Recurrence Relations",
    "beginner/Contiguous and Sequential Data Structures/Static Arrays",
    "beginner/Contiguous and Sequential Data Structures/Dynamic Arrays",
    "beginner/Contiguous and Sequential Data Structures/Multidimensional Arrays and Matrices",
    "beginner/Contiguous and Sequential Data Structures/Strings and Character Arrays",
    "beginner/Linked Data Structures/Singly Linked Lists",
    "beginner/Linked Data Structures/Doubly Linked Lists",
    "beginner/Linked Data Structures/Circular Linked Lists",
    "beginner/Restricted Linear Data Structures/Stacks",
    "beginner/Restricted Linear Data Structures/Queues",
    "beginner/Restricted Linear Data Structures/Double-Ended Queues (Deques)",
    "beginner/Hash-Based Data Structures/Direct Access Tables",
    "beginner/Hash-Based Data Structures/Hash Functions",
    "beginner/Hash-Based Data Structures/Collision Resolution via Separate Chaining",
    "beginner/Hash-Based Data Structures/Collision Resolution via Open Addressing",
    "beginner/Hash-Based Data Structures/Hash Maps",
    "beginner/Hash-Based Data Structures/Hash Sets",
    "beginner/Fundamental Searching and Sorting/Linear Search",
    "beginner/Fundamental Searching and Sorting/Binary Search on Sorted Arrays",
    "beginner/Fundamental Searching and Sorting/Lower Bound and Upper Bound Search",
    "beginner/Fundamental Searching and Sorting/Insertion Sort",
    "beginner/Fundamental Searching and Sorting/Selection Sort",
    "beginner/Fundamental Searching and Sorting/Merge Sort",
    "beginner/Fundamental Searching and Sorting/Quicksort",
    "beginner/Fundamental Searching and Sorting/Counting Sort",
    "beginner/Fundamental Searching and Sorting/Radix Sort",
    "beginner/Fundamental Searching and Sorting/Custom Comparators",
    "beginner/Fundamental Searching and Sorting/Coordinate Compression",
    "beginner/Core Array and Pointer Paradigms/Complete Search and Simulation",
    "beginner/Core Array and Pointer Paradigms/Two Pointers",
    "beginner/Core Array and Pointer Paradigms/Fast and Slow Pointers",
    "beginner/Core Array and Pointer Paradigms/Fixed-Size Sliding Window",
    "beginner/Core Array and Pointer Paradigms/Variable-Size Sliding Window",
    "beginner/Core Array and Pointer Paradigms/One-Dimensional Prefix Sums",
    "beginner/Core Array and Pointer Paradigms/Two-Dimensional Prefix Sums",
    "beginner/Core Array and Pointer Paradigms/Difference Arrays",
    "beginner/Recursion and Bitwise Fundamentals/Linear and Tail Recursion",
    "beginner/Recursion and Bitwise Fundamentals/Divide and Conquer Fundamentals",
    "beginner/Recursion and Bitwise Fundamentals/Bitwise Operators",
    "beginner/Recursion and Bitwise Fundamentals/Bitmask Representation of Sets",
    "beginner/Foundational Mathematics/Integer Divisibility",
    "beginner/Foundational Mathematics/Greatest Common Divisor and Euclidean Algorithm",
    "beginner/Foundational Mathematics/Sieve of Eratosthenes",
    "beginner/Foundational Mathematics/Trial Division Prime Factorization",

    # Intermediate
    "intermediate/Hierarchical Data Structures/Binary Trees",
    "intermediate/Hierarchical Data Structures/Preorder Inorder and Postorder Traversals",
    "intermediate/Hierarchical Data Structures/Level-Order Traversal",
    "intermediate/Hierarchical Data Structures/Binary Search Trees (BST)",
    "intermediate/Hierarchical Data Structures/Balanced Binary Search Trees",
    "intermediate/Hierarchical Data Structures/Ordered Sets and Ordered Maps",
    "intermediate/Hierarchical Data Structures/Tree Diameter and Subtree Properties",
    "intermediate/Heaps and Priority Queues/Binary Heaps",
    "intermediate/Heaps and Priority Queues/Priority Queues",
    "intermediate/Heaps and Priority Queues/Heap Sort",
    "intermediate/Heaps and Priority Queues/Top-K Elements and Two-Heap Maintenance",
    "intermediate/String Data Structures and Monotonic Structures/Prefix Trees and Tries",
    "intermediate/String Data Structures and Monotonic Structures/Bitwise Tries",
    "intermediate/String Data Structures and Monotonic Structures/Monotonic Stacks",
    "intermediate/String Data Structures and Monotonic Structures/Monotonic Queues",
    "intermediate/Search Space and Greedy Paradigms/Backtracking and State-Space Search",
    "intermediate/Search Space and Greedy Paradigms/Pruning Techniques",
    "intermediate/Search Space and Greedy Paradigms/Binary Search on the Answer",
    "intermediate/Search Space and Greedy Paradigms/Ternary Search on Unimodal Functions",
    "intermediate/Search Space and Greedy Paradigms/Greedy Algorithms with Sorting",
    "intermediate/Search Space and Greedy Paradigms/Interval Scheduling and Merging",
    "intermediate/Search Space and Greedy Paradigms/Kadane's Algorithm",
    "intermediate/Foundational Dynamic Programming/Top-Down Memoization",
    "intermediate/Foundational Dynamic Programming/Bottom-Up Tabulation",
    "intermediate/Foundational Dynamic Programming/Space-Optimized Dynamic Programming",
    "intermediate/Foundational Dynamic Programming/One-Dimensional Dynamic Programming",
    "intermediate/Foundational Dynamic Programming/Multi-Dimensional Grid Dynamic Programming",
    "intermediate/Foundational Dynamic Programming/Zero-One Knapsack",
    "intermediate/Foundational Dynamic Programming/Unbounded Knapsack",
    "intermediate/Foundational Dynamic Programming/Subset Sum",
    "intermediate/Foundational Dynamic Programming/Longest Increasing Subsequence (LIS)",
    "intermediate/Foundational Dynamic Programming/Longest Common Subsequence (LCS)",
    "intermediate/Foundational Dynamic Programming/Edit Distance (Levenshtein Distance)",
    "intermediate/Graph Representations and Traversals/Adjacency List and Adjacency Matrix Representations",
    "intermediate/Graph Representations and Traversals/Implicit Grid Graphs and Flood Fill",
    "intermediate/Graph Representations and Traversals/Depth-First Search (DFS)",
    "intermediate/Graph Representations and Traversals/Breadth-First Search (BFS)",
    "intermediate/Graph Representations and Traversals/Connected Components",
    "intermediate/Graph Representations and Traversals/Cycle Detection in Undirected and Directed Graphs",
    "intermediate/Graph Representations and Traversals/Bipartite Graph Checking and Two-Coloring",
    "intermediate/Graph Representations and Traversals/Shortest Paths in Unweighted Graphs",
    "intermediate/Intermediate Modular and Combinatorial Mathematics/Modular Arithmetic",
    "intermediate/Intermediate Modular and Combinatorial Mathematics/Binary Exponentiation",
    "intermediate/Intermediate Modular and Combinatorial Mathematics/Modular Multiplicative Inverse",
    "intermediate/Intermediate Modular and Combinatorial Mathematics/Binomial Coefficients and Combinatorics",

    # Advanced
    "advanced/Disjoint Sets and Range Query Data Structures/Disjoint Set Union (DSU and Union-Find)",
    "advanced/Disjoint Sets and Range Query Data Structures/Path Compression and Union by Rank or Size",
    "advanced/Disjoint Sets and Range Query Data Structures/Sparse Tables for Idempotent Range Queries",
    "advanced/Disjoint Sets and Range Query Data Structures/Binary Indexed Trees (Fenwick Trees)",
    "advanced/Disjoint Sets and Range Query Data Structures/Point Update Range Query Segment Trees",
    "advanced/Disjoint Sets and Range Query Data Structures/Segment Trees with Lazy Propagation",
    "advanced/Disjoint Sets and Range Query Data Structures/Order Statistic Trees",
    "advanced/Advanced Graph Algorithms/Topological Sorting",
    "advanced/Advanced Graph Algorithms/Dynamic Programming on Directed Acyclic Graphs",
    "advanced/Advanced Graph Algorithms/Zero-One Breadth-First Search (0-1 BFS)",
    "advanced/Advanced Graph Algorithms/Dijkstra's Algorithm",
    "advanced/Advanced Graph Algorithms/Bellman-Ford Algorithm",
    "advanced/Advanced Graph Algorithms/Floyd-Warshall Algorithm",
    "advanced/Advanced Graph Algorithms/Kruskal's Algorithm for Minimum Spanning Trees",
    "advanced/Advanced Graph Algorithms/Prim's Algorithm for Minimum Spanning Trees",
    "advanced/Advanced Graph Algorithms/Functional Graphs and Successor Graphs",
    "advanced/Advanced Graph Algorithms/Eulerian Paths and Circuits",
    "advanced/Advanced Tree Algorithms/Subtree Dynamic Programming",
    "advanced/Advanced Tree Algorithms/Rerooting Dynamic Programming (In-and-Out DP)",
    "advanced/Advanced Tree Algorithms/Euler Tour Technique",
    "advanced/Advanced Tree Algorithms/Binary Lifting",
    "advanced/Advanced Tree Algorithms/Lowest Common Ancestor (LCA) via Binary Lifting",
    "advanced/Advanced Tree Algorithms/Lowest Common Ancestor via Euler Tour and Range Minimum Query",
    "advanced/Advanced Tree Algorithms/Small-to-Large Merging (Sack and DSU on Tree)",
    "advanced/Advanced Dynamic Programming and Search/Bitmask Dynamic Programming",
    "advanced/Advanced Dynamic Programming and Search/Range and Interval Dynamic Programming",
    "advanced/Advanced Dynamic Programming and Search/Digit Dynamic Programming",
    "advanced/Advanced Dynamic Programming and Search/Meet in the Middle",
    "advanced/String Matching Algorithms/Polynomial Rolling Hash",
    "advanced/String Matching Algorithms/Knuth-Morris-Pratt (KMP) Algorithm",
    "advanced/String Matching Algorithms/Z-Algorithm",
    "advanced/String Matching Algorithms/Manacher's Algorithm",
    "advanced/Computational Geometry and Number Theory/Cross Product and Orientation Primitives",
    "advanced/Computational Geometry and Number Theory/Line Segment Intersection",
    "advanced/Computational Geometry and Number Theory/Polygon Area",
    "advanced/Computational Geometry and Number Theory/Sweep Line Algorithms",
    "advanced/Computational Geometry and Number Theory/Two-Dimensional Convex Hull",
    "advanced/Computational Geometry and Number Theory/Extended Euclidean Algorithm",
    "advanced/Computational Geometry and Number Theory/Euler's Totient Function",
    "advanced/Computational Geometry and Number Theory/Inclusion-Exclusion Principle",
    "advanced/Computational Geometry and Number Theory/Matrix Exponentiation",

    # Expert
    "expert/Specialized and Persistent Range Structures/Dynamic and Sparse Segment Trees",
    "expert/Specialized and Persistent Range Structures/Persistent Segment Trees",
    "expert/Specialized and Persistent Range Structures/Merge Sort Trees and Two-Dimensional Range Queries",
    "expert/Specialized and Persistent Range Structures/Segment Tree Beats",
    "expert/Specialized and Persistent Range Structures/Wavelet Trees",
    "expert/Specialized and Persistent Range Structures/Square Root Decomposition",
    "expert/Specialized and Persistent Range Structures/Mo's Algorithm",
    "expert/Specialized and Persistent Range Structures/Randomized Treaps and Implicit Treaps",
    "expert/Specialized and Persistent Range Structures/Splay Trees and Link-Cut Trees",
    "expert/Tree Decompositions/Heavy-Light Decomposition (HLD)",
    "expert/Tree Decompositions/Centroid Decomposition",
    "expert/Tree Decompositions/Virtual Trees (Auxiliary Trees)",
    "expert/Tree Decompositions/Kruskal Reconstruction Tree",
    "expert/Connectivity Flows and Matchings/Kosaraju's and Tarjan's Strongly Connected Components Algorithms",
    "expert/Connectivity Flows and Matchings/Two-Satisfiability (2-SAT)",
    "expert/Connectivity Flows and Matchings/Bridges Articulation Points and Biconnected Components",
    "expert/Connectivity Flows and Matchings/Block-Cut Trees",
    "expert/Connectivity Flows and Matchings/Maximum Flow and Minimum Cut",
    "expert/Connectivity Flows and Matchings/Dinic's Algorithm",
    "expert/Connectivity Flows and Matchings/Maximum Bipartite Matching",
    "expert/Connectivity Flows and Matchings/Minimum Cost Maximum Flow (MCMF)",
    "expert/Connectivity Flows and Matchings/Offline Dynamic Connectivity",
    "expert/Dynamic Programming Optimizations/Convex Hull Trick (CHT)",
    "expert/Dynamic Programming Optimizations/Li Chao Trees",
    "expert/Dynamic Programming Optimizations/Divide and Conquer Dynamic Programming Optimization",
    "expert/Dynamic Programming Optimizations/Knuth's Optimization",
    "expert/Dynamic Programming Optimizations/Lagrangian Relaxation and Aliens Trick",
    "expert/Dynamic Programming Optimizations/Slope Trick",
    "expert/Dynamic Programming Optimizations/Sum Over Subsets (SOS) Dynamic Programming",
    "expert/Dynamic Programming Optimizations/Broken Profile Dynamic Programming",
    "expert/Advanced String Suffix Structures/Aho-Corasick Automaton",
    "expert/Advanced String Suffix Structures/Suffix Arrays and Longest Common Prefix (LCP) Arrays",
    "expert/Advanced String Suffix Structures/Suffix Automata (SAM)",
    "expert/Advanced String Suffix Structures/Palindromic Trees (Eertree)",
    "expert/Algebraic and Game-Theoretic Algorithms/Fast Fourier Transform (FFT) and Number Theoretic Transform (NTT)",
    "expert/Algebraic and Game-Theoretic Algorithms/Linear XOR Basis and Gaussian Elimination",
    "expert/Algebraic and Game-Theoretic Algorithms/Combinatorial Game Theory and Sprague-Grundy Theorem",

    # Systems & Storage (Appendix)
    "systems-and-storage/B-Trees and B-Plus Trees",
    "systems-and-storage/LSM-Trees and SSTables",
    "systems-and-storage/Probabilistic Filters and Sketches",
    "systems-and-storage/Compressed Radix Trees (Patricia Tries)",
    "systems-and-storage/Concurrency and In-Memory Caching Structures",
    "systems-and-storage/Multi-Dimensional Spatial Trees"
)

foreach ($path in $paths) {
    New-Item -ItemType Directory -Path $path -Force | Out-Null
}
Write-Host "Successfully initialized $($paths.Count) DSA curriculum directories!" -ForegroundColor Green
```

#### Bash (Linux / macOS / WSL)

```bash
#!/usr/bin/env bash
set -euo pipefail

paths=(
  # Beginner
  "beginner/Algorithmic Complexity and Asymptotic Analysis/Time Complexity Analysis"
  "beginner/Algorithmic Complexity and Asymptotic Analysis/Space Complexity Analysis"
  "beginner/Algorithmic Complexity and Asymptotic Analysis/Asymptotic Notation"
  "beginner/Algorithmic Complexity and Asymptotic Analysis/Amortized Analysis"
  "beginner/Algorithmic Complexity and Asymptotic Analysis/Recurrence Relations"
  "beginner/Contiguous and Sequential Data Structures/Static Arrays"
  "beginner/Contiguous and Sequential Data Structures/Dynamic Arrays"
  "beginner/Contiguous and Sequential Data Structures/Multidimensional Arrays and Matrices"
  "beginner/Contiguous and Sequential Data Structures/Strings and Character Arrays"
  "beginner/Linked Data Structures/Singly Linked Lists"
  "beginner/Linked Data Structures/Doubly Linked Lists"
  "beginner/Linked Data Structures/Circular Linked Lists"
  "beginner/Restricted Linear Data Structures/Stacks"
  "beginner/Restricted Linear Data Structures/Queues"
  "beginner/Restricted Linear Data Structures/Double-Ended Queues (Deques)"
  "beginner/Hash-Based Data Structures/Direct Access Tables"
  "beginner/Hash-Based Data Structures/Hash Functions"
  "beginner/Hash-Based Data Structures/Collision Resolution via Separate Chaining"
  "beginner/Hash-Based Data Structures/Collision Resolution via Open Addressing"
  "beginner/Hash-Based Data Structures/Hash Maps"
  "beginner/Hash-Based Data Structures/Hash Sets"
  "beginner/Fundamental Searching and Sorting/Linear Search"
  "beginner/Fundamental Searching and Sorting/Binary Search on Sorted Arrays"
  "beginner/Fundamental Searching and Sorting/Lower Bound and Upper Bound Search"
  "beginner/Fundamental Searching and Sorting/Insertion Sort"
  "beginner/Fundamental Searching and Sorting/Selection Sort"
  "beginner/Fundamental Searching and Sorting/Merge Sort"
  "beginner/Fundamental Searching and Sorting/Quicksort"
  "beginner/Fundamental Searching and Sorting/Counting Sort"
  "beginner/Fundamental Searching and Sorting/Radix Sort"
  "beginner/Fundamental Searching and Sorting/Custom Comparators"
  "beginner/Fundamental Searching and Sorting/Coordinate Compression"
  "beginner/Core Array and Pointer Paradigms/Complete Search and Simulation"
  "beginner/Core Array and Pointer Paradigms/Two Pointers"
  "beginner/Core Array and Pointer Paradigms/Fast and Slow Pointers"
  "beginner/Core Array and Pointer Paradigms/Fixed-Size Sliding Window"
  "beginner/Core Array and Pointer Paradigms/Variable-Size Sliding Window"
  "beginner/Core Array and Pointer Paradigms/One-Dimensional Prefix Sums"
  "beginner/Core Array and Pointer Paradigms/Two-Dimensional Prefix Sums"
  "beginner/Core Array and Pointer Paradigms/Difference Arrays"
  "beginner/Recursion and Bitwise Fundamentals/Linear and Tail Recursion"
  "beginner/Recursion and Bitwise Fundamentals/Divide and Conquer Fundamentals"
  "beginner/Recursion and Bitwise Fundamentals/Bitwise Operators"
  "beginner/Recursion and Bitwise Fundamentals/Bitmask Representation of Sets"
  "beginner/Foundational Mathematics/Integer Divisibility"
  "beginner/Foundational Mathematics/Greatest Common Divisor and Euclidean Algorithm"
  "beginner/Foundational Mathematics/Sieve of Eratosthenes"
  "beginner/Foundational Mathematics/Trial Division Prime Factorization"

  # Intermediate
  "intermediate/Hierarchical Data Structures/Binary Trees"
  "intermediate/Hierarchical Data Structures/Preorder Inorder and Postorder Traversals"
  "intermediate/Hierarchical Data Structures/Level-Order Traversal"
  "intermediate/Hierarchical Data Structures/Binary Search Trees (BST)"
  "intermediate/Hierarchical Data Structures/Balanced Binary Search Trees"
  "intermediate/Hierarchical Data Structures/Ordered Sets and Ordered Maps"
  "intermediate/Hierarchical Data Structures/Tree Diameter and Subtree Properties"
  "intermediate/Heaps and Priority Queues/Binary Heaps"
  "intermediate/Heaps and Priority Queues/Priority Queues"
  "intermediate/Heaps and Priority Queues/Heap Sort"
  "intermediate/Heaps and Priority Queues/Top-K Elements and Two-Heap Maintenance"
  "intermediate/String Data Structures and Monotonic Structures/Prefix Trees and Tries"
  "intermediate/String Data Structures and Monotonic Structures/Bitwise Tries"
  "intermediate/String Data Structures and Monotonic Structures/Monotonic Stacks"
  "intermediate/String Data Structures and Monotonic Structures/Monotonic Queues"
  "intermediate/Search Space and Greedy Paradigms/Backtracking and State-Space Search"
  "intermediate/Search Space and Greedy Paradigms/Pruning Techniques"
  "intermediate/Search Space and Greedy Paradigms/Binary Search on the Answer"
  "intermediate/Search Space and Greedy Paradigms/Ternary Search on Unimodal Functions"
  "intermediate/Search Space and Greedy Paradigms/Greedy Algorithms with Sorting"
  "intermediate/Search Space and Greedy Paradigms/Interval Scheduling and Merging"
  "intermediate/Search Space and Greedy Paradigms/Kadane's Algorithm"
  "intermediate/Foundational Dynamic Programming/Top-Down Memoization"
  "intermediate/Foundational Dynamic Programming/Bottom-Up Tabulation"
  "intermediate/Foundational Dynamic Programming/Space-Optimized Dynamic Programming"
  "intermediate/Foundational Dynamic Programming/One-Dimensional Dynamic Programming"
  "intermediate/Foundational Dynamic Programming/Multi-Dimensional Grid Dynamic Programming"
  "intermediate/Foundational Dynamic Programming/Zero-One Knapsack"
  "intermediate/Foundational Dynamic Programming/Unbounded Knapsack"
  "intermediate/Foundational Dynamic Programming/Subset Sum"
  "intermediate/Foundational Dynamic Programming/Longest Increasing Subsequence (LIS)"
  "intermediate/Foundational Dynamic Programming/Longest Common Subsequence (LCS)"
  "intermediate/Foundational Dynamic Programming/Edit Distance (Levenshtein Distance)"
  "intermediate/Graph Representations and Traversals/Adjacency List and Adjacency Matrix Representations"
  "intermediate/Graph Representations and Traversals/Implicit Grid Graphs and Flood Fill"
  "intermediate/Graph Representations and Traversals/Depth-First Search (DFS)"
  "intermediate/Graph Representations and Traversals/Breadth-First Search (BFS)"
  "intermediate/Graph Representations and Traversals/Connected Components"
  "intermediate/Graph Representations and Traversals/Cycle Detection in Undirected and Directed Graphs"
  "intermediate/Graph Representations and Traversals/Bipartite Graph Checking and Two-Coloring"
  "intermediate/Graph Representations and Traversals/Shortest Paths in Unweighted Graphs"
  "intermediate/Intermediate Modular and Combinatorial Mathematics/Modular Arithmetic"
  "intermediate/Intermediate Modular and Combinatorial Mathematics/Binary Exponentiation"
  "intermediate/Intermediate Modular and Combinatorial Mathematics/Modular Multiplicative Inverse"
  "intermediate/Intermediate Modular and Combinatorial Mathematics/Binomial Coefficients and Combinatorics"

  # Advanced
  "advanced/Disjoint Sets and Range Query Data Structures/Disjoint Set Union (DSU and Union-Find)"
  "advanced/Disjoint Sets and Range Query Data Structures/Path Compression and Union by Rank or Size"
  "advanced/Disjoint Sets and Range Query Data Structures/Sparse Tables for Idempotent Range Queries"
  "advanced/Disjoint Sets and Range Query Data Structures/Binary Indexed Trees (Fenwick Trees)"
  "advanced/Disjoint Sets and Range Query Data Structures/Point Update Range Query Segment Trees"
  "advanced/Disjoint Sets and Range Query Data Structures/Segment Trees with Lazy Propagation"
  "advanced/Disjoint Sets and Range Query Data Structures/Order Statistic Trees"
  "advanced/Advanced Graph Algorithms/Topological Sorting"
  "advanced/Advanced Graph Algorithms/Dynamic Programming on Directed Acyclic Graphs"
  "advanced/Advanced Graph Algorithms/Zero-One Breadth-First Search (0-1 BFS)"
  "advanced/Advanced Graph Algorithms/Dijkstra's Algorithm"
  "advanced/Advanced Graph Algorithms/Bellman-Ford Algorithm"
  "advanced/Advanced Graph Algorithms/Floyd-Warshall Algorithm"
  "advanced/Advanced Graph Algorithms/Kruskal's Algorithm for Minimum Spanning Trees"
  "advanced/Advanced Graph Algorithms/Prim's Algorithm for Minimum Spanning Trees"
  "advanced/Advanced Graph Algorithms/Functional Graphs and Successor Graphs"
  "advanced/Advanced Graph Algorithms/Eulerian Paths and Circuits"
  "advanced/Advanced Tree Algorithms/Subtree Dynamic Programming"
  "advanced/Advanced Tree Algorithms/Rerooting Dynamic Programming (In-and-Out DP)"
  "advanced/Advanced Tree Algorithms/Euler Tour Technique"
  "advanced/Advanced Tree Algorithms/Binary Lifting"
  "advanced/Advanced Tree Algorithms/Lowest Common Ancestor (LCA) via Binary Lifting"
  "advanced/Advanced Tree Algorithms/Lowest Common Ancestor via Euler Tour and Range Minimum Query"
  "advanced/Advanced Tree Algorithms/Small-to-Large Merging (Sack and DSU on Tree)"
  "advanced/Advanced Dynamic Programming and Search/Bitmask Dynamic Programming"
  "advanced/Advanced Dynamic Programming and Search/Range and Interval Dynamic Programming"
  "advanced/Advanced Dynamic Programming and Search/Digit Dynamic Programming"
  "advanced/Advanced Dynamic Programming and Search/Meet in the Middle"
  "advanced/String Matching Algorithms/Polynomial Rolling Hash"
  "advanced/String Matching Algorithms/Knuth-Morris-Pratt (KMP) Algorithm"
  "advanced/String Matching Algorithms/Z-Algorithm"
  "advanced/String Matching Algorithms/Manacher's Algorithm"
  "advanced/Computational Geometry and Number Theory/Cross Product and Orientation Primitives"
  "advanced/Computational Geometry and Number Theory/Line Segment Intersection"
  "advanced/Computational Geometry and Number Theory/Polygon Area"
  "advanced/Computational Geometry and Number Theory/Sweep Line Algorithms"
  "advanced/Computational Geometry and Number Theory/Two-Dimensional Convex Hull"
  "advanced/Computational Geometry and Number Theory/Extended Euclidean Algorithm"
  "advanced/Computational Geometry and Number Theory/Euler's Totient Function"
  "advanced/Computational Geometry and Number Theory/Inclusion-Exclusion Principle"
  "advanced/Computational Geometry and Number Theory/Matrix Exponentiation"

  # Expert
  "expert/Specialized and Persistent Range Structures/Dynamic and Sparse Segment Trees"
  "expert/Specialized and Persistent Range Structures/Persistent Segment Trees"
  "expert/Specialized and Persistent Range Structures/Merge Sort Trees and Two-Dimensional Range Queries"
  "expert/Specialized and Persistent Range Structures/Segment Tree Beats"
  "expert/Specialized and Persistent Range Structures/Wavelet Trees"
  "expert/Specialized and Persistent Range Structures/Square Root Decomposition"
  "expert/Specialized and Persistent Range Structures/Mo's Algorithm"
  "expert/Specialized and Persistent Range Structures/Randomized Treaps and Implicit Treaps"
  "expert/Specialized and Persistent Range Structures/Splay Trees and Link-Cut Trees"
  "expert/Tree Decompositions/Heavy-Light Decomposition (HLD)"
  "expert/Tree Decompositions/Centroid Decomposition"
  "expert/Tree Decompositions/Virtual Trees (Auxiliary Trees)"
  "expert/Tree Decompositions/Kruskal Reconstruction Tree"
  "expert/Connectivity Flows and Matchings/Kosaraju's and Tarjan's Strongly Connected Components Algorithms"
  "expert/Connectivity Flows and Matchings/Two-Satisfiability (2-SAT)"
  "expert/Connectivity Flows and Matchings/Bridges Articulation Points and Biconnected Components"
  "expert/Connectivity Flows and Matchings/Block-Cut Trees"
  "expert/Connectivity Flows and Matchings/Maximum Flow and Minimum Cut"
  "expert/Connectivity Flows and Matchings/Dinic's Algorithm"
  "expert/Connectivity Flows and Matchings/Maximum Bipartite Matching"
  "expert/Connectivity Flows and Matchings/Minimum Cost Maximum Flow (MCMF)"
  "expert/Connectivity Flows and Matchings/Offline Dynamic Connectivity"
  "expert/Dynamic Programming Optimizations/Convex Hull Trick (CHT)"
  "expert/Dynamic Programming Optimizations/Li Chao Trees"
  "expert/Dynamic Programming Optimizations/Divide and Conquer Dynamic Programming Optimization"
  "expert/Dynamic Programming Optimizations/Knuth's Optimization"
  "expert/Dynamic Programming Optimizations/Lagrangian Relaxation and Aliens Trick"
  "expert/Dynamic Programming Optimizations/Slope Trick"
  "expert/Dynamic Programming Optimizations/Sum Over Subsets (SOS) Dynamic Programming"
  "expert/Dynamic Programming Optimizations/Broken Profile Dynamic Programming"
  "expert/Advanced String Suffix Structures/Aho-Corasick Automaton"
  "expert/Advanced String Suffix Structures/Suffix Arrays and Longest Common Prefix (LCP) Arrays"
  "expert/Advanced String Suffix Structures/Suffix Automata (SAM)"
  "expert/Advanced String Suffix Structures/Palindromic Trees (Eertree)"
  "expert/Algebraic and Game-Theoretic Algorithms/Fast Fourier Transform (FFT) and Number Theoretic Transform (NTT)"
  "expert/Algebraic and Game-Theoretic Algorithms/Linear XOR Basis and Gaussian Elimination"
  "expert/Algebraic and Game-Theoretic Algorithms/Combinatorial Game Theory and Sprague-Grundy Theorem"

  # Systems & Storage (Appendix)
  "systems-and-storage/B-Trees and B-Plus Trees"
  "systems-and-storage/LSM-Trees and SSTables"
  "systems-and-storage/Probabilistic Filters and Sketches"
  "systems-and-storage/Compressed Radix Trees (Patricia Tries)"
  "systems-and-storage/Concurrency and In-Memory Caching Structures"
  "systems-and-storage/Multi-Dimensional Spatial Trees"
)

for path in "${paths[@]}"; do
  mkdir -p "$path"
done

echo "Successfully initialized ${#paths[@]} DSA curriculum directories!"
```
