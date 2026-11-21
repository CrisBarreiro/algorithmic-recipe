---
name: "cookbook-recipe"
description: "Rewrites any recipe in a cookbook-style layout (metadata block, short intro, ingredient table with weight, volume and scaling %, numbered procedure beside the ingredients each step adds, variation, make ahead) as a phone-friendly light/dark HTML page."
---

# Cookbook recipe

A recipe laid out like a professional cookbook page. Ingredients are grouped by the step that adds them, and each group sits next to its numbered steps, so the procedure reads top to bottom alongside the ingredients it uses. Weights come first and every ingredient carries a scaling percentage, so the recipe can be scaled by changing one number.

If the session is attached to the "Recipes" project, new pages go to `recipes/<slug>.html` with project_write. Otherwise `examples/espresso-brownies-cookbook.html` in this repo is the reference.

## Page sections, in order

1. **Title** (`h1`, shown in capitals), then a `<p class="src">` link to the original when the source is a URL.
2. **Metadata** (`dl.meta`), only the rows you have:
   - *Yield*: servings and total weight or volume (`four to six servings (630 g / 2½ cups)`).
   - *Time estimate*: total, split into active and unattended time when known.
   - *Storage notes*: how long it keeps and where.
   - *Level of difficulty*: easy, moderate or advanced (your judgement from the method; say so in the reply).
   - *Special requirements*: equipment or techniques beyond a normal kitchen (sous vide, ricer, stand mixer).
3. **Intro** (`div.intro`, one to three short paragraphs): what makes the dish work, ingredient choices and the key technique. Built from the source's headnote and tips, reworded.
4. **Ingredient table** (see below).
5. **Variation** (`h2` + `div.note`): related dishes as one-line swaps, with the variation name on its own line. Only when the source gives one.
6. **To make ahead** (`h2` + `div.note`): where to pause, how to store, and which step number to resume from. Only when the source gives it or the method has an obvious pause point.

## Ingredient table

Columns: **Ingredient** (name, prep note in `<span class="prep">` underneath, such as "peeled" or "cubed, room temperature"), **Weight**, **Volume**, **Scaling**, **Procedure**.

- **Groups.** One `<tbody>` per group of ingredients that enter together. The first row of the group carries `<td class="proc" rowspan="N">`, N = rows in the group, holding the steps that use them.
- **Steps.** Numbered once across the whole recipe, `<li><span class="n">3</span><span>text</span></li>`. Steps before any ingredient (preheat, set up a water bath) go in the first group. Steps after the last ingredient (bake, cool, serve) go in the last group.
- **Repeats.** If an ingredient is used again later (water to blanch, then water to cook), give it a new row in the later group.
- **Weight** in metric (g, kg), the primary quantity. Use "to taste" or "as needed" when the source does.
- **Volume** in cups and spoons, with mL for liquids, or a count (`about 4 potatoes`, `2 large`). Prefix "about" when it is a conversion.
- **Scaling** as a percentage of the base ingredient's weight, rounded (1 decimal under 10%). The base is the main ingredient (potatoes in a purée), or flour for baked goods. When flours and starches are blended, the base is their total; say so under the table in `<p class="base">`. Leave blank for "to taste" rows.
- When the source gives only volumes, convert to grams with standard densities and say so in the reply.

## Content rules

- Keep every time, temperature, visual cue and "why" tip from the source. Tips go in the step as `<span class="tip">...</span>` or in the intro.
- Reword; do not copy the source's sentences. Numbers and cues stay exact.
- Steps name the action, not the ingredient list: the row beside them already shows what goes in ("Stir into the potatoes", not "Stir the butter into the potatoes").
- Omit metadata rows and sections the source gives nothing for, except difficulty and special requirements, which you can judge from the method.

## Output

- One self-contained `.html` file named after the recipe (`potato-puree.html`). If Artifact is available, load its design guidance and publish the page; otherwise send the file.
- Copy the skeleton's CSS as is. It already handles light/dark and phones (below 640px each group stacks its ingredients with its steps underneath).
- Before delivering, re-read the page against the source: every ingredient, quantity, step and tip present, step numbers consecutive, each `rowspan` equal to its group's row count, scaling percentages recomputed from the weights.
- Reply in one or two sentences, flagging assumptions (converted weights, judged difficulty, missing times). Do not recap the steps.

## HTML skeleton (copy it, do not redesign)

