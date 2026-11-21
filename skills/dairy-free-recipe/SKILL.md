---
name: "dairy-free-recipe"
description: "Converts a recipe that contains dairy into a dairy-free one by following Cris's own rules: picks the rule set for the type of bake, swaps milk, butter, yogurt, buttermilk, cream and cream cheese, adjusts sugar and starch where the rules say, and lists every change."
---

# Dairy-free recipe

Converts a recipe with dairy into a dairy-free one using the rules in `rules.md`, next to this file. Read `rules.md` in full before converting anything. It is Cris's own system and the only source for ratios: never add a substitution, ratio or technique that is not written there.

It works on any recipe, including one already converted by `/gluten-free-recipe`. When the person wants both, the gluten-free conversion runs first, so these swaps apply to the already reduced quantities. The result is the converted recipe as text. To lay it out as a page, hand it to `/cookbook-recipe` or `/algorithmic-recipe` afterwards.

## 1. Pick the rule set

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

Check the chocolate question first for cakes: a cake with melted chocolate in the batter takes the chocolate rules even if it is also rich in butter. If the recipe fits none, or sits between two, ask instead of picking. A recipe with several components (a tart: shortcrust plus filling) gets the matching rule set for each component.

## 2. Apply the rules

Apply every rule in the chosen set, in order.

- **Same weight or volume** swaps keep both columns as they are and change only the ingredient name.
- **Choices.** Where a rule offers two options (vegan butter, or 80% sunflower oil plus 15% plant milk), use the first and mention the other in the reply. For the oil option, both percentages are of the butter's weight (200 g butter → 160 g sunflower oil and 30 g plant milk).
- **Per-quantity additions** (sugar per 240 g of plant milk, cornstarch per 225 g of cream cheese) scale with the recipe's amount. Round to the nearest gram. For a range (5–10 g), use the middle and give the range in the reply.
- **Shortcrust starch swap**: 20% of the flour as it stands, so 20% of the gluten-free blend if the recipe has already been converted. Use cornstarch unless the person names another starch.
- **Never convert units.** Keep only the units the source uses, and apply each change to every unit it gives. Do not add grams to a cup-only recipe or cups to a gram-only one.
- **Plant milk**: write "plant milk (almond, rice, soy or oat)", never canned coconut milk.

## 3. Other dairy

The rules cover milk, butter, yogurt, sour cream, buttermilk, cream and cream cheese. Before delivering, check every other ingredient for dairy: cheese, condensed or evaporated milk, milk powder, ghee, white or milk chocolate, whey, and store-bought mixes. Do not invent swaps for them; list them in the reply as needing a dairy-free version.

## Gap

This is not in the rules yet. Do not fill it in from general knowledge:

- **Bread and yeasted doughs.** That rule set is pending. Do not convert these recipes; say the rules are not written yet.

## Output

Keep the recipe in the language of the source; translate the rule wording into it. Then:

1. **Title**, with "(dairy-free)" or "(sin lácteos)" added, after "(gluten-free)" if it is there.
2. **Ingredients** with converted quantities, in the source's units, in the order of the original.
3. **Method** with the original steps and every time, temperature and cue kept, ingredient names updated.
4. **Changes**: one line per change, original → converted ("Butter 160 g → vegan butter 160 g"). Do not name the rule set or rule numbers, here or anywhere in the recipe. If the recipe already has a Changes list from `/gluten-free-recipe`, add to it.

Before delivering, recompute every converted quantity from the original and check each rule in the chosen set was applied once. Reply in one or two sentences, without naming rule sets or rules: the main changes, the alternatives not taken, other dairy ingredients to buy dairy-free, and the gap above when it affects this recipe. For a page, offer `/cookbook-recipe` or `/algorithmic-recipe` with the converted recipe.
