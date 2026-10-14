# algorithmic-recipe

Turn any recipe into a table you can actually cook from.

Ingredients are listed down the left in the order you add them. Each step sits to the right and stretches over everything already in the bowl, so you always see what is in the mixture and what comes next. Read it left to right like a program.

![Espresso brownies as an algorithmic recipe](docs/espresso-brownies.png)

## Why it's useful

- **Mise en place in one glance.** The ingredient column is your prep list, already in the order you will need things.
- **Shopping list for free.** Everything with its quantity, in one column.
- **Quantities right where you need them.** Each step shows exactly which ingredients go into it, so there is no scrolling back and forth to the ingredient list while your hands are covered in batter.
- **Nothing lost in translation.** Every temperature, time, visual cue and "why" tip from the original is kept (reworded, not copied).
- **Works on a phone.** Light and dark mode, and the ingredient column stays pinned while the table scrolls sideways.

See [`examples/espresso-brownies.html`](examples/espresso-brownies.html) for the full page behind the screenshot above.

## Install

### Claude Code, as a plugin (recommended)

This repo is its own plugin marketplace. In Claude Code run:

```
/plugin marketplace add CrisBarreiro/algorithmic-recipe
/plugin install algorithmic-recipe@algorithmic-recipe
```

Restart Claude Code (or run `/reload-plugins`) so the skill loads. To get updates later, run `/plugin marketplace update algorithmic-recipe`.

Plugin skills are namespaced, so the slash command is `/algorithmic-recipe:algorithmic-recipe`.

### Claude Code, as a personal skill

Copy the skill folder into your skills directory:

```bash
git clone https://github.com/CrisBarreiro/algorithmic-recipe.git
cp -r algorithmic-recipe/skills/algorithmic-recipe ~/.claude/skills/
```

The slash command is then `/algorithmic-recipe`. To share it with everyone working in one project, copy it into that project's `.claude/skills/` instead.

### Claude.ai and the Claude desktop app

1. Zip the skill folder so `SKILL.md` sits inside a top-level `algorithmic-recipe/` folder:
   ```bash
   cd algorithmic-recipe/skills && zip -r algorithmic-recipe.zip algorithmic-recipe
   ```
2. In Claude, open **Settings → Capabilities → Skills**, choose **Upload skill** and pick the zip.
3. Make sure the skill is toggled on.

## Usage

Invoke the skill and give it a recipe (pasted text, a URL or an attachment):

```
/algorithmic-recipe https://example.com/my-favourite-brownies
```

(Use `/algorithmic-recipe:algorithmic-recipe` if you installed it as a plugin.)

Claude also loads the skill on its own when you ask to "rewrite this recipe as an algorithmic recipe". The slash command just makes it explicit. The result is a single self-contained HTML page, saved wherever you ask.

## Repo layout

```
algorithmic-recipe/
├── README.md
├── .claude-plugin/
│   ├── plugin.json           plugin manifest
│   └── marketplace.json      lets /plugin marketplace add point at this repo
├── skills/
│   └── algorithmic-recipe/
│       └── SKILL.md          the skill itself (what Claude loads)
├── examples/
│   └── espresso-brownies.html
└── docs/
    └── espresso-brownies.png screenshot used in this README
```
