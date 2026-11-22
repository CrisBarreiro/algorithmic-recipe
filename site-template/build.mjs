#!/usr/bin/env node
// Builds a private recipe site into dist/, from the recipes in the folder it runs in.
//
// Run it from your site's folder (npm run build does): it reads that folder and writes dist/ there.
//
// Your folder:    recipes/<id>/<lang>.html              cookbook page per language, as the skills write them
//                 recipes/<id>/<lang>.algorithmic.html  algorithmic page (optional)
//                 recipes/<id>/recipe.json              optional: {"tags": [...], "notes": {"en": [...]}}
//                 recipes/<id>/photo.jpg                optional, shared by every language
//                 site.config.json                      optional: overrides for assets/i18n.json (see README)
//                 rules.json, site.css, brand/          optional: replace or add to this template's own
// Output:         dist/<lang>/<id>/index.html, dist/<lang>/index.html, dist/index.html
// Search:         `pagefind --site dist` runs after this script.
//
// Access control is not in this build: Cloudflare Access sits in front of the site, and
// functions/_middleware.js refuses any request without a valid Access login token.

import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, copyFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const TEMPLATE = dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();
const SRC = join(ROOT, "recipes");
const OUT = join(ROOT, "dist");
const ASSETS = join(TEMPLATE, "assets");
if (!existsSync(SRC)) throw new Error(`No recipes/ folder in ${ROOT}. Run this from your site's folder.`);
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const mine = (f) => (existsSync(join(ROOT, f)) ? join(ROOT, f) : null);
// Deep merge, so site.config.json only needs the keys it changes (like each language's "host").
const merge = (a, b) => {
  if (!b || typeof b !== "object" || Array.isArray(b)) return b === undefined ? a : b;
  const out = { ...a };
  for (const k of Object.keys(b)) out[k] = merge(a?.[k], b[k]);
  return out;
};
const config = mine("site.config.json") ? readJson(mine("site.config.json")) : {};
const i18n = merge(readJson(join(ASSETS, "i18n.json")), config.i18n);
const LANGS = Object.keys(i18n);
const DEFAULT_LANG = LANGS[0];

const ROBOTS_META = `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai">`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const write = (path, content) => {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content);
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const f of ["robots.txt", "_headers"]) copyFileSync(mine(f) || join(ASSETS, f), join(OUT, f));
// The service worker is same-origin and only becomes useful after a visitor has loaded the
// protected app once. It lets returning visitors use cached pages when the app hostname is
// temporarily unreachable.
copyFileSync(join(ASSETS, "sw.js"), join(OUT, "sw.js"));
// Public brand assets (icon, login page logo); this path is exempt from Cloudflare Access so the login page
// can load it. Files in your own brand/ replace the template's ones with the same name.
mkdirSync(join(OUT, "brand"), { recursive: true });
for (const dir of [join(ASSETS, "brand"), mine("brand")].filter(Boolean))
  for (const f of readdirSync(dir)) copyFileSync(join(dir, f), join(OUT, "brand", f));

// ---------- read recipes ----------

const recipes = readdirSync(SRC)
  .filter((id) => statSync(join(SRC, id)).isDirectory())
  .sort()
  .map((id) => {
    const dir = join(SRC, id);
    const meta = existsSync(join(dir, "recipe.json")) ? JSON.parse(readFileSync(join(dir, "recipe.json"), "utf8")) : {};
    const versions = {};
    for (const lang of LANGS) {
      const file = join(dir, `${lang}.html`);
      if (!existsSync(file)) continue;
      const html = readFileSync(file, "utf8");
      const title = (html.match(/<title>([^<]*)<\/title>/) || html.match(/<h1[^>]*>([^<]*)</) || [, id])[1].trim();
      const intro = (html.match(/<div class="intro">\s*<p>([\s\S]*?)<\/p>/) || [, ""])[1].replace(/<[^>]+>/g, "").trim();
      const algoFile = join(dir, `${lang}.algorithmic.html`);
      const algorithmic = existsSync(algoFile) ? readFileSync(algoFile, "utf8") : null;
      versions[lang] = { html, title, intro, algorithmic };
    }
    if (!Object.keys(versions).length) throw new Error(`recipes/${id} has no ${LANGS.map((l) => l + ".html").join(" or ")}`);
    const photo = existsSync(join(dir, "photo.jpg")) ? "photo.jpg" : null;
    return { id, tags: meta.tags || [], notes: meta.notes || {}, versions, photo };
  });

// ---------- shared pieces ----------

// Paper design system (design/, reusable outside this site), this site's own glue (assets/site.css),
// then your own site.css if you have one.
const DESIGN = join(TEMPLATE, "design");
const siteCss = [join(DESIGN, "tokens.css"), join(DESIGN, "components.css"), join(ASSETS, "site.css"), mine("site.css")]
  .filter(Boolean).map((f) => readFileSync(f, "utf8")).join("\n");
