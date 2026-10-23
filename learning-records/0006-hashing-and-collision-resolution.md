# Hash Tables, Collision Resolution, and Hardware-Conscious Maps

Established models for direct key-value mapping and collision management. Key insights include:

- Hash function construction (Division with prime table size, Multiplication, Folding) and the Birthday Paradox.
- Closed Addressing (Separate Chaining) with treeification vs Open Addressing.
- Primary Clustering (Linear Probing), Secondary Clustering (Quadratic Probing), and Double Hashing.
- Load factor $\alpha = n/m$, tombstone markers for open addressing deletion, and Swiss Table 16-way SIMD control bytes.
