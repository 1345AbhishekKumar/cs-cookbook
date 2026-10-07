#!/usr/bin/env python3
"""Validate a rendered lesson against the lesson invariants.

Checks the mechanical parts of the validation checklist in SKILL.md:

  errors (exit 1)
    - duplicate element ids
    - anchors that point at an id that does not exist
    - numbering gaps in the .cmd-num sequence, or in the TOC's .n spans
    - external network references (<script src>, <link rel=stylesheet>,
      any src/srcset/poster/data, CSS url() or @import pointing at http(s))

  warnings (exit 0)
    - section/.cmd ids that no TOC entry links to
    - TOC .n count disagreeing with .cmd-num count
    - non-zero-padded numbers
    - missing masthead / filter input / back-to-top hooks
    - external hyperlinks (<a href="http...">) and relative <script>/<link>

Usage:
    python3 validate.py <lesson.html> [more.html ...]
    python3 validate.py --quiet <lesson.html>

Exits 0 when there are no errors, 1 when there are.
"""
import argparse
import re
import sys
from pathlib import Path

# --- matchers ---------------------------------------------------------------

ID_RE = re.compile(r"""\bid\s*=\s*(["'])(.*?)\1""", re.S)
ANCHOR_RE = re.compile(r"""\bhref\s*=\s*(["'])#([^"']*)\1""", re.S)
TAG_RE = re.compile(r"""<([a-zA-Z][a-zA-Z0-9:-]*)\b([^>]*)>""", re.S)
ATTR_RE = re.compile(r"""([a-zA-Z_:][a-zA-Z0-9_:.-]*)\s*=\s*(["'])(.*?)\2""", re.S)
STYLE_RE = re.compile(r"""<style\b[^>]*>(.*?)</style>""", re.S | re.I)
CSS_URL_RE = re.compile(r"""(?:url\(\s*|@import\s+)(["']?)([^"')\s]+)\1""", re.I)

# Attributes that make a browser fetch something as soon as the page loads.
FETCH_ATTRS = {
    "src", "srcset", "poster", "data", "action", "formaction",
    "xlink:href", "background", "manifest",
}
# <a href> and inline style url() are content/decoration, not dependencies.
HYPERLINK_TAGS = {"a", "area"}

# Ordered [(number, line)] for a set of numbered items.
TOC_RE = re.compile(r"""<aside\b[^>]*\bclass\s*=\s*(["'])[^"']*\btoc\b[^"']*\1[^>]*>""", re.I)


def line_of(text: str, pos: int) -> int:
    return text.count("\n", 0, pos) + 1


def find_tags(text: str):
    """Yield (tag_name, attrs_dict, tag_pos, gt_pos) for every start tag."""
    for m in TAG_RE.finditer(text):
        attrs = {}
        for a in ATTR_RE.finditer(m.group(2)):
            attrs[a.group(1).lower()] = a.group(3)
        yield m.group(1).lower(), attrs, m.start(), m.end() - 1


def numbered_items(text: str, cls: str):
    """Collect the leading integer of every element whose class list has `cls`.

    Returns [(int_value, raw_text, line)] in document order.
    """
    out = []
    for m in TAG_RE.finditer(text):
        attrs = {}
        for a in ATTR_RE.finditer(m.group(2)):
            attrs[a.group(1).lower()] = a.group(3)
        classes = attrs.get("class", "").split()
        if cls not in classes:
            continue
        after = text[m.end():m.end() + 64]
        num = re.match(r"\s*(?:<[^>]+>\s*)*(\d+)", after)
        if num:
            out.append((int(num.group(1)), num.group(1), line_of(text, m.start())))
    return out


def toc_section(text: str) -> str:
    """Return the markup of the sidebar TOC, or '' if there is none."""
    m = TOC_RE.search(text)
    if not m:
        return ""
    end = text.find("</aside>", m.end())
    return text[m.end():end if end != -1 else len(text)]


def check_gaps(items, label, errors):
    """Report non-continuous or repeated numbering in `items`."""
    if not items:
        return
    nums = [n for n, _, _ in items]
    seen = {}
    for n, raw, line in items:
        if n in seen:
            errors.append((line, f"{label}: duplicate number {raw} (first at line {seen[n]})"))
        else:
            seen[n] = line
    expected = list(range(1, len(nums) + 1))
    if nums != expected:
        got = " ".join(str(n) for n in nums)
        errors.append((items[0][2],
                       f"{label}: numbering is not continuous 01..{len(nums)} (got {got})"))
    for n, raw, line in items:
        if raw != f"{n:02d}" and n < 100:
            errors.append((line,
                           f"{label}: {raw!r} is not zero-padded (expected {n:02d})"))


