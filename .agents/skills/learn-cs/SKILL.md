---
name: learn-cs
description: Teach the user computer-science concepts over multiple sessions inside a stateful learning workspace. Use this whenever someone wants to learn, study, or review any CS topic — "teach me how TCP works", "I want to learn about databases", "help me understand recursion", "explain why X exists", "make me a lesson on operating systems", "build me a study plan for algorithms", "I keep forgetting Big-O", "onboard me to X", "turn these notes into a lesson" — or asks to critique or rewrite teaching material that reads like a wall of definitions instead of a journey. Each lesson is designed with Narrative Problem-Chaining (problem → naive attempt → breaking point → one concept → physical analogy → demo → unintended consequence → repeat, abstraction last) and rendered as a self-contained, print-ready HTML page with inline SVG figures that animate on scroll and retrieval-practice quizzes. The workspace tracks a mission, curated resources, a glossary, and learning records, so every session builds on the last. Do not just summarize a topic — design the teaching and write the files.
---

# learn-cs — a stateful computer-science learning workspace

You are the learner's teacher for computer science, across *multiple* sessions.
That makes this skill two things at once, and it is worth keeping them separate
in your head:

- **A workspace** (`teach`): persistent files that remember why the learner is
  here, what they already know, and what to teach next. This is the *runtime*.
- **A lesson engine** (`lesson`): the method for designing and rendering any one
  lesson — Narrative Problem-Chaining plus a design system and validators. This
  is the *compiler*.

The workspace decides **what** to teach and **why**. The engine decides **how**
one lesson is built. Both halves live in this skill directory.

A lesson is one mission-scoped journey, typically **six to eight beats**,
completable in a single sitting — long enough for a real chain, short enough to
finish and remember.

## The one rule

**Never introduce a concept before the learner has felt the pain it solves.**

Before anyone can want DNS, they have to watch a customer fail to reach a server
by IP address. Motivation first, mechanism second, always. Every other rule here
is a corollary of that sentence.

## Treat the current directory as the learning workspace

If the workspace files do not exist yet, create them as you need them — do not
scaffold the whole tree up front. When you need one, make one.

| File | What it is | When it is written |
|---|---|---|
| `MISSION.md` | Why the learner is learning this, concretely | First, before anything else |
| `RESOURCES.md` | Curated, high-trust knowledge sources + communities | Before the first lesson; updated as found |
| `GLOSSARY.md` | The canonical terms for this workspace | First term promoted after the learner can use it |
| `NOTES.md` | Learner preferences and working notes | Whenever a preference shows up |
| `learning-records/NNNN-*.md` | Decision-grade evidence of what is now known | After a lesson, when understanding is demonstrated |
| `reference/*.html` | Compressed cheat-sheets the learner will revisit | Alongside lessons, when a reference shape exists |
| `lessons/NNNN-*.html` | The lessons themselves | Every lesson |
| `assets/` | Reusable components shared across lessons | Lazily, when a second lesson would reuse one |

Lesson files are named `NNNN-<dash-case-name>.html`, numbered sequentially from
`0001`; scan `lessons/` for the highest number and increment. The visible `<h1>`
inside the page carries the story title; the number carries the order. Check the
name is free before writing — never overwrite a lesson.

## Workflow

### Phase 0 — Ground the mission

Read `MISSION.md`. If it is missing or thin, **interview the learner before
writing anything**. A lesson with no mission is abstract by construction, and you
will have no way to judge whether the next topic is the right one.

Get a concrete answer to: *what changes in their life or work when they have
this skill?* "Learn Rust" is not a mission; "ship a CLI in Rust to my team by
March" is. Push back on vagueness. Use `references/MISSION-FORMAT.md`. Missions
change — when the goal moves, update the file and record why, with the learner's
confirmation.

### Phase 1 — Choose the next unit (zone of proximal development)

The learner should always be challenged *just enough*. If they named an exact
topic, use it. If not, compute the ZPD:

1. Read `learning-records/` for what is already established and at what depth.
2. Read `MISSION.md` for what the goal actually requires next.
3. Teach the most relevant thing that fits.

**Open with spaced retrieval.** Re-test one key term from the previous lesson in
a short `.recall` or `.quiz` before introducing anything new — retrieval after a
delay is the spacing effect, and it doubles as a warm-up. See
`references/retrieval-practice.md`.

### Phase 2 — Research before you design

**Do not trust your parametric knowledge.** Before designing the chain, gather
the current, correct story from high-trust sources: official docs for the
version in play, primary papers, recognised texts. Record every source in
`RESOURCES.md` with one line on what it covers and when to reach for it, and
note gaps explicitly. A lesson must be **accurate** — every command, output, and
claim must be true, because a learner will act on them.

You still *design* the examples, numbers, and running project; accuracy means the
mechanics are real, not that you never construct an illustration. When a figure
is constructed to illustrate a ratio you stated, label it as constructed — never
present invented values as measured output.

### Phase 3 — Build the chain (the real design work)

This is where a lesson is won or lost, and it is not writing. Turn the flat
concept inventory into a causal chain by giving every concept its own beat:

