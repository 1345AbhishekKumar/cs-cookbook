# Evaluating a lesson

Two ways to use this file:

- **Auditing your own draft** in Phase 3, before you show it to anyone.
- **Critiquing existing material** when the user hands over a lesson, a talk, or notes and asks what's wrong with it.
- **Grading a run of the evals** in `evals/evals.json`, whose `must_pass` and `must_not` lists are written against the checks below. See *Running the evals*.

The checklist is deliberately ordered. A failure early in the list usually explains several failures later: if the protagonist is missing, the stakes are probably abstract too, and the ordering is probably tied to a syllabus rather than a chain. Work top to bottom and fix the first failure before judging the rest.

---

## The ten checks

### 1. Protagonist check
Can you name the person this lesson is for, and the job they are trying to do? Not the audience — the protagonist. "Backend engineers" fails; "a backend engineer whose AI features need database access" passes.

*If it fails:* the lesson has no place to put stakes or consequences, so fix this first, then redo the chain. Everything downstream depends on it.

### 2. Motivation check
For every concept, is there a specific problem stated immediately before it? Take each concept in turn and ask "what forced this?" If the answer is "it's the next thing in the list", the chain is broken there.

*If it fails:* write the problem before the concept. If you can't write a plausible one, the concept is probably not needed at this point — move it to an appendix, or cut it.

### 3. Chain check
Does each solution create the next problem? Read only the last paragraph of each section and the first paragraph of the next, in sequence. If the joints don't connect without an explicit transition sentence ("now let's look at…"), the chain is a list wearing a story's clothes.

*If it fails:* find the missing intermediate problem rather than writing a smoother transition. If the concepts genuinely don't chain, this is two lessons — split at the break and tell the user why.

### 4. Analogy check
Does every abstract concept have a physical analogy, and does the analogy actually have the same shape? Check the mapping holds for the *whole* concept, not just its first sentence.

*If it fails:* replace the analogy rather than extend it. A wrong analogy is worse than none, because it teaches a wrong shape that later material has to unteach.

### 5. Stakes check
Are the numbers concrete and consistent? Scan every quantity in the document: order counts, response times, server counts, dollar figures. They should describe one coherent operation at one scale, and each should be doing work — showing why the naive approach breaks.

*If it fails:* pick a scale at the start of the lesson and hold it. Replace "at scale" and "many users" with numbers that could be true.

### 6. Order check
Is the abstraction revealed last, after the concrete experience? Look for a definition or a taxonomy in the opening section — that is the smell. So is a chapter that lists options before the learner has needed any of them.

*If it fails:* cut the abstraction, keep it in a scratch note, and re-place it as the closing section once the concrete beats are built.

### 7. One-at-a-time check
Is there exactly one new concept per section? Count the concepts in each beat. More than one means the section is doing two jobs.

*If it fails:* split the beat. If the second concept can't wait, you're missing the intermediate problem — go back to the chain and insert a row.

### 8. Demo check
Does each concept get shown working, not just described? Look for actual output, actual code, actual numbers — something the learner could run or verify.

*If it fails:* add the demonstration. If you can't demonstrate it, you don't yet understand it well enough to teach it; research it before writing.

### 9. Transition check
Are the breaking points present and obvious? Grep your draft for the turn: every section but the last should contain one moment where the previous fix stops being enough.

*If it fails:* make the failure mechanical and specific. Vague failure is the most common way a lesson loses its engine.

### 10. Agency check
Does the end leave the learner equipped? The last thing they read should be a mental model they now hold plus a clear sense of what they can do next — not a summary of everything they might still not know.

*If it fails:* end on the reveal, and move any remaining caveats or advanced material into a "where to go next" list.

---

## Checks for the visual and verbal layer

The ten above decide whether the chain holds. These four decide whether the page is readable when it does — and they fail independently, so a lesson can pass all ten and still be unusable. Check 15 decides whether the explanations are finished — a lesson can chain cleanly, read smoothly, and still leave holes.

