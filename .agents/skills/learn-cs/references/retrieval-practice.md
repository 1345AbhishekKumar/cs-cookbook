# Retrieval Practice — making the lesson stick

The Narrative Problem-Chain decides *what* the lesson teaches and in what order.
This file covers the part that decides whether the reader can still use it next
week. It is the bridge between the two halves of `learn-cs`: the `teach`
workspace believes storage strength is the goal, and this is where that belief
becomes concrete markup in an otherwise static lesson.

A beautiful lesson that the reader only *reads* produces fluency — the warm
feeling of understanding while the words are in front of them. Storage strength
(the ability to produce the idea from memory, weeks later) needs the reader to
retrieve, not re-read. One self-check near the end of a section does more for
retention than three extra paragraphs of explanation.

---

## The three mechanisms

| Mechanism | What it is | How this skill honors it |
|---|---|---|
| **Retrieval practice** | Pulling an answer out of memory, rather than recognizing it | A `.quiz` or `.recall` at the end of a beat, before the next problem |
| **Spacing** | Revisiting material after a delay, not in one block | Each lesson opens by re-testing the *previous* lesson's key term; learning records schedule the return |
| **Interleaving** | Mixing related-but-different problems in one practice set | Applied across lessons and exercises, not inside a single beat — a lesson still teaches one concept |

---

## The quiz component

A multiple-choice self-check with immediate, in-page feedback. It degrades to a
native `<details>` reveal, so it works with JavaScript off and still prints.

```html
<div class="quiz">
  <div class="quiz-kicker">Check yourself</div>
  <p class="quiz-q">Which layer chooses the route a packet takes between networks?</p>
  <ul class="quiz-opts">
    <li data-correct="false">The transport layer, which carries ports</li>
    <li data-correct="true">The network layer, which carries routes</li>
    <li data-correct="false">The link layer, which carries frames</li>
  </ul>
  <details class="quiz-answer">
    <summary>Reveal answer</summary>
    <p>The <strong>network layer</strong> picks the path; the transport layer only
    distinguishes the applications sharing that path.</p>
  </details>
</div>
```

The rules that make a quiz teach instead of test:

- **Equal-length options.** Every option carries the same number of words, and
  ideally the same number of characters. If one option is visibly longer or
  better-formed, the reader guesses by shape and never retrieves. This is the
  one rule enforced as an *error* by `scripts/check_practice.py`; ragged
  character counts are a warning.
- **Exactly one correct option** (`data-correct="true"`). The script fails the
  lesson on zero or on two.
- **Options are complete thoughts, not fragments.** Three words minimum. "Routes
  it" as an option next to a full sentence tells the reader which one is filler.
- **The answer reveal explains why**, in one sentence, and links back to the
  beat. A reveal that only says "B" teaches nothing.
- **Place it at the end of a beat**, after the concept has been demonstrated and
  before the next problem opens. The reader retrieves what they just built.

## The recall component

A free-response prompt with the answer hidden behind a native disclosure. Use
this when the thing to retrieve is a definition or a "why", not a one-of-three
choice — free recall is harder than recognition and builds more storage.

```html
<details class="recall">
  <summary>From memory: what problem does a port solve that an IP address does not?</summary>
  <p>A port separates the applications sharing one host, so the network can hand
  a packet to the right process rather than just the right machine.</p>
</details>
```

Use `.recall` sparingly. One per beat at most, and only where the idea is worth
reconstructing from scratch. A page of recall prompts is a workbook, not a
lesson.

## Where they go in a lesson

- **At least one retrieval element per lesson.** The library-level check warns
  when a lesson has none.
- **One self-check per beat is the ceiling.** More than that and the lesson
  becomes an exercise set; the chain stops carrying the reader forward.
- **Never before the demonstration.** The reader retrieves only after the beat
  has shown the concept working — a quiz on an idea that has not been earned is
  just a guess.
- **The final section's self-check** should prompt the *abstraction*, not a
  fact: "In your own words, what do all five fixes have in common?"

## Spacing across sessions

Spacing is a workspace-level concern, not a markup one:

1. When a lesson is finished, write a learning record (see
   `LEARNING-RECORD-FORMAT.md`) naming the two or three things the reader should
   still be able to retrieve.
2. The next lesson opens with a short `.recall` or `.quiz` on the *previous*
   lesson's key term before introducing anything new. That retrieval-after-delay
   is the spacing effect, and it costs nothing because it doubles as a warm-up.
3. When a concept is revisited at a genuinely new depth, note it in the learning
   record so the curriculum does not re-teach the same altitude.

---

## Verification

Run `scripts/check_practice.py` before delivering, and again after editing any
quiz or recall block. It checks option parity, the single-correct rule, the
answer reveals, and the no-retrieval-element warning. `scripts/check_library.py`
runs it across the whole `lessons/` directory alongside the other checks.
