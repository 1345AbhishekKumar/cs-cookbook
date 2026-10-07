#!/usr/bin/env python3
"""Check the definition discipline of a rendered lesson.

Mechanical part of SKILL.md Rule 10 ("every term defined and
emphasized in-context before the reader relies on it").

Warnings only (exit 0):
  - <strong> term with no in-place gloss (-- : is/are/means nearby)
  - <strong> carrying a sentence/rule instead of a term
  - bare acronym <strong>DNS</strong> with no (Domain Name System) expansion nearby
  - <strong> term already used bare in an earlier paragraph
  - frequent <code> term (3+ uses) never <strong>-defined
  - <em> that looks like a term but is never <strong>-defined
  - 4+ terms and no <dl class="deflist"> (buried definitions)

Usage:
    python3 check_definitions.py <lesson.html> [more.html ...]
"""
import argparse
import html
import re
import sys
from collections import Counter
from pathlib import Path

STRONG_RE = re.compile(r"<strong>(.*?)</strong>", re.S | re.I)
EM_RE = re.compile(r"<em>(.*?)</em>", re.S | re.I)
CODE_RE = re.compile(r"<code>(.*?)</code>", re.S | re.I)
PARA_RE = re.compile(r"<p\b[^>]*>(.*?)</p>", re.S | re.I)
TAG_RE = re.compile(r"<[^>]+>")
DEF_LIST_RE = re.compile(r'<dl\b[^>]*class\s*=\s*["\'][^"\']*\bdeflist\b', re.I)
DT_RE = re.compile(r"<dt\b[^>]*>(.*?)</dt>", re.S | re.I)
GLOSS_RE = re.compile(
    r"—|–|\s*(--|---|-)(\s|$)|:\s*|\s+\bis\b|\s+\bare\b"
    r"|\s+means?\b|\s+called\b|,\s+(a|an|the)\b",
    re.I,
)
SENT_WORDS = 6
SENT_CHARS = 60
CODE_MIN = 3
PROSE_MIN = 4
# Bare acronyms: e.g. DNS, HTTP, IP, TCP, WAL, ACID, ReLU, NaN, LiDAR.
# Single letters (Q, K, V) are covered by the normal define-in-flow check, not this one.
# Mixed-case initialisms count when they start uppercase and carry 2+ capitals.
BARE_ACRONYM_RE = re.compile(r"^[A-Z]{2,}[A-Z0-9\-/]*s?$")
# Status codes and versions ("200 OK", "HTTP/1.1") are not teachable acronyms.
ACRONYM_SKIP = {"OK", "OKAY"}


def _is_acronym(tok: str) -> bool:
    t = tok.strip().strip("s") if tok.endswith("s") and len(tok) > 3 else tok
    if len(t) < 2 or not t[0].isupper():
        return False
    if t in ACRONYM_SKIP:
        return False
    # Hyphenated names ("Min-Max", "Z-Score", "Write-Ahead") are names, not
    # initialisms. A hyphenation counts only when a part is itself all-caps
    # ("SYN-ACK"). Statistical symbols ("Z-Score") have no expansion to give.
    if "-" in t or "/" in t:
        parts = [p for p in re.split(r"[-/]", t) if p]
        if not any(re.fullmatch(r"[A-Z]{2,}[A-Z0-9]*", p) for p in parts):
            return False
    if BARE_ACRONYM_RE.match(t):
        return True
    # Mixed case like ReLU, NaN, LiDAR: 2+ uppercase letters, mostly letters.
    letters = [c for c in t if c.isalpha()]
    upper = sum(1 for c in letters if c.isupper())
    if upper >= 2 and len(letters) >= 3 and re.fullmatch(r"[A-Za-z][A-Za-z0-9\-/]*", t):
        return True
    return False
