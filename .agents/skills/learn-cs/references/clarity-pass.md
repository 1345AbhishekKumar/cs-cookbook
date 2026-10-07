# Clarity Pass — Making Hard Material Easy

A lesson can be structurally perfect — one concept per beat, a chain that holds — and still lose the reader in the prose. The chain decides *what* is taught and in what order; the clarity pass decides whether each sentence is actually followable by someone who does not already know the answer.

You constructed this material, so every term, number, and analogy is yours. That makes clarity your responsibility twice over: you cannot blame a confusing source, and you cannot hide difficulty behind fidelity. The pass is a deliberate rewrite of the prose *after* the body is drafted — not a substitute for getting the ordering right.

Run it in Phase 3, once the beats are written and the terminology is defined, before the evaluation checklist.

---

## When this pass applies

Run it on every lesson. A designed lesson is dense by nature — it moves fast on purpose — so there is almost always a passage that only makes sense to the person who wrote it. Look for:

| Signal | What you'll see in your own draft |
|---|---|
| Undefined jargon | Domain terms used on first exposure with no gloss — "as you know", "obviously", "just use the reducer" |
| Missing prerequisites | A section that leans on a term or idea introduced later, or on background the protagonist doesn't have yet |
| Abstraction with no instance | A rule stated once, fast, with no example and no numbers |
| Point arrives late | Two-thirds of the paragraph is ramp-up and the actual idea lands in the last sentence |
| Invisible referent | "this", "that value", "the result" — a thing the reader has not been given a name for |
| Stacked clauses | One sentence carrying four ideas joined by commas and dashes |
| Unstated units or scale | "it's fast", "a lot of rows", "small enough" with nothing to anchor it |

Mixed drafts are normal: a clean section still has two or three sentences that need this.

---

## The hard rule: simplify the structure, never the substance

| Act | Allowed? | Example |
|---|---|---|
| Restate your own idea in plainer words | Yes | "converges" → "you get the same answer each time you run it" |
| Gloss a term instead of dropping it | Yes | Keep "idempotent", add "running it twice has the same effect as running it once" |
| Move the payoff sentence to the top of the section | Yes | The point first, the reasoning after it |
| Split one clause-stacked sentence into two or three | Yes | Same facts, shorter sentences |
| State a prerequisite the beat assumes | Yes, but only where needed | "This assumes the request already has a connection." |
| Add a concrete worked example of a rule you stated | Yes | The rule plus real values, run end to end |
| Replace a hard term with a soft one | **No** | The reader will meet `idempotent` in real docs; define it, don't erase it |
| Drop a fact because it is hard to phrase | **No** | Difficulty is an ordering or phrasing problem, not a reason to cut |
| Soften a claim to avoid proving it | **No** | "sort of works like X" is vague confidence, not clarity |
| Present constructed numbers as if they were quoted | **No** | Label them — see *What "easy" is not* |

The test: **could a reader who does not know the answer read this once and follow it?** If you had to be the author to understand a sentence, rewrite it. If rewriting it would require removing a fact, the fix is upstream in the chain — reorder the beats (see `problem-chain.md`), don't dilute the content.

---

## The seven techniques

| # | Technique | Rendered as |
|---|---|---|
| 1 | **Define before use** | The term stays, with a plain gloss in the same paragraph; acronyms carry their expansion too — `<strong>DNS</strong> (Domain Name System) is ...`; 4+ terms → a `<dl class="deflist">` or a terminology table before first use |
| 2 | **One concrete instance per abstraction** | A `<pre>` block, a small table, or a run-through with real values; math equations must live in code blocks, not in `<p>` only — inline mention + code block copy |
| 3 | **Lead with the point** | The payoff sentence moves to the top of the section or `.cmd`; the reasoning follows it |
| 4 | **State the prerequisite** | `.section-sub` lead-in sentence, the masthead `.meta-row`, or a `note` at the top of the section |
| 5 | **Analogy on first exposure** | One sentence of prose right after the concept is named, before any syntax |
| 6 | **Split stacked clauses** | Short sentences, or an `<ol>` when you listed steps inside one breath |
| 7 | **Name the invisible referent** | The value, the file, the outcome — written out. "It" and "this" are not names |

Do them in that order. Defining before use is the highest-yield fix and the one readers notice most; technique 3 is the one authors resist, because the payoff feels like the reward at the end of the paragraph — but a reader who stops early should already have it. Naming the referent is where invented-sounding filler creeps in, so it is last: if naming the thing would require a fact you haven't established, the fix is a beat earlier in the chain, not a new sentence here.