For the prose itself, run `references/clarity-pass.md` first: it covers the sentence-level fixes (lead with the point, split stacked clauses, name the invisible referent, label constructed numbers) that these checks assume already done.

### 11. Diagram check
Does every section that has a shape have a figure — a topology, a sequence in time, a before-and-after, a repeating mechanism? And is every figure load-bearing, meaning the reader would be slower without it?

*If it fails:* draw the missing one from the vocabulary in `references/figures.md`, or delete the one that just restates the paragraph above it. `scripts/check_figures.py` settles the mechanical half: captions, aria-labels, labels escaping the canvas.

### 12. Definition check
Take every term the lesson uses — sharding, quorum, consensus, replication lag, failover — and find the sentence where it is first defined. If there isn't one, the reader is expected to arrive knowing it, which is the single most common way a lesson loses someone. For acronyms and initialisms — DNS, HTTP, IP, TCP, ReLU, RNN — the definition must also expand the letters in the same sentence: `<strong>DNS</strong> (Domain Name System) is ...`. A functional gloss without the expansion fails this check.

*If it fails:* add the one plain sentence at first use, in the narrative, with the parenthetical expansion for acronyms. The rule and its reasoning live in one place — the define-in-flow rule in SKILL.md — so a fix here is an edit there, not a new glossary. `scripts/check_definitions.py` catches the mechanical half (missing gloss, bare acronym with no `(...)` in the same paragraph); run it before delivering.

### 13. Emphasis check
Is the bold marking definitions, or is it scattered across every paragraph? Bold is a signal that says *this is the term*; applied evenly it says nothing at all.

*If it fails:* keep the bold where a term is introduced and drop the rest. As a rough budget, one bolded phrase per paragraph, and never two in a sentence.

### 14. Animation check
Does the motion actually run — is there something adding the class the animation rules are waiting for — and does the figure still make sense if it doesn't? Motion is a courtesy to readers who get it; it is never the thing carrying the meaning.

*If it fails:* wire up the trigger, move whatever the animation was teaching into the static layout or the caption, and confirm the reduced-motion path shows the finished diagram rather than a half-drawn one.

### 15. Completeness check
Read the draft as a skeptic hunting for holes, not as the author who knows what was meant. For every code block, confirm each flag, option, and value is explained in the surrounding prose or deleted. For every bolded term, confirm it is used again after its definition. For every figure, confirm its takeaway is argued in prose, not only captioned. For every "later" or "we will see", confirm the payoff exists.

*If it fails:* the fix is local — add the missing sentence, work the term into the demo, argue the point in prose, or cut the unexplained line. A completeness failure is never fixed by adding a new section; it is fixed by finishing the one that is there.

---

## Anti-patterns

Each of these is a symptom, and next to it the structural fix. Patching the prose will not help — the problem is upstream in the chain.

| Anti-pattern | What it looks like | The fix |
|---|---|---|
| **Encyclopedic listing** | "There are five types of X: A, B, C, D, E" | Find the problem that forces the first one, teach it, let it break, continue |
| **Definition first** | "X is defined as…" as an opening | Show the thing failing to work without X, then name X |
| **Arbitrary ordering** | "Now that you understand X, let's look at Y" | Reorder to the problem chain; if Y truly needs no X, they are separate lessons |
| **Justification after the fact** | "It's important to understand X because…" | Delete; the problem before it is the justification |
| **Topic-driven framing** | "Let's learn about X" | "You are a [role] and you need to [goal]" |
| **Option listing** | "There are three approaches to X: the pros are…" | Teach one; let it break; the next option arrives as a fix |
| **Diagram before experience** | An architecture diagram in section one | Move it to the point where the learner has felt each box's purpose |
| **Fake stakes** | "Imagine you have a billion users" with no consequence | Numbers that change a decision — a timeout, a bill, a lost job |
| **Unexplained jargon** | "sharding", "quorum", "consensus" used as if the reader arrived knowing them | One plain sentence at first use, in context |
| **Bare acronym** | `DNS`, `HTTP`, `ReLU` used with a functional gloss but no expansion ("DNS is a naming system") | `<strong>DNS</strong> (Domain Name System) is ...` on first use, same sentence |
| **Wall of bold** | Every other sentence carries a bolded phrase | Bold where a term is defined, once per paragraph, never twice in a sentence |
| **Decorative diagram** | A figure restating the paragraph directly above it | Delete it, or drop the paragraph and let the caption carry the point |
| **Inert animation** | Animation rules that nothing ever triggers, or a figure whose meaning only arrives mid-motion | Wire up the trigger, and make the finished state the readable one |
| **Diagram as the argument** | The caption makes the point the prose never made | Say it in prose first; the figure repeats it faster |
| **Unexplained code** | A flag, option, or value in a code block the prose never mentions | Explain the line in place, or delete it |
| **Dangling promise** | "We will see why later" with no later payoff | Pay it off in those words in the promised beat, or cut the promise |

