// The one source for Plain (index.html), Show (show.html), the case studies and both CVs. Every page only draws what
// is here; a new job, project, skill or learning block is an edit to this file, never to the HTML.
// Recipes for the usual changes: DATA.md. Check after editing: node tools/check-data.js
//
// Conventions
// · Dates: "2015-08" (a month = its first day) or "2026-07-15" when the day matters. end: null = ongoing.
// · Texts the CV shows come as { en, es }; es: null = Spanish still to approve (check-data lists them). Texts only the
//   site shows (it is English) are plain strings.
// · **…** marks the words a page highlights. {careerYears}, {lapse}, {count:key} and {countsDate} are computed
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
    aiLine: { en: "AI agents under rules I wrote", es: "agentes de IA bajo reglas que yo escribí" },
    lede: {
      plain: "I build modern Android apps, and I build them with **AI agents under rules I wrote**, on top of {careerYears}+ years of client apps in banking, telecom and consumer products.",
      show: "Modern Android and AI-assisted development · {careerYears}+ years in banking, telecom and consumer apps"
    },
    contact: {
      plain: "Let's talk.",
      show: "So once again, the episode ends… and the next one begins **with your team!**",
      body: "Looking for Senior Android or Android + AI roles. Available now, for remote work or relocation, based in Mexico City (UTC−6)." //  : the time zone never ends a line alone
    },
    education: {
      degree: { en: "Computer Systems Engineering", es: "Ingeniería en Sistemas Computacionales" },
      school: "Universidad de Cuautitlán Izcalli",
      start: "2013", end: "2016" // no degree status, on the site or the CV
    },
    languages: [
      { name: { en: "Spanish", es: "Español" }, level: { en: "native", es: null } },
      { name: { en: "English", es: "Inglés" }, level: { en: "B2", es: "B2" } }
    ]
  },

  // An employer behind several places, with its own dates (Globant ran past Openbank: bench until May 21, 2026).
  employers: {
    globant: {
      name: "Globant", start: "2020-02", end: "2026-05-21",
      role: { en: "Senior Android Developer", es: "Senior Android Developer" },
      intro: { en: "Android developer on two banking clients.", es: "Desarrollador Android en dos clientes bancarios." },
      note: "{lapse} in total, across the two clients below" // Plain, under the employer's name, above its two clients
    }
  },

  // Jobs and projects, oldest first: this order is also the episode order (Show numbers them from it).
  // type: "job" (client work, Season 1) · "project" (own build, Season 2; status "in-progress" | "completed").
  // highlights: three per card, always (a fourth dilutes the scan; what does not fit goes to the CV).
  // show: the Show episode's title card and its prop (an unknown prop falls back to the generic one).
  work: [
    {
      id: "et", type: "job", name: "Estrategia Tecnológica", short: "Estrategia",
      start: "2015-08", end: "2017-01",
      studio: { en: "A software consultancy", es: null },
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
      studio: { en: "A digital agency", es: null },
      role: { en: "Android Developer", es: "Desarrollador Android" },
      what: { en: "Apps for the agency's clients, in Java and early Kotlin.", es: "Apps para los clientes de la agencia, en Java y Kotlin temprano." },
      highlights: [
        { en: "Main contributor to a travel app redesign", es: "Contribuidor principal del rediseño de una app de viajes" },
        { en: "Currency, weather and nearby places screens", es: "Pantallas de divisas, clima y lugares cercanos" },
        { en: "Kotlin in production in 2017, the year Google made it official for Android", es: "Kotlin en producción en 2017, el año en que Google lo hizo oficial para Android" }
      ],
      stack: ["Java", "Kotlin", "Google Maps", "Places", "Firebase"],
      show: { title: ["Bon", "Voyage"], prop: "suitcase" }
    },
    {
      id: "cd", type: "job", name: "Claro Drive", company: "América Móvil",
      start: "2018-02", end: "2020-02",
      studio: { en: "América Móvil, for Claro Drive", es: null },
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
      studio: { en: "Globant, for Citibanamex", es: null },
      what: { en: "Improvements to the app's CoDi flow, the digital payments system of Mexico's central bank.", es: "Mejoras al flujo de CoDi de la app, el sistema de pagos digitales del banco central de México." },
      highlights: [
        { en: "Improved QR reading and generation, and implemented extra security steps to a spec", es: "Mejoré la lectura y generación de códigos QR e implementé pasos extra de seguridad según una especificación" },
        { en: "Worked on payment history and the QR or NFC switch", es: "Trabajé en el historial de pagos y en el cambio entre QR y NFC" },
        { en: "Clean Architecture codebase with unit tests", es: "Base de código con Clean Architecture y pruebas unitarias" }
      ],
      stack: ["Java", "Kotlin", "RxJava", "MVP", "Clean Architecture", "Retrofit"],
      show: { title: ["QUICK RESPONSE"], prop: "qr" }
    },
    {
      id: "ob", type: "job", name: "Openbank", employer: "globant",
      start: "2020-08", end: "2026-02",
      studio: { en: "Globant, for Openbank (Spain)", es: null },
      what: { en: "A Spanish bank's app, mostly with the deposits team: a Java codebase from 2018, where new code went into Kotlin.", es: "App de un banco español, sobre todo con el equipo de depósitos: una base de código en Java de 2018, donde el código nuevo se escribía en Kotlin." },
      highlights: [
        { en: "Built the full deposit reinvestment flow", es: "Construí el flujo completo de reinversión de depósitos" },
        { en: "Worked across most of the app: cards, accounts, user keys, documentation", es: "Trabajé en la mayor parte de la app: tarjetas, cuentas, claves de usuario, documentación" },
        { en: "Integrated whole sections built by other teams (profile, notifications) as Kotlin + Compose modules", es: "Integré secciones completas hechas por otros equipos (perfil, notificaciones) como módulos Kotlin + Compose" }
      ],
      stack: ["Kotlin", "Java", "MVP", "Coroutines", "Dagger 2", "Custom Views", "Bitrise"],
      show: { title: ["Compound", "Interest"], prop: "cert" }
    },
    {
      id: "mn", type: "project", name: "ModernNotes", status: "completed",
      start: "2026-02-26", end: "2026-04-06", // first and last commit
      what: { en: "A notes app written entirely by hand. AI never wrote the code; it guided and audited.", es: "App de notas escrita completamente a mano. La IA nunca escribió el código; lo guió y lo auditó." },
      highlights: [
        { en: "Room as the single source of truth; the UI never reads from the network", es: "Room es la única fuente de verdad y la interfaz nunca lee de la red" },
        { en: "13 unit test classes and a DAO test", es: "13 clases de pruebas unitarias y una prueba del DAO" },
        { en: "Sort order saved with DataStore and applied in the database query", es: "El orden se guarda con DataStore y se aplica en la consulta a la base de datos" }
      ],
      stack: ["Kotlin", "Compose", "MVVM", "Room", "Hilt", "Flow"],
      links: { repo: "https://github.com/voltek/ModernNotes", caseStudy: "modernnotes.html" },
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
      lede: { en: "A game backlog app built with AI agents under rules I wrote, using Claude Code. The agents propose; every plan decision waits for my approval.", es: "App para organizar el backlog de videojuegos, hecha con agentes de IA bajo reglas que yo escribí, usando Claude Code. Los agentes proponen; cada decisión de plan espera mi aprobación." },
      what: { en: "A game backlog app built with AI agents under rules I wrote.", es: "App para organizar el backlog de videojuegos, hecha con agentes de IA bajo reglas que yo escribí." },
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
      // Public counts from the repo, with the day they were taken. Written by the phase 10 Action (base:
      // tools/count-gamestack.sh); until then by hand, and never recounted during the build.
      counts: { date: "2026-10-20", commit: "144b922", adrs: 24, skills: 14, prs: 32, driftLog: 66 },
      // "Now building": the proof, in control-loop order (rules, playbooks, the human, the gate, self-correction).
      // count: a key of counts; check: true where there is nothing to count. on: where each row shows, like the shots
      // ("plain", "show", "case"); the landing keeps the three that prove the differentiator, the case study has them all (Alan, 10-27).
      proof: [
        { count: "adrs", label: "ADRs", note: "each one states what enforces it", on: ["plain", "show", "case"] },
        { count: "skills", label: "Skills", note: "the playbooks the agents follow, from a new screen to shipping a branch", on: ["case"] },
        { check: true, label: "Human in the loop", note: "every plan decision waits for my approval", on: ["plain", "show", "case"] },
        { check: true, label: "A gate on every PR", note: "an AI code review before I open it, then build, test and lint in CI · {count:prs} PRs so far", on: ["plain", "show", "case"] },
        { count: "driftLog", label: "Drift log entries", note: "each time the code and the docs disagreed, and how it was fixed", on: ["case"] }
      ],
      source: "Counts from the public repo, {countsDate}",
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
        updated: "2026-10-20", // a fact, not a length: the day this path last changed
        lane: "Harness", // Show: the label of its lane under the app's
        intro: "A self-directed path in AI-assisted Android development, updated as the tools change. Each finished block is put to work in GameStack, and the repo shows it.",
        arc: "It goes from **writing every line by hand**, which is ModernNotes, to **directing AI agents under rules I wrote**, which is GameStack.", // Show only
        blocks: [
          { tag: "Block 1", title: "Fundamentals", status: "done", note: "How LLMs work, research with checked sources, and GameStack's first spec" },
          { tag: "Block 2", title: "Context engineering", status: "done", note: "Prompting, CLAUDE.md and the first Skills", steps: [["CLAUDE.md", "done"], ["Skills", "done"]] },
          { tag: "Block 3", title: "Spec-Driven Development", status: "done", note: "Specs, a drift checklist, human in the loop and handoffs" },
          { tag: "Extra", title: "Design phase", status: "done", note: "Four screens and their states, designed and documented" },
          { tag: "Block 4", title: "Claude Code, harness and loop engineering", status: "now", note: "CI gate and ADRs done · now: Hooks · next: a checker loop and subagents", steps: [["CI gate", "done"], ["ADRs", "done"], ["Hooks", "now"], ["Checker loop", "next"], ["Subagents", "next"]] },
          { tag: "Block 5", title: "Agentic IDEs and other CLIs", status: "next", note: "Hands-on with other agent tools" },
          { tag: "Block 6", title: "AI APIs inside apps", status: "next", note: "AI recommendations in GameStack" },
          { tag: "Block 7", title: "Rapid prototyping", status: "next", note: "From an idea to a clickable prototype, fast" },
          { tag: "Block 8", title: "Capstone: my own harness and loop", short: "My own harness and loop", status: "goal", note: "Where the whole path leads" }
        ]
      },
      show: { title: ["RULES OF", "THE GAME"], prop: "marquee", record: "The record so far!" }
    }
  ],

  // Skills by level, in Alan's own judgment (words only: never bars, stars or percentages). Within a level, ai: true
  // goes first, then this order. legacy: true goes to the "View-based apps" row, in this order and one look for all.
  // pages: false keeps a skill off Plain and Show (Git, the Compose-era libraries): it stays for the CV. at: where it
  // was used (ids from work; { id, start, end } narrows one place); its years are computed from there. len: false
  // names the places instead of a length (a skill used in only part of a job). note: the line in the detail layer.
  skills: [
    { name: "Kotlin", level: "core", at: ["gs", "mn", "ob", "cb", { id: "ir", end: "2017-12" }] }, // none in 2018–19
    { name: "Java", level: "core", at: ["ob", "cb", "cd", "ir", "et"] },
    { name: "Android SDK", level: "core", at: ["gs", "mn", "ob", "cb", "cd", "ir", "et"] },
    { name: "Retrofit · REST APIs", level: "core", at: ["gs", "mn", "ob", "cb", "cd", "ir", "et"], note: "REST APIs at every client job. In GameStack, IGDB queries written in its Apicalypse language" },
    { name: "Git", level: "core", at: ["gs", "mn", "ob", "cb", "cd", "ir", "et"], note: "At every job; in GameStack, pull requests behind branch protection", pages: false },
    { name: "Agentic engineering · Claude Code", level: "strong", ai: true, at: ["gs"], note: "AI-assisted development with Claude Code agents under rules I wrote: CLAUDE.md, Skills, ADRs, a CI gate and a human in the loop. In ModernNotes, AI never wrote the code" },
    { name: "Spec-Driven Development", level: "strong", ai: true, at: ["gs"], note: "Specs, a drift checklist and handoffs, from my learning path, applied in GameStack" },
    { name: "Jetpack Compose", level: "strong", at: ["gs", "mn"] },
    { name: "Coroutines", level: "strong", at: ["gs", "mn", "ob"] },
    { name: "Flow", level: "strong", at: ["gs", "mn"] },
    { name: "MVI · MVVM", level: "strong", at: ["gs", "mn"], note: "MVI in GameStack, MVVM in ModernNotes" },
    { name: "Clean Architecture", level: "strong", at: ["gs", "mn", "cb"], note: "Designed by hand in ModernNotes and kept in GameStack; at Citibanamex, inside an existing codebase" },
    { name: "Architecture decisions · ADRs", level: "strong", at: ["gs"], note: "{count:adrs} ADRs in GameStack, each naming what enforces it" },
    { name: "Hilt", level: "strong", at: ["gs", "mn"] },
    { name: "Room", level: "strong", at: ["mn"] },
    { name: "Testing", level: "strong", at: ["gs", "mn", "cb"], note: "JUnit, MockK, Turbine and coroutines-test in both builds, MockWebServer in ModernNotes, Robolectric screen tests in GameStack; unit tests at Citibanamex" },
    { name: "Compose & Views interop", level: "strong", at: ["ob"], len: false, note: "At Openbank, Compose modules from other teams inside a View-based app" },
    { name: "Navigation Compose", level: "strong", at: ["gs", "mn"], pages: false },
    { name: "Material 3", level: "strong", at: ["gs", "mn"], pages: false },
    { name: "kotlinx.serialization", level: "strong", at: ["gs", "mn"], pages: false },
    { name: "Coil", level: "strong", at: ["gs"], pages: false },
    { name: "Gradle", level: "strong", at: ["gs", "mn"], note: "Version catalogs and KSP in both builds", pages: false },
    { name: "CI · GitHub Actions", level: "familiar", at: ["gs"], note: "The gate on every GameStack PR: build, test and lint" },
    { name: "Code review", level: "familiar", at: ["ob", "cb", "cd"], len: false, note: "Now and then, reviewing teammates' pull requests at Globant (Citibanamex, Openbank) and Claro Drive" },
    { name: "Firebase Analytics · Crashlytics", level: "familiar", at: ["ir"] },
    { name: "Google Maps · Places", level: "familiar", at: ["ir"] },
    { name: "Robolectric", level: "familiar", at: ["gs"], note: "Screen tests in GameStack", pages: false },
    { name: "MVP", level: "core", legacy: true, at: ["ob", "cb", "cd", "ir"] },
    { name: "Dagger 2", level: "core", legacy: true, at: ["ob", "cd"], note: "Also at IRONBIT toward the end. Citibanamex wired its dependencies by hand" },
    { name: "RxJava", level: "familiar", legacy: true, at: ["cb", "cd"] },
    { name: "Custom Views", level: "core", legacy: true, at: ["ob"] },
    { name: "SQLite", level: "familiar", legacy: true, at: ["ir", "et"], note: "SQLite by hand for offline catalogs at Estrategia; Realm at IRONBIT" },
    { name: "Glide", level: "familiar", legacy: true, at: ["cd"] }
  ],

  // Page copy that is not about one entry (copy-deck sections 1 and 5–8). Site only, so English strings.
  copy: {
    page: {
      title: {
        plain: "Alan Hernández · Senior Android Developer",
        show: "Alan Hernández · Senior Android Developer · Animated version",
        cv: "Alan Hernández · CV"
      },
      description: "Senior Android Developer in Mexico City: {careerYears}+ years of client apps in banking, telecom and consumer products, now building with AI agents under rules I wrote."
    },
    nav: {
      plain: ["Now building", "Skills", "Experience", "Next", "Contact"],
      show: ["Now showing", "Skills", "Experience", "Contact"]
    },
    links: {
      toShow: { long: "Play the animated version", short: "Animated" },
      toPlain: { long: "Read the plain version", short: "Plain" }
    },
    cta: { contact: "Get in touch", cv: "Download CV", copied: "Copied" },
    footer: {
      // CC BY 3.0 requires this credit wherever the Android robot appears
      showCredit: "The Android robot is reproduced or modified from work created and shared by Google and used according to terms described in the Creative Commons 3.0 Attribution License."
    },
    aria: {
      primary: "Primary", menu: "Menu", toLight: "Switch to light mode", toDark: "Switch to dark mode",
      home: "Alan Hernández, back to top", stack: "Current stack", legend: "Bar colors", copyEmail: "Copy email address",
      episodes: "All episodes, newest first", viewLarger: "View larger: ", close: "Close",
      skip: "Skip to content", yes: "Yes"
    },
    education: { plain: "Education and languages", show: "Education", languages: "Languages" },
    skills: {
      intro: "Grouped by how well I know them. The years and the places behind each one are in the detail below.",
      levels: {
        core: ["Core", "My daily tools, with years in production"],
        strong: ["Strong", "Confident with it, in production or in complete apps"],
        familiar: ["Familiar", "Used in real work, not a main strength"],
        legacy: ["View-based apps", "Patterns and libraries of the apps built before Compose"]
      },
      toggle: "See years and where I used each one",
      hide: "Hide detail", // the same button while the detail is open, held under the bar
      legend: { own: "Own builds", client: "Client work" }
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
        // a lane's stops say "Now: Hooks" / "Next: Game Detail"; nowKick sits over "Now showing"
        episode: "Episode", season: "Season", starIn: "in", about: "about", at: "at", highlights: "Episode highlights",
        credits: { studio: "Studio", dates: "Dates", total: "Total", featuring: "Featuring" },
        stopNow: "Now", stopNext: "Next", nowKick: "What I'm building now" },
      kind: { project: "Own build", "in-progress": "In progress", completed: "Completed" },
      since: "since", // Plain, Now building: "Own build · since Jul 2026"
      links: { caseStudy: "Case study", repo: "GitHub repo" },
      shotsNote: "Real screens from the app. Select one to see it full size." // Show
    },
    next: {
      heading: { plain: "What comes next", show: "Next episodes" },
      groups: { app: "The app", path: "The learning path" }, // Plain
      intro: "GameStack's roadmap, and the self-directed learning path behind its harness: from writing every line by hand (ModernNotes) to directing AI agents under rules I wrote." // Plain
    },
    path: {
      heading: { show: ["Next season · my AI learning path", "Training montage"] },
      status: { done: "Completed", now: "In progress", next: "Coming up", goal: "Goal" },
      updated: "Updated {updated}"
    },
    // the case-study pages (copy deck §10.10): the bar, the section titles and the labels every case shares.
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
