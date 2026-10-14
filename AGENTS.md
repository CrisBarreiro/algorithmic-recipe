# Agent guide

Instructions for agents installing or working on [algorithmic-recipe](https://github.com/CrisBarreiro/algorithmic-recipe). What the skill does lives in `skills/algorithmic-recipe/SKILL.md`; this file only covers how to install it and where things are.

## Install

When a user asks you to install this skill, read `skills/algorithmic-recipe/SKILL.md` first so you know what you are adding. It is a single Markdown file with no scripts or hooks. Only run the commands below that the chosen route needs.

### Claude Code (preferred: plugin)

```bash
claude plugin marketplace add CrisBarreiro/algorithmic-recipe
claude plugin install algorithmic-recipe@algorithmic-recipe
```

This installs for the user across all projects. Add `--scope project` to the install command if the user wants it only for the current project.

Verify with `claude plugin list`. Then tell the user to restart Claude Code (or run `/reload-plugins`) and type `/algorithmic-recipe`.

### Claude Code (without the plugin system)

Copy the skill folder into the skills directory: `~/.claude/skills/` for the user, or `.claude/skills/` in the current project.

```bash
git clone --depth 1 https://github.com/CrisBarreiro/algorithmic-recipe.git <temp-dir>
cp -r <temp-dir>/skills/algorithmic-recipe ~/.claude/skills/
```

If `algorithmic-recipe` already exists there, ask before overwriting it. Remove the temporary clone afterwards. Claude Code picks the skill up without a restart; the command is `/algorithmic-recipe`.

### Other agents that read `SKILL.md`

Copy `skills/algorithmic-recipe/` into that agent's skills directory, the same way as above.

### Claude.ai and the Claude desktop app

You cannot install it there for the user. Give them the zip-and-upload steps from the Install section of `README.md`.

## Update and uninstall

```bash
claude plugin marketplace update algorithmic-recipe
claude plugin update algorithmic-recipe@algorithmic-recipe
claude plugin uninstall algorithmic-recipe
claude plugin marketplace remove algorithmic-recipe
```

For a copied folder, update by copying it again and uninstall by deleting the folder.

## Repository map

| Path | Purpose |
| --- | --- |
| `skills/algorithmic-recipe/SKILL.md` | The skill: workflow, layout and content rules, HTML skeleton, grid check. |
| `.claude-plugin/plugin.json` | Plugin manifest. |
| `.claude-plugin/marketplace.json` | Makes the repo its own marketplace. |
| `examples/espresso-brownies.html` | Reference output. |
| `docs/espresso-brownies.png` | Screenshot of the example, used in `README.md`. |
| `README.md` | User-facing overview and install steps. |

## Changing the skill

- Edit `SKILL.md` first. If the change affects output, update `examples/espresso-brownies.html` to match and retake the screenshot.
- Keep the install steps in `README.md` and this file in sync.
- Run `claude plugin validate .` before committing.
