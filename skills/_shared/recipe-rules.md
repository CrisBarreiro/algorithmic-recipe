# Shared recipe rules

Rules every recipe skill in this repo follows. Each skill's `SKILL.md` links here and adds only what is specific to it. Change a shared rule here, once.

## Reading the source

- Read the whole source, including a URL or attachment. When a blog post and its recipe card disagree (times, quantities), follow the card, and use the printable version when there is one (`/wprm_print/...` on WordPress recipe sites).
- If the source is a URL, keep it for the page's source link.
- Omit any time, yield or note the source does not give, unless the skill says you may judge it.

## Ingredients and units

- **Ingredients stay as the source gives them.** Layout skills never change an ingredient. The one hand-off: if the source calls for a gluten-free flour blend without naming a brand or giving its composition, run `/gluten-free-recipe` on it first (it swaps in Cris's homemade blend) and lay out its result.
- **Never convert units.** Give only the quantities and temperatures the source gives, in its units (both when it gives both). Do not estimate grams from cups or cups from grams, and do not add a weight to a teaspoon amount. A conversion skill applies each change to every unit the source gives.
- **Lengths are the one exception.** Write inches as centimetres first with the inches in parentheses (`2.5 cm (1 in)`), and round pan and tray sizes to the nearest standard metric size (`20 cm (8 in) round`, `23 × 33 cm (9 × 13 in)`, `22 × 11 cm (8½ × 4½ in) loaf`).

## Steps and wording

- **Keep every detail.** Every technique, time, temperature, visual cue and "why" tip from the source survives. Tips go under their step in `<span class="tip">...</span>`.
- **Reword**; do not copy the source's sentences. Numbers and cues ("amber, nutty smell, dark specks") stay exact.
- **Let the layout name the ingredients.** The rows beside a step already show what goes in, so the step names the action and what the layout can't show (technique, time, temperature, cues): "Stir into the potatoes", not "Stir the butter into the potatoes". Name an ingredient only when the step handles it differently from the others (one at a time, part now, part later).

## Output

- One self-contained `.html` file named after the recipe (`potato-puree.html`). If the session is attached to the "Recipes" project, it goes to `recipes/<slug>.html` there with project_write; otherwise use the skill's example in `examples/` as the reference. If Artifact is available, load its design guidance and publish the page; otherwise send the file.
- Before delivering, re-read the page against the source: every ingredient, quantity, step and tip present and correct.
- Reply in one or two sentences, flagging assumptions (missing times, judged values). Do not recap the steps, and do not name the conversion rules that were applied.