# everyday glue + code identifiers: never "terms that need defining"
SKIP = {
    "the", "and", "for", "with", "from", "that", "this", "have", "has",
    "will", "would", "should", "there", "their", "they", "them",
    "you", "your", "not", "but", "are", "was", "were", "been", "being",
    "what", "when", "where", "which", "while", "about", "into", "over",
    "after", "before", "between", "through", "each", "every", "other",
    "more", "most", "such", "only", "also", "just", "than", "then",
    "now", "how", "why", "all", "any", "one", "two", "new", "own",
    "same", "here", "out", "off", "again", "once", "too", "very",
    "can", "could", "does", "did", "read", "next", "after", "too",
    "const", "return", "function", "import", "var", "fig", "color",
    "font-size", "shipments", "shipment",
    "filterbar", "shipmenttable", "summarybadge", "dispatchboard",
    "late-count", "late count", "count badge",
}
# quoted UI strings / titles / single narrative words: emphasis, not terms
SKIP_EM = {
    "disagreed", "you might not need an effect",
    "3 of 240 matching", "maximum update depth exceeded",
    "when a shipment goes late, update four separate places",
}
# ~300 most common English words: never definition-worthy on their own.
COMMON = {
    "time", "year", "people", "way", "day", "man", "thing", "woman",
    "life", "child", "world", "school", "state", "family", "student",
    "group", "country", "problem", "hand", "part", "place", "case",
    "week", "company", "system", "program", "question", "work",
    "government", "number", "night", "point", "home", "water", "room",
    "mother", "area", "money", "story", "fact", "month", "lot", "right",
    "study", "book", "eye", "job", "word", "business", "issue", "side",
    "kind", "head", "house", "service", "friend", "father", "power",
    "hour", "game", "line", "end", "member", "law", "car", "community",
    "name", "team", "minute", "idea", "kid", "body", "information",
    "back", "parent", "face", "others", "level", "office", "door",
    "health", "person", "art", "war", "history", "party", "result",
    "change", "morning", "reason", "research", "girl", "guy", "moment",
    "air", "teacher", "force", "education", "because", "description",
    "list", "value", "being", "chapter", "nothing", "rows", "much", "many", "some", "these", "those",
    "another", "around", "still", "even", "ever", "never", "always",
    "away", "back", "call", "come", "came", "done", "does", "doing",
    "down", "first", "give", "goes", "going", "good", "great", "know",
    "keep", "large", "last", "later", "least", "leave", "left", "like",
    "little", "look", "looked", "looking", "made", "make", "making",
    "mean", "means", "mine", "need", "needs", "needed", "order",
    "over", "part", "page", "point", "put", "really", "right", "said",
    "same", "say", "says", "seen", "show", "shows", "small", "take",
    "tell", "thing", "things", "think", "thought", "tells", "told",
    "use", "used", "using", "want", "wants", "well", "went", "gets",
    "getting", "gives", "giving", "goes", "going", "gone", "got",
    "gets", "half", "helps", "higher", "highest", "home", "instead",
    "keeps", "knows", "known", "lets", "long", "looks", "main",
    "makes", "matter", "maybe", "meant", "meets", "middle", "might",
    "months", "morning", "mostly", "moves", "often", "once", "opens",
    "ours", "owner", "owners", "passes", "passing", "phone", "places",
    "price", "quite", "rather", "returns", "runs", "running", "screen",
    "second", "seems", "shows", "shown", "shows", "side", "since",
    "says", "sets", "shows", "sits", "sitting", "small", "sort",
    "sound", "sounds", "source", "step", "steps", "story", "table",
    "takes", "taking", "tells", "terms", "thanks", "theirs", "third",
    "three", "together", "took", "top", "turn", "turns", "two",
    "under", "until", "upon", "usual", "varies", "walks", "wants",
    "watch", "ways", "weeks", "writes", "writing", "written", "years",
    "yours", "week", "years", "yet", "young",
}
# explicitly techy shape: CamelCase/dotted/upper, or a known tech word.
# Lesson-world nouns (board/badge/row/server...) are story furniture,
# not taught terms -- they must NOT be flagged as undefined.
TECH_WORDS = {
    "dom", "render", "renders", "component", "components", "state",
    "prop", "props", "hook", "hooks", "effect", "effects", "queue",
    "cache", "index", "client", "router", "store", "diff",
    "diffs", "filter", "input", "output", "reconciler",
    "reconciliation", "identity",
}
TECH_RE = re.compile(r"[A-Z][a-z]+[A-Z]|[/.]|[A-Z]{2,}")


