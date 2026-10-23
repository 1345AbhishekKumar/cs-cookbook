# String Immutability, Encodings, and Pattern Matching

Established deep intuition for text in memory. Key insights include:

- The distinction between mutable `char[]` buffers and immutable `String` objects (thread safety, security, hash caching).
- The $O(N^2)$ concatenation loop trap and mutable buffer solutions (`StringBuilder`, `''.join()`).
- Unicode, UTF-8 variable byte representation, and UTF-16 surrogate pairs (preventing the emoji slice bug).
- Combinatorics of substrings ($\frac{n(n+1)}{2}$) vs subsequences ($2^n - 1$).
- KMP pattern matching with LPS (Longest Prefix Suffix) array construction and Rabin-Karp rolling hashes.