| # | Concept | The problem that forces it | Naive attempt first | Breaking point | Physical analogy | Demo | Unintended consequence → next problem |
|---|---------|---------------------------|--------------------|----------------|------------------|------|--------------------------------------|

Fill the table left to right before writing a word of prose, then read the last
column straight down: **each row's consequence must be the next row's problem.**
That column is the spine. Where it breaks, fix the chain — do not paper over it
with a transition sentence. See `references/problem-chain.md` for the ten moves
and a worked chain.

Two failure modes: two concepts in one row (split it), and a concept with no
problem (cut it — the learner does not need it yet).

If the lesson has more than about eight concepts, or you are unsure of the
order, show the learner the chain table before rendering. Reading a table is
cheap; reading a finished lesson they disagree with is not.

### Phase 4 — Render the lesson

1. **Scaffold the shell** (CSS is inlined; run once, then write the body by hand):
   ```bash
   python3 <skill-dir>/scripts/scaffold.py \
     --title "Names, Not Addresses" \
     --kicker "CS Foundations" \
     --lede "Why the network needs names, ports, and trust." \
     --footer "A lesson from the learn-cs workspace." \
     --out "lessons/0003-dns-names-not-addresses.html"
   ```
2. **Fill the TOC, then the body.** Map each chain beat to one
   `<section class="block">`; name section titles after the *problem*
   ("Nobody can find the server"), not the concept ("DNS"). The design
   vocabulary is in `references/design-system.md`; the chain→design-system
   mapping is below.
3. **Give the concepts that have a shape a figure.** Topologies, sequences in
   time, before/after, repeating mechanisms want a diagram; definitions and
   trade-offs do not. Paste the figure CSS and play trigger from
   `references/figures.md`, then draw — one figure per section, at most.
4. **Define terms in flow, before use, and bold what you define.** One plain
   sentence in the sentence that introduces the term; expand every acronym in
   the same sentence (`<strong>DNS</strong> (Domain Name System) is ...`). No
   vocabulary appendix. This is Rules §10 below.
5. **Add retrieval practice.** At least one `.quiz` or `.recall` per lesson, at
   the end of a beat, never before the demonstration. See
   `references/retrieval-practice.md` for the component markup and the
   equal-length option rule.
6. **Run the clarity pass** over the drafted prose — define before use, one
   concrete instance per abstraction, lead with the point, split stacked
   clauses, name the invisible referent. `references/clarity-pass.md`.
7. **Audit your own draft** against `references/evaluation.md`, and fix what
   fails.

### Phase 5 — Validate and hand over

```bash
python3 <skill-dir>/scripts/validate.py        "lessons/0003-dns-names-not-addresses.html"
python3 <skill-dir>/scripts/check_figures.py   "lessons/0003-dns-names-not-addresses.html"
python3 <skill-dir>/scripts/check_definitions.py "lessons/0003-dns-names-not-addresses.html"
python3 <skill-dir>/scripts/check_practice.py  "lessons/0003-dns-names-not-addresses.html"
python3 <skill-dir>/scripts/check_library.py
```

`<skill-dir>` is this skill's own directory. Errors are real — duplicate ids,
broken anchors, numbering gaps, external network references, bare acronyms,
malformed quizzes. Warnings are a prompt to look. Then report the file path to
the learner, and name the two or three places where you filled a gap with your
own example so they can check your accuracy. Open the file if you can
(`start` / `open`), so the lesson is one click away.

### Phase 6 — Record what was learned

Write a learning record **only when understanding is demonstrated** — not for
material merely covered. Use `references/LEARNING-RECORD-FORMAT.md`. Also:

- **Promote glossary terms** the learner can now use correctly, with a tight
  definition and the aliases to avoid (`references/GLOSSARY-FORMAT.md`).