def validate(path: Path):
    text = path.read_text(encoding="utf-8", errors="replace")
    errors, warnings = [], []

    # 1. duplicate ids -------------------------------------------------------
    ids, seen_ids = {}, {}
    for m in ID_RE.finditer(text):
        ident, line = m.group(2), line_of(text, m.start())
        if ident in seen_ids:
            errors.append((line, f'duplicate id "{ident}" (first defined at line {seen_ids[ident]})'))
        else:
            seen_ids[ident] = line
            ids[ident] = line

    # 2. anchors that resolve to nothing ------------------------------------
    referenced = set()
    for m in ANCHOR_RE.finditer(text):
        target = m.group(2).strip()
        if not target or target == "#":
            continue  # placeholder (#) and the back-to-top href="#" are fine
        referenced.add(target)
        if target not in ids:
            errors.append((line_of(text, m.start()), f'broken anchor href="#{target}" (no such id)'))

    # 3. numbering gaps ------------------------------------------------------
    body = numbered_items(text, "cmd-num")
    toc = numbered_items(toc_section(text), "n")
    check_gaps(body, ".cmd-num", errors)
    check_gaps(toc, "TOC .n", errors)

    # 4. external network references ----------------------------------------
    for tag, attrs, pos, _ in find_tags(text):
        line = line_of(text, pos)
        for name, value in attrs.items():
            urlish = value.strip()
            external = urlish.startswith(("http://", "https://", "//"))
            if name in FETCH_ATTRS:
                if external and not (tag in HYPERLINK_TAGS and name == "href"):
                    errors.append((line, f"<{tag} {name}> loads an external resource: {urlish[:70]}"))
                elif tag == "script" and name == "src":
                    errors.append((line, f"<script src> is not self-contained: {urlish[:70]}"))
            if name == "style" and "url(" in value:
                for u in CSS_URL_RE.finditer(value):
                    if u.group(2).startswith(("http", "//")):
                        errors.append((line, f"inline style url() loads {u.group(2)[:70]}"))
        if tag in HYPERLINK_TAGS:
            href = attrs.get("href", "").strip()
            if href.startswith(("http://", "https://")):
                warnings.append((line, f"external hyperlink (content, not a dependency): {href[:70]}"))
        if tag == "link" and "stylesheet" in attrs.get("rel", "").lower():
            href = attrs.get("href", "").strip()
            if href.startswith(("http://", "https://", "//")):
                errors.append((line, f"<link rel=stylesheet> loads an external resource: {href[:70]}"))
            elif href:
                warnings.append((line, f"<link rel=stylesheet> is not inlined: {href[:70]}"))

    for m in STYLE_RE.finditer(text):
        for u in CSS_URL_RE.finditer(m.group(1)):
            if u.group(2).startswith(("http", "//")):
                errors.append((line_of(text, m.start(1) + u.start()),
                               f"CSS url()/@import loads {u.group(2)[:70]}"))

    # --- warnings -----------------------------------------------------------
    for ident, line in sorted(ids.items(), key=lambda kv: kv[1]):
        if ident in ("filter", "toTop"):
            continue
        if ident not in referenced:
            warnings.append((line, f'id "{ident}" is not linked from any TOC entry'))

    if toc and body and len(toc) != len(body):
        warnings.append((1, f"TOC lists {len(toc)} numbered items but the body has "
                            f"{len(body)} .cmd-num blocks"))

    if 'class="masthead"' not in text and "class='masthead'" not in text:
        warnings.append((1, 'no <header class="masthead">'))
    if not re.search(r"""\bid\s*=\s*(["'])filter\1""", text):
        warnings.append((1, 'no TOC filter input (id="filter")'))
    if not re.search(r"""\bid\s*=\s*(["'])toTop\1""", text):
        warnings.append((1, 'no back-to-top control (id="toTop")'))

    return errors, warnings


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="+", help="Lesson HTML file(s) to validate")
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
        errors, warnings = validate(path)
        total_errors += len(errors)
        show = errors or warnings or not args.quiet
        if show:
            print(str(path))
            for line, msg in sorted(errors):
                print(f"  ERROR   line {line:<5} {msg}")
            for line, msg in sorted(set(warnings)):
                print(f"  warn    line {line:<5} {msg}")
            if not errors and not warnings:
                print("  OK - all checks passed")
            elif not errors:
                print(f"  {len(warnings)} warning(s), no errors")

    if total_errors:
        print(f"\nFAILED: {total_errors} error(s)")
        return 1
    print("\nAll files passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
