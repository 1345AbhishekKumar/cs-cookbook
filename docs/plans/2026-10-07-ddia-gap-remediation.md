# DDIA & Live Stream Full Parity Implementation Plan

> **Goal:** Remediate all completely missing and partially covered distributed systems topics across the `content/docs/system-design` curriculum, achieving 100% parity with Martin Kleppmann's *Designing Data-Intensive Applications* (DDIA) and the 11 PlanetScale database engineering lecture streams.

**Architecture:**
1. **Module 02 (Data Models & Storage):** Integrate Triple-Stores/SPARQL/Datalog into `02-02`, $B^\epsilon$-Trees / Bf-Trees and Columnar Bitmap Indexing into `02-03`, and Binary JSON byte breakdown / Actor Model dataflow into `02-04`.
2. **Module 03 (Distributed Data & Consensus):** Add the 4 Replication Log types and Vitess VTGate query buffering to `03-01`, GitHub multi-tenant sharding and key salting to `03-02`, PostgreSQL vs. MySQL MVCC storage internals and transactional anti-patterns to `03-03`, $\phi$-Accrual failure detection to `03-04`, and Three-Phase Commit (3PC) & Attiya-Welch bound to `03-05`.
3. **Module 04 (Batch, Streaming & Future):** Add batch search index construction to `04-01`, Kafka rebalance protocols and ClickHouse telemetry routing to `04-02`, and Ethics/Data Ecology, Uber MGR Raft migration, and Bit Rot verification to `04-03`.
4. **Verification:** Validate all MDX syntax, Fumadocs components, LaTeX KaTeX formulas, and build cleanly with `npm run build`.

**Tech Stack:** Next.js 16, Fumadocs MDX, React 19, KaTeX math formulas, Mermaid diagrams, Lucide React icons.

---

## Phase 1: Module 02 — Data Models, Storage & Evolution Gaps

### Task 1: Add Triple-Stores, SPARQL, and Datalog to `02-02`
**Target File:** `content/docs/system-design/02-data-models-and-storage/02-data-models-and-query-languages.mdx`  
**Gap Type:** <span style="color:red; font-weight:bold">COMPLETELY MISSING</span> (DDIA Chapter 2)

- **Step 1: Write Triple-Store and SPARQL Section**
  - Add a dedicated subsection comparing Property Graphs (Neo4j Cypher) with **Triple-Stores (Resource Description Framework - RDF)**.
  - Explain the `(subject, predicate, object)` data model with Turtle syntax:
    ```turtle
    @prefix : <urn:travelbuddy:>.
    _:flight101 :airline "Delta" ; :origin "JFK" ; :destination "LHR" .
    ```
  - Provide a declarative **SPARQL query** example finding connecting flights through London Heathrow:
    ```sparql
    PREFIX : <urn:travelbuddy:>
    SELECT ?flight WHERE {
      ?flight :origin "JFK" .
      ?flight :destination ?stop .
      ?nextFlight :origin ?stop .
      ?nextFlight :destination "HND" .
    }
    ```
- **Step 2: Add Datalog Declarative Logic & Recursion**
  - Introduce **Datalog** as the mathematical foundation for declarative deduction.
  - Show recursive rule definition:
    ```prolog
    can_reach(X, Y) :- flight(X, Y).
    can_reach(X, Y) :- flight(X, Z), can_reach(Z, Y).
    ```
- **Step 3: Expand CODASYL vs Relational & LinkedIn Schema Evolution**
  - Expand CODASYL manual cursor traversal vs. Codd's declarative access paths.
  - Add practical discussion from Stream 1 on LinkedIn profile modeling: normalized tables vs. native `JSON` columns in PostgreSQL/MySQL vs. MongoDB document model.
- **Step 4: Verify MDX Rendering**
  - Ensure Fumadocs components (`Tabs`, `Callout`) and code fences render cleanly.

---

### Task 2: Add $B^\epsilon$-Trees (Bf-Trees), Bitmap Indexing, and Star/Snowflake Schemas to `02-03`
**Target File:** `content/docs/system-design/02-data-models-and-storage/03-storage-engines-lsm-vs-btree.mdx`  
**Gap Type:** <span style="color:red; font-weight:bold">COMPLETELY MISSING</span> ($B^\epsilon$-Trees, Stream 10) & <span style="color:orange; font-weight:bold">PARTIALLY COVERED</span> (Bitmap Indexing, Star/Snowflake)

