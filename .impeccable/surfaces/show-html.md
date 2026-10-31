---
version: 1
slug: "show-html"
primary_target: "show.html"
related_targets: ["index.html"]
---

# Surface brief: expressive landing (Show)

**Scope and mode:** the expressive version of the landing, its own page beside Plain (`index.html`, the main door since 2026-10-17). The file name `show.html` is provisional until the copy deck. Persuade and be remembered: this is the door for a reader who wants to get to know Alan, linked prominently from Plain's header. It renders from the same data file as Plain.

**Audience and job:** a recruiter or hiring manager who already chose to see more; it still has to be clear on its own (role, stack and availability in the first viewport). Action: get in touch or download the CV.

**Constraints:** every number dated and linked to a public repo; no invented proof; client work and own builds kept visibly apart.

**Built page:** `src/show.html` + `tools/pages/show.js` → `_site/show.html` (phase 4c, 2026-10-21). The prototype (approved by Alan on 2026-10-16 after ~20 tuning rounds) is in the private history, `21f7e48` (`git -C _private show`).

## Direction contract

THESIS: Alan's career as a Saturday-morning cartoon program: every job is an episode, the current build is "Now showing". It refuses the dark bento/glass grid and the "timeline + summary" résumé page.

OWN-WORLD: flat rubber-hose cartoon on a CRT set. Sunburst of sky blue and sun yellow, ink outlines 3–4 px with hard offset shadows, white outlined Titan One title, Bangers for tags and nav, Nunito for reading. One clickable color (pink-red), status orange/green only for status, purple = own builds, pale blue `#C4ECF9` = client work. One painted prop per episode.

STORY: the visitor sees an Android developer who builds with AI under written rules, backed by ten years of client work; they skim episodes, check the record so far, and get in touch.

FIRST VIEWPORT: inside the TV screen, arched "ALAN HERNÁNDEZ" lockup centered over the sun, photo badge with speed lines top-left, "Open to work" pill, black lower-third "Senior Android Developer", stack chips plus the AI chip, then "Get in touch" (primary) and "Download CV"; quick-read link in the top bar.

FORM: Cortinilla (cartoon title card), from the bolder re-roll rounds of 1d; seed key 61470666. Signature: the episode guide that irises between cards.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Night ("Luna azul", chosen by Alan on 2026-10-20)

The same program after sundown, as the `data-theme="dark"` block of `tokens.css`: night-blue sky with faint rays, a
cream moon with craters where the sun was, ink-outlined stars, a blue-black room, the Skills band and the ending's rings
in night blue. Outlines stay ink and cards stay white (they are the lit things). The solid top bar goes dark with cream
text and a cream "current section" pill. It follows the system until the visitor picks a theme with the bar's button;
the choice (`localStorage` `ah-theme`) is shared with Plain.
