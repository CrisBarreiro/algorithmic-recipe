# How to install

The quickest way is to ask your agent:

```
Install the algorithmic-recipe skill from https://github.com/CrisBarreiro/algorithmic-recipe, refer to the repo's AGENTS.md for instructions.
```

Or pick a route below.

## Claude Code, as a plugin (recommended)

This repo is its own plugin marketplace.

```bash
claude plugin marketplace add CrisBarreiro/algorithmic-recipe
claude plugin install algorithmic-recipe@algorithmic-recipe
```

Inside a Claude Code session, the same commands work as `/plugin marketplace add …` and `/plugin install …`. Add `--scope project` to the install command to enable it only for the current project.

Restart Claude Code (or run `/reload-plugins`), then type `/algorithmic-recipe`. The namespaced `/algorithmic-recipe:algorithmic-recipe` also works, and is what to use if another skill or command already takes the short name.

Check it installed:

```bash
claude plugin list
```

Update:

```bash
claude plugin marketplace update algorithmic-recipe
claude plugin update algorithmic-recipe@algorithmic-recipe
```

Uninstall:

```bash
claude plugin uninstall algorithmic-recipe
claude plugin marketplace remove algorithmic-recipe
```

## Claude Code, as a personal skill

Copy the skill folder into your skills directory:

```bash
git clone https://github.com/CrisBarreiro/algorithmic-recipe.git
cp -r algorithmic-recipe/skills/algorithmic-recipe ~/.claude/skills/
```

The slash command is `/algorithmic-recipe`, and Claude Code picks it up without a restart. To share it with everyone working in one project, copy it into that project's `.claude/skills/` instead.

Update by copying the folder again; uninstall by deleting it.

## Other agents that read `SKILL.md`

Copy `skills/algorithmic-recipe/` into that agent's skills directory, the same way as above.

## Claude.ai and the Claude desktop app

1. Zip the skill folder so `SKILL.md` sits inside a top-level `algorithmic-recipe/` folder:
   ```bash
   cd algorithmic-recipe/skills && zip -r algorithmic-recipe.zip algorithmic-recipe
   ```
2. In Claude, open **Settings → Capabilities → Skills**, choose **Upload skill** and pick the zip.
3. Make sure the skill is toggled on.
