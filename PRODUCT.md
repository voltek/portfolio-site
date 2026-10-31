# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain HTML/CSS/JS, no framework. One build step in plain Node fills the pages from `data/portfolio.js` (see
`CLAUDE.md` and `DATA.md`).

## Users

Two readers with two reading modes:

- **Technical recruiters** scan. They need role, seniority, stack, availability and one clear differentiator within seconds, on desktop or mobile.
- **Hiring managers and senior engineers** audit. They follow links into case studies and public repos to check that every claim holds up.

Alan Hernández is being evaluated for Senior Android Developer roles (also Android + AI and Mobile Lead). The site names only Senior Android and Android + AI as the roles he wants: no "Lead", since he held no formal leadership.

## Product Purpose

A personal portfolio that helps Alan get hired for senior Android roles. Android is the core; disciplined AI-assisted development is the differentiator, never the headline that replaces it.

## Positioning

Android first, AI as the differentiator. The subject is Alan: what he is good at today (modern Android with Kotlin, Jetpack Compose, MVI/MVVM and Clean Architecture, plus AI-assisted development under a documented harness), backed by ten years of shipping Android for banks, telecom and consumer apps. Personal projects are the current evidence, not the identity. Today that evidence is two contrasting builds: GameStack, built with AI agents under a documented harness (CLAUDE.md, Skills, ADRs, a CI gate), and ModernNotes, written entirely by hand with AI used only as a reviewer. Projects will finish and new ones will start; the positioning does not change when they do. The site proves the approach with process and public evidence rather than claims.

## Operating Context

A landing page (`index.html`) that a recruiter can scan top to bottom, plus one case-study page per project (`gamestack.html`, `modernnotes.html`) for the reader who audits. The landing ships in two versions (Alan, 2026-10-15): a quick-read version that states the facts plainly for readers who want hard data fast, and a full, expressive version. **Plain is the main door** (Alan, 2026-10-17): recruiters decide in seconds whether to keep reading, and Plain shows role, stack, years and every job at once, while the expressive version puts its experience behind clicks. So Plain is `index.html` and the expressive version (Show) gets its own page, linked prominently from Plain's header as the way to get to know Alan; each channel can link the version that suits it (CV and applications: Plain; LinkedIn or a conversation: either). Each version links to the other from its header; both render from one shared data file, so they can never disagree and a new project is still one data change. The expressive version must still be clear on its own. A downloadable CV (a PDF, EN/ES; how it is made is decided in phase 7) inherits Plain's sober direction. Hosted on GitHub Pages under a custom domain.

## Capabilities and Constraints

- Site copy in English; the CV also ships in Spanish.
- No framework and no npm dependencies: plain HTML/CSS/JS, filled by one plain-Node build step.
- One shared data file (profile, jobs, projects, skills, learning path, roadmap; texts as `{en, es}`) feeds Plain, the expressive version and both CVs. Spans and durations are computed from the dates, never typed. Case-study pages are authored individually. Finishing a project or starting a new one is a data change (status, a new entry, a new case-study page), never a landing redesign.
- Every public number (ADRs, Skills, PRs, tests) comes from a public repo, carries a date, and links to its source.
- Phone number appears only in the CV, never on the site.
- Running cost as close to zero as possible (Alan, 2026-10-20): a static site on GitHub Pages, automation only within free tiers, the domain as the only planned expense. Any feature that would add hosting or service costs needs a cheaper alternative or Alan's explicit approval.

## Brand Commitments

