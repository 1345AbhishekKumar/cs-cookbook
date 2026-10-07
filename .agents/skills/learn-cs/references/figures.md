# Figures — diagrams, and the animation on top of them

A lesson about systems has shapes in it: a topology, a sequence in time, a before-and-after, a trade-off between two costs. Prose describes those shapes badly — a reader has to hold five nouns in their head and wire them together. One diagram does it in a glance.

This file is the complete recipe: the CSS, the play trigger, the class vocabulary, and the authoring rules. It is the one sanctioned extension to the design system (see the note at the end), and the vocabulary below is shared with the other lessons in `lessons/data_internals/`, so figures look the same across the library.

## Which beats want a figure

Not every section. A figure earns its place when the idea has a shape that prose flattens:

| The beat contains | The figure |
|---|---|
| A topology — clients, servers, replicas, shards | Boxes and labeled edges |
| A sequence in time — a write, then a lag, then a stale read | Stacked steps with labeled gaps between them |
| A mechanism repeating — a heartbeat every 5 s, a round of gossip | One diagram with motion (`flow`) on the repeating path |
| A before-and-after — one node, then three | Two panels in one figure, or one figure with the change marked `pulse` |
| A failure case — who kept their opinion, who disagreed | The same topology with the divergent paths colored differently |
| A trade-off between costs | A comparison table, not a figure |

The rule of thumb: if you cannot say in one sentence what the reader should conclude, you do not have a figure yet. And if the prose already made the point in two lines, the figure is decoration — delete it.

**At most one figure per section.** Two figures in a section means the section is two beats. `scripts/check_figures.py` warns and names the section, because a long chapter showing a before and an after is the legitimate exception.

## The CSS

Append this to the lesson's existing `<style>` block, immediately before `</style>`. Do not create a second style tag, and do not inline colors anywhere in the document body — this block is the only place figure colors are defined.

