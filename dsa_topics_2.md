# Master Hierarchical Curriculum: Data Structures & Algorithms

A comprehensive, four-tier reference curriculum covering foundational computational complexity, standard linear and hierarchical data structures, classical algorithmic paradigms, advanced graph theory, dynamic programming, string algorithms, computational geometry, and competitive programming techniques.

---

## Curriculum Overview

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
- [Appendix: Systems & Storage Data Structures](#appendix-systems--storage-data-structures)

---

# 1. Beginner

### 1.1. Algorithmic Complexity and Asymptotic Analysis

- **1.1.1. Time Complexity Analysis**: Counting fundamental operations, instruction latency, mechanical sympathy, and evaluating execution bounds as input scales.
- **1.1.2. Space Complexity Analysis**: Auxiliary memory vs. total space, stack frame allocation, heap allocation, in-place algorithms.
- **1.1.3. Asymptotic Notation**: Formal mathematical definitions of Big-O ($\mathcal{O}$ upper bound), Big-Omega ($\Omega$ lower bound), and Big-Theta ($\Theta$ tight bound).
- **1.1.4. Amortized Analysis**: Accounting method, aggregate analysis, and potential method; analyzing sequences of operations (e.g., dynamic array resizing).
- **1.1.5. Recurrence Relations**: Modeling recursive running times using recursion trees, the substitution method, Master Theorem, and Akra-Bazzi method.

### 1.2. Contiguous and Sequential Data Structures

- **1.2.1. Static Arrays**: Fixed-size contiguous memory blocks, index-based $O(1)$ random access, spatial locality, and cache-line utilization.
- **1.2.2. Dynamic Arrays**: Resizable vector architectures, geometric growth factors ($1.5\times$ to $2\times$), amortized $O(1)$ push operations, and shrink thresholds.
- **1.2.3. Multidimensional Arrays and Matrices**: Flattened indexing formulas ($i \cdot \text{cols} + j$), row-major vs. column-major memory layout, submatrix traversal.
- **1.2.4. Strings and Character Arrays**: String immutability, ASCII, UTF-8 variable-length encodings, UTF-16 surrogate pairs, Small String Optimization (SSO).

### 1.3. Linked Data Structures

- **1.3.1. Singly Linked Lists**: Node structures with forward pointers, pointer manipulation, in-place list reversal, sentinel head nodes.
- **1.3.2. Doubly Linked Lists**: Forward and backward bidirectional traversal, $O(1)$ arbitrary node deletion given a pointer reference, sentinel head/tail nodes.
- **1.3.3. Circular Linked Lists**: Tail node referencing head, circular ring topologies, round-robin schedulers.

### 1.4. Restricted Linear Data Structures

- **1.4.1. Stacks**: Last-In-First-Out (LIFO) protocol, call stack mechanics, function activation frames, expression evaluation and syntax parsing.
- **1.4.2. Queues**: First-In-First-Out (FIFO) protocol, front and rear pointer maintenance, circular array ring buffers to prevent false overflow.
- **1.4.3. Double-Ended Queues (Deques)**: Insert and remove operations at both head and tail in $O(1)$ time; array-based and linked chunk implementations.

### 1.5. Hash-Based Data Structures

- **1.5.1. Direct Access Tables**: Array-indexed key-value mapping over bounded universes, trade-offs between memory footprint and access time.
- **1.5.2. Hash Functions**: Uniform distribution, avalanche effect, polynomial rolling hashes, MurmurHash3, and cryptographically secure hash properties (SipHash).
- **1.5.3. Collision Resolution via Separate Chaining**: Linked list and balanced tree buckets, expected length, load factor $\alpha = N / M$.
- **1.5.4. Collision Resolution via Open Addressing**: Linear probing, quadratic probing, double hashing, cache efficiency, tombstone deletion markers.
- **1.5.5. Hash Maps**: Key-value associative mapping, dynamic rehashing, resizing thresholds, amortized $O(1)$ lookup, insertion, and deletion.
- **1.5.6. Hash Sets**: Distinct item storage, set union, intersection, difference, and subset checking.

### 1.6. Fundamental Searching and Sorting

- **1.6.1. Linear Search**: Sequential inspection, sentinel loop optimization, performance on small arrays and modern SIMD architectures.
- **1.6.2. Binary Search on Sorted Arrays**: Divide-and-conquer logarithmic search, midpoint calculation without integer overflow (`low + (high - low) / 2`).
- **1.6.3. Lower Bound and Upper Bound Search**: Finding first element $\ge \text{target}$ and first element $> \text{target}$ in monotonic sequences.
- **1.6.4. Insertion Sort**: Online adaptive sorting, maintaining a sorted prefix, $O(N)$ best-case on nearly sorted data, subproblem routine in TimSort.
- **1.6.5. Selection Sort**: Repeated minimum element extraction, unstable $O(N^2)$ comparison sort, minimizing write operations.
- **1.6.6. Merge Sort**: Stable divide-and-conquer sorting, recursive tree analysis, $O(N \log N)$ worst-case time, out-of-place buffer requirements.
- **1.6.7. Quicksort**: Partitioning schemes (Lomuto, Hoare, Dutch National Flag 3-way), pivot selection strategies, randomized quicksort, recursion depth guards.
- **1.6.8. Counting Sort**: Non-comparison integer sorting over bounded ranges $[0, K]$, frequency prefix calculation, stable sorting in $O(N + K)$.
- **1.6.9. Radix Sort**: Multi-pass integer and string sorting using Least Significant Digit (LSD) and Most Significant Digit (MSD) passes with counting sort.
- **1.6.10. Custom Comparators**: Strict weak ordering axioms, transitive comparisons, multi-key composite sorting, comparator objects.
- **1.6.11. Coordinate Compression**: Mapping sparse, large values into dense rank-order indices ($[0, N-1]$) for array-indexed algorithms.

### 1.7. Core Array and Pointer Paradigms

- **1.7.1. Complete Search and Simulation**: Brute-force state enumeration, state space exhaustion, step-by-step physical simulation.
- **1.7.2. Two Pointers**: Converging pointers from opposite ends of a sorted array, monotonic boundary reduction (Two Sum II, Container With Most Water).
- **1.7.3. Fast and Slow Pointers**: Floyd's Tortoise and Hare algorithm, cycle detection in linked lists and arrays, finding list midpoints in a single pass.
- **1.7.4. Fixed-Size Sliding Window**: Maintaining invariant state across a contiguous subarray of static width $K$ in $O(1)$ incremental transition time.
- **1.7.5. Variable-Size Sliding Window**: Dynamically expanding right boundary and shrinking left boundary to maintain monotonic predicates.
- **1.7.6. One-Dimensional Prefix Sums**: Precomputing cumulative sums $P[i] = P[i-1] + A[i]$ to answer arbitrary range sum queries $\sum_{k=l}^r A[k]$ in $O(1)$.
- **1.7.7. Two-Dimensional Prefix Sums**: Inclusion-exclusion formula on 2D grids to evaluate subgrid bounding box sums in $O(1)$ time.
- **1.7.8. Difference Arrays**: Range updates: applying increment $+V$ to interval $[l, r]$ in $O(1)$ time via $D[l] \mathrel{+}= V$ and $D[r+1] \mathrel{-}= V$, followed by prefix reconstruction.

### 1.8. Recursion and Bitwise Fundamentals

- **1.8.1. Linear and Tail Recursion**: Base cases, call stack unwinding, tail-call optimization (TCO), converting recursive calls to iterative loops.
- **1.8.2. Divide and Conquer Fundamentals**: Problem decomposition into non-overlapping subproblems, conquer step, recombination of solutions.
- **1.8.3. Bitwise Operators**: Bitwise AND (`&`), OR (`|`), XOR (`^`), NOT (`~`), left shift (`<<`), right shift (`>>`), arithmetic vs. logical shifts.
- **1.8.4. Bitmask Representation of Sets**: Treating integers as compact boolean arrays, membership test (`mask & (1 << i)`), union, intersection, set difference.

### 1.9. Foundational Mathematics

- **1.9.1. Integer Divisibility**: Division algorithm, quotient and remainder, parity, prime vs. composite properties.
- **1.9.2. Greatest Common Divisor and Euclidean Algorithm**: Euclidean algorithm for $\gcd(a, b)$, Least Common Multiple ($\text{lcm}(a, b) = \frac{a \cdot b}{\gcd(a, b)}$).
- **1.9.3. Sieve of Eratosthenes**: Generating all prime numbers up to $N$ in $O(N \log \log N)$ time, boolean composite cross-off array.
- **1.9.4. Trial Division Prime Factorization**: Finding prime factors up to $\sqrt{N}$ in $O(\sqrt{N})$ time.

---

# 2. Intermediate

### 2.1. Hierarchical Data Structures

- **2.1.1. Binary Trees**: Tree terminology (root, leaf, height, depth), full, complete, perfect, and degenerate trees.
- **2.1.2. Preorder, Inorder, and Postorder Traversals**: Recursive depth-first tree walks, explicit stack simulations, and Morris in-order traversal ($O(1)$ space).
- **2.1.3. Level-Order Traversal**: Breadth-first tree search using a queue, calculating tree width, zig-zag traversals.
- **2.1.4. Binary Search Trees (BST)**: Binary search tree invariant, search, insert, delete (in-order successor/predecessor replacement), min/max lookups.
- **2.1.5. Balanced Binary Search Trees**: Self-balancing invariants: AVL Trees (balance factors and rotations) and Red-Black Trees (recoloring and rotations).
- **2.1.6. Ordered Sets and Ordered Maps**: Tree-backed associative containers, logarithmic predecessor, successor, and range iteration.
- **2.1.7. Tree Diameter and Subtree Properties**: Calculating the longest path between any two nodes in a tree, subtree sizes, depth calculation.

### 2.2. Heaps and Priority Queues

- **2.2.1. Binary Heaps**: Array-backed complete binary trees, parent-child index relations ($2i+1, 2i+2$), Min-Heap and Max-Heap invariants, sift-up, sift-down.
- **2.2.2. Priority Queues**: Abstract data type for priority-ordered retrieval, insert ($O(\log N)$), extract-min/max ($O(\log N)$), peek ($O(1)$).
- **2.2.3. Heap Sort**: In-place $O(N \log N)$ comparison sorting using a binary heap, Floyd's $O(N)$ linear heap construction algorithm.
- **2.2.4. Top-K Elements and Two-Heap Maintenance**: Streaming top-K largest elements via Min-Heap, continuous median tracking using paired Min-Heap and Max-Heap.

### 2.3. String Data Structures and Monotonic Structures

- **2.3.1. Prefix Trees and Tries**: Character-labeled tree edges, string insertion, lookup, and prefix matching in $O(L)$ time where $L$ is string length.
- **2.3.2. Bitwise Tries**: Binary alphabet $\{0, 1\}$ trie over integer bits, maximum XOR pair queries in $O(\text{bits})$.
- **2.3.3. Monotonic Stacks**: Stack with strictly increasing or decreasing elements, solving Next Greater Element, Stock Span, Largest Rectangle in Histogram.
- **2.3.4. Monotonic Queues**: Double-ended queue maintaining monotonic order, calculating sliding window minimum/maximum in amortized $O(1)$ per step.

### 2.4. Search Space and Greedy Paradigms

- **2.4.1. Backtracking and State-Space Search**: State exploration via depth-first decision trees, `Choose`, `Explore`, `Unchoose` methodology.
- **2.4.2. Pruning Techniques**: Bounding functions, symmetry breaking, forward checking, branch-and-bound pruning.
- **2.4.3. Binary Search on the Answer**: Monotonic boolean feasibility functions $P(x)$, minimizing or maximizing parameters across answer spaces.
- **2.4.4. Ternary Search on Unimodal Functions**: Dividing search intervals into three parts to locate local extrema of unimodal or convex functions.
- **2.4.5. Greedy Algorithms with Sorting**: Greedy choice property, optimal substructure, proving optimality via exchange arguments.
- **2.4.6. Interval Scheduling and Merging**: Merging overlapping intervals, maximum non-overlapping interval scheduling, minimum meeting rooms required.
- **2.4.7. Kadane's Algorithm**: Dynamic programming / greedy maximum subarray sum in $O(N)$ time and $O(1)$ auxiliary space.

### 2.5. Foundational Dynamic Programming

- **2.5.1. Top-Down Memoization**: Recursive formulations augmented with hash map or array caches for overlapping subproblems.
- **2.5.2. Bottom-Up Tabulation**: Iterative table filling following topological evaluation order of subproblem DAGs.
- **2.5.3. Space-Optimized Dynamic Programming**: Rolling arrays and state variable reduction to drop spatial complexity by an order of magnitude.
- **2.5.4. One-Dimensional Dynamic Programming**: Linear recurrences (Fibonacci, Climbing Stairs, House Robber, Coin Change).
- **2.5.5. Multi-Dimensional Grid Dynamic Programming**: Path counting on grids, minimum cost paths, rectangle area state transformations.
- **2.5.6. Zero-One Knapsack**: Item inclusion/exclusion decisions with bounded weights, reverse-loop inner iteration for space compression.
- **2.5.7. Unbounded Knapsack**: Multi-item selection with replacement, forward-loop inner iteration.
- **2.5.8. Subset Sum**: Partitioning problems, boolean reachable state transitions.
- **2.5.9. Longest Increasing Subsequence (LIS)**: Standard $O(N^2)$ dynamic programming recurrence and $O(N \log N)$ patience sorting with binary search.
- **2.5.10. Longest Common Subsequence (LCS)**: 2D matching matrix recurrence, string reconstruction via back-pointers.
- **2.5.11. Edit Distance (Levenshtein Distance)**: Minimum insert, delete, and replace operations to transform one string into another.

### 2.6. Graph Representations and Traversals

- **2.6.1. Adjacency List and Adjacency Matrix Representations**: Memory bounds ($O(V^2)$ vs. $O(V + E)$), edge lookup, degree enumeration, Compressed Sparse Row (CSR).
- **2.6.2. Implicit Grid Graphs and Flood Fill**: Grid cells as graph vertices, 4-directional and 8-directional edge transitions, connected component coloring.
- **2.6.3. Depth-First Search (DFS)**: Recursive and stack-based traversal, discovery/finish timestamps, tree edges, back edges, forward edges, cross edges.
- **2.6.4. Breadth-First Search (BFS)**: Queue-based level-order exploration, finding shortest path in unweighted graphs, multi-source BFS.
- **2.6.5. Connected Components**: Finding and labeling disjoint graph subgraphs in undirected graphs via DFS/BFS.
- **2.6.6. Cycle Detection in Undirected and Directed Graphs**: Parent tracking in undirected graphs; 3-color DFS state tracking (White, Gray, Black) in directed graphs.
- **2.6.7. Bipartite Graph Checking and Two-Coloring**: 2-coloring via BFS/DFS, verifying absence of odd-length cycles.
- **2.6.8. Shortest Paths in Unweighted Graphs**: Single-source shortest paths (SSSP) via breadth-first search in $O(V + E)$ time.

### 2.7. Intermediate Modular and Combinatorial Mathematics

- **2.7.1. Modular Arithmetic**: Addition, subtraction, multiplication modulo $M$, preventing integer overflow during intermediate steps.
- **2.7.2. Binary Exponentiation**: Computing $a^b \pmod M$ in $O(\log b)$ time using repeated squaring.
- **2.7.3. Modular Multiplicative Inverse**: Fermat's Little Theorem for prime moduli ($a^{M-2} \equiv a^{-1} \pmod M$), extended Euclidean algorithm for coprime moduli.
- **2.7.4. Binomial Coefficients and Combinatorics**: Factorial precomputation, calculating $\binom{n}{k} \pmod M$, Pascal's identity, stars and bars technique.

---

# 3. Advanced

### 3.1. Disjoint Sets and Range Query Data Structures

- **3.1.1. Disjoint Set Union (DSU / Union-Find)**: Partitioning elements into disjoint sets, `find` and `union` operations.
- **3.1.2. Path Compression and Union by Rank or Size**: Flattens tree structures during lookups, bounding operations to nearly linear $O(\alpha(N))$ time (Inverse Ackermann).
- **3.1.3. Sparse Tables for Idempotent Range Queries**: Power-of-two jump tables, $O(N \log N)$ precomputation, $O(1)$ Range Minimum/Maximum Queries (RMQ).
- **3.1.4. Binary Indexed Trees (Fenwick Trees)**: Tree structure mapped on lowest set bit (`x & (-x)`), $O(\log N)$ prefix sum queries and point updates.
- **3.1.5. Point Update Range Query Segment Trees**: Complete binary tree representation, range queries and single-element updates in $O(\log N)$ time.
- **3.1.6. Segment Trees with Lazy Propagation**: Deferred range updates using lazy tags, enabling $O(\log N)$ range modification and range query operations.
- **3.1.7. Order Statistic Trees**: Balanced search trees augmented with subtree sizes, answering $k$-th smallest element and element rank queries in $O(\log N)$.

### 3.2. Advanced Graph Algorithms

- **3.2.1. Topological Sorting**: Kahn's algorithm (in-degree reduction queue) and DFS post-order reversal for DAG vertex linearizations.
- **3.2.2. Dynamic Programming on Directed Acyclic Graphs**: Evaluating dynamic programming recurrences over topological vertex orders.
- **3.2.3. Zero-One Breadth-First Search (0-1 BFS)**: Shortest paths on graphs with edge weights in $\{0, 1\}$ using a Deque in $O(V + E)$ time.
- **3.2.4. Dijkstra's Algorithm**: Single-source shortest paths on non-negative weighted graphs using a min-heap priority queue in $O((V + E) \log V)$ time.
- **3.2.5. Bellman-Ford Algorithm**: Relaxing all edges $V-1$ times, handling negative edge weights, detecting negative-weight cycles in $O(V \cdot E)$ time.
- **3.2.6. Floyd-Warshall Algorithm**: Dynamic programming all-pairs shortest paths (APSP) in $O(V^3)$ time, transitive closure computation.
- **3.2.7. Kruskal's Algorithm for Minimum Spanning Trees**: Edge sorting followed by greedy selection using Disjoint Set Union in $O(E \log E)$ time.
- **3.2.8. Prim's Algorithm for Minimum Spanning Trees**: Vertex growth algorithm maintaining cut edges via a priority queue in $O(E \log V)$ time.
- **3.2.9. Functional Graphs and Successor Graphs**: Directed graphs where out-degree of every vertex is 1, binary lifting for successor navigation, cycle component discovery.
- **3.2.10. Eulerian Paths and Circuits**: Hierholzer's linear $O(V + E)$ algorithm for finding paths visiting every edge exactly once.

### 3.3. Advanced Tree Algorithms

- **3.3.1. Subtree Dynamic Programming**: Computing dynamic programming values over subtrees via post-order tree traversals.
- **3.3.2. Rerooting Dynamic Programming (In-and-Out DP)**: Two-pass tree traversal technique computing answers for every node as root in $O(N)$ total time.
- **3.3.3. Euler Tour Technique**: Flattening a tree into a linear array using entry and exit timestamps, transforming subtree operations into contiguous range queries.
- **3.3.4. Binary Lifting**: Jump pointer tables ($up[v][j] = 2^j$-th ancestor), answering ancestor queries in $O(\log N)$ time.
- **3.3.5. Lowest Common Ancestor (LCA) via Binary Lifting**: Elevating deeper nodes to identical depth, binary stepping to identify Lowest Common Ancestor in $O(\log N)$.
- **3.3.6. Lowest Common Ancestor via Euler Tour and Range Minimum Query**: Reduction of LCA to static Range Minimum Query on Euler tour depth array in $O(1)$ query time.
- **3.3.7. Small-to-Large Merging (Sack / DSU on Tree)**: Merging child subtree data structures into the largest child's structure, bounding overall work to $O(N \log N)$ or $O(N \log^2 N)$.

### 3.4. Advanced Dynamic Programming and Search

- **3.4.1. Bitmask Dynamic Programming**: Bitmask state representations, subset iteration ($O(3^N)$), Traveling Salesperson Problem (TSP in $O(N^2 2^N)$).
- **3.4.2. Range and Interval Dynamic Programming**: Subarray range synthesis, transitioning from shorter intervals to longer intervals (Matrix Chain Multiplication, Burst Balloons).
- **3.4.3. Digit Dynamic Programming**: Counting integers in range $[A, B]$ satisfying digit conditions via state tuple `(index, tight, leading_zeros, mask)`.
- **3.4.4. Meet in the Middle**: Dividing search spaces of size $2^N$ into two halves of size $2^{N/2}$, computing half-solutions and recombining via sorting or binary search.

### 3.5. String Matching Algorithms

- **3.5.1. Polynomial Rolling Hash**: Rabin-Karp substring search algorithm, modular arithmetic on rolling character window hashes, handling collisions.
- **3.5.2. Knuth-Morris-Pratt (KMP) Algorithm**: Prefix function $\pi[i]$ (Longest Proper Prefix which is also Suffix), avoiding redundant backtracks in $O(N + M)$ time.
- **3.5.3. Z-Algorithm**: Computing $Z$-array ($Z[i]$ = length of longest substring starting at $i$ matching prefix of string) in $O(N)$ linear time.
- **3.5.4. Manacher's Algorithm**: Linear $O(N)$ algorithm finding all maximal palindromic substrings by exploiting symmetry and mirror bounds.

### 3.6. Computational Geometry and Number Theory

- **3.6.1. Cross Product and Orientation Primitives**: 2D cross product of vectors, clockwise, counter-clockwise, and collinear orientation tests.
- **3.6.2. Line Segment Intersection**: Verifying if two line segments intersect using cross-product orientation tests and bounding box checks.
- **3.6.3. Polygon Area**: Shoelace formula (Gauss's area formula) for computing the area of arbitrary non-self-intersecting polygons in $O(N)$ time.
- **3.6.4. Sweep Line Algorithms**: Sorting geometric events along an axis, dynamic event processing with balanced search trees.
- **3.6.5. Two-Dimensional Convex Hull**: Graham Scan and Andrew's Monotone Chain algorithms computing the minimum enclosing convex boundary in $O(N \log N)$ time.
- **3.6.6. Extended Euclidean Algorithm**: Computing integers $x, y$ such that $a \cdot x + b \cdot y = \gcd(a, b)$, finding modular inverses.
- **3.6.7. Euler's Totient Function $\phi(N)$**: Counting positive integers up to $N$ coprime to $N$, product formula $\phi(N) = N \prod_{p|N} (1 - 1/p)$.
- **3.6.8. Inclusion-Exclusion Principle**: Computing set union cardinality $|\bigcup A_i| = \sum |A_i| - \sum |A_i \cap A_j| + \dots$, application to counting coprime sets.
- **3.6.9. Matrix Exponentiation**: Formulating linear recurrences as state-transition matrices, accelerating evaluation to $O(K^3 \log N)$ time.

---

# 4. Expert

### 4.1. Specialized and Persistent Range Structures

- **4.1.1. Dynamic and Sparse Segment Trees**: Node allocation on demand for coordinates up to $10^9$ without full coordinate compression.
- **4.1.2. Persistent Segment Trees**: Path copying technique, preserving previous versions of data structures, range $k$-th smallest queries (Chair Tree).
- **4.1.3. Merge Sort Trees and Two-Dimensional Range Queries**: Segment tree where each node holds a sorted vector, answering range frequency and rank queries.
- **4.1.4. Segment Tree Beats**: Maintaining range minimum, maximum, and modulo/clipping updates ($A[i] = \min(A[i], X)$) in amortized $O(N \log N)$ time.
- **4.1.5. Wavelet Trees**: Recursive alphabet-partitioning tree supporting rank, select, and range quantile queries over arbitrary integer sequences.
- **4.1.6. Square Root Decomposition**: Block decomposition dividing arrays into chunks of size $\sqrt{N}$, processing point updates and block queries in $O(\sqrt{N})$.
- **4.1.7. Mo's Algorithm**: Offline query reordering via Hilbert curves or $\sqrt{N}$ block sorting, answering $Q$ range queries in $O((N + Q)\sqrt{N})$.
- **4.1.8. Randomized Treaps and Implicit Treaps**: Cartesian tree combining BST search keys and randomized heap priorities; implicit treaps for dynamic array splitting and rope operations.
- **4.1.9. Splay Trees and Link-Cut Trees**: Splay trees (self-adjusting amortized $O(\log N)$ BST); Link-Cut Trees maintaining dynamic forests with link and cut operations.

### 4.2. Tree Decompositions

- **4.2.1. Heavy-Light Decomposition (HLD)**: Decomposing trees into heavy and light chains, mapping paths to contiguous segments for $O(\log^2 N)$ path updates.
- **4.2.2. Centroid Decomposition**: Recursive tree partitioning at centroid vertices (subtrees $\le N/2$), answering tree path distance queries in $O(N \log N)$ time.
- **4.2.3. Virtual Trees (Auxiliary Trees)**: Compressing a subset of $K$ critical tree nodes and their LCAs into an auxiliary tree of size $O(K)$ in $O(K \log K)$ time.
- **4.2.4. Kruskal Reconstruction Tree**: Binary tree built during Kruskal's algorithm, converting bottleneck edge weight queries between nodes into LCA queries.

### 4.3. Connectivity, Flows, and Matchings

- **4.3.1. Kosaraju's and Tarjan's Strongly Connected Components Algorithms**: Decomposition of directed graphs into maximal strongly connected subgraphs via DFS.
- **4.3.2. Two-Satisfiability (2-SAT)**: Solving boolean satisfiability clauses $(x \lor y)$ in linear time using implication graphs and SCC components.
- **4.3.3. Bridges, Articulation Points, and Biconnected Components**: Identifying critical failure points in undirected graphs using discovery and low-link numbers.
- **4.3.4. Block-Cut Trees**: Tree representation of an undirected graph's biconnected components (blocks) and articulation points (cuts).
- **4.3.5. Maximum Flow and Minimum Cut**: Max-Flow Min-Cut Theorem, Ford-Fulkerson method, Edmonds-Karp shortest augmenting path algorithm.
- **4.3.6. Dinic's Algorithm**: Level graphs constructed via BFS and blocking flows pushed via DFS, running in $O(V^2 E)$ (and $O(E \sqrt{V})$ on unit networks).
- **4.3.7. Maximum Bipartite Matching**: Finding maximum matching in bipartite graphs via Hopcroft-Karp algorithm in $O(E \sqrt{V})$ time.
- **4.3.8. Minimum Cost Maximum Flow (MCMF)**: Augmenting paths with minimum cost using Bellman-Ford, SPFA, or potentials with Dijkstra.
- **4.3.9. Offline Dynamic Connectivity**: Maintaining graph connectivity across an offline sequence of edge insertions and deletions via DSU with rollback and divide-and-conquer over time.

### 4.4. Dynamic Programming Optimizations

- **4.4.1. Convex Hull Trick (CHT)**: Optimizing transitions $dp[i] = \min_{j < i} \{ dp[j] + m_j x_i + c_j \}$ from $O(N^2)$ to $O(N)$ or $O(N \log N)$ by maintaining upper/lower convex hulls of lines.
- **4.4.2. Li Chao Trees**: Segment tree maintaining line or segment envelopes, supporting dynamic line insertion and point evaluation in $O(\log N)$.
- **4.4.3. Divide and Conquer Dynamic Programming Optimization**: Applicable when transition points satisfy quadrangle monotonicity $opt[i][j-1] \le opt[i][j] \le opt[i+1][j]$, reducing complexity from $O(K N^2)$ to $O(K N \log N)$.
- **4.4.4. Knuth's Optimization**: Narrowing subproblem split searches for interval DP satisfying the quadrangle inequality, reducing complexity from $O(N^3)$ to $O(N^2)$.
- **4.4.5. Lagrangian Relaxation and Aliens Trick**: Binary searching over Lagrange multipliers (penalties $\lambda$) to remove cardinality constraints $K$ from state spaces.
- **4.4.6. Slope Trick**: Maintaining convex cost functions using sets of slope change points (priority queues of inflection coordinates).
- **4.4.7. Sum Over Subsets (SOS) Dynamic Programming**: Evaluating submask sums $F[mask] = \sum_{sub \subseteq mask} A[sub]$ in $O(N \cdot 2^N)$ time instead of $O(3^N)$.
- **4.4.8. Broken Profile Dynamic Programming**: Dynamic programming on grid cells with irregular, jagged, or incomplete profiles using bitmask boundaries.

### 4.5. Advanced String Suffix Structures

- **4.5.1. Aho-Corasick Automaton**: Multi-pattern string matching combining trie structures with KMP failure links and dictionary suffix links in $O(\sum |P| + |Text|)$.
- **4.5.2. Suffix Arrays and Longest Common Prefix (LCP) Arrays**: Lexicographically sorted suffixes in $O(N \log N)$ and Kasai's algorithm for linear-time LCP calculation in $O(N)$.
- **4.5.3. Suffix Automata (SAM)**: Minimal directed acyclic word graph (DAWG) representing all substrings of a string with $O(N)$ states and transitions.
- **4.5.4. Palindromic Trees (Eertree)**: Directed tree structure encoding all distinct palindromic substrings of a string in $O(N)$ vertices.

### 4.6. Algebraic and Game-Theoretic Algorithms

- **4.6.1. Fast Fourier Transform (FFT) and Number Theoretic Transform (NTT)**: Polynomial multiplication in $O(N \log N)$ using complex roots of unity or modular primitive roots.
- **4.6.2. Linear XOR Basis and Gaussian Elimination**: Vector space over $\mathbb{F}_2$, finding maximum XOR subset sums and Gaussian elimination over modular systems.
- **4.6.3. Combinatorial Game Theory and Sprague-Grundy Theorem**: Normal play impartial games, calculating Grundy values ($mex$ function), game decomposition via XOR-sums.

---

## Appendix: Systems & Storage Data Structures

Data structures foundational to modern database storage engines, distributed key-value stores, and operating systems:

- **B-Trees & B+ Trees**: High branching factor search trees optimized for block storage, paging, and disk I/O minimization; leaf-level linked chains for range scans.
- **Log-Structured Merge-Trees (LSM-Trees) & SSTables**: Append-only storage architectures, in-memory MemTables, Write-Ahead Logs (WAL), sorted immutable SSTable disk files, and compaction policies (Leveled vs. Size-Tiered).
- **Probabilistic Filters & Sketches**:
  - **Bloom Filters**: Space-efficient membership testing with zero false negatives.
  - **Cuckoo Filters**: Hash-table based filters supporting dynamic item deletion.
  - **HyperLogLog (HLL)**: Distinct-count cardinality estimation of billions of records using small constant memory.
  - **Count-Min Sketch**: Approximate frequency estimation and heavy-hitter identification in data streams.
- **Compressed Radix Trees (Patricia Tries)**: Edge-compacted tries for IP routing tables and memory-efficient associative lookups.
- **Concurrency & In-Memory Caching Structures**:
  - **$O(1)$ LRU Cache**: Doubly linked list paired with hash table for least-recently-used eviction.
  - **$O(1)$ LFU Cache**: Frequency-bucketed doubly linked lists for least-frequently-used eviction.
  - **Lock-Free SPSC Ring Buffer**: Circular buffers with atomic read/write head pointers and memory fences for thread-safe producer-consumer pipelines.
  - **Skip Lists**: Probabilistic balanced hierarchies for concurrent in-memory ordering (e.g., Redis Sorted Sets).
  - **Merkle Trees**: Cryptographic verification trees for peer-to-peer anti-entropy and distributed consensus verification.
- **Multi-Dimensional Spatial Trees**:
  - **QuadTrees & Octrees**: Recursive 2D/3D space partitioning for graphics engines and spatial simulations.
  - **K-D Trees**: $k$-dimensional space partitioning for fast nearest neighbor lookups ($k$-NN).
  - **R-Trees & $R^\*$ Trees**: Bounding box hierarchies for spatial indices and geographic GIS queries.