- **Step 1: Add Modern Hybrids: $B^\epsilon$-Trees / Bf-Trees Deep Dive**
  - Explain the fundamental tradeoff: B-trees are optimized for point reads ($\mathcal{O}(\log_B N)$), while LSM-trees are optimized for writes ($\mathcal{O}(\frac{1}{B} \log_{M/B} \frac{N}{B})$).
  - Detail how **$B^\epsilon$-trees** (Buffer Trees, as highlighted in Stream 10) bridge this: each non-leaf node contains both child pointers and a **node-level write buffer**.
  - Detail cascading buffer flushes: writes append to root buffer; when full, a batch flushes down to the relevant child node's buffer, reducing random I/O while keeping bounded tree height.
  - Include a Mermaid architecture diagram showing the internal anatomy of a $B^\epsilon$-tree node.
- **Step 2: Detail Columnar Bitmap Indexing with Bitwise SIMD Operations**
  - Provide a concrete step-by-step table showing how a low-cardinality column (`flight_status`: `ON_TIME`, `DELAYED`, `CANCELLED`) is transformed into raw binary bitvectors.
  - Demonstrate bitwise operations: `status_delayed AND destination_jfk` using SIMD parallel hardware instructions.
- **Step 3: Add Star vs. Snowflake Schema Comparison Diagram & Postgres Heap `ctid`**
  - Add a Mermaid ERD illustrating fact table (`fact_flight_bookings`) with foreign keys to dimensions (`dim_passenger`, `dim_aircraft`, `dim_airport`), contrasted with normalized snowflake hierarchies.
  - Contrast PostgreSQL heap file storage (tuple pointers via `ctid` = `(page_number, item_offset)`) with InnoDB's clustered index page architecture.

---

### Task 3: Add Binary JSON Byte Layout Breakdown and Actor Model Dataflow to `02-04`
**Target File:** `content/docs/system-design/02-data-models-and-storage/04-encoding-and-evolution.mdx`  
**Gap Type:** <span style="color:orange; font-weight:bold">PARTIALLY COVERED</span> (Stream 4 & DDIA Ch 4)

- **Step 1: Byte-by-Byte Layout Comparison: MessagePack vs. Protocol Buffers**
  - Reproduce the exact breakdown from Stream 4 showing why Binary JSON (MessagePack, BSON) only saves marginal space compared to Protobuf:
    - MessagePack: still encodes string field names (`userName`, `email`, `age`), totaling 66 bytes.
    - Protocol Buffers: substitutes strings with 1-byte field tags (e.g. tag `1`, wire type `2`), compressing the identical payload into 33 bytes.
  - Include an illustrative hex/byte alignment table contrasting both formats.
- **Step 2: Add Actor Model Distributed Dataflow**
  - Detail asynchronous message-passing concurrency in the **Actor Model** (Erlang/OTP, Akka, Microsoft Orleans).
  - Analyze schema evolution challenges in Actor systems: upgrading actors independently in rolling deployments, handling unhandled messages in actor mailboxes, and location transparency serialization.

---

## Phase 2: Module 03 — Distributed Replication, Sharding, MVCC & Consensus Gaps

### Task 4: Add the 4 Replication Log Implementations & Vitess VTGate Query Buffering to `03-01`
**Target File:** `content/docs/system-design/03-distributed-data-and-consensus/01-replication-models-and-lag.mdx`  
**Gap Type:** <span style="color:red; font-weight:bold">COMPLETELY MISSING</span> (4 Log Types, DDIA Ch 5) & <span style="color:orange; font-weight:bold">PARTIALLY COVERED</span> (Vitess VTGate, Stream 5)

