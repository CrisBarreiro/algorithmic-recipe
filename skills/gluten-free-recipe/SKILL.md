---
name: "gluten-free-recipe"
description: "Converts a recipe that contains gluten into a gluten-free one by following Cris's own rules (picks the rule set for the type of bake, swaps in the homemade gluten-free flour blend, adds xanthan gum, adjusts fat and liquids, lists every change). Also use it whenever a recipe calls for a gluten-free flour blend without naming a brand or composition, to swap in the homemade blend."
---

# Gluten-free recipe

Converts a recipe with gluten into a gluten-free one using the rules in `rules.md`, next to this file. Read `rules.md` in full before converting anything. It is Cris's own system and the only source for ratios: never add a substitution, ratio or technique that is not written there.

For dairy-free, use the separate `/dairy-free-recipe` skill. When the person wants both, run this one first, then hand the result to `/dairy-free-recipe`, so its swaps apply to the already reduced quantities.

The result is the converted recipe as text. To lay it out as a page, hand it to `/cookbook-recipe` or `/algorithmic-recipe` afterwards; this skill does not render HTML.

## Already gluten-free recipes with a generic blend

When the source is already gluten-free but calls for a gluten-free flour blend without naming a brand or giving its composition, only swap the blend: replace it with the homemade blend in the same amount and the same units, split as in step 2. Skip the rule sets: no flour reduction, and xanthan gum, fat and liquids stay as written. A named shop-bought blend, or one whose flours the source lists, stays as it is. List the swap under Changes.

## 1. Pick the rule set

Decide what kind of bake the recipe is, using the flowchart at the top of `rules.md` and the rule set titles:

| Recipe | Rule set |
| --- | --- |
| Banana bread | Butter cakes |
| Cake with melted chocolate in the batter | Chocolate cakes |
| Cake with lots of butter or oil, loaf cake, pound cake (same weight of each), cupcakes, muffins | Butter cakes |
| Swiss roll, or a sponge built on whipped egg whites | Swiss rolls and sponge cakes |
| Brownies | Brownies |
| Cookies that hold their shape (cut-out, shortbread) | Cookies that hold their shape |
| Cookies that spread (chocolate chip, drop cookies) | Cookies that spread |
| Soft, cake-like cookies (madeleines, soft-baked) | Cake-like cookies |
| Shortcrust (tart and pie dough) | Shortcrust pastry |
| Puff or rough-puff pastry | Puff and flaky pastry |
| Thick pancakes | Thick pancakes |
| Fluffy pancakes | Fluffy pancakes |
| Baked cheesecake | Baked cheesecake |
| Bread and other yeasted doughs | Bread and yeasted doughs (not written yet, see Gap) |

Check the chocolate question first for cakes: a cake with melted chocolate in the batter takes the chocolate rules even if it is also rich in butter. If the recipe fits none, or sits between two, ask instead of picking.

A recipe with several components (a tart: shortcrust plus filling) gets the matching rule set for each component that contains gluten.

## 2. Apply the rules

Apply every rule in the chosen set, in order.

- **Flour.** Replace the wheat flour with the homemade gluten-free flour blend. Some rule sets keep the same amount; others reduce it by 10% (250 g flour → 225 g blend). Round the blend to the nearest 5 g.
- **The blend** is 50% starch, 25% "light" protein flour and 25% "heavy" protein flour (see `rules.md`). Use Cris's own picks unless the person names others: cornstarch, brown rice flour and gluten-free oat flour. List the three as their own rows, split in the source's unit (225 g blend → 112.5 g cornstarch, 56.3 g brown rice flour, 56.2 g gluten-free oat flour, to one decimal and adjusted so they add up), with the blend total in the prep note. The oat flour must be certified gluten-free.
- **Xanthan gum.** The rules give it per 120 g of blend. Use the blend weight *after* any reduction: blend ÷ 120 × the rule's teaspoons. Round to the nearest ⅛ teaspoon (225 g blend at ¼ tsp per 120 g → 0.47 → ½ tsp).
- **Per-120 g additions** (almond flour or ground sunflower seeds, baking powder) work the same way, also from the blend weight.
- **Fat, water, milk and sugar changes** are percentages of the recipe's own quantity (butter reduced 20%: 200 g → 160 g). Apply them to each unit the source gives (weight, volume or both).
- **Units** follow the shared rules in `../_shared/recipe-rules.md` (or `recipe-rules.md` next to this file in a standalone install): if the source gives flour only in cups, the blend, its split and the reduction are in cups too. Teaspoon amounts from the rules (xanthan gum, baking powder) stay in teaspoons.
- **Sub-cases.** The indented rules for an egg-free or vegan base apply only when the starting recipe is already egg-free or vegan. The rules do not cover replacing eggs, so do not make a recipe vegan on your own. Where a sub-case says "instead", it replaces the main rule rather than adding to it.
- **Technique notes** in the rules (butter at room temperature, not melted; add plant milk slowly until the dough forms) go into the matching step of the method.

## 3. Other gluten

The rules only cover the flour and the cheesecake base. Before delivering, check every other ingredient for gluten: biscuits and crumbs, oats (outside the blend), malt, barley, rye, semolina, couscous, soy sauce, beer, stock cubes, baking powder and store-bought mixes. Do not change their quantities; list them in the reply as needing a certified gluten-free version.

## Gap

This is not in the rules yet. Do not fill it in from general knowledge:

- **Bread and yeasted doughs.** That rule set is pending. Do not convert these recipes; say the rules are not written yet.

## Output

Keep the recipe in the language of the source; translate the rule wording into it. Then:

1. **Title**, with "(gluten-free)" or "(sin gluten)" added.
2. **Ingredients** with converted quantities, in the source's units, in the order of the original. The blend's three flours take the place of the wheat flour, and new ingredients (xanthan gum, almond flour) go right after them.
3. **Method** with the original steps and every time, temperature and cue kept, plus any technique note the rules add.
4. **Changes**: one line per change, original → converted ("Butter 200 g → 160 g"). Do not name the rule set or rule numbers, here or anywhere in the recipe.

Before delivering, recompute every converted quantity from the original and check each rule in the chosen set was applied once. Reply in one or two sentences, without naming rule sets or rules: the main changes, other gluten ingredients to buy gluten-free, and the gap above when it affects this recipe. If the person wants it dairy-free too, continue with `/dairy-free-recipe`; for a page, `/cookbook-recipe` or `/algorithmic-recipe`.
