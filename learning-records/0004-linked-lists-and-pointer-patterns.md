# Linked Lists, Pointer Invariants, and Cycle Detection

Mastered node-based non-contiguous memory structures. Key insights include:

- Cache misses and pointer overhead compared to arrays; why modern systems favor vectors for linear data.
- The Sentinel / Dummy Node pattern eliminating edge cases for head/tail insertions and deletions.
- In-place list reversal using the 3-pointer invariant (`prev`, `curr`, `next_node`).
- Floyd's Cycle Detection ("Tortoise and Hare") with mathematical proof for intersection and cycle entry.
- Skip Lists as a concurrent, lock-free alternative to balanced binary search trees in Redis and LSM storage engines.