- **Step 1: Add "Under the Hood: The Four Replication Log Implementations" Section**
  - **1. Statement-Based Replication (SBR):** Master logs raw SQL statements (`INSERT INTO ...`). Hazards: non-deterministic functions (`NOW()`, `RAND()`, `UUID()`), auto-incrementing IDs in concurrency, and triggers with non-deterministic evaluation.
  - **2. Write-Ahead Log (WAL) Shipping:** Master sends raw disk page byte changes (used in PostgreSQL and Oracle). Caveat: tightly couples replication to the exact binary storage engine and OS/database version (prevents zero-downtime major version rolling upgrades).
  - **3. Logical (Row-Based) Replication (RBR):** Master logs row images before and after modification (MySQL binlog row format). Decouples storage formats, allows different storage engines on replicas, enables zero-downtime schema upgrades, and serves as the foundation for CDC.
  - **4. Trigger-Based Replication:** Application/user triggers copy updates to shadow change tables (e.g. Bucardo, Databus). Highly flexible but carries massive database overhead and bug susceptibility.
- **Step 2: Add Vitess VTGate Query Buffering During Failover**
  - Add production engineering case study from PlanetScale/Vitess: how the VTGate stateless proxy layer buffers inbound client queries in memory during primary failovers (orchestrated by VTOrc) so that application client connection pools experience brief latency spikes rather than connection drop errors.
  - Add typical latency comparison: AWS Intra-AZ latency (<1ms) vs. Cross-Region round-trip latency (70–150ms).

---

### Task 5: Add Key Salting Step-by-Step and Multi-Tenant Blast Radius Sharding to `03-02`
**Target File:** `content/docs/system-design/03-distributed-data-and-consensus/02-partitioning-and-sharding.mdx`  
**Gap Type:** <span style="color:orange; font-weight:bold">PARTIALLY COVERED</span> (DDIA Ch 6 & Stream 6)

- **Step 1: Add Hotspot Elimination via Deterministic Key Salting**
  - Document the concrete two-phase algorithm for handling celebrity / hotspot keys:
    - **Write path:** Append a random two-digit salt (e.g., `user_10293_salt_${Math.floor(Math.random() * 100)}`) to distribute writes evenly across 100 partitions.
    - **Read path:** Scatter-gather read query across all 100 partition keys (`user_10293_salt_0` through `user_10293_salt_99`) and merge results in the proxy/application layer.
- **Step 2: Add GitHub Multi-Tenant Vitess Sharding & Blast Radius Isolation**
  - Document GitHub's database architecture using Vitess MySQL: sharding by Organization / Enterprise ID.
  - Detail blast radius containment: if Shard 7 crashes or experiences a noisy-neighbor load spike, 95% of GitHub organizations on Shards 1–6 and 8–20 remain 100% operational.

---

### Task 6: Add Postgres vs. MySQL MVCC Internals, Transactional Anti-Patterns, and Conflict Materialization to `03-03`
**Target File:** `content/docs/system-design/03-distributed-data-and-consensus/03-transactions-acid-and-isolation.mdx`  
**Gap Type:** <span style="color:orange; font-weight:bold">PARTIALLY COVERED</span> (Stream 7 & DDIA Ch 7)

- **Step 1: Add "Physical MVCC Mechanics: PostgreSQL Heap Pages vs. MySQL InnoDB Undo Logs"**
  - **PostgreSQL Heap Tuples:** Rows inserted into 8KB heap pages with header fields `xmin` (creating transaction ID) and `xmax` (deleting/updating transaction ID).
    - `UPDATE` does not overwrite: it marks old tuple's `xmax` and inserts a brand new tuple, creating a dead tuple.
    - Dead tuples cause table bloat and index bloat; requires PostgreSQL `VACUUM` / `autovacuum` to reclaim page space.
    - Explain transaction ID wraparound freeze: 32-bit transaction IDs wrap around after 2 billion transactions; failing to freeze causes database shutdown. Mention tools like `pg_squeeze` and `pg_repack`.
  - **MySQL InnoDB Clustered Index + Undo Logs:** Updates modify the row in-place on the clustered B+ tree leaf page.
    - Prior row versions are written to rollback segments in the **Undo Log**, linked via a 7-byte `roll_ptr`.
    - Purge threads reclaim undo log space once transactions older than the view commit.
- **Step 2: Add Transaction Anti-Pattern: Network I/O Inside Database Transactions**
  - Highlight the severe failure mode of making synchronous HTTP calls (Stripe payment charge, LLM API call) inside an open database transaction.
  - Explain how downstream network latency holds open database row locks, exhausts database connection pools, and cascades into global thread starvation.
