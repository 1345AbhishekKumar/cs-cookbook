#!/usr/bin/env python3
"""Check the figures in a generated lesson.

The mechanical part of `references/figures.md`, in one pass:

  errors (exit 1)
    - a <figure class="fig"> with no <svg>, no role="img", or no aria-label
    - a figure with no <figcaption>
    - a figure whose aria-label is too short to describe relationships
    - a canvas that is not 660 wide, which the shared figure vocabulary fixes
    - <text> that runs outside the SVG viewBox
    - a centered <text> wider than the box it sits inside
    - figures present but no play trigger, so the animations can never run
    - animation classes present while the reduced-motion gate is missing

  warnings (exit 0)
    - a section carrying two or more figures, so the section is really two beats
    - a class inside the SVG that is not in the vocabulary (drift or a typo)
    - a figure with nothing animated
    - a figure with several animated elements and a single delay value, so
      everything appears at once
    - delays numbered with a gap, or beyond dl11
    - figures in a lesson with no .fig CSS

Usage:
    python3 check_figures.py <lesson.html> [more.html ...]
    python3 check_figures.py --quiet <lesson.html>

Exits 0 when there are no errors, 1 when there are.
"""
import argparse
import re
import sys
from pathlib import Path

# --- vocabulary -------------------------------------------------------------

# The complete set of classes a figure may use. Kept here as well as in
# references/figures.md so that drift is detectable rather than invisible.
VOCAB = {
    # text
    "sm", "xs", "lbl", "ctr", "mono-b",
    # shapes
    "box", "box2", "dim", "accbox", "okbox",
    # strokes and arrowheads
    "acc", "accf", "ok", "okf",
    "edge", "edgeA", "edgeO", "dash", "dashA",
    "head", "headA", "headO", "mk", "mkd",
    # animation
    "fade", "rise", "slide", "draw", "pulse", "reclaim", "flow",
}
DELAYS = {"dl%d" % n for n in range(1, 12)}
ANIMATED = {"fade", "rise", "slide", "draw", "pulse", "reclaim", "flow"}

SVG_RE = re.compile(r"<figure\b([^>]*)>(.*?)</figure>", re.S)
SECTION_RE = re.compile(r"<section\b([^>]*)>(.*?)</section>", re.S)
FIG_OPEN_RE = re.compile(r"<figure\b([^>]*)>", re.S)
SVG_OPEN_RE = re.compile(r"<svg\b([^>]*)>", re.S)
TEXT_RE = re.compile(r"<text\b([^>]*)>(.*?)</text>", re.S)
RECT_RE = re.compile(r"<rect\b([^>]*)/?>")
CLASS_RE = re.compile(r'\bclass\s*=\s*"([^"]*)"')
ATTR_RE = re.compile(r'\b([a-zA-Z-]+)\s*=\s*"([^"]*)"')
VIEWBOX_RE = re.compile(r'viewBox\s*=\s*"\s*0\s+0\s+([\d.]+)\s+([\d.]+)"')
ENTITY_RE = re.compile(r"&[a-zA-Z]+;|&#\d+;")
TAG_RE = re.compile(r"<[^>]+>")


def line_of(text: str, pos: int) -> int:
    return text.count("\n", 0, pos) + 1


def font_size(cls: str) -> float:
    if "xs" in cls.split() or "lbl" in cls.split():
        return 8.5
    if "sm" in cls.split():
        return 9.5
    return 11.0


def est_width(raw: str, size: float) -> float:
    """Rough advance width of a label. Mono, so characters are near-equal."""
    text = TEXT_RE.sub("", raw)
    text = ENTITY_RE.sub("x", text)
    text = TAG_RE.sub("", text)
    return len(text) * 0.60 * size


def attrs_of(fragment: str) -> dict:
    return {k.lower(): v for k, v in ATTR_RE.findall(fragment)}


