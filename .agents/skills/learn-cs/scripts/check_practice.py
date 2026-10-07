#!/usr/bin/env python3
"""Check the retrieval-practice layer of a rendered lesson.

The mechanical part of the quiz/recall contract in `references/retrieval-practice.md`.
A lesson teaches by making the reader retrieve, and an interactive quiz only
does that work if its options are well-formed. This script verifies the parts a
human reviewer would otherwise have to eyeball on every lesson.

  errors (exit 1)
    - a .quiz with no .quiz-q, fewer than two options, or no .quiz-answer
    - a .quiz with no option marked data-correct="true", or more than one
    - a .quiz-answer <details> that is empty
    - quiz options whose word counts differ (formatting would leak the answer)
    - an option whose data-correct is neither "true" nor "false"
    - a <details class="recall"> with no summary, or with no reveal body

  warnings (exit 0)
    - quiz options with equal words but ragged character counts
    - a lesson with no retrieval element at all
    - a .quiz with no .quiz-kicker label
    - a quiz option under 3 words, which reads as a fragment

Usage:
    python3 check_practice.py <lesson.html> [more.html ...]
    python3 check_practice.py --quiet <lesson.html>

Exits 0 when there are no errors, 1 when there are.
"""
import argparse
import html
import re
import sys
from pathlib import Path

OPEN_TAG_RE = re.compile(r'<(div|details|ul|p)\b([^>]*)>', re.I)
ATTR_RE = re.compile(r'([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*"([^"]*)"')
LI_RE = re.compile(r'<li\b([^>]*)>(.*?)</li>', re.S | re.I)
SUMMARY_RE = re.compile(r'<summary\b([^>]*)>(.*?)</summary>', re.S | re.I)
TAG_RE = re.compile(r'<[^>]+>')


def line_of(text, pos):
    return text.count("\n", 0, pos) + 1


def clean(raw):
    return re.sub(r"\s+", " ", html.unescape(TAG_RE.sub("", raw))).strip()


def attr_map(attrs):
    return {k.lower(): v for k, v in ATTR_RE.findall(attrs)}


def has_class(attrs, cls):
    return cls in attr_map(attrs).get("class", "").split()


def _matching_body(text, open_tag_end, tag):
    """Return (body, end) for the element whose open tag ends at open_tag_end.

    Balances nested same-name tags, so a .quiz still contains its nested
    .quiz-kicker <div> instead of being cut off at the first </div>.
    """
    open_re = re.compile(r"<" + re.escape(tag) + r"\b[^>]*>", re.I)
    close_re = re.compile(r"</" + re.escape(tag) + r"\s*>", re.I)
    start = open_tag_end
    depth, pos = 1, start
    while depth > 0:
        nxt_open = open_re.search(text, pos)
        nxt_close = close_re.search(text, pos)
        if nxt_close is None:
            return text[start:], len(text)
        if nxt_open is not None and nxt_open.start() < nxt_close.start():
            seg = text[nxt_open.start():nxt_open.end()]
            if seg.rstrip().endswith("/>"):
                pos = nxt_open.end()
                continue
            depth += 1
            pos = nxt_open.end()
        else:
            depth -= 1
            if depth == 0:
                return text[start:nxt_close.start()], nxt_close.end()
            pos = nxt_close.end()
    return text[start:start], start


def find_blocks(text, tag, cls):
    """Yield (start, body) for every <tag> whose class list contains exactly cls.

    Matching on the class token rather than a substring is the whole point:
    'quiz' must not also catch 'quiz-q', 'quiz-opts' or 'quiz-answer'.
    """
    blocks = []
    open_re = re.compile(r"<" + re.escape(tag) + r"\b([^>]*?)>", re.I)
    for m in open_re.finditer(text):
        if not has_class(m.group(1), cls):
            continue
        body, _ = _matching_body(text, m.end(), tag)
        blocks.append((m.start(), body))
    return blocks


