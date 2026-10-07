#!/usr/bin/env python3
"""Emit an HTML shell for a lesson.

Reads assets/lesson.css relative to this script and inlines it into a
self-contained HTML document. The agent then fills in the TOC and body.

Usage:
    python3 scaffold.py --title "My Lesson" --kicker "Lecture Notes" \
        --lede "A short description." [--out lesson.html] [--force]

If --out is omitted, the HTML is written to stdout.

--out creates its parent directory when it is missing (a fresh checkout has
no lessons/ yet) and refuses to clobber an existing file unless --force is
given -- SKILL.md asks for a distinct name rather than an overwrite, and a
silent overwrite destroys a lesson that took a long time to write.
"""
import argparse
import sys
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
CSS_PATH = SKILL_DIR / "assets" / "lesson.css"

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>__TITLE__</title>
<style>
/*__CSS__*/
</style>
</head>
<body>

<header class="masthead">
  <div class="masthead-inner">
    <div class="kicker">__KICKER__</div>
    <h1 class="title">__TITLE_HTML__</h1>
    <p class="lede">__LEDE__</p>
    <div class="meta-row">
      <!-- Fill in: e.g. <span>Topic</span><span>Audience</span><span>Length</span> -->
    </div>
  </div>
</header>

<div class="layout">

  <aside class="toc">
    <input type="text" id="filter" class="toc-filter" placeholder="filter…" autocomplete="off">

    <!-- Fill in TOC groups here. Pattern:

    <div class="toc-group">
      <div class="toc-group-title">Section Name</div>
      <a href="#id"><span class="n">01</span>command-name</a>
      ...
    </div>
    -->
  </aside>

  <main>
    <!-- Fill in sections here. See references/design-system.md -->
  </main>
</div>

<footer>
  <div>
    <span class="foot-mark">▍</span> __FOOTER__
  </div>
</footer>

<a href="#" class="to-top" id="toTop" aria-label="Back to top">↑</a>

<script>
  /* TOC filter */
  (function(){
    const filter = document.getElementById('filter');
    if(!filter) return;
    const links  = Array.from(document.querySelectorAll('aside.toc a'));
    const groups = Array.from(document.querySelectorAll('aside.toc .toc-group'));
    filter.addEventListener('input', function(){
      const q = this.value.trim().toLowerCase();
      links.forEach(function(link){
        const match = link.textContent.toLowerCase().indexOf(q) !== -1;
        link.classList.toggle('hidden', !match);
      });
      groups.forEach(function(group){
        const visible = group.querySelectorAll('a:not(.hidden)').length;
        group.classList.toggle('hidden', visible === 0);
      });
    });
  })();

  /* Back to top */
  (function(){
    const btn = document.getElementById('toTop');
    if(!btn) return;
    function onScroll(){
      btn.classList.toggle('visible', window.scrollY > 600);
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
    btn.addEventListener('click', function(e){
      e.preventDefault();
      window.scrollTo({ top:0, behavior:'smooth' });
    });
  })();

  /* Retrieval practice: make quiz options clickable for immediate feedback,
     and open the answer reveal. Without JavaScript the options are inert and
     the <details class="quiz-answer"> is the fallback, so the prompt and its
     answer always survive; the enhancer only adds the instant feedback loop. */
  (function(){
    document.querySelectorAll('.quiz').forEach(function(quiz){
      var opts = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-opts li'));
      if(!opts.length) return;
      var answer = quiz.querySelector('.quiz-answer');
      function choose(picked){
        opts.forEach(function(o){ o.classList.remove('correct','wrong'); });
        if(picked.dataset.correct === 'true'){
          picked.classList.add('correct');
        } else {
          picked.classList.add('wrong');
          opts.forEach(function(o){
            if(o.dataset.correct === 'true') o.classList.add('correct');
          });
        }
        if(answer) answer.open = true;
      }
      opts.forEach(function(opt){
        opt.setAttribute('tabindex','0');
        opt.setAttribute('role','button');
        opt.addEventListener('click', function(){ choose(opt); });
        opt.addEventListener('keydown', function(e){
          if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); choose(opt); }
        });
      });
    });
  })();
</script>

</body>
</html>
"""


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--title", required=True, help="Plain-text title")
    ap.add_argument("--kicker", default="Lecture Notes",
                    help="Small uppercase label above the title")
    ap.add_argument("--lede", default="",
                    help="One-sentence description under the title")
    ap.add_argument("--footer", default="A lesson generated using Narrative Problem-Chaining.",
                    help="Text shown in the footer")
    ap.add_argument("--out", default=None,
                    help="Output path. Writes to stdout if omitted.")
    ap.add_argument("--force", action="store_true",
                    help="Allow overwriting an existing --out file.")
    args = ap.parse_args()

    if not CSS_PATH.exists():
        sys.stderr.write(f"CSS not found: {CSS_PATH}\n")
        return 1

    css = CSS_PATH.read_text(encoding="utf-8")

    # Escape minimal HTML in the plain-text title for the <title> tag, and
    # allow <em> in the visible h1 by NOT escaping -- the caller is trusted
    # and can use <em> for emphasis.
    title_html = args.title  # the visible h1 may contain <em>
    title_tag  = args.title.replace("&", "&amp;").replace("<", "&lt;")

    html = (
        TEMPLATE
        .replace("/*__CSS__*/", css)
        .replace("__TITLE_HTML__", title_html)
        .replace("__TITLE__", title_tag)
        .replace("__KICKER__", args.kicker)
        .replace("__LEDE__", args.lede)
        .replace("__FOOTER__", args.footer)
    )

    if args.out:
        out = Path(args.out)
        if out.exists() and not args.force:
            sys.stderr.write(
                f"Refusing to overwrite {out}. Pick a distinct name, or pass "
                f"--force if you really mean to replace it.\n")
            return 2
        if str(out.parent) not in ("", ".") and not out.parent.exists():
            out.parent.mkdir(parents=True, exist_ok=True)
            sys.stderr.write(f"Created directory {out.parent}\n")
        out.write_text(html, encoding="utf-8")
        sys.stderr.write(f"Wrote {out} ({len(html):,} bytes)\n")
    else:
        # The document contains non-ASCII glyphs (->, up arrow, block mark).
        # On Windows the default stdout codec is cp1252, which cannot encode
        # them, so force UTF-8 before writing rather than crashing mid-document.
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass
        sys.stdout.write(html)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
