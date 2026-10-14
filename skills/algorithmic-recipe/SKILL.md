---
name: "algorithmic-recipe"
description: "Rewrites any recipe as an \"algorithmic\" cumulative table (ingredient rows in order of addition, merged step cells in a staircase) as a phone-friendly light/dark HTML page."
---

# Algorithmic recipe

A grid that shows, at every step, what is already in the bowl. Ingredients are rows in order of addition; each step is a cell to the right spanning every ingredient used so far, so the steps form a staircase read left to right. When a layout choice is unclear, pick whatever keeps "what is in the bowl now?" answerable at a glance.

If the session is attached to the "Recipes" project, pages in `recipes/` are the style reference (read one with project_read) and new pages go there with project_write at `recipes/<slug>.html`. Otherwise `examples/espresso-brownies.html` in this repo is the reference.

## Workflow

1. **Parse.** Read the whole source (URL or attachment included). Collect title, serves, prep / cook / bake times, ingredients with quantities, every instruction and tip, storage, variations and photos. Omit any time the source does not give. If the source is a URL, keep it for the source link.
2. **Order the rows.** List each ingredient when it first enters a bowl or pan. Split one into two rows when part is used now and the rest later.
3. **Plan the columns.** One per step, in order. Steps with no ingredients become full-width rows on top; steps done in a separate bowl get their own cell in the empty lower-left.
4. **Write the HTML** from the skeleton below, run the grid check and fix what it reports.
5. **Deliver** (see Output).

## Layout rules

- **Prep steps without ingredients** (greasing a tin, preheating): one full-width row each at the top, `<td class="top" colspan="N"><div>...</div></td>`, N = number of `<col>`s. The inner div is sticky so it stays readable while the table scrolls sideways.
- **Ingredient column** (`td.ing`, sticky): one row per ingredient, quantity first in `<span class="q">`, metric then imperial in brackets when the source gives both (`200g (1¾ sticks)`).
- **Step cells** start at the first ingredient row and span down to the last ingredient added so far (`rowspan`). Final steps (bake, cool, slice) span every row.
- **Separately prepared parts**: one cell on their own ingredient rows, `colspan` = columns between the ingredient column and the step that combines them. That combining step spans down over those rows.
- **Gaps**: fill unused lower-left positions with borderless `<td class="gap">`, merged into the largest rectangles possible. Every grid position is covered by exactly one cell.
- **Labels**: each step cell starts with a bold action, `<span class="lab">Mix</span>`. Use several `<div class="part">`s when one step has consecutive actions (Brown, then Pour and cool).
- **Widths**: one `<col>` per column with pixel widths (ingredients ~190-260px, steps ~130-290px, wider for long text). Table `width` = their sum.

Example (`examples/espresso-brownies.html`): rows are butter, sugar, vanilla, espresso, eggs, flour, cocoa, baking soda, salt. Melt spans row 1, Mix rows 1-4, Mix rows 1-5, Fold in and Bake rows 1-9. Gaps: `rowspan="3"` under Melt, `colspan="2"` beside eggs, `colspan="3" rowspan="4"` beside the dry ingredients.

## Content rules

- **Let the grid name the ingredients.** A step's rows already show what goes in, so don't list them again in the text. Write only what the grid can't show: technique, time, temperature, visual cues, tips. If the label says it all, the cell is just the label. Name an ingredient only when the step handles it differently from its other rows (one at a time, part now, part later).
- **Keep every detail.** Every technique, time, temperature, visual cue and "why" tip survives; only ingredient lists the grid already shows are dropped.
- **Reword**; do not copy the source's sentences. Numbers and cues ("amber, nutty smell, dark specks") stay exact.
- **Tips** go under their step in `<span class="tip">...</span>`.
- **Around the table**: above it, the `h1`, a `<p class="src">` link to the original when the source is a URL, a `.meta` list (serves, prep, cook, bake; only those given), an optional `.photos` grid, then the `.hint`. Below it, `<p class="store"><b>Storage</b> ...</p>` and a `.twist` box for variations.

## Output

The grid needs merged cells, so it is always an HTML table, never markdown.

- Write one self-contained `.html` file named after the recipe (`espresso-brownies.html`). If Artifact is available, load its design guidance and publish the page; otherwise send the file.
- Keep the skeleton's behaviour: 16px side padding with the table scrolling inside `.wrap`, light/dark tokens (`prefers-color-scheme` block guarded by `:root:not([data-theme="light"])`, plus the `[data-theme="dark"]` override), pinned ingredient column and top-row text.
- Before delivering, run the grid check and re-read the page against the source: every ingredient, tip and quantity present and correct.
- Reply in one or two sentences, flagging assumptions (converted quantity, missing time). Do not recap the steps.

## HTML skeleton (copy it, do not redesign)