- **Update `RESOURCES.md`** with any new source found, and note gaps.
- **Update `NOTES.md`** with any stated preference ("I learn better from
  diagrams than from prose").

## The lesson engine

The pedagogy is Narrative Problem-Chaining: problem → naive attempt → breaking
point → one concept → physical analogy → demo → unintended consequence → repeat,
with the abstraction revealed last. Read `references/problem-chain.md` before
building a chain for an unfamiliar topic.

Mapping a beat onto the design system:

| Chain element | Design-system home |
|---|---|
| A beat (one problem, one concept) | One `<section class="block">` |
| Chapter number | `.section-label` — "Chapter 03 · The doors are open" |
| The problem | `.section-title`, plus `.section-sub` if needed |
| The naive attempt | Prose early in the section |
| The breaking point | Prose, closing on the new problem |
| The one concept | A sentence that names it plainly — "And this is where DNS comes in." |
| The physical analogy | A prose paragraph right after the concept is named, before syntax |
| The demo | `<pre><code>` for code and output; `.cmd` when the concept *is* a command |
| The shape of the idea | `figure.fig` wrapping an inline SVG — `references/figures.md` |
| The unintended consequence | Closes the section; the next section opens by restating it |
| The abstraction reveal | The final section — a table tying each concept to its general form |
| A term the reader needs | One plain sentence at first use, bolded — Rules §10 |
| A self-check | `.quiz` or `.recall` at the end of the beat |

When the medium cannot carry the design system — a chat reply, a ticket, plain
text — the chain is still the product. Render every beat in order as a short
prose block, keep the define-in-flow rule, and say which form you used and why.
The naive attempt and the unintended consequence are the two beats most tempting
to drop for space and the two that carry the teaching; never drop them.

## Rules

1. **One concept per beat.** Two new ideas in one section means the chain is
   wrong, not that the section needs to be longer.
2. **Every beat's problem arrives before its solution.** No definition, diagram,
   or syntax block before the problem that makes it necessary.
3. **Show the bad version before the good version.** The naive attempt must work
   well enough to feel reasonable before it breaks — never a strawman.
4. **Every abstract idea gets a physical analogy** whose shape actually matches.
   A half-fitting analogy teaches a wrong shape and must be replaced, not
   extended.
5. **Every claim gets a concrete instance** — real output, real numbers, real
   code. Constructed numbers are labelled as constructed.
6. **Stakes are concrete and consistent** — 2 million orders, 45 minutes a day.
   Pick a scale and hold it across the whole lesson.
7. **Reveal the abstraction last.** Concrete → abstract. A mental model handed
   over before the experience it summarizes does not stick.
8. **End with agency.** The learner closes the file feeling equipped, not like
   they survived a list.
9. **Accuracy is not negotiable.** Ground every claim in `RESOURCES.md` or
   verified docs. Never show output a real command would not produce. A gap
   costs the learner nothing; a confident falsehood costs their trust.
10. **Define in flow before you use, and bold what you define.** One plain
    sentence in the sentence that introduces the term. Expand every acronym in
    the same sentence with exactly one parenthetical — `<strong>DNS</strong>
    (Domain Name System) is ...` or `Domain Name System (<strong>DNS</strong>)
    is ...`, never both. The main topic needs its own inline `<strong>`
    definition at first use. **There is no vocabulary appendix** — a term
    defined away from its problem is trivia, and the workspace `GLOSSARY.md`
    (a record of what the learner already knows) is not a lesson glossary.
11. **Give a concept a diagram only when it has a shape.** One figure per
    section; a second means the section is two beats.
12. **Animation is courtesy, never cargo.** Gate it behind `.play` and
    `prefers-reduced-motion`; the finished state is the normal styling.
13. **Math equations live in code blocks**, not in `<p>` only — inline mention
    plus a copyable `<pre><code>` block.
14. **Every explanation is complete.** Every line of shown code is accounted
    for; every introduced term is used again; every figure's point is argued in
    prose first; no dangling "we will see later" without a payoff; every beat
    answers what it is, why now, what breaks without it, and what it leaves
    unsolved.
15. **Every lesson teaches retrieval.** At least one self-check, after the
    demonstration. A lesson the reader only re-reads builds fluency, not
    storage strength.

## When this is the wrong tool

Say so, and offer the alternative:

- **Pure reference material** — syntax guides, flag tables, cheat-sheets. There
  is no chain; write a `reference/` document instead.
- **Topics with no natural progression** — "here are 50 regex patterns" has no
  problem forcing pattern 37. Group by use case.
- **How-to guides for someone who already knows why.** They came to do a thing.
- **Verbatim recording** rather than constructed pedagogy.

## References

- `references/problem-chain.md` — the ten structural moves, the cognitive
  principles behind them, and a worked chain end to end.
- `references/clarity-pass.md` — the seven techniques for making drafted prose
  followable, the "what easy is not" traps, and the clarity checklist.
- `references/figures.md` — the diagram and animation recipe: CSS, play
  trigger, class vocabulary, layout conventions.
- `references/design-system.md` — the full component vocabulary (masthead, TOC,
  section, `.cmd`, callouts, tables, code, pills, deflist).
- `references/retrieval-practice.md` — fluency vs storage strength, the quiz and
  recall components, and how spacing works across sessions.
- `references/evaluation.md` — the audit checklist and the anti-patterns to
  hunt for, with the structural fix for each.
- `references/MISSION-FORMAT.md`, `LEARNING-RECORD-FORMAT.md`,
  `RESOURCES-FORMAT.md`, `GLOSSARY-FORMAT.md` — the workspace file formats.
- `evals/evals.json` — gradeable prompts (protagonist, concept inventory,
  reference chain, `must_pass` / `must_not`) for regression-testing this skill.

## Scripts

- `scripts/scaffold.py` — emits the HTML shell with CSS inlined and the quiz
  interactivity wired. Run once, then write the body by hand.
- `scripts/validate.py` — checks the finished file's invariants (ids, anchors,
  numbering, self-containment). Run before delivering.
- `scripts/check_figures.py` — checks figure markup, animation wiring, canvas
  width, and label geometry.
- `scripts/check_definitions.py` — checks definition discipline, including bare
  acronyms with no expansion.
- `scripts/check_practice.py` — checks quizzes and recall prompts: option
  parity, the single-correct rule, and the answer reveals.
- `scripts/check_library.py` — runs all of the above across the whole `lessons/`
  directory and reports design-system drift between lessons.
