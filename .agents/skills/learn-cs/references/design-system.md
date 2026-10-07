# Design System — Component Vocabulary

Every component in the lesson template, with the exact HTML and a note on when to use it.

Do not invent new components. If a situation isn't covered here, use the closest existing pattern. Consistency is the entire point of the design system.

---

## Masthead

The editorial header at the top of the document. Set once.

```html
<header class="masthead">
  <div class="masthead-inner">
    <div class="kicker">Reference Manual</div>
    <h1 class="title">The 50 Most Popular <em>Linux Commands</em></h1>
    <p class="lede">A complete, beginner-friendly lesson on Linux command essentials.</p>
    <div class="meta-row">
      <span>Linux</span>
      <span>macOS</span>
      <span>Windows via WSL</span>
      <span>Beginner → Intermediate</span>
    </div>
  </div>
</header>
```

- `<em>` in the title colors that phrase in the accent color. Use it once, on the most distinctive noun.
- `.kicker` is a small uppercase label. Default is "Lecture Notes". Change to "Workshop Guide", "Study Notes", etc. based on the topic.
- `.meta-row` holds 2–4 short metadata items (e.g. platform, level, topic), not invented.

---

## Sidebar TOC

Two things to fill in: the filter input (already present in the scaffold) and the groups.

```html
<aside class="toc">
  <input type="text" id="filter" class="toc-filter" placeholder="filter…" autocomplete="off">

  <div class="toc-group">
    <div class="toc-group-title">Foundations</div>
    <a href="#why">Why Learn the Terminal</a>
    <a href="#history">A Brief History</a>
  </div>

  <div class="toc-group">
    <div class="toc-group-title">Navigation &amp; Files</div>
    <a href="#whoami"><span class="n">01</span>whoami</a>
    <a href="#man"><span class="n">02</span>man</a>
    <!-- ... -->
  </div>
</aside>
```

Rules:
- **Prose sections** get a plain link (no `.n` span).
- **Numbered items** (commands, steps) get a `<span class="n">01</span>` prefix.
- **Numbering is continuous across the whole document**, not per group.
- The `.toc-group-title` is uppercase mono, one line, and matches the section headings in the body.
- **Every anchor resolves to exactly one element.** Put the `id` where you want the reader to land:
  - A section holding several `.cmd` blocks → give each `.cmd` its own `id` and point the TOC entries at the `.cmd`s.
  - A section holding one command, or a prose section → put the `id` on the `<section class="block">` and leave the inner `.cmd` without one.

  Never put the same `id` on both. The document would carry a duplicate id, and the browser would jump to whichever one came first rather than the heading you meant.

---

## Section

The top-level content container. Wrap every thematic group in one.

```html
<section class="block" id="navigation">
  <div class="section-head">
    <span class="section-label">Part 01 · Commands 01 – 13</span>
    <h2 class="section-title">Navigation &amp; Files</h2>
    <p class="section-sub">If you're a complete beginner, work through this section in order.</p>
  </div>

  <!-- command blocks or prose go here -->
</section>
```

- `.section-label` is optional; use it when the section is part of a numbered sequence ("Part 03") or has a range ("Commands 20 – 25").
- Give the section an `id` whenever the TOC entry points at the section rather than at a `.cmd` inside it. See the id rule under **Sidebar TOC** — an anchor belongs on the section or on the command, never on both.
- Ends with `</section>`. No exceptions.

---

## Command block

The workhorse. One command per block.

```html
<div class="cmd" id="ls">
  <span class="cmd-num">05</span>
  <h3 class="cmd-name">ls<span class="dash">—</span>List directory contents</h3>
  <p class="cmd-tagline">Lists what's inside a folder.</p>
  <span class="syntax">ls [options] [path]</span>

  <p>In a GUI you just see the contents; in a terminal you have to ask.</p>

  <pre><code><span class="c">$</span> ls
<span class="c">$</span> ls wildlife
<span class="c">$</span> ls -la</code></pre>

  <h4>Essential options</h4>
  <table>
    <thead><tr><th>Option</th><th>Meaning</th></tr></thead>
    <tbody>
      <tr><td><code>-l</code></td><td>Long listing format</td></tr>
      <tr><td><code>-a</code></td><td>Include hidden files</td></tr>
    </tbody>
  </table>
</div>
```