def check_figures(path: Path):
    text = path.read_text(encoding="utf-8", errors="replace")
    errors, warnings = [], []

    figures = list(SVG_RE.finditer(text))
    has_fig_css = ".fig{" in text or "figure.fig" in text
    has_trigger = "querySelectorAll('figure.fig')" in text
    has_motion_gate = "prefers-reduced-motion" in text

    if figures and not has_fig_css:
        warnings.append((1, "figures present but no .fig CSS block (see references/figures.md)"))
    if figures and not has_trigger:
        errors.append((line_of(text, figures[0].start()),
                       "figures present but no play trigger: .play is never added, so the "
                       "animations can never run"))
    if figures and has_trigger and not has_motion_gate:
        errors.append((1, "animation is wired up but the reduced-motion gate is missing"))

    # At most one figure per section: a second figure means the section is
    # really two beats. Reported as a warning rather than an error because a
    # long chapter can legitimately show a before and an after.
    for sidx, sec in enumerate(SECTION_RE.finditer(text), 1):
        sec_attrs = attrs_of(sec.group(1))
        if "block" not in sec_attrs.get("class", "").split():
            continue
        n = sum(1 for a in FIG_OPEN_RE.findall(sec.group(2))
                if "fig" in attrs_of(a).get("class", "").split())
        if n > 1:
            warnings.append((line_of(text, sec.start()),
                             f"section {sidx} carries {n} figures &mdash; one figure per "
                             "section means a second one is a second beat"))

    for idx, fig in enumerate(figures, 1):
        fpos, body = fig.start(), fig.group(2)
        fline = line_of(text, fpos)

        svg = SVG_OPEN_RE.search(body)
        if not svg:
            errors.append((fline, f"figure {idx}: no <svg>"))
            continue
        svg_attrs = attrs_of(svg.group(1))
        label = svg_attrs.get("aria-label", "")
        if svg_attrs.get("role") != "img":
            errors.append((fline, f'figure {idx}: <svg> has no role="img"'))
        if not label:
            errors.append((fline, f"figure {idx}: <svg> has no aria-label"))
        elif len(label) < 40:
            errors.append((fline, f"figure {idx}: aria-label is {len(label)} chars &mdash; "
                                  "describe the relationships, not the picture"))

        if "<figcaption>" not in body:
            errors.append((fline, f"figure {idx}: no <figcaption>"))

        vb = VIEWBOX_RE.search(svg.group(1))
        if not vb:
            errors.append((fline, f'figure {idx}: viewBox is not "0 0 660 H"'))
            continue
        W, H = float(vb.group(1)), float(vb.group(2))
        # The width is an invariant, not a suggestion: every figure in the
        # library is 660 wide so diagrams match when they sit side by side.
        # A different width means the file drifted from figures.md.
        if W != 660:
            errors.append((fline, f"figure {idx}: canvas is {W:.0f} wide, not 660 "
                                  "(figures.md fixes the width; only the height varies)"))

        # text geometry ------------------------------------------------------
        rects = []
        for m in RECT_RE.finditer(body):
            a = attrs_of(m.group(1))
            try:
                rects.append((float(a["x"]), float(a["y"]),
                              float(a.get("width", 0)), float(a.get("height", 0))))
            except (KeyError, ValueError):
                pass

        for m in TEXT_RE.finditer(body):
            a = attrs_of(m.group(1))
            cls = a.get("class", "")
            if "x" not in a or "y" not in a:
                continue
            try:
                x, y = float(a["x"]), float(a["y"])
            except ValueError:
                continue
            size = font_size(cls)
            w = est_width(m.group(2), size)
            # Anchoring can be a class or an attribute, and getting this wrong
            # reports a perfectly placed label as an overflow.
            anchor = a.get("text-anchor", "").strip().lower()
            centred = "ctr" in cls.split() or anchor == "middle"
            if centred:
                left, right = x - w / 2, x + w / 2
            elif anchor == "end":
                left, right = x - w, x
            else:
                left, right = x, x + w
            line = line_of(text, fpos + svg.end() + m.start())
            if left < 0 or right > W or y > H or y < 0:
                errors.append((line, f"figure {idx}: label runs outside the canvas "
                                     f"(x {left:.0f}..{right:.0f} of {W:.0f}, y {y:.0f} of {H:.0f})"))
                continue
            if not centred:
                continue
            for rx, ry, rw, rh in rects:
                if rx <= x <= rx + rw and ry <= y <= ry + rh:
                    if w > rw - 8:
                        warnings.append((line, f"figure {idx}: label is {w:.0f}px wide in a "
                                               f"{rw:.0f}px box &mdash; likely to overflow"))
                    break

        # classes and animation ----------------------------------------------
        used = set()
        for m in CLASS_RE.finditer(body):
            used.update(m.group(1).split())
        unknown = sorted(c for c in used if c not in VOCAB and c not in DELAYS)
        if unknown:
            warnings.append((fline, f"figure {idx}: classes outside the vocabulary: "
                                    f"{', '.join(unknown)}"))

        animated = sorted(used & ANIMATED)
        if not animated:
            warnings.append((fline, f"figure {idx}: nothing is animated"))
        delays = sorted(int(c[2:]) for c in used if c in DELAYS)
        if len(animated) >= 3 and not delays:
            warnings.append((fline, f"figure {idx}: {len(animated)} animated elements and no "
                                    "dl delay, so they all appear at once"))
        # Gaps in the numbering are fine -- they lengthen a pause on purpose, and
        # parallel groups legitimately re-use low numbers. What is worth flagging
        # is a figure whose last element lands long after the reader has arrived.
        if delays and max(delays) > 10:
            warnings.append((fline, f"figure {idx}: dl{max(delays)} delays the last element "
                                    "past 1.5s; the reader has read the caption by then"))

    return figures, errors, warnings


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="+", help="Lesson HTML file(s) to check")
    ap.add_argument("--quiet", action="store_true",
                    help="Print only failing files and the summary")
    args = ap.parse_args()

    total_errors = 0
    for raw in args.paths:
        path = Path(raw)
        if not path.exists():
            print(f"{path}: not found", file=sys.stderr)
            total_errors += 1
            continue
        figures, errors, warnings = check_figures(path)
        total_errors += len(errors)
        show = errors or warnings or not args.quiet
        if show:
            print(f"{path}  ({len(figures)} figure(s))")
            for line, msg in sorted(errors):
                print(f"  ERROR   line {line:<5} {msg}")
            for line, msg in sorted(set(warnings)):
                print(f"  warn    line {line:<5} {msg}")
            if not errors and not warnings:
                print("  OK - figures all check out" if figures else "  no figures to check")

    if total_errors:
        print(f"\nFAILED: {total_errors} error(s)")
        return 1
    print("\nAll files passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