- **Step 3: Add Materializing Conflicts for Write Skew**
  - Explain how to solve phantom-driven write skew when no rows exist to lock (e.g. meeting room booking): pre-populate a calendar slots table so transactions can issue `SELECT ... FOR UPDATE` against physical slot rows.

---

### Task 7: Add $\phi$-Accrual Failure Detector and Two Generals Problem to `03-04`
**Target File:** `content/docs/system-design/03-distributed-data-and-consensus/04-distributed-failures-and-clocks.mdx`  
**Gap Type:** <span style="color:red; font-weight:bold">COMPLETELY MISSING</span> ($\phi$-Accrual, DDIA Ch 8) & <span style="color:orange; font-weight:bold">PARTIALLY COVERED</span> (Two Generals)

- **Step 1: Add the $\phi$-Accrual Failure Detector (Hayashibara et al.)**
  - Explain the limitation of static heartbeat timeouts: too short causes false positives (marking healthy nodes dead during temporary GC pauses or packet jitter); too long causes slow failover.
  - Detail the **$\phi$-Accrual algorithm** (used in Apache Cassandra and Akka Cluster):
    - Maintains a sliding window of historical heartbeat inter-arrival times.
    - Fits arrival times to a normal distribution and calculates suspicion level:
      $$\phi = -\log_{10}(P_{\text{later}}(t - t_{\text{last}}))$$
    - If $\phi = 1$, probability of false positive is $10\%$; if $\phi = 8$, probability of false positive is $10^{-8}$.
    - Allows systems to adapt failover thresholds dynamically based on network jitter.
- **Step 2: Add The Two Generals Problem vs. Byzantine Generals**
  - Add the classic illustration of two Byzantine generals coordinating an attack across an unreliable valley via messengers.
  - Mathematically prove why no deterministic protocol can guarantee common knowledge over an unreliable communication channel with packet loss.

---

### Task 8: Add Three-Phase Commit (3PC), Attiya-Welch Theorem, and Viewstamped Replication to `03-05`
**Target File:** `content/docs/system-design/03-distributed-data-and-consensus/05-consistency-and-consensus.mdx`  
**Gap Type:** <span style="color:red; font-weight:bold">COMPLETELY MISSING FROM LESSON BODY</span> (3PC & Attiya-Welch, DDIA Ch 9)

- **Step 1: Add "Three-Phase Commit (3PC) & Why It Fails in Practice"**
  - Diagram the 3 phases: `Can-Commit?` $\to$ `Pre-Commit` $\to$ `Do-Commit`.
  - Explain why 3PC was theorized to make 2PC non-blocking under a synchronous crash-stop model with bounded network delay.
  - Explain why 3PC fails completely in real-world asynchronous distributed networks: network partitions cause split-brain timeouts where partitioned nodes commit while others abort.
- **Step 2: Add the Attiya-Welch Theoretical Bound on Linearizability**
  - Formally state the Attiya-Welch theorem: in any distributed system providing linearizable read/write operations over an asynchronous network with uncertainty $d$, the sum of read latency $r$ and write latency $w$ must satisfy:
    $$r + w \ge d$$
  - Discuss the practical implication: fast reads require slow writes; fast writes require slow reads.
- **Step 3: Add Viewstamped Replication (VSR) & The Alice/Bob Sports Score Anomaly**
  - Historical context: Oki & Liskov's Viewstamped Replication (1988) predating Paxos.
  - Include Kleppmann's classic scenario of Alice and Bob refreshing a live World Cup score over a laggy replica to illustrate causal ordering vs. linearizability.

---

## Phase 3: Module 04 — Batch, Streaming & Future Systems Gaps

### Task 9: Add Immutable Search Index Construction to `04-01`
**Target File:** `content/docs/system-design/04-batch-streaming-and-future/01-batch-processing-and-mapreduce.mdx`  
**Gap Type:** <span style="color:orange; font-weight:bold">PARTIALLY COVERED</span> (DDIA Ch 10)

