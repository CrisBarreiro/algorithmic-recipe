# How to install

The quickest way is to ask your agent:

```
Install the baking-plugin skills from https://github.com/CrisBarreiro/baking-plugin, refer to the repo's AGENTS.md for instructions.
```

Or pick a route below.

## Claude Code, as a plugin (recommended)

This repo is its own plugin marketplace.

```bash
claude plugin marketplace add CrisBarreiro/baking-plugin
claude plugin install baking-plugin@baking-plugin
```

Inside a Claude Code session, the same commands work as `/plugin marketplace add …` and `/plugin install …`. Add `--scope project` to the install command to enable it only for the current project.

Restart Claude Code (or run `/reload-plugins`), then type `/algorithmic-recipe`. The namespaced `/baking-plugin:algorithmic-recipe` also works, and is what to use if another skill or command already takes the short name.

Check it installed:

```bash
claude plugin list
```

Update:

```bash
claude plugin marketplace update baking-plugin
claude plugin update baking-plugin@baking-plugin
```

Uninstall:

```bash
claude plugin uninstall baking-plugin
claude plugin marketplace remove baking-plugin
```

### Moving from `algorithmic-recipe`

The plugin used to be called `algorithmic-recipe`, and so did its marketplace and this repo. The skills kept their names, so `/algorithmic-recipe` and the others work as before. If you installed it under the old name, swap it for the new one:

```bash
claude plugin uninstall algorithmic-recipe
claude plugin marketplace remove algorithmic-recipe
claude plugin marketplace add CrisBarreiro/baking-plugin
claude plugin install baking-plugin@baking-plugin
```

A site using the template swaps its `algorithmic-recipe` dependency for `"baking-plugin": "github:CrisBarreiro/baking-plugin#main"` and imports the token check from `baking-plugin/site-template/functions/_middleware.js`.

## Claude Code, as a personal skill

Copy the skill folder into your skills directory:

```bash
git clone https://github.com/CrisBarreiro/baking-plugin.git
cp -r baking-plugin/skills/algorithmic-recipe baking-plugin/skills/_shared ~/.claude/skills/
```

Copy `skills/_shared` alongside any skill you install: every skill reads its shared rules from `../_shared/recipe-rules.md`.

The slash command is `/algorithmic-recipe`, and Claude Code picks it up without a restart. To share it with everyone working in one project, copy it into that project's `.claude/skills/` instead.

Update by copying the folder again; uninstall by deleting it.

## Other agents that read `SKILL.md`

Copy `skills/algorithmic-recipe/` into that agent's skills directory, the same way as above.

## Claude.ai and the Claude desktop app

1. Zip the skill folder so `SKILL.md` sits inside a top-level `algorithmic-recipe/` folder:
   ```bash
   cd baking-plugin/skills && cp _shared/recipe-rules.md algorithmic-recipe/ && zip -r algorithmic-recipe.zip algorithmic-recipe
   ```
   Uploaded skills can't see each other's folders, so the shared rules (`_shared/recipe-rules.md`) are copied into the skill folder first. Do the same for any other skill you upload.
2. In Claude, open **Settings → Capabilities → Skills**, choose **Upload skill** and pick the zip.
3. Make sure the skill is toggled on.