```html
<title>Recipe title</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500&display=swap">
<style>
:root{--bg:#f6f6f3;--card:#fdfdfb;--ink:#24221e;--muted:#6b675f;--rule:#cfcdc5;--tint:#ebeae4;--accent:#8a5516;--accent-bg:#f1e4cf;
  --display:"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif;--body:"IBM Plex Sans","Helvetica Neue",Arial,sans-serif;--mono:"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#1a1917;--card:#211f1c;--ink:#ece9e2;--muted:#a09b90;--rule:#3d3a35;--tint:#2a2723;--accent:#e2a85a;--accent-bg:#3a2d1b;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#1a1917;--card:#211f1c;--ink:#ece9e2;--muted:#a09b90;--rule:#3d3a35;--tint:#2a2723;--accent:#e2a85a;--accent-bg:#3a2d1b;color-scheme:dark}
body{background:var(--bg);color:var(--ink);font-family:var(--body);font-size:14px;line-height:1.5;padding-inline:16px;padding-block:24px}
main{max-width:1480px;margin-inline:auto}
h1{font-family:var(--display);font-weight:600;font-size:clamp(1.7rem,6vw,2.4rem);line-height:1.1;margin:0 0 14px;text-wrap:balance;letter-spacing:-0.01em}
.meta{display:flex;flex-wrap:wrap;gap:6px 20px;margin:0 0 8px;padding:0;list-style:none;font-size:13px;color:var(--muted)}
.meta b{font-family:var(--mono);font-weight:500;color:var(--ink);font-size:13px;margin-right:4px}
.hint{margin:0 0 16px;font-size:13px;color:var(--muted)}
.src{margin:-6px 0 10px;font-size:13px;color:var(--muted)}
.src a{color:var(--accent)}
.photos{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:8px;margin:0 0 16px}
.photos figure{margin:0;min-width:0;position:relative}
.photos img{display:block;width:100%;height:100%;object-fit:cover;aspect-ratio:1/1;background:var(--tint)}
.photos figcaption{position:absolute;left:0;bottom:0;padding:4px 8px;font-size:12px;background:var(--card);color:var(--ink)}
@media (max-width:560px){.photos{grid-template-columns:minmax(0,1fr)}}
.wrap{overflow-x:auto;border:1px solid var(--rule)}
table{border-collapse:collapse;table-layout:fixed;width:1450px;min-width:100%} /* width = sum of <col> widths */
td{padding:10px 12px;border:1px solid var(--rule);vertical-align:top;min-width:0;overflow-wrap:anywhere;background:var(--card)}
td.top{background:var(--tint);padding:0}
td.top>div{position:sticky;left:0;box-sizing:border-box;width:min(680px,calc(100vw - 34px));padding:10px 12px}
td.ing{position:sticky;left:0;z-index:1;background:var(--tint);box-shadow:inset -1px 0 0 var(--rule)}
td.gap{border:0;background:var(--bg);padding:0}
.q{font-family:var(--mono);font-weight:500;font-size:13px;color:var(--accent)}
.lab{display:block;font-family:var(--display);font-weight:600;font-size:14px;color:var(--accent);margin-bottom:4px}
.part+.part{margin-top:14px}
.tip{display:block;margin-top:6px;font-size:13px;color:var(--muted)}
.star{color:var(--accent);font-weight:500}
.store,.twist{margin:16px 0 0;padding:10px 12px;background:var(--accent-bg);font-size:14px}
.store b,.twist b{font-family:var(--display);font-weight:600}
.twist p{margin:0}.twist p+p{margin-top:6px}
</style>
<main>
<h1>Recipe title</h1>
<!-- only when the source is a URL; link text is the site or author name -->
<p class="src">Original recipe: <a href="https://example.com/recipe">Site name</a></p>
<ul class="meta"><li><b>8</b>serves</li><li><b>30 min</b>prep</li><li><b>6 min</b>cook</li><li><b>28 min</b>bake</li></ul>
<p class="hint">Ingredients are listed in the order they go in. Each step covers every ingredient beside it, and the steps run left to right. Scroll sideways on a phone.</p>
<div class="wrap">
<table>
<colgroup><col style="width:190px"><col style="width:280px"><col style="width:190px"><col style="width:170px"></colgroup>
<tbody>
<!-- prep steps, one full-width row each -->
<tr><td class="top" colspan="4"><div><span class="lab">Preheat</span>Instruction.<span class="tip">Why / tip.</span></div></td></tr>
<!-- ingredient rows; first row also holds the first step cells -->
<tr>
<td class="ing"><span class="q">200g (1¾ sticks)</span> first ingredient</td>
<td><span class="lab">Melt</span>Covers row 1 only.</td>
<td rowspan="3"><span class="lab">Mix</span>Covers rows 1-3.</td>
<td rowspan="4"><span class="lab">Bake</span>Final step covers all 4 rows.</td>
</tr>
<tr><td class="ing"><span class="q">150g</span> second</td><td class="gap" rowspan="2"></td></tr>
<tr><td class="ing"><span class="q">1</span> third</td></tr>
<!-- separately prepared part: colspan = columns before the combining step -->
<tr><td class="ing"><span class="q">100g</span> dry ingredient</td><td colspan="2"><span class="lab">Whisk</span>Separate bowl.</td></tr>
</tbody>
</table>
</div>
<p class="store"><b>Storage</b> Storage note.</p>
</main>
```

## Grid check

Parse the first `<table>` with a short `python3 -I` script using `html.parser`: columns = number of `<col>`s, rows = number of `<tr>`s. Place each `<td>` in the first free position of its row and mark its `rowspan x colspan` area. Report overlaps (a position claimed twice), holes (never covered: add a `td.gap` or fix a span) and cells running past the last row or column. Also check that column 1 of every non-`.top` row is a `td.ing` and that final steps span all ingredient rows. Fix and re-run until clean.
