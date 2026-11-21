# Agent guide

Instructions for agents installing or working on [algorithmic-recipe](https://github.com/CrisBarreiro/algorithmic-recipe). The plugin holds four recipe skills (`algorithmic-recipe`, `cookbook-recipe`, `gluten-free-recipe`, `dairy-free-recipe`) plus rules they share in `skills/_shared/`. What each skill does lives in its `SKILL.md`; this file only covers how to install them and where things are.

## Install

When a user asks you to install these skills:

1. Read the `SKILL.md` of each skill you are adding, plus `skills/_shared/recipe-rules.md`. They are Markdown files with no scripts or hooks.
2. Read `INSTALL.md` and pick the route for the user's runtime. For Claude Code, prefer the plugin route; use `--scope project` only if the user wants it limited to the current project.
3. Run only the commands that route needs. When copying folders, clone into a temporary directory, always copy `skills/_shared` along with the skills (each one reads `../_shared/recipe-rules.md`), ask before overwriting an existing skill folder, and delete the clone afterwards.
4. Verify (`claude plugin list` for the plugin, or check the copied `SKILL.md` exists), then tell the user how to invoke them: `/algorithmic-recipe`, `/cookbook-recipe`, `/gluten-free-recipe`, `/dairy-free-recipe`, after a restart or `/reload-plugins` for the plugin route.
5. On Claude.ai or the desktop app you cannot install it for the user; give them the zip-and-upload steps from `INSTALL.md`, which copy the shared rules into each skill folder first.

## Repository map

| Path | Purpose |
| --- | --- |
| `skills/_shared/recipe-rules.md` | Rules all recipe skills share (reading the source, units, wording, output). Edit shared rules here, once. |
| `skills/algorithmic-recipe/SKILL.md` | The skill: workflow, layout and content rules, HTML skeleton, grid check. |
| `skills/cookbook-recipe/SKILL.md` | Separate cookbook-style layout skill, independent of the one above. |
| `skills/gluten-free-recipe/SKILL.md` | Separate gluten-free conversion skill; its output can feed either layout skill. |
| `skills/gluten-free-recipe/rules.md` | Cris's gluten-free rules, read by the skill on every run. Edit rules here, not in `SKILL.md`. |
| `skills/dairy-free-recipe/SKILL.md` | Separate dairy-free conversion skill; runs after `gluten-free-recipe` when both are wanted. |
| `skills/dairy-free-recipe/rules.md` | Cris's dairy-free rules, read by the skill on every run. Edit rules here, not in `SKILL.md`. |
| `.claude-plugin/plugin.json` | Plugin manifest. |
| `.claude-plugin/marketplace.json` | Makes the repo its own marketplace. |
| `examples/espresso-brownies.html` | Reference output. |
| `examples/espresso-brownies-cookbook.html` | Reference output for `cookbook-recipe`. |
| `assets/espresso-brownies.png` | Screenshot of the example, used in `README.md`. |
| `README.md` | User-facing overview. |
| `INSTALL.md` | Every install, update and uninstall route. |

## Changing the skills

- A rule that applies to every recipe skill goes in `skills/_shared/recipe-rules.md`, once; a rule for one skill goes in its `SKILL.md`. Conversion ratios go in that skill's `rules.md`.
- If a change affects output, update the matching example (`examples/espresso-brownies.html` or `examples/espresso-brownies-cookbook.html`) and retake the screenshot.
- Install commands live only in `INSTALL.md`; `README.md` repeats just the two plugin commands, so keep those in sync.
- Run `claude plugin validate .` before committing.
