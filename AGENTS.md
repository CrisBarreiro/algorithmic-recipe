# Agent guide

Instructions for agents installing or working on [algorithmic-recipe](https://github.com/CrisBarreiro/algorithmic-recipe). What the skill does lives in `skills/algorithmic-recipe/SKILL.md`; this file only covers how to install it and where things are.

## Install

When a user asks you to install this skill:

1. Read `skills/algorithmic-recipe/SKILL.md` first so you know what you are adding. It is a single Markdown file with no scripts or hooks.
2. Read `INSTALL.md` and pick the route for the user's runtime. For Claude Code, prefer the plugin route; use `--scope project` only if the user wants it limited to the current project.
3. Run only the commands that route needs. When copying the folder, clone into a temporary directory, ask before overwriting an existing `algorithmic-recipe` skill folder, and delete the clone afterwards.
4. Verify (`claude plugin list` for the plugin, or check the copied `SKILL.md` exists), then tell the user how to invoke it: `/algorithmic-recipe`, after a restart or `/reload-plugins` for the plugin route.
5. On Claude.ai or the desktop app you cannot install it for the user; give them the zip-and-upload steps from `INSTALL.md`.

## Repository map

| Path | Purpose |
| --- | --- |
| `skills/algorithmic-recipe/SKILL.md` | The skill: workflow, layout and content rules, HTML skeleton, grid check. |
| `.claude-plugin/plugin.json` | Plugin manifest. |
| `.claude-plugin/marketplace.json` | Makes the repo its own marketplace. |
| `examples/espresso-brownies.html` | Reference output. |
| `assets/espresso-brownies.png` | Screenshot of the example, used in `README.md`. |
| `README.md` | User-facing overview. |
| `INSTALL.md` | Every install, update and uninstall route. |

## Changing the skill

- Edit `SKILL.md` first. If the change affects output, update `examples/espresso-brownies.html` to match and retake the screenshot.
- Install commands live only in `INSTALL.md`; `README.md` repeats just the two plugin commands, so keep those in sync.
- Run `claude plugin validate .` before committing.