---

## What "easy" is not

- **Not dumbing down.** Keep the real term as the label and attach the gloss. Erasing vocabulary cheats the learner out of the words they need after the lesson.
- **Not removing detail.** Simplification happens in *sentence structure and sequencing*, not in what gets stated. If a passage only works without a fact, the passage is in the wrong place.
- **Not condescension.** Delete "simply", "just", "obviously", "of course", "as you know" from your own prose. To a stuck reader they read as blame.
- **Not filler.** "In other words, the index is a structure that indexes things" restates; it does not clarify. A restatement earns its place only if it is *more concrete* than what it follows.
- **Not a stretched analogy.** A comparison that breaks under one push of scrutiny leaves the reader with a wrong model. If the analogy only half-fits, state the half that fits and stop. Your analogies are constructed, so the mapping is yours to make precise.
- **Not silent numbers.** When a figure is constructed to illustrate a ratio you stated, say so. Presenting invented values as measured data is the one dishonesty this pass must not enable.

---

## Budget

Clarity work does not raise the callout limits — still at most one callout per `.cmd`, three per section. Prefer prose, `<dl class="deflist">`, and tables.

If a section seems to need a callout on every command, the real problem is that the section lacks a lead-in paragraph explaining the concept they share. Write that paragraph instead: one place to say it is better than five places to repeat it.

Adding a definition, an example, or a prerequisite does not violate "one concept per beat." Clarifying a stated concept in flow is not introducing a new one; the beat still teaches a single idea.

---

## Worked example

**Draft paragraph — correct, unreadable to the reader who doesn't already know:**

```html
<p>An index is a secondary structure mapping the key to the row id, so lookups stay O(log n) instead of requiring a full scan.</p>
```

Every term is used before it is defined (`secondary structure`, `row id`, `O(log n)`, `full scan`), and the whole explanation is packed into one clause-stacked sentence. You wrote it, so it reads fine to you — that is exactly the trap.

**After the clarity pass:**

```html
<dl class="deflist">
  <dt>Index</dt>
  <dd>A separate lookup structure that answers "which row holds this key?" without touching the table.</dd>
  <dt>Row id</dt>
  <dd>The index's pointer to the real row on disk — what it stores instead of the row itself.</dd>
  <dt>O(log n)</dt>
  <dd>Cost grows with the logarithm of the row count: doubling the table adds about one comparison, not one full pass.</dd>
</dl>

<p>Reading a row by key is two hops. The index turns the key into a row id; the row id fetches the row.</p>

<pre><code><span class="c"># no index — read everything, keep the one that matches</span>
<span class="p">100,000 rows read → 1 row returned</span>

<span class="c"># with index — descend the tree, then fetch one row</span>
<span class="p">about 17 comparisons → 1 row returned</span></code></pre>

<div class="note">
  <p>17 is log₂(100,000) rounded up: each step in the tree halves the rows still in play.</p>
</div>
```

What changed, and why the substance is untouched:

- Four undefined terms became a `deflist` — technique 1, and the shared setup for the section lives in one place instead of in every block.
- One clause-stacked sentence became two short sentences — technique 6.
- The stated comparison (`log n` vs. `full scan`) got real values — technique 2. **These values are constructed to illustrate the ratio you stated, not measured output.** Say so in the lesson when you do this; a note like the one above is enough.
- The `note` explains the arithmetic the reader would otherwise have to supply.
- Nothing was removed: no term was erased, no fact was softened, no claim was dropped.

---

## Clarity checklist

- [ ] No term is used before it is defined — first use carries a gloss, or a glossary precedes it
- [ ] No bare acronym — every initialism (DNS, HTTP, TCP, ReLU) is expanded in parentheses in the same sentence where it is first defined
- [ ] Every abstraction has at least one concrete instance with real values
- [ ] Each section's point is in its first two sentences, not at the end of the last paragraph
- [ ] Prerequisites are stated where they're needed, and only where they're needed
- [ ] No "simply", "just", "obviously", "of course", "as you know"
- [ ] No sentence carries more than one new idea; stacked clauses are split
- [ ] Every "it", "this", and "the result" resolves to a named referent in the same paragraph
- [ ] Constructed numbers are labelled as constructed, never presented as quoted output
- [ ] Nothing was cut to make a passage easier — if it was, the beat was reordered instead