def check_practice(path: Path):
    text = path.read_text(encoding="utf-8", errors="replace")
    errors, warnings = [], []

    # --- quizzes ------------------------------------------------------------
    quiz_blocks = find_blocks(text, "div", "quiz")
    for start, body in quiz_blocks:
        qline = line_of(text, start)

        def err(msg):
            errors.append((qline, msg))

        # question: the first <p class="quiz-q"> inside the block
        q = next((b for s, b in find_blocks(body, "p", "quiz-q")), None)
        if q is None:
            err("quiz has no .quiz-q question line")
        elif not clean(q):
            err("quiz question is empty")

        if not any(True for _ in find_blocks(body, "div", "quiz-kicker")):
            warnings.append((qline, "quiz has no .quiz-kicker label"))

        opts = next((b for s, b in find_blocks(body, "ul", "quiz-opts")), None)
        if opts is None:
            err('quiz has no <ul class="quiz-opts">')
            continue
        items = LI_RE.findall(opts)
        if len(items) < 2:
            err(f"quiz has {len(items)} option(s); two or more needed")
            continue

        correct, texts = 0, []
        for attrs, raw in items:
            val = attr_map(attrs).get("data-correct", "").strip().lower()
            if val not in ("true", "false"):
                err('quiz option is missing data-correct="true|false"')
            elif val == "true":
                correct += 1
            label = clean(raw)
            texts.append(label)
            if label and len(label.split()) < 3:
                warnings.append((qline,
                                 f'quiz option "{label}" is under 3 words — reads as a fragment'))

        if correct == 0:
            err('quiz has no option with data-correct="true"')
        elif correct > 1:
            err(f"quiz has {correct} correct options; exactly one is expected")

        word_counts = {len(t.split()) for t in texts if t}
        char_counts = {len(t) for t in texts if t}
        if len(word_counts) > 1:
            err("quiz options differ in word count "
                f"({sorted(word_counts)}); formatting leaks the answer")
        elif len(char_counts) > 1:
            warnings.append((qline, "quiz options have equal word counts but ragged "
                                    f"character counts ({sorted(char_counts)})"))

        ans = next((b for s, b in find_blocks(body, "details", "quiz-answer")), None)
        if ans is None:
            err('quiz has no <details class="quiz-answer"> reveal')
        elif not clean(ans):
            err("quiz answer reveal is empty")

    # --- recall prompts -----------------------------------------------------
    recall_blocks = find_blocks(text, "details", "recall")
    for start, body in recall_blocks:
        rline = line_of(text, start)
        sm = SUMMARY_RE.search(body)
        if not sm or not clean(sm.group(2)):
            errors.append((rline, "recall prompt has no <summary> question"))
        rest = body[sm.end():] if sm else body
        if not clean(rest):
            errors.append((rline, "recall <details> reveals nothing; add the answer body"))

    # --- lesson-level -------------------------------------------------------
    if not quiz_blocks and not recall_blocks:
        warnings.append((1, "no retrieval element (quiz or recall) — this lesson only lets "
                            "the reader re-read; add a self-check"))

    return quiz_blocks, recall_blocks, errors, warnings


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="+", help="Lesson HTML file(s) to check")
    ap.add_argument("--quiet", action="store_true",
                    help="Print only files with findings, plus the summary")
    args = ap.parse_args()

    total_errors = 0
    for raw in args.paths:
        path = Path(raw)
        if not path.exists():
            print(f"{path}: not found", file=sys.stderr)
            total_errors += 1
            continue
        quizzes, recalls, errors, warnings = check_practice(path)
        total_errors += len(errors)
        show = errors or warnings or not args.quiet
        if show:
            print(f"{path}  ({len(quizzes)} quiz(zes), {len(recalls)} recall prompt(s))")
            for line, msg in sorted(errors):
                print(f"  ERROR   line {line:<5} {msg}")
            for line, msg in sorted(set(warnings)):
                print(f"  warn    line {line:<5} {msg}")
            if not errors and not warnings:
                print("  OK - retrieval practice is well-formed")
            elif not errors:
                print(f"  {len(warnings)} warning(s), no errors")

    if total_errors:
        print(f"\nFAILED: {total_errors} error(s)")
        return 1
    print("\nAll files passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