Anatomy:
- `.cmd-num` — sequential, zero-padded, whole document.
- `.cmd-name` — command name in mono, then `<span class="dash">—</span>`, then a short Title Case description.
- `.cmd-tagline` — one italic-serif sentence. What it does. Not a full paragraph.
- `.syntax` — the signature form. Shows optional parts in `[ ]`. Uses `→` as a pseudo-element, don't type it.
- Then: prose, `<pre>` blocks, `<h4>` subheads, `<table>`s, and at most one callout.
- Give the `.cmd` an `id` when the TOC links to that individual command — which is the usual layout when one section carries several commands. When the entry points at its section instead, leave the `.cmd` bare. See the id rule under **Sidebar TOC**.

---

## Callouts

Three kinds. All use the same markup with a different class.

```html
<div class="note">
  <p>While viewing a man page you cannot type commands. Press <kbd>q</kbd> to exit.</p>
</div>

<div class="tip">
  <p><kbd>Ctrl</kbd>+<kbd>L</kbd> does the same thing as <code>clear</code> and is much faster.</p>
</div>

<div class="warn">
  <p><code>rm</code> does not move files to a recycle bin. They are gone immediately.</p>
</div>
```

The label ("Note", "Tip", "Warning") is injected by CSS via `::before`. Do not type it.

Rules:
- At most one callout per `.cmd` block.
- At most three callouts per section.
- Only use a callout when there is a real gotcha, genuine shortcut, or destructive command. Do not fabricate.

---

## Table

For options, comparisons, key bindings, terminology.

```html
<table>
  <thead>
    <tr><th>Flag</th><th>Meaning</th></tr>
  </thead>
  <tbody>
    <tr><td><code>-l</code></td><td>Long listing format</td></tr>
    <tr><td><code>-a</code></td><td>Include hidden files</td></tr>
  </tbody>
</table>
```

- First column is styled `white-space: nowrap`. Put short tokens there (flags, keys, symbols), not sentences.
- Use `<code>` for command names, flags, and file paths inside cells.

---

## Code block

Any terminal output, script, or literal text.

```html
<pre><code><span class="c">$</span> ls -la
<span class="p">total 24
drwxr-xr-x  4 colt colt 4096 Oct 15 13:48 .</span></code></pre>
```

- `<span class="c">$</span>` — the shell prompt marker (colored gray, italic).
- `<span class="c"># comment</span>` — an inline comment.
- `<span class="p">output</span>` — command output (colored green).
- Unmarked text is treated as code/input.

Rule: one `<pre>` block per logical example. Do not mix unrelated commands into one block.

Math equations must live in code blocks, not in `<p>` only. Inline mention + code block copy. Name the equation in prose, then repeat it in its own block starting with a `# math:` comment:
```html
<pre><code><span class="c"># math: derivative definition</span>
f'(t) = lim(h -&gt; 0) (f(t+h) - f(t)) / h</code></pre>
```

---

## Pill row

For a horizontal strip of key bindings, related commands, or short tags.

```html
<div class="pill-row">
  <span class="pill">Space — page down</span>
  <span class="pill">b — page up</span>
  <span class="pill">q — quit</span>
</div>
```

Use when the items are peer tokens and a table would be overkill.

---

## Definition list

For compact key-value pairs or property descriptions when a table is too heavy. A `deflist` is an in-flow component: it belongs inside the beat that needs it, never collected into a glossary at the end (`SKILL.md`, Rules §10).

```html
<dl class="deflist">
  <dt>Kernel</dt>
  <dd>The core of the OS. Sits between hardware and software.</dd>
  <dt>Shell</dt>
  <dd>The program that takes your commands and hands them to the OS.</dd>
</dl>
```

Use sparingly. For 3+ items, a table is usually better.

---

## Blockquote / pull quote

Not part of the system. Do not use. Incorporate memorable insights as a callout or as regular prose.

---

## Color and spacing reference

The full palette is defined in `assets/lesson.css` under `:root`. Do not redefine colors inline — always use `var(--token)` if a one-off style is unavoidable (which it usually isn't).

- Accent (`--accent`) is used **only** for: the kicker label, `<em>` inside the title, section labels, the `.cmd-num`, the `.syntax::before` arrow, and link hover. Never as a background fill except in `.cmd-num`.
- Background (`--bg`) is a warm off-white, not pure white. Paper (`--paper`) is used only for the "back to top" button.
- Rules (`--rule`, `--rule-2`) are hairline separators. Never use `<hr>` — the section and cmd blocks already carry rules via `border-top` / `border-bottom`.
- Code background is dark. Code is the only dark element in the design. This is intentional: it makes examples jump off the page.
