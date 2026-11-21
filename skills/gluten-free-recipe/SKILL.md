---
name: "gluten-free-recipe"
description: "Converts a recipe that contains gluten into a gluten-free one (and dairy-free on request) by following Cris's own rules: picks the rule set for the type of bake, swaps in the homemade gluten-free flour blend, adds xanthan gum and adjusts fat and liquids, and lists every change."
---

# Gluten-free recipe

Converts a recipe with gluten into a gluten-free one using the rules in `rules.md`, next to this file. Read `rules.md` in full before converting anything. It is Cris's own system, in Spanish, and it is the only source for ratios: never add a substitution, ratio or technique that is not written there.

The result is the converted recipe as text. To lay it out as a page, hand it to `/cookbook-recipe` or `/algorithmic-recipe` afterwards; this skill does not render HTML.

## 1. Pick the rule set

Decide what kind of bake the recipe is, using the flowchart at the top of `rules.md` and the rule set titles:

| Recipe | Rule set |
| --- | --- |
| Banana bread | Bizcochos con mantequilla |
| Cake with melted chocolate in the batter | Bizcochos de chocolate |
| Cake with lots of butter or oil, loaf cake, pound cake (same weight of each), cupcakes, muffins | Bizcochos con mantequilla |
| Swiss roll, or a sponge built on whipped egg whites | Swiss rolls y bizcochos esponjosos |
| Brownies | Brownies |
| Cookies that hold their shape (cut-out, shortbread) | Cookies que mantienen la forma |
| Cookies that spread (chocolate chip, drop cookies) | Cookies que se expanden |
| Soft, cake-like cookies (madeleines, soft-baked) | Galletas tipo bizcocho |
| Shortcrust (tart and pie dough) | Masa quebrada |
| Puff or rough-puff pastry | Masas hojaldradas |
| Thick pancakes | Tortitas gruesas |
| Fluffy pancakes | Tortitas esponjosas |
| Baked cheesecake | Tartas de queso al horno |
| Bread and other yeasted doughs | Pan y masas con levadura (not written yet, see Gap) |

Check the chocolate question first for cakes: a cake with melted chocolate in the batter takes the chocolate rules even if it is also rich in butter. Say which rule set you chose in the reply. If the recipe fits none, or sits between two, ask instead of picking.

A recipe with several components (a tart: shortcrust plus filling) gets the matching rule set for each component that contains gluten.

## 2. Gluten-free track ("Sin gluten")

Apply every rule in the chosen set's "Sin gluten" list, in order.

- **Flour.** Replace the wheat flour with the homemade gluten-free flour blend ("Mezcla casera de harina sin gluten"). Some rule sets keep the same amount; others reduce it by 10% (250 g flour → 225 g blend). Round the blend to the nearest 5 g.
- **The blend** is 50% starch, 25% "light" protein flour and 25% "heavy" protein flour (see `rules.md`). Use Cris's own picks unless the person names others: cornstarch, brown rice flour and gluten-free oat flour. List the three as their own rows, split by weight (225 g blend → 115 g cornstarch, 55 g brown rice flour, 55 g gluten-free oat flour, rounded to 5 g and adjusted so they add up), with the blend total in the prep note. The oat flour must be certified gluten-free.
- **Xanthan gum.** The rules give it per 120 g of blend. Use the blend weight *after* any reduction: blend ÷ 120 × the rule's teaspoons. Round to the nearest ⅛ teaspoon (225 g blend at ¼ tsp per 120 g → 0.47 → ½ tsp).
- **Per-120 g additions** (almond flour or ground sunflower seeds, baking powder) work the same way, also from the blend weight.
- **Fat, water, milk and sugar changes** are percentages of the recipe's own quantity (butter reduced 20%: 200 g → 160 g). Apply them to weight and keep the original volume column in step.
- **Sub-cases.** The indented rules for an egg-free or vegan base ("base sin huevo o vegana", "base vegana") apply only when the starting recipe is already egg-free or vegan. The rules do not cover replacing eggs, so do not make a recipe vegan on your own. Where a sub-case says "en su lugar", it replaces the main rule rather than adding to it.
- **Technique notes** in the rules (butter at room temperature, not melted; add plant milk slowly until the dough forms) go into the matching step of the method.
- "cdta" is a teaspoon; "Royal" is baking powder; "maizena" is cornstarch.

## 3. Dairy-free track ("Sin lácteos"), only on request

Apply the chosen set's "Sin lácteos" rules only when the person asks for dairy-free or vegan. Run them after the gluten-free track, so fat reductions apply first and the swap uses the reduced weight. Where a rule offers a choice (vegan butter, or 80% sunflower oil plus 15% plant milk), use the first option and mention the alternative in the reply.

## 4. Other gluten

The rules only cover the flour and the cheesecake base. Before delivering, check every other ingredient for gluten: biscuits and crumbs, oats (outside the blend), malt, barley, rye, semolina, couscous, soy sauce, beer, stock cubes, baking powder and store-bought mixes. Do not change their quantities; list them in the reply as needing a certified gluten-free version.

## Gap

This is not in the rules yet. Do not fill it in from general knowledge:

- **Bread and yeasted doughs.** That rule set is pending. Do not convert these recipes; say the rules are not written yet.

## Output

Keep the recipe in the language of the source; translate the rule wording into it. Then:

1. **Title**, with "(gluten-free)" or "(sin gluten)" added.
2. **Ingredients** with converted quantities, weight first, in the order of the original. The blend's three flours take the place of the wheat flour, and new ingredients (xanthan gum, almond flour) go right after them.
3. **Method** with the original steps and every time, temperature and cue kept, plus any technique note the rules add.
4. **Changes**: one line per change, original → converted, and the rule behind it ("Butter 200 g → 160 g, cookies que mantienen la forma, rule 3").

Before delivering, recompute every converted quantity from the original and check each rule in the chosen set was applied once. Reply in one or two sentences: the rule set used, any sub-case applied, other gluten ingredients to buy gluten-free, and the gap above when it affects this recipe. If the person wants a page, offer `/cookbook-recipe` or `/algorithmic-recipe` with the converted recipe.