def line_of(text, pos):
    return text.count("\n", 0, pos) + 1


def clean(raw):
    txt = TAG_RE.sub("", raw)
    txt = html.unescape(txt)
    return re.sub(r"\s+", " ", txt).strip()


def paras_of(text):
    out = []
    for m in PARA_RE.finditer(text):
        out.append((clean(m.group(1)), line_of(text, m.start()), m.group(1)))
    return out


def check_definitions(path):
    text = path.read_text(encoding="utf-8", errors="replace")
    warns = []
    paras = paras_of(text)
    has_deflist = bool(DEF_LIST_RE.search(text))
    dt_terms = {clean(m.group(1)).lower() for m in DT_RE.finditer(text)}
    dt_roots = set()  # "effects" defined => "effect" counts as defined
    for d in dt_terms:
        base = re.sub(r"\(.*", "", d).strip().lower()
        for w in re.findall(r"[a-z][a-z\-]*", base):
            dt_roots.add(w)
            dt_roots.add(re.sub(r"s$", "", w))

    strongs = []
    for m in STRONG_RE.finditer(text):
        term = clean(m.group(1))
        if not term or term in SKIP or term.lower() in SKIP:
            continue
        if re.match(r"\d", term):
            continue  # a story value ("12 late", "15"), not a taught term
        if re.fullmatch(r"[\d\s.,$%\-–—x×+*/=<>≤≥()]+", term):
            continue  # a pure number/symbol, not a term
        after = clean(text[m.end():m.end() + 300])[:200]
        strongs.append((term, m.start(), line_of(text, m.start()), after))

    # 1+2: gloss present? sentence instead of term?
    for term, pos, line, after in strongs:
        if len(term) > SENT_CHARS or len(term.split()) >= SENT_WORDS:
            warns.append((line, "STRONG sentence not term: "
                          + term[:70] + " -- dilutes defined-term signal"))
            continue
        if not GLOSS_RE.search(" " + after[:200]):
            warns.append((line, 'STRONG "%s" no gloss nearby '
                          '(-- / : / is / means within ~200 chars)' % term))

    # 1b: bare acronym with no expansion in the same block.
    # SKILL.md Rule 10: <strong>DNS</strong> (Domain Name System) is ...
    # A functional gloss alone ("a naming system") is not enough.
    # Catches both bare <strong>DNS</strong> and embedded <strong>IP address</strong>.
    def _block_of(pos):
        start_p, start_li = text.rfind("<p", 0, pos), text.rfind("<li", 0, pos)
        start = max(start_p, start_li)
        if start == -1:
            return text[max(0, pos - 500):pos + 500]
        end_p, end_li = text.find("</p>", pos), text.find("</li>", pos)
        ends = [e for e in (end_p, end_li) if e != -1]
        end = min(ends) + 5 if ends else pos + 500
        return text[start:end]

    def _has_expansion(plain, acr):
        # An expansion looks like "(Domain Name System)" or
        # "(Atomicity, Consistency, Isolation, Durability)" — letters/spaces/
        # hyphens/commas, no digits, no "=", no "e.g.". Single-word
        # "(Synchronize)" counts; "(e.g. seq=100)" and "(TTL)" do not.
        for m in re.finditer(r"\(([^)]+)\)", plain):
            inside = m.group(1).strip()
            if len(inside) < 4:
                continue
            if re.search(r"[0-9=]", inside):
                continue
            if "e.g." in inside.lower():
                continue
            if not re.fullmatch(r"[A-Za-z][A-Za-z\s\-,]+", inside):
                continue
            if " " not in inside and "," not in inside and len(inside) < 5:
                continue
            # Expansion must sit near the acronym, not pages away.
            try:
                acr_pos = plain.index(acr)
            except ValueError:
                acr_pos = len(plain) // 2
            if abs(m.start() - acr_pos) < 300:
                return True
        return False

    for term, pos, line, after in strongs:
        t = term.strip()
        # Doubled expansion: "Recurrent Neural Network (RNN) (Recurrent Neural
        # Network)" — pick one parenthetical, not two. Runs for every strong,
        # including single letters like Q/K/V.
        _dbl_block = _block_of(pos)
        _dbl_plain = clean(_dbl_block)
        if re.search(r"\)\s*\(", _dbl_plain):
            warns.append((line, 'STRONG "%s" has a doubled "(...) (...)" expansion '
                          "-- use exactly one parenthetical" % t))
        # "Top-Level Domain (TLD) servers" already carries its expansion.
        if "(" in t and ")" in t:
            continue
        cands = []
        if _is_acronym(t):
            cands = [t]
        else:
            for tok in re.findall(r"\b[A-Za-z][A-Za-z0-9\-/]*\b", t):
                if _is_acronym(tok):
                    cands.append(tok)
        if not cands:
            continue
        block = _dbl_block
        plain_block = _dbl_plain
        for acr in cands:
            if not _has_expansion(plain_block, acr):
                warns.append((line, 'STRONG "%s" is a bare acronym with no '
                              '"(...) expansion" in the same paragraph -- use '
                              '"<strong>%s</strong> (Full Form) is ..." on first use'
                              % (t, acr)))

    # short terms for later checks
    defs = {}
    for term, pos, line, after in strongs:
        if len(term) <= 40 and len(term.split()) <= 4:
            if term.lower() not in defs:
                pi = next((i for i, (_, ln, _) in enumerate(paras)
                           if ln >= line), len(paras))
                defs[term.lower()] = (term, line, pi)
    # defined roots: strong terms + deflist roots, singular+plural
    defined_roots = set(defs) | dt_terms | dt_roots
    for k in list(defs):
        for w in re.findall(r"[a-z][a-z\-]*", k):
            defined_roots.add(w)
            defined_roots.add(re.sub(r"s$", "", w))

    # 3: used before defined (bare use in earlier <p>)
    for key, (orig, dline, dpara) in defs.items():
        pat = re.compile(r"\b" + re.escape(key) + r"\b", re.I)
        for i in range(min(dpara, len(paras))):
            pt, pln, praw = paras[i]
            if pat.search(pt) and "<strong>" not in praw.lower():
                warns.append((pln, '"%s" used here (para %d) but first '
                              "<strong>-defined at line %d" % (orig, i + 1, dline)))
                break

    # 4: frequent <code> terms never defined. Only API-shaped names
    # (CamelCase / dotted / useXxx) count -- lowercase single words are
    # local variable names (filter, count), defined by their own code.
    codes = []
    for m in CODE_RE.finditer(text):
        c = clean(m.group(1)).strip().strip("$#>.")
        if 2 <= len(c) <= 30 and re.search(r"[A-Za-z]", c):
            if c.lower() in SKIP or c.lower() in COMMON:
                continue
            if not (TECH_RE.search(c) or re.search(r"[A-Z_.]", c)):
                continue  # plain lowercase variable, not a teachable term
            codes.append(c.lower())
    for term, n in sorted(Counter(codes).items(), key=lambda kv: -kv[1]):
        if n < CODE_MIN or term in defined_roots:
            continue
        m = re.search(r"<code>" + re.escape(term), text, re.I)
        ln = line_of(text, m.start()) if m else 1
        warns.append((ln, "<code>%s</code> used %dx but never <strong>-defined "
                      "or in <dt> -- assumed known" % (term, n)))

    # 4b: frequent PROSE terms never defined (the DOM/component/diff gap).
    # Body only, code examples removed; <code> contents excluded too, so
    # Array.filter / useState / variable names can't inflate prose counts.
    body = text
    mb = re.search(r"<main\b.*?</main>", text, flags=re.S | re.I)
    if mb:
        body = mb.group(0)
    nocode = re.sub(r"<pre\b.*?</pre>", " ", body, flags=re.S | re.I)
    nocode = re.sub(r"<code\b.*?</code>", " ", nocode, flags=re.S | re.I)
    nocode = re.sub(r"<figcaption\b.*?</figcaption>", " ", nocode, flags=re.S | re.I)
    plain = clean(nocode).lower()
    for m in re.finditer(r"\b([a-z][a-z\-/]{2,29})\b", plain):
        pass  # counted below via Counter on word list
    words = re.findall(r"\b[a-z][a-z\-/]{2,29}\b", plain)
    for term, n in sorted(Counter(words).items(), key=lambda kv: -kv[1]):
        if n < PROSE_MIN or term in SKIP or term in COMMON:
            continue
        root = re.sub(r"s$", "", term)
        if term in defined_roots or root in defined_roots:
            continue
        if term in Counter(codes):  # already reported as code, skip double
            continue
        if not (TECH_RE.search(term) or term in TECH_WORDS):
            continue  # plain English, however frequent, is not a "term"
        # point at the first bare prose use, not line 1
        ln = 1
        mp = re.search(r"<p\b[^>]*>[^<]*\b" + re.escape(term) + r"\b", body, re.I | re.S)
        if mp:
            ln = line_of(text, mp.start())
        warns.append((ln, '"%s" used %dx in prose but never <strong>-defined '
                      "or in <dt> -- assumed known" % (term, n)))
        if sum(1 for _, msg in warns if "in prose but never" in msg) >= 8:
            break

    # 5: <em> that looks like a term: multi-word, or single word reused.
    # Single common words in <em> (again/after/too/every/next/read) are
    # narrative emphasis, not terms -- require 2+ words here.
    for e in sorted({clean(m.group(1)) for m in EM_RE.finditer(text)}):
        eu = e.strip().strip('"“”"').lower().rstrip(".")
        if len(e) > 60 or e.lower() in defs or eu in SKIP or eu in SKIP_EM:
            continue
        if len(e.split()) < 2:  # single-word <em> is emphasis, not a term
            continue
        m = re.search(r"<em>" + re.escape(e[:30]), text, re.S)
        ln = line_of(text, m.start()) if m else 1
        warns.append((ln, '<em>"%s"</em> looks like a term but never '
                      "<strong>-defined with gloss" % e))

    # 6: buried defs (many terms, no deflist)
    if len(defs) >= 4 and not has_deflist:
        warns.append((1, "%d defined terms and no <dl class=\"deflist\"> "
                      "-- defs buried in story paragraphs" % len(defs)))
    return strongs, warns

def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("paths", nargs="+")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()
    flagged = 0
    for raw in args.paths:
        p = Path(raw)
        if not p.exists():
            print("%s: not found" % p, file=sys.stderr)
            continue
        strongs, warns = check_definitions(p)
        if warns:
            flagged += 1
        if warns or not args.quiet:
            print("%s (%d <strong>, %d warning(s))"
                  % (p, len(strongs), len(set(warns))))
            for ln, msg in sorted(set(warns)):
                print("  warn    line %-5d %s" % (ln, msg))
            if not warns:
                print("  OK - every term carries its gloss in place")
    if flagged:
        print("\n%d file(s) with definition findings." % flagged)
    else:
        print("\nAll files passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