// Favicon and home-screen icon: a cinnamon roll, served from /brand/ (public, so the login page has it too).
const ICONS = `<link rel="icon" href="/brand/icon.svg" type="image/svg+xml"><link rel="icon" href="/brand/icon-32.png" sizes="32x32"><link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">`;
const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Roboto:wght@400;500;700&display=swap">`;
// The skills' own font links; Paper brings its fonts.
const SKILL_FONTS = /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/g;
// The gluten-free and dairy-free rules page: the same rules as the gluten-free-recipe and dairy-free-recipe
// skills. Your own rules.json replaces them; "rules": false in site.config.json turns the page off.
const RULES = config.rules === false ? {} : readJson(mine("rules.json") || join(ASSETS, "rules.json"));
// Optional per-language hostnames ("host" in site.config.json i18n), e.g. recipes.example.com for English and
// recetas.example.com for Spanish. On those hosts each language lives on its own address and the
// EN | ES switch jumps between them. On any other host (like *.pages.dev) everything stays on one host.
const HOSTS = Object.fromEntries(LANGS.filter((l) => i18n[l].host).map((l) => [l, i18n[l].host]));
const hostScript = `<script>
(function () {
  var hosts = ${JSON.stringify(HOSTS)}, here = location.hostname, lang = document.documentElement.lang, on = false;
  for (var l in hosts) if (hosts[l] === here) on = true;
  try { localStorage.setItem("lang", lang); } catch (e) {}
  if (!on) return;
  if (hosts[lang] && hosts[lang] !== here) { location.replace("https://" + hosts[lang] + location.pathname + location.search); return; }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("a[hreflang]").forEach(function (a) {
      var h = hosts[a.getAttribute("hreflang")];
      if (h && h !== here) a.href = "https://" + h + a.getAttribute("href");
    });
  });
})();
</script>`;
const langScript = hostScript;
const serviceWorkerScript = `<script>
if ("serviceWorker" in navigator) window.addEventListener("load", function () {
  navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function () {});
});
</script>`;

function switcher(lang, hrefFor) {
  return `<nav class="tabs langs" aria-label="Language">${LANGS.map((l) => {
    if (l === lang) return `<span aria-current="true">${l.toUpperCase()}</span>`;
    const href = hrefFor(l);
    return href
      ? `<a href="${href}" hreflang="${l}" lang="${l}">${l.toUpperCase()}</a>`
      : `<span class="off" title="${esc(i18n[lang].noTranslation)}">${l.toUpperCase()}</span>`;
  }).join(`<span class="sep">|</span>`)}</nav>`;
}

const bar = (lang, hrefFor, extra = "") =>
  `<header class="bar"><a class="bar-back" href="/${lang}/">${esc(i18n[lang].allRecipes)}</a>${extra}${switcher(lang, hrefFor)}</header>`;

// ---------- recipe pages ----------

// Each recipe has a cookbook page (<lang>.html, the default) and optionally an algorithmic one
// (<lang>.algorithmic.html). Only the cookbook page is indexed for search.
const LAYOUTS = { cookbook: "", algorithmic: "algorithmic/" };
const hasLayout = (r, l, layout) => !!r.versions[l] && (layout === "cookbook" || !!r.versions[l].algorithmic);

function layoutSwitch(r, lang, layout) {
  if (!r.versions[lang].algorithmic) return "";
  const t = i18n[lang];
  return `<nav class="tabs layouts" aria-label="${esc(t.layout)}">${Object.keys(LAYOUTS)
    .map((k) => {
      const label = esc(t[k]);
      return k === layout
        ? `<span aria-current="true">${label}</span>`
        : `<a href="/${lang}/${r.id}/${LAYOUTS[k]}">${label}</a>`;
    })
    .join(`<span class="sep">|</span>`)}</nav>`;
}

