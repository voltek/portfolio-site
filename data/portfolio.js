// The one source for Plain (index.html), Show (show.html), the case studies and both CVs. Every page only draws what
// is here; a new job, project, skill or learning block is an edit to this file, never to the HTML.
// Recipes for the usual changes: DATA.md. Check after editing: node tools/check-data.js
//
// Conventions
// · Dates: "2015-08" (a month = its first day) or "2026-07-15" when the day matters. end: null = ongoing.
// · Texts the CV shows come as { en, es }; es: null = Spanish still to approve (check-data lists them). Texts only the
//   site shows (it is English) are plain strings.
// · **…** marks the words a page highlights. {careerYears}, {lapse}, {pinDate} and {updated} are filled
//   (lib/calc.js); never write a length, a number of years or an episode number by hand.
// · Approved copy only: every text here passed _private/sources/copy-deck.md.
(function (root, data) {
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.PORTFOLIO = data;
})(typeof self !== "undefined" ? self : this, {

  profile: {
    name: "Alan Hernández",
    alternateName: "Alan Hernandez", // JSON-LD, so a search without the accent finds it too
    title: { en: "Senior Android Developer", es: "Senior Android Developer" },
    status: "Open to work · Mexico City (UTC−6) · remote or relocation",
    timeZone: "America/Mexico_City", // the live clock after "(UTC−6)" in the hero pill (computed in the browser)
    email: "hello@alanhernandez.dev", // forwards to Alan's Gmail, which is never published
    links: {
      linkedin: "https://www.linkedin.com/in/alan-hernandez-voltek/",
      github: "https://github.com/voltek",
      site: "https://alanhernandez.dev/" // canonical address, sitemap and share previews
    },
    // the phone lives only in the CV Alan sends himself, never in this public file (phase 7)
    photo: { src: "assets/alan.jpg", alt: "Portrait of Alan Hernández" },
    stack: ["Kotlin", "Jetpack Compose", "MVI", "MVVM", "Clean Architecture"],
    aiLine: { en: "AI agents inside a harness I designed", es: "agentes de IA dentro de un harness que yo diseñé" },
    lede: {
      plain: "{careerYears}+ years of Android client apps in banking, telecom and consumer products. In 2026 I wrote a modern Android app by hand; now I build the next one with **AI agents inside a harness I designed**: rules and checks they can't skip.",
      show: "Modern Android and AI-assisted development · {careerYears}+ years in banking, telecom and consumer apps"
    },
    contact: {
      plain: "Let's talk.",
      show: "So once again, the episode ends… and the next one begins with **your team!**",
      body: "Looking for Senior Android or Android + AI roles. Available now, for remote work or relocation, based in Mexico City (UTC−6): full overlap with US hours and European afternoons." //  : the time zone never sits alone on a line
    },
    education: {
      degree: { en: "Computer Systems Engineering", es: "Ingeniería en Sistemas Computacionales" },
      school: "Universidad de Cuautitlán Izcalli",
      start: "2013", end: "2016" // no degree status, on the site or the CV
    },
    languages: [
      { name: { en: "Spanish", es: "Español" }, level: { en: "native", es: "nativo" } },
      { name: { en: "English", es: "Inglés" }, level: { en: "B2", es: "B2" } }
    ]
  },

  // An employer behind several places, with its own dates (Globant ran past Openbank: bench until May 21, 2026).
  employers: {
    globant: {
      name: "Globant", start: "2020-02", end: "2026-05-21",
      role: { en: "Senior Android Developer", es: "Senior Android Developer" },
      place: { en: "Mexico City", es: "Ciudad de México" }, // CV
      intro: { en: "Android developer on two banking clients.", es: "Desarrollador Android en dos clientes bancarios." },
      note: "{lapse} in total, across the two clients below" // Plain, under the employer's name, above its two clients
    }
  },

  // Jobs and projects, oldest first: this order is also the episode order (Show numbers them from it).
  // type: "job" (client work, Season 1) · "project" (own build, Season 2; status "in-progress" | "completed").
  // highlights: three per card, always (a fourth dilutes the scan; what does not fit goes to the CV).
  // cv: what only the CV adds: more (bullets after the highlights) and note (beside a client's name under its employer).
  // show: the Show episode's title card and its prop (an unknown prop falls back to the generic one).
  work: [
    {
      id: "et", type: "job", name: "Estrategia Tecnológica", short: "Estrategia",
      start: "2015-08", end: "2017-01",
      studio: { en: "A software consultancy", es: "Una consultora de software" },
      role: { en: "Android Developer", es: "Desarrollador Android" },
      what: { en: "My first Android role: apps for a consultancy's clients.", es: "Mi primer puesto como desarrollador Android: apps para los clientes de una consultora." },
      highlights: [
        { en: "Usually the only Android developer on each project", es: "Normalmente era el único desarrollador Android de cada proyecto" },
        { en: "Started an offline ticketing pilot from scratch: SQLite catalogs and Bluetooth printing (Zebra SDK)", es: "Inicié desde cero un piloto de boletas sin conexión: catálogos en SQLite e impresión por Bluetooth (SDK de Zebra)" },
        { en: "Worked on a board game app's redesign: refactors, new animations and AdMob ads", es: "Trabajé en el rediseño de una app de juego de mesa: refactors, animaciones nuevas y anuncios de AdMob" }
      ],
      stack: ["Java", "SQLite", "REST", "Bluetooth printing"],
      show: { title: ["FIRST", "TICKET"], prop: "ticket" }
    },
    {
      id: "ir", type: "job", name: "IRONBIT",
      start: "2017-01", end: "2018-02",
      studio: { en: "A digital agency", es: "Una agencia digital" },
      role: { en: "Android Developer", es: "Desarrollador Android" },
      what: { en: "Apps for the agency's clients, in Java and early Kotlin.", es: "Apps para los clientes de la agencia, en Java y Kotlin temprano." },
      highlights: [
        { en: "Main contributor to a travel app redesign", es: "Contribuidor principal del rediseño de una app de viajes" },
        { en: "Currency, weather and nearby places screens", es: "Pantallas de divisas, clima y lugares cercanos" },
        { en: "Kotlin in production in 2017, the year Google made it official for Android", es: "Kotlin en producción en 2017, el año en que Google lo hizo oficial para Android" }
      ],
      stack: ["Java", "Kotlin", "Google Maps", "Places", "Firebase"],
      cv: { more: [{ en: "Minor work on KidZania's visitor and kiosk apps", es: "Trabajo menor en las apps de visitantes y de kiosco de KidZania" }] },
      show: { title: ["Bon", "Voyage"], prop: "suitcase" }
    },
    {
      id: "cd", type: "job", name: "Claro Drive", company: "América Móvil",
      start: "2018-02", end: "2020-02",
      studio: { en: "América Móvil, for Claro Drive", es: "América Móvil, para Claro Drive" },
      role: { en: "Android Developer", es: "Desarrollador Android" },
      what: { en: "A telecom's cloud storage app for its subscribers: new features and bug fixes across the app, with the Scanner as my main area.", es: "App de almacenamiento en la nube de una empresa de telecomunicaciones para sus suscriptores. Funciones nuevas y corrección de errores en toda la app, con el Scanner como mi área principal." },
      highlights: [
        { en: "Built the Scanner's editing screen: crop, filters and stickers on the photo", es: "Construí la pantalla de edición del Scanner: recorte, filtros y stickers sobre la foto" },
        { en: "Compressed photos so large images no longer ran out of memory", es: "Comprimí las fotos para que las imágenes grandes dejaran de agotar la memoria" },
        { en: "File sharing by email or link, with editable permissions", es: "Compartir archivos por correo o enlace, con permisos editables" }
      ],
      stack: ["Java", "MVP", "RxJava", "Dagger 2", "Glide", "EventBus"],
      show: { title: ["PAPER", "CHASE"], prop: "scanner" }
    },
    {
      id: "cb", type: "job", name: "Citibanamex", employer: "globant",
      start: "2020-02", end: "2020-08",
      studio: { en: "Globant, for Citibanamex", es: "Globant, para Citibanamex" },
      what: { en: "Improvements to the app's CoDi flow, the digital payments system of Mexico's central bank.", es: "Mejoras al flujo de CoDi de la app, el sistema de pagos digitales del banco central de México." },
      highlights: [
        { en: "Improved QR reading and generation, and built the specified security steps natively", es: "Mejoré la lectura y generación de códigos QR y construí de forma nativa los pasos de seguridad especificados" },
        { en: "Worked on payment history and the QR or NFC switch", es: "Trabajé en el historial de pagos y en el cambio entre QR y NFC" },
        { en: "Wrote unit tests inside a Clean Architecture codebase", es: "Escribí pruebas unitarias dentro de una base de código con Clean Architecture" }
      ],
      stack: ["Java", "Kotlin", "RxJava", "MVP", "Clean Architecture", "Retrofit"],
      cv: { note: { en: "A Mexican bank, then part of Citigroup", es: "Banco mexicano, entonces parte de Citigroup" } },
      show: { title: ["QUICK RESPONSE"], prop: "qr" }
    },
    {
      id: "ob", type: "job", name: "Openbank", employer: "globant",
      start: "2020-08", end: "2026-02",
      studio: { en: "Globant, for Openbank (Spain)", es: "Globant, para Openbank (España)" },
      what: { en: "A Spanish bank's app, mostly with the deposits team: a Java codebase from 2018, where new code went into Kotlin.", es: "App de un banco español, sobre todo con el equipo de depósitos: una base de código en Java de 2018, donde el código nuevo se escribía en Kotlin." },
      highlights: [
        { en: "Built the full deposit reinvestment flow", es: "Construí el flujo completo de reinversión de depósitos" },
        { en: "Implemented the deposits redesign from its user stories: rates from the API instead of fixed, a wizard cut from 5 steps to 4, preferential renewal rates", es: "Implementé el rediseño de depósitos a partir de sus historias de usuario: tasas desde la API en lugar de fijas, un asistente reducido de 5 pasos a 4 y tasas preferenciales de renovación" },
        { en: "Integrated whole sections built by other teams (profile, notifications) as Kotlin + Compose modules", es: "Integré secciones completas hechas por otros equipos (perfil, notificaciones) como módulos Kotlin + Compose" }
      ],
      stack: ["Kotlin", "Java", "MVP", "Coroutines", "Dagger 2", "Custom Views", "Bitrise"],
      cv: {
        note: { en: "Santander Group's digital bank · Spain", es: "Banco digital del Grupo Santander · España" },
        more: [
          { en: "Worked across most of the app (cards, accounts, keys and contracts) and unified its PDF contract viewer", es: "Trabajé en la mayor parte de la app (tarjetas, cuentas, claves y contratos) y unifiqué su visor de contratos en PDF" },
          { en: "Built custom views, such as the renewal detail on each deposit in the list, which changed color depending on the deposit", es: "Construí custom views, como el detalle de renovación de cada depósito en la lista, que cambiaba de color según el depósito" },
          { en: "Replaced legacy AsyncTask code with coroutines in the sections I worked on", es: "Reemplacé código legacy con AsyncTask por coroutines en las secciones en las que trabajé" }
        ]
      },
      show: { title: ["Compound", "Interest"], prop: "cert" }
    },
    {
      id: "mn", type: "project", name: "ModernNotes", status: "completed",
      start: "2026-02-26", end: "2026-04-06", // first commit and last code commit (the Oct 16 fixes are in the case)
      what: { en: "A notes app written entirely by hand. AI never wrote the code; it guided and audited.", es: "App de notas escrita completamente a mano. La IA nunca escribió el código; lo guio y lo auditó." },
      highlights: [
        { en: "Room as the single source of truth; the UI never reads from the network", es: "Room es la única fuente de verdad y la interfaz nunca lee de la red" },
        { en: "13 unit test classes and a DAO test", es: "13 clases de pruebas unitarias y una prueba del DAO" },
        { en: "Sort order saved with DataStore and applied in the database query", es: "El orden se guarda con DataStore y se aplica en la consulta a la base de datos" }
      ],
      stack: ["Kotlin", "Compose", "MVVM", "Room", "Hilt", "Flow"],
      links: { repo: "https://github.com/voltek/ModernNotes", caseStudy: "modernnotes.html" },
      pin: { date: "2026-10-16", commit: "3274436" }, // the case file's pin; tools/repo-changes.js reads it here
      // on: where each screen appears ("plain", "show", "case"). No screens = the designed empty state.
      shots: [
        { src: "assets/projects/modernnotes/home.png", label: "Home", alt: "ModernNotes list screen titled My notes, with two notes and a sort menu set to Date descendant", on: ["case"] },
        { src: "assets/projects/modernnotes/filters.png", label: "Sort order", alt: "ModernNotes sort menu open with three options: Date descendant (selected), Date ascendant and Title", on: ["case"] },
        { src: "assets/projects/modernnotes/detail.png", label: "Edit note", alt: "ModernNotes Edit Note screen with a title field and a content field, and a Save action", on: ["case"] }
      ],
      show: { title: ["Written", "by Hand"], prop: "notepad" }
    },
    {
      id: "gs", type: "project", name: "GameStack", status: "in-progress",
      start: "2026-07-15", end: null, // the repo's first commit (the study plan from June does not count as use)
      lede: { en: "A game library app in Kotlin and Compose, built with AI agents inside a harness I designed, using Claude Code. The agents write the code; I review every change.", es: "App de biblioteca de videojuegos en Kotlin y Compose, hecha con agentes de IA dentro de un harness que yo diseñé, usando Claude Code. Los agentes escriben el código; yo reviso cada cambio." },
      what: { en: "An Android app to search video games from IGDB, with game details coming next.", es: "App Android para buscar videojuegos en IGDB; el detalle de cada juego viene después." },
      highlights: [
        { en: "Search end to end: four screen states, debounced queries, and a failed refresh that keeps the results", es: "La búsqueda funciona de punta a punta: cuatro estados de pantalla, consultas con debounce y un refresh fallido que conserva los resultados" },
        { en: "IGDB queries in its Apicalypse language, behind Twitch OAuth", es: "Consultas a IGDB en su lenguaje Apicalypse, detrás de OAuth de Twitch" },
        { en: "MVI with Clean Architecture; screen tests with Robolectric", es: "MVI con Clean Architecture; pruebas de pantalla con Robolectric" }
      ],
      stack: ["Kotlin", "Compose", "MVI", "Clean Architecture", "AI agents"],
      links: { repo: "https://github.com/voltek/GameStack", caseStudy: "gamestack.html" },
      shots: [
        { src: "assets/projects/gamestack/search.png", label: "Search", alt: "GameStack search screen, empty state", on: ["show", "case"] },
        { src: "assets/projects/gamestack/search_results.png", label: "Results", alt: "GameStack search results with game covers", on: ["plain", "show", "case"] },
        { src: "assets/projects/gamestack/search_refresh_error.png", label: "Error keeps results", alt: "GameStack refresh error that keeps the previous results on screen", on: ["show", "case"] },
        { src: "assets/projects/gamestack/search_loading.png", label: "Loading", alt: null, on: ["case"] },
        { src: "assets/projects/gamestack/search_no_results.png", label: "No results", alt: null, on: ["case"] }
      ],
      // The commit and day the site's claims were last checked against the repo (DATA.md → Re-pin GameStack).
      pin: { date: "2026-11-12", commit: "5fb80bc" },
      // "Now building": the proof, qualitative (no counts: the system is the value, not the quantity). on: where each
      // row shows, like the shots ("plain", "show", "case"); the landing keeps the three that prove the differentiator,
      // the case study has them all (Alan, 10-27 and 11-12). es: the row in Spanish; the CV draws the rows that have it.
      proof: [
        { check: true, label: "Decisions that name their enforcement", note: "each ADR states what enforces it: a test, a CI check, a setting, or prose only", on: ["plain", "show", "case"],
          es: { label: "Decisiones que dicen qué las hace cumplir", note: "cada ADR indica si lo hace un test, un check de CI, una configuración o solo texto" } },
        { check: true, label: "Human in the loop", note: "what the rules don't settle waits for my approval, and I confirm every review triage and every merge", on: ["plain", "show", "case"],
          es: { label: "Human in the loop", note: "lo que las reglas no resuelven espera mi aprobación, y yo confirmo cada triage de revisión y cada merge" } },
        { check: true, label: "Checks no agent can skip", note: "build, test, lint and commit checks on every PR, behind branch protection that binds me too", on: ["plain", "show", "case"],
          es: { label: "Controles que ningún agente puede saltarse", note: "build, tests, lint y reglas de commit en cada PR, tras una protección de rama que también me obliga a mí" } },
        { check: true, label: "Rules as mechanisms", note: "the rules that must never break are a hook, a deny rule or a test, not a line of prose", on: ["case"] },
        { check: true, label: "A capped review loop", note: "local AI review rounds before every PR, capped per branch: real defects per round fell from 3.3 to 2.2 by round 3 (measured once, Nov 2026)", on: ["case"] },
        { check: true, label: "A context budget", note: "the agents' standing instructions are held under 60 lines by a test, and area rules load only when needed: 31% fewer tokens before any task (measured once, Nov 2026)", on: ["case"] },
        { check: true, label: "From spec to test", note: "in Search's spec, every scenario names the test that verifies it", on: ["case"] },
        { check: true, label: "Code and documents in step", note: "the commit that resolves a disagreement between them says which side was fixed", on: ["case"] },
        { check: true, label: "Skills", note: "one procedure per repeatable task, loaded only when needed: each layer's code and tests, device checks, shipping a branch", on: ["case"] }
      ],
      source: "Checked against the public repo, {pinDate}",
      // where the app goes next (status: "done" · "now" · "next"); the pin lands before the first step not done
      roadmap: {
        lane: "App",
        steps: [["Search", "done"], ["Game Detail", "next"], ["Library", "next"], ["Ratings", "next"], ["Home", "next"]],
        goal: "On Google Play"
      },
      // The learning path lives on the project it proves: "Now building" draws it while GameStack is in progress, and it
      // stays with this project (and its case study) when another build takes over. Show's harness lane is read from the
      // blocks' steps, then the goal's short name. status: "done" · "now" · "next" · "goal".
      learningPath: {
        updated: "2026-11-13", // a fact, not a length: the day this path last changed
        lane: "Harness", // Show: the label of its lane under the app's
        intro: "A self-directed path in AI-assisted Android development, updated as the tools change. Each finished block is put to work in GameStack, and the repo shows it.",
        arc: "It goes from **writing every line by hand** (ModernNotes) to **directing AI agents** (GameStack).", // Show only
        blocks: [
          { tag: "Block 1", title: "Fundamentals", status: "done", note: "How LLMs work, research with checked sources, and GameStack's first spec, later replaced by a living PRD" },
          { tag: "Block 2", title: "Context engineering", status: "done", note: "Prompting, CLAUDE.md and the first Skills", steps: [["CLAUDE.md", "done"], ["Skills", "done"]] },
          { tag: "Block 3", title: "Spec-Driven Development", status: "done", note: "Specs, a drift checklist, human in the loop and handoffs" },
          { tag: "Extra", title: "Design phase", status: "done", note: "Four screens and their states, designed and documented" },
          { tag: "Block 4", title: "Claude Code, harness and loop engineering", status: "now", note: "CI gate, ADRs, hooks and a capped review loop done · next: subagents of my own", steps: [["CI gate", "done"], ["ADRs", "done"], ["Hooks", "done"], ["Review loop", "done"], ["Subagents", "next"]] },
          { tag: "Block 5", title: "Agentic IDEs and other CLIs", status: "next", note: "Hands-on with other agent tools" },
          { tag: "Block 6", title: "AI APIs inside apps", status: "next", note: "AI recommendations in GameStack" },
          { tag: "Block 7", title: "Rapid prototyping", status: "next", note: "From an idea to a clickable prototype, fast" },
          { tag: "Block 8", title: "Capstone: my own harness and loop", short: "My own harness", status: "goal", note: "Where the whole path leads" }
        ]
      },
      show: { title: ["RULES OF", "THE GAME"], prop: "marquee", record: "The record so far!" }
    }
  ],

  // Skills by level, in Alan's own judgment (words only: never bars, stars or percentages). Each row keeps this
  // order, what Android openings ask for most first, with a few set by hand (Flow by Coroutines, RxJava over SQLite,
  // Git and MCP last): Alan approved it, do not re-sort. ai: true goes to the "AI-assisted development" row. cv: the name on the CV, when it says more there. legacy: true goes to the "Apps with XML Views" row, in this order and one look for all.
  // pages: false keeps a skill off Plain and Show (Git, the Compose-era libraries): it stays for the CV. at: where it
  // was used (ids from work; { id, start, end } narrows one place; part: true marks a place where it was used only
  // some of the time: the matrix's hollow dot, and no years); its years are computed from there. len: false names the
  // places instead of a length (a skill used in only part of a job). note: the line under its row in the detail.
  skills: [
    { name: "Kotlin", level: "core", at: ["gs", "mn", "ob", "cb", { id: "ir", end: "2017-12" }] }, // none in 2018–19
    { name: "Java", level: "core", at: ["ob", "cb", "cd", "ir", "et"] },
    { name: "Android SDK", level: "core", at: ["gs", "mn", "ob", "cb", "cd", "ir", "et"] },
    { name: "Retrofit · REST APIs", level: "core", at: ["gs", "mn", "ob", "cb", "cd", "ir", "et"], note: "REST APIs at every client job. In GameStack, IGDB queries written in its Apicalypse language" },
    { name: "Jetpack Compose", level: "strong", at: ["gs", "mn"] },
    { name: "Coroutines", level: "strong", at: ["gs", "mn", "ob"], note: "In my own builds, a search where each new query cancels the one running (GameStack) and tests on a test dispatcher in both; at Openbank, simple use inside an existing codebase" },
    { name: "Flow", level: "strong", at: ["gs", "mn"] },
    { name: "MVI · MVVM", level: "strong", at: ["gs", "mn"], note: "MVI in GameStack, MVVM in ModernNotes" },
    { name: "Testing", cv: "Testing (JUnit, MockK, Turbine)", level: "strong", at: ["gs", "mn", "cb", { id: "ob", part: true }], note: "JUnit, MockK, Turbine and coroutines-test in both builds, MockWebServer in ModernNotes, Robolectric screen tests in GameStack; unit tests at Citibanamex and, now and then, at Openbank" },
    { name: "Hilt", level: "strong", at: ["gs", "mn"] },
    { name: "Gradle", level: "strong", at: ["gs", "mn"], note: "Version catalogs and KSP in both builds", pages: false },
    { name: "Room", level: "strong", at: ["mn"] },
    { name: "Material 3", level: "strong", at: ["gs", "mn"], pages: false },
    { name: "Clean Architecture", level: "strong", at: ["gs", "mn", "cb"], note: "Designed by hand in ModernNotes and kept in GameStack; at Citibanamex, inside an existing codebase" },
    { name: "Navigation Compose", level: "strong", at: ["gs", "mn"], pages: false },
    { name: "Compose & Views interop", level: "strong", at: ["ob"], len: false, note: "At Openbank, Compose modules from other teams inside an app with XML Views" },
    { name: "Architecture decisions · ADRs", level: "strong", at: ["gs"], note: "Decisions recorded as ADRs in GameStack, each naming what enforces it" },
    { name: "kotlinx.serialization", level: "strong", at: ["gs", "mn"], pages: false },
    { name: "Coil", level: "strong", at: ["gs"], pages: false },
    { name: "Git", level: "strong", at: ["gs", "mn", "ob", "cb", "cd", "ir", "et"], note: "At every job; in GameStack, pull requests behind branch protection", pages: false },
    { name: "Agentic engineering · Claude Code", level: "strong", ai: true, at: ["gs"], note: "Claude Code agents build inside a harness I designed, with a human in the loop: I confirm every review triage and every merge. In ModernNotes, AI never wrote the code" },
    { name: "Spec-Driven Development", cv: "Spec-Driven Development (OpenSpec)", level: "strong", ai: true, at: ["gs"], note: "A living PRD and OpenSpec, each scenario naming the test that verifies it, a drift checklist and session checkpoints, from my learning path, applied in GameStack" },
    { name: "AI code review loops", level: "strong", ai: true, at: ["gs"], note: "Capped review rounds per branch, every finding triaged in a table I confirm, then one Codex round on the pull request" },
    { name: "Harness engineering", cv: "Harness engineering (CLAUDE.md, path-scoped rules, Agent Skills, hooks, permissions, CI gates)", level: "strong", ai: true, at: ["gs"], note: "CLAUDE.md and rules loaded by path, Skills, hooks, permissions and two required CI checks" },
    { name: "Using subagents and MCP servers", level: "familiar", ai: true, at: [], pages: false }, // used, none built: never without "using"
    { name: "CI · GitHub Actions", level: "familiar", at: ["gs"], note: "Two required checks on every GameStack PR: build, test and lint; and the commit, title and branch rules" },
    { name: "Code review", level: "familiar", at: ["gs", { id: "ob", part: true }, { id: "cb", part: true }, { id: "cd", part: true }], len: false, note: "Every GameStack pull request before it merges; teammates' pull requests now and then at Globant (Citibanamex, Openbank) and Claro Drive" },
    { name: "Firebase Analytics · Crashlytics", level: "familiar", at: ["ir"] },
    { name: "Google Maps · Places", level: "familiar", at: ["ir"] },
    { name: "Robolectric", level: "familiar", at: ["gs"], note: "Screen tests in GameStack", pages: false },
    { name: "Dagger 2", level: "core", legacy: true, at: ["ob", "cd", { id: "ir", part: true }], note: "Also at IRONBIT toward the end. Citibanamex wired its dependencies by hand" },
    { name: "RxJava", level: "familiar", legacy: true, at: ["cb", "cd"] },
    { name: "SQLite", level: "familiar", legacy: true, at: ["ir", "et"], note: "SQLite by hand for offline catalogs at Estrategia; Realm at IRONBIT" },
    { name: "MVP", level: "core", legacy: true, at: ["ob", "cb", "cd", "ir"] },
    { name: "Custom Views", level: "core", legacy: true, at: ["ob"] },
    { name: "Glide", level: "familiar", legacy: true, at: ["cd"] }
  ],

  // The CV's own copy (copy deck §11), both languages; the rest of it is read from the entries above.
  // siteLink: the site's address joins the contact line at launch, not before.
  cv: {
    siteLink: false,
    photo: ["es"], // the languages whose CV carries the photo
    status: { en: "Mexico City (UTC−6) · Remote or relocation · Available now", es: "Ciudad de México (UTC−6) · Remoto o reubicación · Disponible de inmediato" },
    overlap: { en: "Flexible by up to 3 hours to overlap with European afternoons; full overlap with US hours.", es: "Flexible hasta 3 horas para coincidir con las tardes de Europa; coincidencia total con el horario de EE. UU." },
    summary: {
      en: "Android developer with {careerYears}+ years of client apps in banking, telecom and consumer products, in Java and Kotlin. In 2026 I wrote a modern Android app by hand; now I build the next one with **AI agents inside a harness I designed**: rules and checks they can't skip. Looking for Senior Android or Android + AI roles.",
      es: "Desarrollador Android con {careerYears}+ años en apps para clientes de banca, telecomunicaciones y consumo, en Java y Kotlin. En 2026 escribí a mano una app Android moderna; ahora construyo la siguiente con **agentes de IA dentro de un harness que yo diseñé**: reglas y controles que no pueden saltarse. Busco puestos de Senior Android o Android + IA."
    },
    h: {
      skills: { en: "Skills", es: "Habilidades" }, projects: { en: "Own projects", es: "Proyectos propios" }, experience: { en: "Experience", es: "Experiencia" },
      how: { en: "How I work", es: "Cómo trabajo" }, education: { en: "Education", es: "Educación" }, languages: { en: "Languages", es: "Idiomas" }
    },
    levels: {
      core: { en: "Core", es: "Principales" }, coreNote: { en: "years of use", es: "años de uso" }, strong: { en: "Strong", es: "Sólidas" },
      ai: { en: "AI-assisted development", es: "Desarrollo asistido por IA" }, familiar: { en: "Familiar", es: "Familiares" },
      legacy: { en: "Apps with XML Views", es: "Apps con vistas XML" }
    },
    kind: { project: { en: "Own build", es: "Proyecto propio" }, "in-progress": { en: "In progress", es: "En curso" }, completed: { en: "Completed", es: "Completado" } },
    // skill and stack names that change in Spanish; every other one is written alike (technical terms stay in English, Alan)
    terms: {
      "Harness engineering (CLAUDE.md, path-scoped rules, Agent Skills, hooks, permissions, CI gates)": "Harness engineering (CLAUDE.md, path-scoped rules, Agent Skills, hooks, permisos, controles de CI)",
      "AI code review loops": "Ciclos de code review con IA",
      "Using subagents and MCP servers": "Uso de subagents y servidores MCP",
      "Code review": "Revisión de código", "Architecture decisions · ADRs": "Decisiones de arquitectura · ADRs", "Compose & Views interop": "Interoperabilidad Compose y Views",
      "Bluetooth printing": "Impresión por Bluetooth", "AI agents": "Agentes de IA"
    },
    how: [
      { en: "In Globant's evaluations, the client valued features delivered with few bugs, because I covered the scenarios before handing them over, and clear communication with the team and with them.", es: "En las evaluaciones de Globant, el cliente valoró que entregara funciones con pocos bugs, porque cubría los escenarios antes de entregarlas, y la comunicación clara con el equipo y con ellos." },
      { en: "Remote work across countries at Openbank: teams spread between Spain and Latin America, and in the last one I was the only member outside Spain. Close work with the product owner and analysts, adapting to last-minute changes.", es: "Trabajo remoto entre países en Openbank: equipos repartidos entre España y Latinoamérica, y en el último yo era el único fuera de España. Trabajo cercano con el product owner y los analistas, adaptándome a cambios de último minuto." },
      { en: "I review my own process and fix it before adding features: in GameStack I paused product work for a cycle that rewrote the product requirements, set up Spec-Driven Development with OpenSpec and tightened the harness, applying my self-directed AI learning path.", es: "Reviso mi propio proceso y lo corrijo antes de sumar funciones: en GameStack pausé el producto durante un ciclo que reescribió los requisitos del producto, dejó listo el Spec-Driven Development con OpenSpec y ajustó el harness, aplicando mi ruta de aprendizaje de IA autodirigida." }
    ]
  },

  // Page copy that is not about one entry (copy-deck sections 1 and 5–8). Site only, so English strings.
  copy: {
    page: {
      title: {
        plain: "Alan Hernández · Senior Android Developer",
        show: "Alan Hernández · Senior Android Developer · Animated version",
        cv: "Alan Hernández · CV"
      },
      description: "Senior Android Developer in Mexico City: {careerYears}+ years of client apps in banking, telecom and consumer products, now building with AI agents inside a harness I designed."
    },
    nav: {
      plain: ["Now building", "Skills", "Experience", "Next", "Contact"],
      show: ["Now showing", "Skills", "Experience", "Contact"]
    },
    links: {
      toShow: { long: "Play the animated version", short: "Animated" },
      toPlain: { long: "Read the plain version", short: "Plain" }
    },
    cta: { contact: "Get in touch", cv: "Download CV", cvIn: { en: "English", es: "Español" }, cvKind: "PDF", copied: "Copied" },
    footer: {
      // CC BY 3.0 requires this credit wherever the Android robot appears
      showCredit: "The Android robot is reproduced or modified from work created and shared by Google and used according to terms described in the Creative Commons 3.0 Attribution License."
    },
    // home: Show's name link reads "Alan Hernández, back to top", the visible name and then this
    aria: {
      primary: "Primary", menu: "Menu", toLight: "Switch to light mode", toDark: "Switch to dark mode",
      home: "back to top", stack: "Current stack", copyEmail: "Copy email address",
      episodes: "All episodes, newest first", viewLarger: "View larger: ", close: "Close",
      skip: "Skip to content", yes: "Yes"
    },
    education: { plain: "Education and languages", show: "Education", languages: "Languages" },
    skills: {
      intro: "Grouped by how well I know them.",
      levels: {
        core: ["Core", "My daily tools, with years of use"],
        strong: ["Strong", "Confident with it, in production or in complete apps"],
        ai: ["AI-assisted development", "Strong, with Claude Code agents in GameStack"], // the row of every ai: true skill
        familiar: ["Familiar", "Used in real work, not a main strength"],
        legacy: ["Apps with XML Views", "Patterns and libraries of the apps built before Compose"]
      },
      toggle: "See where I used each one",
      hide: "Hide detail", // the same button while the detail is open, held under the bar
      legend: { own: "Own builds", client: "Client work", part: "Some of the time" }
    },
    experience: {
      heading: { plain: "Experience", show: ["Experience · newest first", "Episode guide"] },
      intro: {
        plain: "Newest first: my own builds, where Compose, MVI/MVVM and AI agents come in, then {careerYears}+ years of client apps, from Java to Kotlin.",
        show: "Season 2 is my own builds, where Compose, MVI/MVVM and AI agents come in. Season 1 is {careerYears}+ years of client apps, from Java to Kotlin."
      },
      groups: { own: "Own builds", client: "Client work", ownShow: "Season 2 · Own builds", clientShow: "Season 1 · Client work" },
      showUi: { newer: "Newer", playAll: "Play all", pause: "Pause", older: "Older", next: "Next episodes", here: "I'm here", goal: "Goal", inProduction: "in production",
        // the episode card: "Episode 6 · Season 2", "ALAN in" (the first name, then starIn), its credits;
        // nowKick sits over "Now showing"
        episode: "Episode", season: "Season", starIn: "in", about: "about", at: "at", highlights: "Episode highlights",
        credits: { studio: "Studio", dates: "Dates", total: "Total", featuring: "Featuring" },
        nowKick: "What I'm building now" },
      kind: { project: "Own build", "in-progress": "In progress", completed: "Completed" },
      since: "since", // Plain, Now building: "Own build · since Jul 2026"
      links: { caseStudy: "Case study", repo: "GitHub repo" },
      shotsNote: "Real screens from the app. Select one to see it full size." // Show
    },
    next: {
      heading: { plain: "What comes next", show: "Next episodes" },
      groups: { app: "The app", path: "The learning path" }, // Plain
      intro: "GameStack's roadmap, and the self-directed learning path behind its harness. Each finished block is put to work in GameStack, and the repo shows it." // Plain
    },
    path: {
      heading: { show: ["Next season · my AI learning path", "Training montage"] },
      status: { done: "Completed", now: "In progress", next: "Coming up", goal: "Goal" },
      updated: "Updated {updated}"
    },
    // the case-study pages (copy deck §10.9): the bar, the section titles and the labels every case shares.
    // A section a case leaves out takes its label out of the bar too.
    case: {
      nav: { overview: "Overview", why: "Why", architecture: "Architecture", decisions: "Decisions", tests: "Tests", ai: "AI", missing: "What’s missing" },
      h: { why: "Why it exists", architecture: "Architecture", decisions: "Key decisions", tests: "Tests", ai: "How AI was used", missing: "What went wrong, what is missing" },
      decisionCols: ["Decision", "Instead of", "Why", "Cost", "Code"],
      back: "All work", glance: "At a glance", stack: "Stack", demo: "Demo", walk: "Read the code", next: "Next case",
      pin: "Each name opens its file.",
      commit: "Code links point to commit {commit} ({date}).",
      readme: "README",
      title: "{name} case study",
      aria: { screens: "Screens", prevScreens: "Previous screens", nextScreens: "Next screens", viewLarger: "View larger: ",
        prevScreen: "Previous screen", nextScreen: "Next screen", screen: "Screen", hash: "Link to this section: ", decisions: "Key decisions",
        pager: "Case studies" }
    }
  }
});