- **Step 1: Document Batch Workflows for Building Read-Only Search Indexes**
  - Explain how large-scale search engines (Google web crawl, Lucene/Elasticsearch index rebuilds) use batch processing rather than direct incremental writes.
  - Detail the MapReduce pipeline:
    - Map: Tokenize documents into `(term, doc_id)` pairs.
    - Shuffle/Sort: Group and sort alphabetically by `term`.
    - Reduce: Build sorted posting lists and write compressed immutable inverted index segments directly to cloud storage.
  - Explain the advantages: zero index lock contention, optimal segment layout, and atomic whole-index swaps.

---

### Task 10: Add Kafka Consumer Rebalance Storms and ClickHouse Telemetry Ingest to `04-02`
**Target File:** `content/docs/system-design/04-batch-streaming-and-future/02-stream-processing-and-kafka.mdx`  
**Gap Type:** <span style="color:orange; font-weight:bold">PARTIALLY COVERED</span> (DDIA Ch 11 & Stream 11)

- **Step 1: Add Kafka Consumer Group Rebalance Mechanics & Eager vs. Cooperative Sticky Assignor**
  - Detail how group coordinators use heartbeats (`max.poll.interval.ms`) to detect consumer crashes.
  - Contrast the legacy **Eager Rebalance Protocol** (stop-the-world pause where all consumers revoke partitions, creating rebalance storms) with the modern **Cooperative Sticky Assignor** (incremental rebalance where unimpacted consumers keep processing).
- **Step 2: Add Direct-to-ClickHouse Telemetry Ingest vs. OLTP Protection**
  - Detail the production architecture from Stream 11: routing high-throughput application event telemetry (pageviews, telemetry pings) directly via Kafka into analytical columnar storage (ClickHouse / Snowflake) rather than overloading the OLTP MySQL/Postgres cluster.

---

### Task 11: Add Ethics, Privacy & Data Ecology, Uber MGR Raft Migration, and Bit Rot Verification to `04-03`
**Target File:** `content/docs/system-design/04-batch-streaming-and-future/03-the-future-of-data-systems.mdx`  
**Gap Type:** <span style="color:red; font-weight:bold">COMPLETELY MISSING</span> (Ethics & Ecology, DDIA Ch 12) & <span style="color:orange; font-weight:bold">PARTIALLY COVERED</span> (Uber MGR, Bit Rot, Stream 12)

- **Step 1: Add "The Ethics of Data Systems: Bias, Consent & Data Ecology" Section**
  - Kleppmann's closing treatise from Chapter 12:
    - **Automated Discrimination & Predictive Profiling:** Algorithmic bias when training models on historical systemic prejudice; lack of recourse in automated decision systems.
    - **Surveillance Capitalism & Consent:** Tracking user behavioral surplus without meaningful opt-out.
    - **Self-Fulfilling Algorithmic Feedback Loops:** Recommendation and fraud models that amplify initial skew by generating their own training feedback.
    - **Data Ecology & Industrial Responsibility:** Viewing data generation not as an infinite harmless exhaust, but as an ecosystem requiring stewardship, data minimization, and active retention pruning.
- **Step 2: Add Uber's Large-Scale Migration to MySQL Group Replication (MGR)**
  - Detail Uber's production migration of tens of thousands of MySQL database instances to MySQL Group Replication using Raft/Paxos consensus.
  - Explain how automated leader failover eliminated split-brain hazards and manual human on-call failover errors at planetary scale.
- **Step 3: Add Silent Disk Corruption (Bit Rot) & Automated Backup Verification**
  - Address hardware unreliability: silent bit flips on solid-state drives and network transfers that pass TCP checksums.
  - Emphasize end-to-end cryptographic hashing (SHA-256) and the gold standard of disaster recovery: regularly restoring production backups into staging environments and running automated sanity queries.

---

## Phase 4: Verification and Quality Assurance

### Task 12: Curriculum Build and Typecheck Verification
**Target:** Repo-wide validation across all modified documentation files.

- **Step 1: Run Next.js Typecheck & Typegen**
  - Run: `npm run types:check`
  - Expected: Clean output with 0 TypeScript errors.
- **Step 2: Run Production Build**
  - Run: `npm run build`
  - Expected: Next.js and Fumadocs compile all MDX routes without syntax, KaTeX, or component errors.
- **Step 3: Inspect Output and Confirm Parity**
  - Verify all 11 target MDX files render correctly with proper formatting, tables, Mermaid diagrams, and code snippets.