for (const r of recipes) {
  for (const [lang, v] of Object.entries(r.versions)) {
    for (const layout of Object.keys(LAYOUTS)) {
      const src = layout === "cookbook" ? v.html : v.algorithmic;
      if (!src) continue;
      const file = `recipes/${r.id}/${lang}${layout === "cookbook" ? "" : "." + layout}.html`;
      const split = src.indexOf("<main");
      if (split < 0) throw new Error(`${file} has no <main>`);
      let head = src.slice(0, split).replace(/<meta name="claude:[^>]*>\s*/g, "").replace(SKILL_FONTS, "");
      let main = src.slice(split);
      if (layout === "cookbook") {
        // Cookbook pages are styled by Paper's recipe component alone, so the skill's own CSS goes.
        head = head.replace(/<style>[\s\S]*?<\/style>\s*/g, "");
        const t = i18n[lang];
        const eyebrow = r.tags.length
          ? `<p class="eyebrow" data-pagefind-ignore>${r.tags.map((x) => esc(t.tags[x] || x)).join(" · ")}</p>`
          : "";
        const photo = r.photo ? `<img class="photo" src="/media/${r.id}/${r.photo}" alt="" data-pagefind-meta="image[src]">` : "";
        main = main.replace(/<main[^>]*>/, `<main class="recipe${r.photo ? " has-photo" : ""}" data-pagefind-body>\n${photo}${eyebrow}`);
      }
      // Your own notes from recipe.json ("notes": {"en": [...], "es": [...]}), above the table in both
      // layouts. A language without notes falls back to the other language's.
      const notes = r.notes[lang] || Object.values(r.notes).find((n) => n && n.length) || [];
      if (notes.length) {
        const box = `<aside class="my-notes"><h2>${esc(i18n[lang].myNotes)}</h2><ul>${notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></aside>\n`;
        const at = layout === "cookbook" ? main.indexOf("<table") : main.indexOf('<div class="wrap"');
        if (at < 0) throw new Error(`${file}: no place for notes`);
        main = main.slice(0, at) + box + main.slice(at);
      }
      const alternates = Object.keys(r.versions)
        .map((l) => `<link rel="alternate" hreflang="${l}" href="/${l}/${r.id}/">`)
        .join("");
      const page = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${ROBOTS_META}
${ICONS}
${alternates}
${head.trim()}
${FONTS}
<style>${siteCss}</style>
${langScript}
${serviceWorkerScript}
</head>
<body class="paper layout-${layout}">
${bar(lang, (l) => (hasLayout(r, l, layout) ? `/${l}/${r.id}/${LAYOUTS[layout]}` : r.versions[l] ? `/${l}/${r.id}/` : null), layoutSwitch(r, lang, layout))}
${main}
</body>
</html>
`;
      write(join(OUT, lang, r.id, LAYOUTS[layout], "index.html"), page);
    }
  }
  // every image in the recipe folder is published under /media/<id>/
  for (const f of readdirSync(join(SRC, r.id)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
    mkdirSync(join(OUT, "media", r.id), { recursive: true });
    copyFileSync(join(SRC, r.id, f), join(OUT, "media", r.id, f));
  }
}

// ---------- index page per language ----------

for (const lang of LANGS) {
  const t = i18n[lang];
  const own = recipes.filter((r) => r.versions[lang]);
  const others = recipes.filter((r) => !r.versions[lang]);
  const usedTags = [...new Set(recipes.flatMap((r) => r.tags))].sort((a, b) =>
    (t.tags[a] || a).localeCompare(t.tags[b] || b, lang),
  );

  const card = (r, l, note) => {
    const v = r.versions[l];
    return `<li class="card" data-tags="${r.tags.join(" ")}">
<a href="/${l}/${r.id}/"${l !== lang ? ` hreflang="${l}" lang="${l}"` : ""}>
${r.photo ? `<img src="/media/${r.id}/${r.photo}" alt="" loading="lazy">` : `<span class="nophoto" aria-hidden="true">${esc(v.title.charAt(0))}</span>`}
<span class="title">${esc(v.title)}</span>
${note ? `<span class="note">${esc(note)}</span>` : ""}
${v.intro ? `<span class="intro">${esc(v.intro)}</span>` : ""}
<span class="tags">${r.tags.map((x) => `<span>${esc(t.tags[x] || x)}</span>`).join("")}</span>
</a></li>`;
  };
  const cards = [
    ...own.sort((a, b) => a.versions[lang].title.localeCompare(b.versions[lang].title, lang)).map((r) => card(r, lang)),
    ...others.map((r) => {
      const l = Object.keys(r.versions)[0];
      return card(r, l, t.onlyIn);
    }),
  ].join("\n");

  const page = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${ROBOTS_META}
${ICONS}
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="/${l}/">`).join("")}
<title>${esc(t.siteTitle)}</title>
${FONTS}
<link rel="stylesheet" href="/pagefind/pagefind-ui.css">
<style>${siteCss}</style>
${langScript}
${serviceWorkerScript}
</head>
<body class="paper index">
<header class="bar"><span class="bar-spacer"></span>${switcher(lang, (l) => `/${l}/`)}</header>
<main>
<h1>${esc(t.siteTitle)}</h1>
${RULES[lang] ? `<p class="rules-link"><a href="/${lang}/rules/">${esc(RULES[lang].link)} →</a></p>` : ""}
<div id="search"></div>
<div class="chips filters" role="group">
<button type="button" aria-pressed="true" data-tag="">${esc(t.all)}</button>
${usedTags.map((x) => `<button type="button" aria-pressed="false" data-tag="${x}">${esc(t.tags[x] || x)}</button>`).join("\n")}
</div>
<p class="count">${esc(t.count.replace("{n}", recipes.length))}</p>
<ul class="cards">
${cards}
</ul>
${config.skillsBox === false ? "" : `<aside class="skills-note"><h2>${esc(t.skillsTitle)}</h2><p>${esc(t.skillsText)}</p><p><a href="https://github.com/CrisBarreiro/algorithmic-recipe">${esc(t.skillsLink)} →</a></p></aside>`}
</main>
<script src="/pagefind/pagefind-ui.js"></script>
<script>
new PagefindUI({ element: "#search", showSubResults: false, showImages: false, resetStyles: false,
  translations: { placeholder: ${JSON.stringify(t.search)} } });
const buttons = document.querySelectorAll(".filters button");
buttons.forEach((b) => b.addEventListener("click", () => {
  buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  document.querySelectorAll(".card").forEach((c) => {
    c.hidden = !!b.dataset.tag && !c.dataset.tags.split(" ").includes(b.dataset.tag);
  });
}));
</script>
</body>
</html>
`;
  write(join(OUT, lang, "index.html"), page);
}

// ---------- gluten-free and dairy-free rules, per language ----------
// Content: assets/rules.json or your own rules.json (the same rules the gluten-free-recipe and
// dairy-free-recipe skills use). Linked from each index page.

for (const lang of LANGS) {
  const r = RULES[lang];
  if (!r) continue;
  const li = (xs) => `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const body = `<main class="rules">
<h1>${esc(r.title)}</h1>
<p class="lede">${esc(r.intro)}</p>
<nav class="toc" aria-label="${esc(r.contents)}">${r.types.map(([id, name]) => `<a href="#${id}">${esc(name)}</a>`).join("")}</nav>
<div class="rules-top">
<section class="box"><h2>${esc(r.blendTitle)}</h2><p class="muted">${esc(r.blendIntro)}</p>
<dl>${r.blend.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join("")}</dl></section>
<section class="box"><h2>${esc(r.whichTitle)}</h2>
<dl>${r.which.map(([a, b, id]) => `<dt>${esc(a)}</dt><dd>${id ? `<a href="#${id}">${esc(b)}</a>` : esc(b)}</dd>`).join("")}</dl>
<p class="muted">${esc(r.plantMilk)}</p></section>
</div>
${r.types.map(([id, name, gf, df]) => `<section class="rule" id="${id}"><h2>${esc(name)}</h2>
<div class="cols"><div><h3>${esc(r.gf)}</h3>${li(gf)}</div><div><h3>${esc(r.df)}</h3>${li(df)}</div></div></section>`).join("\n")}
</main>`;
  write(join(OUT, lang, "rules", "index.html"), `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${ROBOTS_META}
${ICONS}
${LANGS.filter((l) => RULES[l]).map((l) => `<link rel="alternate" hreflang="${l}" href="/${l}/rules/">`).join("")}
<title>${esc(r.title)}</title>
${FONTS}
<style>${siteCss}</style>
${langScript}
${serviceWorkerScript}
</head>
<body class="paper index">
${bar(lang, (l) => (RULES[l] ? `/${l}/rules/` : null))}
${body}
</body>
</html>
`);
}

// ---------- root: pick a language ----------

write(join(OUT, "index.html"), `<!doctype html>
<html lang="${DEFAULT_LANG}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${ROBOTS_META}
${ICONS}
<title>${LANGS.map((l) => esc(i18n[l].siteTitle)).join(" · ")}</title>
${serviceWorkerScript}
<script>
(function () {
  var langs = ${JSON.stringify(LANGS)}, hosts = ${JSON.stringify(HOSTS)}, pick;
  for (var l in hosts) if (hosts[l] === location.hostname) { location.replace("/" + l + "/"); return; }
  try { pick = localStorage.getItem("lang"); } catch (e) {}
  if (langs.indexOf(pick) < 0) {
    var nav = (navigator.languages || [navigator.language || ""]).map(function (l) { return l.slice(0, 2).toLowerCase(); });
    pick = nav.filter(function (l) { return langs.indexOf(l) >= 0; })[0] || ${JSON.stringify(DEFAULT_LANG)};
  }
  location.replace("/" + pick + "/");
})();
</script>
</head>
<body>
${LANGS.map((l) => `<p><a href="/${l}/" lang="${l}">${esc(i18n[l].siteTitle)} (${esc(i18n[l].name)})</a></p>`).join("\n")}
</body>
</html>
`);

console.log(`Built ${recipes.length} recipes: ${recipes.map((r) => `${r.id} [${Object.keys(r.versions).join(", ")}]`).join("; ")}`);
