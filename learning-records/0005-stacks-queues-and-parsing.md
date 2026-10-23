# Stacks, Queues, Expression Parsing, and Monotonic Structures

Established complete models for restricted-access linear primitives. Key insights include:

- LIFO vs FIFO principles; stack underflow/overflow and function activation records.
- Shunting-Yard Infix to Postfix conversion and Postfix evaluation trace tables.
- Circular Queues resolving linear false overflow using modulo arithmetic `(rear + 1) % MAX`.
- Monotonic Stacks solving the Next Greater Element and Histogram problems in amortized $O(N)$ time.
- Queue implementation using two stacks with amortized $O(1)$ operations via the Banker's accounting method.
