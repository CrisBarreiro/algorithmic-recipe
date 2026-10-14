---
name: "algorithmic-recipe"
description: "Rewrites any recipe as an \"algorithmic\" cumulative table (ingredient rows in order of addition, merged step cells in a staircase) as a phone-friendly light/dark HTML page."
---

# Algorithmic recipe

An algorithmic recipe is a grid where you can see, at every step, exactly what is already in the bowl. Ingredients are rows in the order they are added; each step is a cell to the right whose height covers every ingredient used so far. The result is a staircase. Cooks read it left to right like a program and glance down a column to know what is in the mixture. When a layout decision is unclear, remember the purpose: "what is in the bowl right now?" must be answerable at a glance.

If the session is attached to the "Recipes" project, existing pages in `recipes/` (e.g. `examples/espresso-brownies.html` in this repo) are the reference for look and structure; read one with project_read if in doubt, and save new recipes there with project_write at `recipes/<slug>.html`.

## Workflow

1. **Parse the recipe.** Collect title, serves, prep / cook / bake times, ingredients with quantities, every instruction, every tip or "why" note, storage, and extras (variations, photos). If the source is a URL or attachment, read it fully first. If a time is missing, omit that item rather than inventing it.
2. **Find the order of addition.** Walk through the method and list each ingredient at the moment it enters a bowl or pan. That is the row order. Split an ingredient into two rows when only part is used at one step and the rest later (most of the chocolate folded in, the rest kept for the top).
3. **Plan the columns.** One column per step, in the order steps happen. Steps with no ingredient go in full-width rows above the grid. Steps done separately (dry ingredients whisked in their own bowl) get their own cell in the empty lower-left area.
4. **Compute spans**, write the HTML from the skeleton below, and run the grid check (below). Fix anything it reports.
5. **Deliver** (see Output).

## Layout rules

- **No-ingredient prep steps** (lining or greasing a tin, preheating) are full-width rows at the very top, one per row: `<td class="top" colspan="N"><div>...</div></td>`. The inner div is sticky so the text stays readable while the table scrolls sideways. N = number of `<col>`s.
- **Ingredient column** (leftmost, sticky, `td.ing`): one row per ingredient, quantity first in `<span class="q">`, metric first with imperial in brackets when the source gives both (`200g (1¾ sticks)`).
- **Step cells** sit to the right, left to right in order. A step cell starts at the first ingredient row and runs down through the last ingredient added up to that point (its `rowspan`). "Melt" covers only the butter row; the first "mix" covers butter through the last ingredient added with it; each later step is taller. Final steps (bake, cool, slice) cover every row.
- **Separately prepared parts**: one cell in the rows of their own ingredients, right of the ingredient column. Its `colspan` is the number of columns between the ingredient column and the combining step; its `rowspan` is the number of its ingredient rows. The combining step then extends down to cover those rows.
- **Unused lower-left cells** are empty and borderless: `<td class="gap" rowspan=".." colspan=".."></td>`, merged into the largest rectangles possible so the staircase is clean. Every grid position is covered by exactly one cell.
- **Each step cell begins with a short bold action label**: `<span class="lab">Mix</span>`. A cell may hold several `<div class="part">`s when one pan-step has consecutive actions (Brown, then Pour and cool).
- `colgroup` has one `<col>` per grid column with explicit pixel widths (ingredient ~190-200px, steps ~150-290px, wider for long text). Table `width` = their sum.

### Worked example (espresso brownies, `examples/espresso-brownies.html`)

Ingredient rows: butter(1), sugar(2), vanilla(3), espresso(4), eggs(5), flour(6), cocoa(7), baking soda(8), salt(9). Six columns: ingredients, Melt, Mix, Mix, Fold in, Bake.
- Melt: butter only, row 1, no rowspan; rows 2-9 below it are empty.
- Mix (sugar, vanilla, espresso): rows 1-4, `rowspan="4"`; rows 2-4 of the Melt column are one `gap` cell `rowspan="3"`.
- Mix (eggs): rows 1-5, `rowspan="5"`; row 5 has a `gap` with `colspan="2"` (the Melt and first Mix columns).
- Row 6 (flour): a `gap` with `colspan="3"` and `rowspan="4"` covers rows 6-9 of the first three step columns.
- Fold in (flour, cocoa, baking soda, salt) and Bake: rows 1-9, `rowspan="9"`.
- Two full-width `top` rows above (prepare the pan, preheat) with `colspan="6"`.

## Content rules

- **Keep everything.** Every instruction, temperature, time, visual cue and "why" tip survives. Do not simplify, merge away or shorten.
- **Reword in your own words**; do not copy the source's sentences. Numbers and cues ("amber, nutty smell, dark specks") stay exact.
- **Tips** go in small secondary text under the step they belong to: `<span class="tip">...</span>`.
- **Above the table**: `h1` title, a `.meta` list (serves, prep, cook, bake; only those the source gives), and the one-line `.hint`. **Below it**: storage in `<p class="store"><b>Storage</b> ...</p>`. Extra material (variations) goes in a `.twist` box after the table. Photos, if supplied, go in a `.photos` grid above the hint.

## Output

Plain markdown tables cannot merge cells, so the grid is always an HTML table.

- Write one self-contained `.html` file from the skeleton below, named after the recipe (`espresso-brownies.html`).
- If Artifact is available, load its design guidance and publish the page (recipes are kept and shared); otherwise send the file. Keep the template behaviour: phone-readable with 16px side padding and no page-level horizontal scroll (table scrolls inside `.wrap`); light and dark mode via `:root` tokens, the `prefers-color-scheme` block guarded by `:root:not([data-theme="light"])`, and the `[data-theme="dark"]` override; pinned ingredient column and pinned top-row text.
- Before delivering, run the grid check, then re-read the page against the source once: every ingredient present, every tip present, quantities correct.
- Reply with one or two sentences on the result and flag assumptions (converted quantity, missing time). Do not recap the steps.

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

Before delivering, verify that every grid position is covered exactly once. Quick method: write the page to a file and run a short Python script (use `python3 -I`) that parses the first `<table>` with `html.parser`, counts `<col>`s as the column count and `<tr>`s as the row count, then places each `<td>` left to right into the first free position, marking `rowspan x colspan` positions as occupied. Report: an "overlap" if a position is claimed twice, a "hole" if any position is never covered (add a `td.gap` or fix a span), and an error if a cell runs past the last row or last column. Also confirm column 1 of every row below the `.top` rows is a `td.ing`, and that the final step cells have a rowspan equal to the number of ingredient rows. Fix all errors, then re-run until clean.