```css
/* ============================================================
   Figures & diagrams — lesson-local addition
   Inline SVG only: no markers, no <use>, no external references.
   Every animation is gated behind .fig.play so that reduced-motion
   users and JavaScript-off readers see the finished diagram.
   ============================================================ */
.fig{ margin:26px 0 30px; padding:20px 20px 14px; background:var(--paper); border:1px solid var(--rule); border-radius:3px; overflow-x:auto; -webkit-overflow-scrolling:touch; }
.fig svg{ display:block; width:100%; min-width:560px; height:auto; }
.fig::-webkit-scrollbar{ height:6px; }
.fig::-webkit-scrollbar-thumb{ background:#3a3d44; border-radius:3px; opacity:0.5; }
@media print{ .fig{ overflow:visible; break-inside:avoid; } .fig svg{ min-width:0; } }
.fig figcaption{ margin-top:14px; padding-top:12px; border-top:1px solid var(--rule-2); font-family:var(--mono); font-size:0.7rem; letter-spacing:0.03em; line-height:1.75; color:var(--ink-3); }
.fig figcaption b{ color:var(--ink-2); font-weight:600; }
.fig text{ font-family:var(--mono); font-size:11px; fill:var(--ink-2); }
.fig .sm{ font-size:9.5px; }
.fig .xs{ font-size:8.5px; }
.fig .lbl{ font-size:8.5px; letter-spacing:0.12em; fill:var(--ink-3); }
.fig .ctr{ text-anchor:middle; }
.fig .mono-b{ font-weight:600; }
.fig .box{ fill:var(--paper); stroke:var(--rule); stroke-width:1; }
.fig .box2{ fill:#f4f1ea; stroke:var(--rule); stroke-width:1; }
.fig .dim{ fill:#faf8f3; stroke:var(--ink-4); stroke-width:1; }
.fig .accbox{ fill:#fbf1ee; stroke:#a03a2e; stroke-width:1.2; }
.fig .okbox{ fill:#eff5f0; stroke:#3f6b4a; stroke-width:1.2; }
.fig .acc{ stroke:#a03a2e; }
.fig .accf{ fill:#a03a2e; }
.fig .ok{ stroke:#3f6b4a; }
.fig .okf{ fill:#3f6b4a; }
.fig .edge{ stroke:var(--ink-4); stroke-width:1.1; fill:none; }
.fig .edgeA{ stroke:#a03a2e; stroke-width:1.4; fill:none; }
.fig .edgeO{ stroke:#3f6b4a; stroke-width:1.4; fill:none; }
.fig .dash{ stroke:var(--ink-4); stroke-width:1; fill:none; stroke-dasharray:5 4; }
.fig .dashA{ stroke:#a03a2e; stroke-width:1.2; fill:none; stroke-dasharray:5 4; }
.fig .head{ fill:var(--ink-4); }
.fig .headA{ fill:#a03a2e; }
.fig .headO{ fill:#3f6b4a; }
.fig .mk{ fill:#a03a2e; }
.fig .mkd{ fill:var(--tip); }
.fig .draw{ stroke-dasharray:100; }
.fig .flow{ stroke-dasharray:4 7; }

@media (prefers-reduced-motion: no-preference){
  .fig.play .fade{ animation:fadeIn .5s ease-out both; }
  .fig.play .rise{ animation:riseIn .55s cubic-bezier(.2,.7,.3,1) both; }
  .fig.play .slide{ animation:slideIn .6s cubic-bezier(.2,.7,.3,1) both; }
  .fig.play .draw{ animation:drawIn .7s ease-out both; }
  .fig.play .pulse{ animation:pulseIn 1.5s ease-out both; }
  .fig.play .reclaim{ animation:reclaim 1.1s ease-out both; }
  .fig.play .flow{ animation:flow 1.4s linear infinite; }
  .fig.play .dl1{ animation-delay:.15s; }
  .fig.play .dl2{ animation-delay:.3s; }
  .fig.play .dl3{ animation-delay:.45s; }
  .fig.play .dl4{ animation-delay:.6s; }
  .fig.play .dl5{ animation-delay:.75s; }
  .fig.play .dl6{ animation-delay:.9s; }
  .fig.play .dl7{ animation-delay:1.05s; }
  .fig.play .dl8{ animation-delay:1.2s; }
  .fig.play .dl9{ animation-delay:1.35s; }
  .fig.play .dl10{ animation-delay:1.5s; }
  .fig.play .dl11{ animation-delay:1.65s; }
}
@keyframes fadeIn{ from{ opacity:0; } to{ opacity:1; } }
@keyframes riseIn{ from{ opacity:0; transform:translate(0,10px); } to{ opacity:1; transform:translate(0,0); } }
@keyframes slideIn{ from{ opacity:0; transform:translate(-20px,0); } to{ opacity:1; transform:translate(0,0); } }
@keyframes drawIn{ from{ stroke-dashoffset:100; } to{ stroke-dashoffset:0; } }
@keyframes pulseIn{ 0%{ opacity:.2; } 35%{ opacity:1; } 55%{ opacity:.4; } 100%{ opacity:1; } }
@keyframes reclaim{ from{ fill:#fbf1ee; stroke:#a03a2e; } to{ fill:#eff5f0; stroke:#3f6b4a; } }
@keyframes flow{ from{ stroke-dashoffset:0; } to{ stroke-dashoffset:-22; } }
```

## The play trigger

Append inside the lesson's existing `<script>` block, before `</script>`. Without this the animation rules never fire: `.play` is never added, the figures never animate, and nothing visibly breaks — which is what makes it worth checking rather than assuming. The other lessons in `lessons/data_internals/` all wire it up; `scripts/check_figures.py` flags a lesson that forgets.

```js
  /* Diagrams: hand a figure the .play class once it has scrolled into view,
     which lets its entrance animation run. The animation rules themselves sit
     inside @media (prefers-reduced-motion: no-preference), and every element's
     end state is its normal styling, so a reader with reduced motion enabled
     -- or with JavaScript off -- simply sees the finished diagram. */
  (function(){
    const figs = Array.from(document.querySelectorAll('figure.fig'));
    if(!figs.length) return;
    if(!('IntersectionObserver' in window)){
      figs.forEach(function(f){ f.classList.add('play'); });
      return;
    }
    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        entry.target.classList.add('play');
        observer.unobserve(entry.target);
      });
    }, { threshold:0.25 });
    figs.forEach(function(f){ observer.observe(f); });
  })();
```

## Class vocabulary

