# Narrative Problem-Chaining — the ten moves

The structure behind the lessons in `lessons/`, described from the sources they were built from. Every move below earned its place across lessons on unrelated topics, which is the point: the technique is topic-independent.

Use this file when you are building a chain for a topic you have not taught before, or when a draft feels flat and you want to find which move is missing.

---

## Move 1 — The role assignment

**"Let's say you are a backend engineer…"** / **"Meet TravelBuddy, our imaginary travel booking site…"**

The learner steps into a professional identity with a job to do. This is not the same as naming the audience. A topic is a thing to memorize; a role is a position to act from, with responsibilities and consequences. "You are a DevOps engineer who reads these logs every morning" tells the learner what they will care about for the next twenty minutes.

Signals: *Let's say you are…*, *Meet X…*, *You've just joined a team that…*

## Move 2 — The concrete goal, with real stakes

**"2 million orders"** / **"500,000 products"** / **"30 to 45 minutes, almost daily"**

Not "n" and not "at scale". The numbers do emotional work: they make the problem feel like it belongs to someone with a job. Keep the numbers consistent across the whole lesson — a project that has 2 million orders in chapter one and 200 in chapter four teaches the learner that the examples are decorative.

Signals: specific counts, specific durations, specific money, specific blast radius ("if a hacker breaks in, they get everything").

## Move 3 — The naive attempt

**Show what the learner would actually do first.**

Write the obvious solution, honestly, and let it work — at least for a moment. This does three things: it validates the learner's intuition ("you were not wrong, you were missing information"), it proves the concept is not obvious, and it earns the contrast that makes the real solution feel valuable. A strawman does none of these; if the naive attempt is something no competent person would try, the learner learns nothing from watching it fail.

Signals: *So you start building…*, *The obvious thing to do is…*, *At first this works…*

## Move 4 — The breaking point

**"But then we hit our first problem…"** / **"But wait a minute…"**

The naive attempt fails in a specific, concrete way: a delay, a crash, an open door, an integration that has to be rewritten for every new client. This is the curiosity gap — the learner now *wants* the solution rather than being handed it.

Make the failure mechanical, not vague. "It doesn't scale" is a shrug; "every new AI client means rewriting all six integrations, and now there are eleven clients" is a problem with a shape.

Signals: *But then…*, *But hold on…*, *That's when it stopped working…*

## Move 5 — The minimal fix, one concept only

**The minimum viable solution to *this specific* problem.** Not a toolkit, not "here are five options", not the full feature set. One thing, arriving like a tool handed over at the moment it's needed.

Signals: *And this is where DNS comes in.*, *So this is exactly what MCP is for.*, *This is where variables come in.*

## Move 6 — The physical analogy anchor

**"Think of it like a house address for mail delivery."** / **"Think of it like apartment numbers inside a building."**

Every abstract concept gets an everyday physical anchor. This is not decoration — it is the mechanism that makes the concept stick, because the learner files it against a schema they already own.

Two requirements: pick a schema with the *same shape* as the concept, and map the parts explicitly. If the analogy has to be apologized for ("it's not exactly like a restaurant, but…"), it is the wrong analogy. The best ones extend: IP as street address, ports as apartment numbers, DNS as the phone book that maps the name to the address.

Signals: *Think of it like…*, *Imagine a…*, *It's the same idea as…*

## Move 7 — The demonstration

**Show it working before explaining it fully.**

Real output, real code, real result. The learner should see the concept succeed — "and now customers can find our server. Good." — while still holding only a rough intuition of how. Understanding deepens on the second pass, and the second pass is much easier once the learner has seen the thing work.

Signals: *And there you go.*, *So now X works.* — followed by the actual output.

## Move 8 — The unintended consequence

**"But here's the next problem."**

The fix creates a new limitation. This is the engine: it is what turns a lecture into a story, and it is entirely why the chain can continue without the learner ever being told "now let's move on to the next topic."

The consequence should be a real property of the solution, not an invented penalty. DNS solves naming; DNS now means anyone can point a name at your server. Separate rooms solve sharing; separate rooms mean the doors need locks.

Signals: *But here's the next problem.*, *That solved one thing and created another.*

## Move 9 — The loop

Repeat moves 4–8. Each solution becomes the next problem. The learner is pulled forward by curiosity instead of pushed by a syllabus. This is the whole trick, and it is why the concept order in the finished lesson is almost never the order you wrote in your inventory — it is the order the problems demand.

