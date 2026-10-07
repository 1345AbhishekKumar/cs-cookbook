#!/usr/bin/env python3
"""Check a whole lessons library against the shared conventions.

`validate.py` and `check_figures.py` each judge one file. This script judges
the library those files form, which is a different question, and the one
figures.md and SKILL.md both assume has an answer:

  - Does every lesson use the same design-system shell (masthead, TOC, filter)?
  - Do the figures share one canvas width, so diagrams match side by side?
  - Which lessons are outside the figure vocabulary entirely, so the
    "figures look the same across the library" claim is quietly false?

  errors (exit 1)
    - every error validate.py and check_figures.py report, aggregated

  warnings (exit 0)
    - every warning those two report, aggregated
    - a lesson with inline <svg> diagrams and no <figure class="fig">, so it
      predates or bypasses the shared figure vocabulary
    - a lesson with no masthead, no TOC, or no font/colour tokens from
      assets/lesson.css, i.e. not built from scaffold.py

Usage:
    python3 check_library.py [dir-or-file ...]
    python3 check_library.py --quiet [dir-or-file ...]

With no arguments it looks for `lessons/` at the project root (four levels
above this file) and falls back to the working directory. Exits 0 when there
are no errors, 1 when there are.
"""
import argparse
import importlib.util
import re
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
try:
    PROJECT_ROOT = SCRIPT_DIR.parents[3]
except IndexError:
    # Shallow checkout (e.g. skill at <root>/lesson/): fall back to the
    # skill's parent, which is the project root here.
    PROJECT_ROOT = SCRIPT_DIR.parent.parent


def load(name: str):
    """Import a sibling script by path, so this works from any cwd."""
    path = SCRIPT_DIR / f"{name}.py"
    spec = importlib.util.spec_from_file_location(f"_lesson_{name}", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def default_targets() -> list:
    # learn-cs treats the current directory as the learning workspace, so the
    # lessons live in ./lessons relative to where the agent was invoked.
    candidate = Path.cwd() / "lessons"
    return [candidate if candidate.is_dir() else Path.cwd()]


def collect(paths) -> list:
    """Expand files and directories into a sorted list of lesson HTML files."""
    out = []
    for raw in paths:
        p = Path(raw)
        if p.is_dir():
            out.extend(sorted(p.rglob("*.html")))
        elif p.exists():
            out.append(p)
        else:
            sys.stderr.write(f"{p}: not found\n")
    # index.html is a landing page, not a lesson.
    return [p for p in dict.fromkeys(out) if p.name.lower() != "index.html"]


def describe(path: Path, text: str) -> dict:
    """Facts about one lesson that matter at the library level."""
    figures = len(re.findall(r"<figure\b[^>]*class=\"[^\"]*\bfig\b", text))
    inline_svg = len(re.findall(r"<svg\b", text))
    widths = sorted({int(float(w)) for w in
                     re.findall(r"viewBox=\"0 0 ([\d.]+) ", text)})
    return {
        "figures": figures,
        "inline_svg": inline_svg,
        "widths": widths,
        "masthead": 'class="masthead"' in text,
        "toc": bool(re.search(r"<aside\b[^>]*class=\"[^\"]*\btoc\b", text)),
        "tokens": "--rule" in text and "--ink" in text,
    }


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

    ap = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="*", help="Lesson files or directories")
    ap.add_argument("--quiet", action="store_true",
                    help="Print only files with findings, plus the summary")
    args = ap.parse_args()

    validate = load("validate")
    check_figures = load("check_figures")
    check_practice = load("check_practice")

    files = collect(args.paths or default_targets())
    if not files:
        print("No lesson files found.")
        return 0

    rows, total_errors, total_warnings = [], 0, 0
    for path in files:
        text = path.read_text(encoding="utf-8", errors="replace")
        info = describe(path, text)

        v_errors, v_warnings = validate.validate(path)
        _, f_errors, f_warnings = check_figures.check_figures(path)
        _, _, p_errors, p_warnings = check_practice.check_practice(path)
        errors = v_errors + f_errors + p_errors
        warnings = v_warnings + f_warnings + p_warnings

        drift = []
        if info["inline_svg"] and not info["figures"]:
            drift.append(f"{info['inline_svg']} inline <svg> and no "
                         "<figure class=\"fig\"> - outside the shared vocabulary")
        if not info["masthead"]:
            drift.append("no masthead - not built from scaffold.py")
        if not info["toc"]:
            drift.append("no sidebar TOC")
        if not info["tokens"]:
            drift.append("no design-system tokens - its own stylesheet")

        total_errors += len(errors)
        total_warnings += len(warnings) + len(drift)
        rows.append((path, info, errors, warnings, drift))

    width = max(len(str(r[0])) for r in rows)
    print(f"{'':<{width}}  figs  widths          state")
    for path, info, errors, warnings, drift in rows:
        widths = ",".join(str(w) for w in info["widths"]) or "-"
        state = "ok"
        if errors:
            state = f"{len(errors)} error(s)"
        elif drift:
            state = "outside the design system"
        elif warnings:
            state = f"{len(warnings)} warning(s)"
        print(f"{str(path):<{width}}  {info['figures']:>4}  {widths:<14}  {state}")

    show = [r for r in rows if r[2] or r[3] or r[4]]
    for path, info, errors, warnings, drift in (show if args.quiet else rows):
        if not (errors or warnings or drift):
            continue
        print(f"\n{path}")
        for line, msg in sorted(errors):
            print(f"  ERROR   line {line:<5} {msg}")
        for line, msg in sorted(set(warnings)):
            print(f"  warn    line {line:<5} {msg}")
        for msg in drift:
            print(f"  drift           {msg}")

    print(f"\n{len(rows)} lesson(s): {total_errors} error(s), "
          f"{total_warnings} warning(s)")
    if total_errors:
        print("FAILED: fix the errors before adding another lesson.")
        return 1
    print("No errors. Warnings are a prompt to look, not a failure.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