## Correct patterns

- "We had a problem. Here's how we solved it. That created a new problem. Here's how we solved that."
- "Let's say you are a [role] and you need to [goal] with [concrete constraint]."
- "But wait — if X works that way, how does Y work?"
- "Think of it like a [familiar physical object]."
- "So you start building. [naive attempt]. But then… [breaking point]."
- "And this is where [concept] comes in."
- "The tools change. The concepts never do."

---

## Grading a lesson

When the user asks whether a lesson works, don't answer with taste — answer per check. For each of the ten, plus the four for the visual and verbal layer, plus the completeness check, give a one-line verdict and cite the passage that decided it, so the user can see the reasoning and disagree with it. Then name the single highest-leverage fix: the earliest failing check, since it usually repairs the later ones for free.

Report honestly. A lesson can be accurate and well-designed and still be the wrong choice for the audience the user has in mind — say that too, rather than improving something that shouldn't exist.

---

## Running the evals

`evals/evals.json` holds three prompts on unrelated topics. Each carries a protagonist with stakes, a concept inventory, and a problem chain — then the two things that make it gradeable: `must_pass`, the assertions a lesson built from that prompt has to satisfy, and `must_not`, the anti-patterns it must avoid. Both lists are derived from the checks above, so a failing assertion points at the check that caught it.

A run is scored, not admired:

1. **Build the lesson** from the eval's `prompt`, `protagonist`, and `concept_inventory` alone. Do not read the eval's `problem_chain` while writing; it is the reference answer, and using it turns the eval into a transcription test.
2. **Grade each `must_pass` assertion separately.** For each one, cite the passage that decided it — a quoted sentence plus its section title. An assertion you cannot cite a passage for is a failure, not a pass.
3. **Grade the `must_not` list.** Any one of them present is a failure of the whole run; they are the anti-patterns, and they are the reason this list exists.
4. **Compare the chain to the reference.** Read the lesson's own last-paragraph/first-paragraph joints in sequence, as check 3 does. The order does not have to match the reference beat for beat — a better intermediate problem is a good sign, not a defect — but every joint has to hold without a transition sentence, and the lesson has to land on the eval's `abstraction_reveal` in substance.
5. **Report the earliest failing check**, not the total count, for the reason given at the top of this file.

A run passes when every `must_pass` assertion cites a passage, no `must_not` appears, and every joint holds. Record the pass rate, not a grade out of ten: with three evals, a rubric with decimals is false precision.

Two things to hold onto when a run fails:

- **Fix the skill, not the eval.** A failed assertion is either a real gap in SKILL.md or a genuine disagreement about the technique. Decide which before editing, and if it is the second, change the technique deliberately and update all three evals with it.
- **The evals test the technique, not topic knowledge.** If a lesson only passes because it happens to know drones or Transformers, the chain collapsed into research and the technique did not do the work. A healthy run looks the same on all three topics.