- Name: Alan Hernández (with the accent; without it only in the domain, URLs and file names). Title: Senior Android Developer.
- Personality: professional, precise, builder, never hype. Plain is deliberately sober and plain (Alan's word: "corporate"); Show is playful. Both stay precise.
- Each page brings its own palette and fonts (chosen 2026-10-16/17, described in the surface briefs). What binds both is the role logic (one color for what is clickable, status colors that only mean status, purple = own builds) and WCAG AA contrast.
- Colored glow is not a default effect: generic hover halos and decorative glows (the detector's `dark-glow` rule) are avoided, and plain interactive feedback uses neutral shadow, lightness or movement. Alan has no aesthetic objection to glow (2026-10-15): a direction whose world genuinely emits light (an amber screen, neon signage, a lit display) may use it as part of that world, with a scoped detector ignore and its reason. Never discard or weaken a direction because it uses glow.
- Must not read as a generic template portfolio. The dark bento grid + glassmorphism + aurora combination is a known pattern to avoid as the defining look.

## Evidence on Hand

- Public repos: GameStack (in progress) and ModernNotes (completed), both on https://github.com/voltek.
- Real experience: Globant (OpenBank Spain, CitiBanamex Mexico), América Móvil/Claro Drive, IRONBIT Digital Experiences, Estrategia Tecnológica.
- Contact: email hello@alanhernandez.dev (forwards to a private Gmail that is never published); LinkedIn https://www.linkedin.com/in/alan-hernandez-voltek/; GitHub https://github.com/voltek.
- Modern architecture, verified in the public repos (2026-10-15): MVI + Clean Architecture in GameStack (its CLAUDE.md, `SearchContract.kt`, the `new-viewmodel` Skill); MVVM with unidirectional state (ViewModel + UiState + UiEvent) in ModernNotes. Client work was MVP (IRONBIT, Claro Drive, OpenBank), with Clean Architecture at CitiBanamex. MVI/MVVM are claimed for personal work only.
- AI-assisted development, verified: GameStack is built with Claude Code agents under a documented harness (CLAUDE.md, Skills, ADRs with "Enforced by", a CI gate, a Human-in-the-Loop principle); ModernNotes used AI only as a reviewer. Spec-Driven Development and context engineering come from Alan's self-directed roadmap, applied in GameStack. Not claimable yet: LLM APIs (Gemini, OpenAI, Anthropic), on-device AI, KMP, Alan's own Hooks.
- Learning path: a self-directed roadmap on AI-assisted Android development, built with Claude from the syllabus of DevExpert's "AI Expert" course and kept current with newer tooling. Alan is not enrolled in that course, so the site never names it as a course taken or a credential; it describes the roadmap and points to GameStack as its evidence.
- No testimonials, benchmarks, pricing, or third-party proof exist. Future work must not fabricate any.

## Product Principles

- What Alan is good at now comes first. The first viewport answers "what is he good at today?": Senior Android, the modern stack (Kotlin, Compose, MVI/MVVM, Clean Architecture) and AI-assisted development under a documented harness. Years and domains (banking, telecom) back it up; they do not lead.
- A framed "Now building" slot features the project in progress (today GameStack) as the strongest current evidence, close to the first viewport and visually set apart from everything else. It reads from data, so a new project replaces it without a redesign, and it never replaces Alan as the headline or turns the landing into one project's page.
- Skills lead, history supports. Skills read by level first (Alan, 2026-10-17): three tiers named in words (Core, Strong, Familiar), with legacy client tech (Java-era codebases) in a row of its own. Within a level, AI-assisted development skills go first (Alan, 2026-10-17): they are the differentiator recruiters look for today, so any AI skill added later leads its level too (in the data, `ai:true`); Core stays the Android foundation. Levels are words backed by evidence in the projects and the history, never bars, stars, percentages or scores: self-rated scales read as unverifiable to recruiters. Years and places are the secondary layer, one click away: since when and where each skill was used, as an approximate visual (whole years rounded down, "since 2017 · 7+ yrs"), computed from the career dates; exact dates belong to the downloadable CV. Career history reads newest first, and legacy client work stays visibly distinct from modern personal work.
- Two reading modes, one page each: the landing scans fast, the case studies reward a close read. Neither mode should force the other's pace.
- Prove AI fluency through documented process and public evidence, not adjectives.
- Every claim must be defensible in an interview. If it is not in a public repo or confirmed by Alan, it is not published.
- Keep legacy client work (Java/MVP era, Globant) and modern personal work (Kotlin/Compose/Clean Architecture) visibly distinct. Never overstate seniority or leadership that wasn't formally held.
- Android first: AI-assisted development supports the Android story; it does not replace it.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast at least 4.5:1 (3:1 for large text and UI components), visible focus on every interactive element, full keyboard operation, and `prefers-reduced-motion` respected for every animation.