| Class | Use |
|---|---|
| `.box` | A neutral component: an app server, a follower, a client |
| `.box2` | A slightly recessed neutral box, for a second tier |
| `.dim` | Something absent, uninformed, or not yet in play |
| `.accbox` | The thing that failed, is in question, or carries the accent role |
| `.okbox` | The thing that is healthy, informed, or the resolution |
| `.edge` / `.edgeA` / `.edgeO` | A connection: neutral / accent / green |
| `.dash` / `.dashA` | A connection that is provisional, delayed, or uncertain |
| `.head` / `.headA` / `.headO` | The arrowhead matching the edge color |
| `.mk` / `.mkd` | Text in the accent color / in the green color — for the one word inside a figure that has to stand out |
| `.fade` | Default entrance: the element appears |
| `.pulse` | The element the sentence is about — use it once or twice per figure |
| `.draw` | A stroke that draws itself; add `pathLength="100"` to the path |
| `.flow` | Repeating motion along a path — only for something genuinely repeated |
| `.dl1` … `.dl11` | Stagger, in causal order |
| `.lbl` | Small uppercase caption inside the figure |
| `.xs` / `.sm` | Text at 8.5px / 9.5px |
| `.ctr` | Centre the text on its `x` |
| `.mono-b` | Bold mono, for the name of a component |

Arrowheads are polygons, not markers — markers break in some renderers and cannot be styled per-color here. An arrow that ends at `(x,y)` pointing right:

```html
<polygon class="headA fade dl3" points="-6,-4 -6,4 0,0" transform="translate(236,112)"/>
```

The triangle's tip is its last point, so the `translate` is the arrow's destination. Pointing down: `points="-4,-7 4,-7 0,0"`.

## Authoring rules

- **Canvas.** `viewBox="0 0 660 H"` — 660 wide, matching the other figures in the library. Height follows the content. Lay out on a 2px grid; humans read aligned boxes as intentional. `scripts/check_figures.py` treats the width as an invariant and rejects any other value, so a figure copied from a wider comparison chart fails until the layout is rescaled.
- **Text sizes.** `11px` body inside the figure, `.sm` for a component name, `.xs` for labels and detail lines, `.lbl` for the figure's own title. Nothing smaller than 8.5px — it becomes unreadable on a laptop.
- **Text length.** Mono at 8.5px is about 5.1px per character. A label in a 140px box holds 27 characters, and no more. `scripts/check_figures.py` estimates every label against the canvas and will catch what you miss.
- **Title.** `.lbl .ctr` at the top, uppercase, describing what the reader is looking at — "TWO SHARDS · ONE FRONT DOOR", not "Figure 6".
- **Accessibility.** Every `<svg>` carries `role="img"` and an `aria-label` that describes the *relationships*, not the picture: "a leader broadcasts a heartbeat every five seconds to five followers, each of which expects to receive it". A screen-reader user gets the content, not a description of the pixels. Aim for a sentence, not three words.
- **Caption.** Every figure ends with `figcaption`, starting with a bolded takeaway: `<b>Replication and failover.</b> …`. The caption states the conclusion the reader should have reached; it does not repeat the labels, and it must not be the only place the point is made.
- **Delay discipline.** Number `dl` classes in the order the reader should absorb the elements: the naive state first, then the failing edge, then the consequence. Re-use the low numbers across elements that belong together, and skip numbers where you want a longer pause — a gap only stretches the wait. Keep the largest delay at about `dl8` or below: past that, the last element arrives well over a second after the figure scrolls into view, by which time the reader has read the caption and moved on.
- **End state is the real state.** Never write a figure whose finished appearance is confusing. The animation is a bonus for readers who get it; reduced-motion and no-JS readers see the same diagram minus the motion.
- **No dependencies.** No external images, no `<use>`, no markers, no canvas, no libraries. The lesson must open offline and print.

## The tension with the design system

`references/design-system.md` says plainly: do not invent new components. Figures are the deliberate exception, and the reason it is safe is that this file exists — the CSS, the classes, and the layout conventions are fixed and shared, so a figure in one lesson looks like a figure in another. Treat the block above as the design system's figure chapter: paste it unchanged, use the classes listed, and do not add new colors, new keyframes, or a different canvas width.

If a diagram genuinely needs something this vocabulary cannot express, extend this file first, then use it — otherwise the next lesson will solve the same problem differently and the library drifts.
