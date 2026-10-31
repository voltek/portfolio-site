---
name: Alan Hernández — Portfolio
description: Rules shared by Plain, Show and every page of Plain's world. Each world's palette, faces and material live in its surface brief; the impeccable documenter rewrites this file from the build in phase 8.
---

<!-- Each world is described in its surface brief (.impeccable/surfaces/index-html.md, show-html.md, case-html.md) and built in src/. Re-run /impeccable document in phase 8 (_private/phases/phase-8-docs.md). The bento / glass / Aurum-Aqua system is an anti-reference (its old DESIGN.md: private commit df28821). -->

# Design System: Alan Hernández — Portfolio

## Overview

Two pages, two worlds, one data file. The **Plain** (`index.html`, the main door) is sober and plain: easy to scan and to find things in. **Show** (`show.html`) is the expressive version: a Saturday-morning cartoon program. They share only the data, the status colors and the role logic below; neither borrows the other's colors, fonts or outlines. The CV inherits Plain. The retired bento grid with glass panes and an aurora field is the generic developer-portfolio pattern this redesign exists to leave.

## Colors

Each world brings its own palette (see its surface brief). Shared across both:

- **Purple = own builds** (GameStack, ModernNotes); client work has its own pale blue in each world.
- Status colors (in progress, completed) appear only on status.

### Named Rules
**The One-Clickable-Color Rule.** Whatever the palette, exactly one color role means "you can click this". An accent color used for emphasis or evidence is never clickable, and the clickable color is never used as decoration (text selection uses a pale blue, not the clickable color).

**The Status-Means-Status Rule.** In-progress and completed colors appear only on status (project state, availability). They never double as brand or decoration.

## Typography

Faces belong to each world (see its surface brief). Half years are written "5.5", never "½".

### Named Rules
**The No-Gradient-Text Rule.** Text never carries a gradient fill (`background-clip: text`). Emphasis comes from weight, size, or a solid highlight, at most once per section.

## Layout

Works from 360 px phones to wide desktop with no horizontal scroll (16 px side gutters on phones), and the first viewport is about Alan, never one project. Both pages have a sticky top bar with the current section marked, and each links to the other version from it.
The jump to a section is set in one place only: `scroll-padding-top` on `html` = the bar's height + about 16 px (smaller
on phones). Never add a `scroll-margin-top` on the sections as well: the two add up and the previous section shows.

## Components

**Skills by level.** Three levels in words (Core, Strong, Familiar) plus a separate "View-based apps" row; a level with no skills is not drawn. Within a level, AI skills go first. The level reads from the row, the color and the chip size: one hue in three solid steps, **never a dashed or dotted outline** (it reads as "I don't have it"), and **no color legend** (the row names are the legend). Never bars, stars, percentages or scores. Years and places sit behind a collapsible detail ("See years and where I used each one"), rounded down ("since 2017 · 7+ yrs", "under 1 yr"); exact dates belong to the CV.

**The Bar Menu Rule (Plain's world: Plain, the case studies and any new page that inherits it; Alan, 10-27).** Every
page copies this bar exactly; a new page never redesigns it. Sections inline while they fit; when they don't (measured by
the script, not a fixed width), they go behind a menu button. The open menu is a panel on the field color; each item
fills the **whole width** of the panel (its hover and current background is the full row, never just the word); the
current item has the darker field background **plus a 3 px bar in the ink color on its left edge**. Opening it moves
focus to the first item with `focus({ preventScroll:true })` (a plain `focus()` scrolls the page under the bar). It
closes with any link in the bar (the page's own action too), Esc, a tap outside, focus leaving the bar, or scrolling on
more than 24 px. The bar itself always stays at the top, on phones too. The marked section is computed from positions
(the last one whose top passed under the bar; at the end of the page, the last one in view), and a section chosen in
the bar stays marked until the visitor scrolls by hand. A page's own always-visible action (Plain: "Animated"; a case
study: "Contact") stays outside the menu. The name is the home link and looks the same everywhere; on a case study it
returns to the exact place on the landing when the visitor came from there, else to the landing's top (Alan, 10-28).
Show has its own bar in its own world. **One copy:** the bar's CSS and script
are `src/partials/bar-read.css` and `bar-read.js`, included with `{{>name}}`; a page never copies or restyles them.

**The Contact Rule (Plain's world: Plain, the case studies, and any new page that ends with contact;
Alan, 10-28).** "Let's talk" is one piece, never rebuilt: its markup `src/partials/contact-read.html`, its CSS
`contact-read.css` (which also carries the world's buttons: `.btn`, `.go`, `.line`, `.copy`, `.ctas`) and its copy script
`copy-email.js`, each included with `{{>name}}`. Its words come from `profile` in `data/portfolio.js` (`contact.plain`,
`contact.body`, `email`, `links`), so a change there reaches every page. A page adds only the gap above it (Plain:
`.contact{margin-top:88px}`) and must give its renderer `githubIcon` (`ICON.github`). Show ends with its own "finale" in its
own world, reading the same `profile` data.

**Text links (Plain's world).** Every text link is underlined from the start in the clickable color (2 px; 3 px for a
large title link) and the underline thickens on hover; it never appears only on hover. Bar items (a 2 px border under the
current one) and the diagram's pieces (the box says it is clickable) are the exceptions.

## Elevation & Depth

Material and depth belong to each world. Colored glow is not a default hover effect; a world that literally emits light may use it as its own material.

## Do's and Don'ts

### Do:
- **Do** use one hover for every button (they rise and the shadow grows, no tilt); secondary links only change color.
- **Do** react to hover and press only on things that are clickable. Text cells, tags and labels stay still.
- **Do** tilt objects (props, badges, stickers) if the world tilts anything; lists, panels and text blocks stay straight.
- **Do** give every image (avatar, screenshots) a designed empty state, so paths can be declared before the files exist.
- **Do** switch every animation off under `prefers-reduced-motion`. An animation missing from that block is unfinished.
- **Do** hold WCAG 2.2 AA contrast for text and UI components in every state, including hover and focus.
- **Do** compute anything time-based from the dates (axis end, spans, "now"); never hard-code the current year.

### Don't:
- **Don't** inherit the retired bento grid, glass panes, aurora field or Aurum/Aqua gradients.
- **Don't** use gradient text, or ornament that carries no meaning in the chosen world.
- **Don't** add hover effects to non-interactive elements.
