# alanhernandez.dev

Source of the portfolio of Alan Hernández, Senior Android Developer. Work in progress: the site goes live at
[alanhernandez.dev](https://alanhernandez.dev).

## How it is built

- Plain HTML, CSS and JavaScript: no framework, no npm dependencies.
- One data file, `data/portfolio.js`, feeds every page and the CV (English and Spanish).
- `tools/build.js` (plain Node) fills the templates in `src/` into `_site/`; `tools/check-data.js` checks the data
  first. Dates and spans are computed by `lib/calc.js` at build time and again in the browser.
- Two versions of the same content: **Plain** (`index.html`, the quick read) and **Show** (`show.html`), plus one page
  per case study, built from `data/cases/`.
- Static files only, hosted on GitHub Pages: the domain is the only running cost.

## Run it locally

```sh
node tools/check-data.js
node tools/build.js
node tools/serve.js   # http://localhost:8080/
```

## How AI was used

Built with [Claude Code](https://claude.com/claude-code) as the coding agent, under the rules in `CLAUDE.md`. I set the
direction, made the product and design decisions, approved every text and verified the result; the agent wrote most of
the code. The design tooling it used, the third-party [impeccable](https://github.com/pbakaus/impeccable) skill, is not
included here; `skills-lock.json` pins the version.

## License

Code: [MIT](LICENSE). Text, photos and images: © Alan Hernández, all rights reserved.