## Move 10 — The abstraction reveal, last

**"The tools change. The concepts never do."**

Only after all the concrete experience does the lesson reveal the mental model — usually one paragraph and a table that maps each concept to its general form. The learner has earned the abstraction by living through the examples, so it compresses experience they already have instead of replacing experience they don't.

This is also where the lesson's scope is confirmed: "whether you're on physical servers, containers, or Kubernetes pods, these principles hold." Then hand over agency — *you now have the fundamentals to build on this* — and stop. A lesson that keeps going after the reveal dilutes it.

---

## Why it works

| Principle | Where the technique uses it |
|---|---|
| **Curiosity gap** | Every "but here's the problem" opens an itch the learner wants scratched |
| **Just-in-time learning** | Concepts arrive when needed; retention is higher when the brain is already reaching for the answer |
| **Concrete before abstract** | New ideas anchor to physical schemas the learner already owns |
| **Narrative transportation** | A story engages more than an exposition; the learner lives the lesson instead of skimming it |
| **Progressive disclosure** | One concept at a time, so working memory never holds more than a couple of items |
| **Desirable difficulty** | Feeling the pain of the naive approach is what makes the solution feel valuable rather than arbitrary |
| **Role-based identity** | "You are a DevOps engineer" engages the practitioner instead of the student |
| **Emotional beats** | The moment something clicks is the memory anchor |

---

## A worked chain, end to end

Compact enough to see the whole spine at once. Topic: *why background jobs exist*. Protagonist: a developer at a photo-sharing app with 40,000 uploads a day.

| # | Concept | Problem that forces it | Naive attempt | Breaking point | Analogy | Demo | Consequence → next problem |
|---|---|---|---|---|---|---|---|
| 1 | HTTP request lifecycle | Users upload photos and nothing happens | Handle upload and resize in the request handler | A 12 MP resize takes 8 seconds; the browser times out at 30s under load and users retry, doubling work | A restaurant where the waiter cooks the meal before taking the next order | Request log showing 30s+ responses and 504s | The work must happen outside the request — but where? |
| 2 | A job queue | Slow work inside a request breaks the request | "Just do it in a background thread" | In-process threads die with the process; a deploy during a burst loses 4,000 jobs silently | A ticket rail in a kitchen: orders wait in line, cooks take them when free | Deploy during peak → jobs vanish, no error anywhere | The work now outlives the process, so someone must be able to re-run it |
| 3 | Idempotency | A job that fails must be retried | Retry the job | Retries re-resize the same photo and send a duplicate notification email | Delivering mail twice to the same address | Duplicate emails in the log after a network blip | Retries are safe only if the work can be repeated — which needs a key |
| 4 | Job status as state | Nothing knows whether a job succeeded, failed, or is stuck | Watch the queue dashboard | Failures are only discovered when a user complains | A hospital board listing which patients are still waiting | Dashboard with no failure view; support ticket | State has to be queryable, which is a schema decision |
| 5 | Dead-letter queues | Permanently failing jobs retry forever | Let retries run | A poisoned job retries for 3 days, 900,000 times, and starves real work | A return-to-sender bin for undeliverable mail | Retry counter at 900k, queue depth climbing | Failures must be set aside — and someone must look at them |

Read the last column straight down: it is the lesson. The abstraction reveal for this chain would be the general rule that *any work that can outlive a request must be defined by its state, not by its call stack* — and the learner is ready for it only after row 5.

Nothing in that table is spelled out in the finished lesson as a table. It is scaffolding for the author. The reader gets the story.

---

## Signals checklist

Before rendering, scan your chain for the phrases that mark each move. A move whose signal phrase you cannot write is a move you have not actually designed:

- [ ] "Let's say you're a …" — role
- [ ] "…which costs 45 minutes a day" — concrete stakes
- [ ] "So you start building…" — naive attempt
- [ ] "But then…" — breaking point
- [ ] "And this is where X comes in." — minimal fix
- [ ] "Think of it like a …" — physical analogy
- [ ] "There you go — it works." — demonstration
- [ ] "But here's the next problem." — unintended consequence
- [ ] "The tools change. The concepts never do." — abstraction reveal
- [ ] "You now have the fundamentals." — agency