```html
<title>Recipe title</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap">
<style>
:root{--bg:#fbfaf7;--ink:#1f1d1a;--muted:#6b665d;--rule:#d9d5cc;--accent:#b0302a;
  --serif:"Source Serif 4",Georgia,"Times New Roman",serif}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#1a1917;--ink:#ece9e2;--muted:#a39d92;--rule:#3d3a35;--accent:#ef7a6c;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#1a1917;--ink:#ece9e2;--muted:#a39d92;--rule:#3d3a35;--accent:#ef7a6c;color-scheme:dark}
body{background:var(--bg);color:var(--ink);font-family:var(--serif);font-size:15px;line-height:1.45;padding:24px 16px;margin:0}
main{max-width:960px;margin-inline:auto}
h1{font-size:clamp(1.4rem,5vw,1.8rem);font-weight:600;text-transform:uppercase;letter-spacing:.02em;margin:0 0 16px}
h2{font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);margin:24px 0 4px}
.src{margin:-8px 0 14px;font-size:13px;color:var(--muted)}
.src a{color:var(--accent)}
.meta{display:grid;grid-template-columns:max-content 1fr;gap:2px 24px;margin:0 0 18px}
.meta dt{font-size:12px;text-transform:uppercase;letter-spacing:.08em;padding-top:2px}
.meta dd{margin:0;font-style:italic}
@media (max-width:520px){.meta{grid-template-columns:1fr}.meta dd{margin-bottom:6px}}
.intro{columns:2 300px;column-gap:28px;margin:0 0 20px}
.intro p{margin:0;text-indent:1.2em}.intro p:first-child{text-indent:0}
table{border-collapse:collapse;width:100%;font-size:14px}
th{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;text-align:left;padding:4px 10px 4px 0;border-bottom:1.5px solid var(--accent)}
td{padding:4px 10px 4px 0;vertical-align:top}
tbody+tbody tr:first-child td{border-top:1px solid var(--rule)}
tbody td{padding-top:6px}
td.ing{width:24%}td.w,td.v,td.s{white-space:nowrap}
td.s{color:var(--muted)}
.prep{display:block;font-size:13px;color:var(--muted)}
td.proc{width:46%}
td.proc ol{margin:0;padding:0;list-style:none}
td.proc li{display:flex;gap:8px}td.proc li+li{margin-top:4px}
.n{flex:none;width:1.4em;height:1.4em;margin-top:.05em;border:1px solid currentColor;border-radius:50%;font-size:11px;line-height:1.4em;text-align:center}
.tip{display:block;font-size:13px;color:var(--muted)}
.note p{margin:0}
.base{margin:6px 0 0;font-size:13px;color:var(--muted)}
/* phone: each group stacks its ingredients, then its steps underneath */
@media (max-width:640px){
  thead tr,tbody{display:grid;grid-template-columns:minmax(0,1fr) 4.2em 6.5em 3.4em}
  tr{display:contents}th:last-child{display:none}
  td.ing,td.proc{width:auto}td.w,td.v{white-space:normal}
  td.proc{grid-column:1/-1;order:1;padding:6px 0 10px}
}
</style>
<main>
<h1>Recipe title</h1>
<!-- only when the source is a URL -->
<p class="src">Original recipe: <a href="https://example.com/recipe">Site name</a></p>
<dl class="meta">
  <dt>Yield</dt><dd>four to six servings (630 g / 2½ cups)</dd>
  <dt>Time estimate</dt><dd>2 hours overall, including 30 minutes of preparation and 1½ hours unattended</dd>
  <dt>Storage notes</dt><dd>keeps for 2 days when refrigerated</dd>
  <dt>Level of difficulty</dt><dd>moderate</dd>
  <dt>Special requirements</dt><dd>ricer</dd>
</dl>
<div class="intro">
  <p>What makes the dish work and why these ingredients.</p>
  <p>The key technique, and what to avoid.</p>
</div>
<table>
<thead><tr><th>Ingredient</th><th>Weight</th><th>Volume</th><th>Scaling</th><th>Procedure</th></tr></thead>
<!-- one tbody per group; rowspan = rows in the group -->
<tbody>
<tr><td class="ing">Main ingredient<span class="prep">peeled</span></td><td class="w">500 g</td><td class="v">about 4</td><td class="s">100%</td>
<td class="proc" rowspan="2"><ol>
  <li><span class="n">1</span><span>Step with no ingredients, such as preheating.</span></li>
  <li><span class="n">2</span><span>Step using this group.<span class="tip">Why, or a visual cue.</span></span></li>
</ol></td></tr>
<tr><td class="ing">Water</td><td class="w">1 kg</td><td class="v">1 L / 4¼ cups</td><td class="s">200%</td></tr>
</tbody>
<tbody>
<tr><td class="ing">Salt</td><td class="w">to taste</td><td class="v"></td><td class="s"></td>
<td class="proc"><ol>
  <li><span class="n">3</span><span>Season, and serve warm.</span></li>
</ol></td></tr>
</tbody>
</table>
<!-- only when the base is not a single row at 100% -->
<p class="base">Scaling is relative to the total flour and starch (635 g = 100%).</p>
<h2>Variation</h2>
<div class="note"><p>Variation name</p><p>Substitute X for Y.</p></div>
<h2>To make ahead</h2>
<div class="note"><p>After step 2, refrigerate until ready to serve. Then continue with step 3.</p></div>
</main>
```
