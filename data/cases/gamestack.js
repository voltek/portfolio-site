// The GameStack case study (gamestack.html): what only the case page says. Its header (name, status, dates,
// highlights, screens, repo), its roadmap and its learning path come from the project's entry in
// data/portfolio.js (id "gs"); the bar, the section titles and the labels from copy.case there. Text: copy deck §12.
//
// Conventions: data/cases/modernnotes.js. Also here:
// · Every text is { en, es }; the pages show the English. A class or library name is a plain string.
// · "adr:…" is a decision record; "pr:209", "issue:159" and "commit:a00cf8c" open that on GitHub; a path that ends in
//   "/" opens the folder.
module.exports = {
  id: "gs",
  pin: { commit: "5fb80bc", date: "2026-11-12" },
  roots: {
    repo: "",
    main: "app/src/main/java/com/gamestack/",
    test: "app/src/test/java/com/gamestack/",
    adr: "docs/project/decisions/"
  },
  readme: "repo:README.md",
  lede: {
    en: "An Android app for exploring video games from IGDB (the Internet Game Database) and keeping a personal library, built by AI agents inside a harness I designed. Search is built; Game Detail is next.",
    es: "Una app Android para explorar videojuegos de IGDB (Internet Game Database) y llevar una biblioteca personal, construida por agentes de IA dentro de un harness que yo diseñé. Search ya está construida; sigue Game Detail."
  },
  role: {
    en: "I decide the product, design the harness and review every change; AI agents write the code and the documents.",
    es: "Yo decido el producto, diseño el harness y reviso cada cambio; los agentes de IA escriben el código y los documentos."
  },
  stack: ["Kotlin", "Jetpack Compose", "Material 3", "Coroutines", "Flow", "Hilt", "Retrofit", "Clean Architecture", "MVI", "JUnit", "MockK", "Turbine", "Robolectric", "GitHub Actions", "Claude Code"],
  libs: ["JUnit", "MockK", "Turbine"],
  video: {
    src: "assets/projects/gamestack/demo.mp4",
    poster: "assets/projects/gamestack/demo-poster.webp",
    alt: {
      en: "A search for \"zelda\" loads results with covers and scrolls through them; a search with no matches shows the empty state.",
      es: "Una búsqueda de «zelda» carga resultados con portadas y se recorren; una búsqueda sin coincidencias muestra el estado vacío."
    }
  },
  shotsFoot: {
    en: "Real screens from the emulator. Game data and covers come from IGDB and belong to their owners.",
    es: "Pantallas reales del emulador. Los datos y las portadas vienen de IGDB y pertenecen a sus dueños."
  },

  why: {
    body: [
      {
        en: "GameStack is two things built together: an app headed for Google Play, and a harness (the rules, procedures and automatic checks AI agents work inside) that is meant to be taken to other projects.",
        es: "GameStack son dos cosas construidas juntas: una app con destino a Google Play y un harness (las reglas, los procedimientos y los controles automáticos dentro de los que trabajan los agentes de IA), pensado para llevarse a otros proyectos."
      },
      {
        en: "When serving users more fully and learning that whole path pull apart, learning wins. The rule is written down, because it explains choices that would look odd in a normal product.",
        es: "Cuando servir mejor al usuario y aprender todo ese camino se contradicen, gana el aprendizaje. La regla está escrita porque explica decisiones que se verían raras en un producto normal."
      }
    ]
  },

  architecture: {
    intro: {
      en: "One module, MVI over Clean Architecture: presentation reaches data only through domain. A feature owns its code in `feature/`; what two or more share lives in `core/`.",
      es: "Un solo módulo, MVI sobre Clean Architecture: la presentación llega a los datos solo a través del dominio. Cada feature tiene su código en `feature/`; lo que comparten dos o más vive en `core/`."
    },
    flow: {
      layers: [
        { id: "data", name: { en: "Data", es: "Datos" }, pkg: "core/data/" },
        { id: "domain", name: { en: "Domain", es: "Dominio" }, pkg: "feature/search/domain/" },
        { id: "presentation", name: { en: "Presentation", es: "Presentación" }, pkg: "feature/search/presentation/" }
      ],
      pieces: [
        { id: "api", name: { en: "IGDB API", es: "API de IGDB" }, sub: "Retrofit · Apicalypse", layer: "data", file: "core/data/remote/api/IgdbApiService.kt" },
        { id: "repo", name: "GamesRepositoryImpl", sub: { en: "maps to the domain", es: "convierte al dominio" }, layer: "data", file: "core/data/repository/GamesRepositoryImpl.kt" },
        { id: "auth", name: "AuthInterceptor", sub: { en: "Twitch token", es: "token de Twitch" }, layer: "data", file: "core/data/remote/interceptor/AuthInterceptor.kt" },
        { id: "uc", name: "SearchGamesUseCase", layer: "domain", file: "feature/search/domain/usecase/SearchGamesUseCase.kt" },
        { id: "vm", name: "SearchViewModel", sub: { en: "cancels old searches", es: "cancela búsquedas viejas" }, layer: "presentation", file: "feature/search/presentation/SearchViewModel.kt" },
        { id: "ui", name: "SearchScreen", sub: { en: "Compose UI", es: "UI en Compose" }, layer: "presentation", file: "feature/search/presentation/SearchScreen.kt" }
      ],
      trunk: ["api", "repo", "uc", "vm", "ui"],
      edges: [{ en: "DTOs", es: "DTO" }, { en: "Result of games", es: "Result con juegos" }, "Result", { en: "UiState, effects", es: "UiState, efectos" }],
      side: [{ into: "api", piece: "auth", say: { en: "adds the token", es: "agrega el token" } }],
      back: { from: "ui", to: "vm", say: { en: "events", es: "eventos" }, down: { en: "events go back up", es: "los eventos suben" } }
    },
    walk: [
      { title: { en: "The search screen", es: "La pantalla de búsqueda" },
        text: { en: "draws one `UiState` and sends events up; a failed refresh shows a banner above the results.", es: "dibuja un solo `UiState` y manda eventos hacia arriba; un refresh fallido muestra un aviso sobre los resultados." },
        files: ["feature/search/presentation/SearchScreen.kt:151–196"] },
      { title: { en: "The contract and the ViewModel:", es: "El contrato y el ViewModel:" },
        text: { en: "a newer query cancels the search in flight before it waits out the debounce, so an answer to replaced text never lands.", es: "una consulta nueva cancela la búsqueda en curso antes de esperar el debounce, así que la respuesta a un texto ya reemplazado nunca llega." },
        files: ["feature/search/presentation/SearchContract.kt", "feature/search/presentation/SearchViewModel.kt:54–72"] },
      { title: "SearchGamesUseCase",
        text: { en: "trims the query; a blank one never reaches the API.", es: "recorta la consulta; si está en blanco, nunca llega a la API." },
        files: ["feature/search/domain/usecase/SearchGamesUseCase.kt:13–17"] },
      { title: { en: "The repository", es: "El repositorio" },
        text: { en: "maps DTOs to domain models and returns a `Result`, rethrowing cancellation.", es: "convierte los DTO en modelos de dominio y devuelve un `Result`, relanzando la cancelación." },
        files: ["core/data/repository/GamesRepositoryImpl.kt:17–24"] },
      { title: { en: "The API service", es: "El servicio de la API" },
        text: { en: "posts an Apicalypse query with the text escaped, and leaves the ranking to IGDB.", es: "envía una consulta Apicalypse con el texto escapado y deja el orden a IGDB." },
        files: ["core/data/remote/api/IgdbApiService.kt:21–29"] },
      { title: { en: "Authentication", es: "La autenticación" },
        text: { en: "adds the Twitch token to every call; a `Mutex` makes callers share one cached token, and without a token the call fails.", es: "agrega el token de Twitch a cada llamada; un `Mutex` hace que todas compartan un token en caché, y sin token la llamada falla." },
        files: ["core/data/remote/interceptor/AuthInterceptor.kt:16–26", "core/data/repository/AuthRepositoryImpl.kt:20–43"] }
    ]
  },

  decisionsNote: { en: "ADRs are the repo's architecture decision records.", es: "Los ADR son los registros de decisiones de arquitectura del repo." },
  decisions: [
    { what: { en: "A cancelled search is never an error", es: "Una búsqueda cancelada nunca es un error" },
      instead: { en: "`runCatching` around the call", es: "`runCatching` alrededor de la llamada" },
      why: { en: "`runCatching` also catches the cancellation, so every cancelled search flashed the error screen before the next results.", es: "`runCatching` también atrapa la cancelación, y cada búsqueda cancelada mostraba un instante la pantalla de error antes de los resultados." },
      cost: { en: "Each repository writes out its own `try`/`catch`, and a checklist guards the rule, not a test.", es: "Cada repositorio escribe su propio `try`/`catch`, y la regla la cuida un checklist, no un test." },
      files: ["core/data/repository/GamesRepositoryImpl.kt:17–24", "adr:0009-never-runcatching-around-a-suspend-call.md"] },
    { what: { en: "A failed refresh is state, not an event", es: "Un refresh fallido es estado, no un evento" },
      instead: { en: "A snackbar, the first fix", es: "Un snackbar, el primer arreglo" },
      why: { en: "The results still answer the query, and the snackbar went out of step with them three times before the redesign, which deleted more than it added.", es: "Los resultados siguen respondiendo la consulta, y el snackbar se desfasó de ellos tres veces antes del rediseño, que borró más de lo que agregó." },
      cost: { en: "“State or event” is a judgment for each field, and nothing mechanical checks it.", es: "«Estado o evento» se juzga campo por campo y nada mecánico lo revisa." },
      files: ["feature/search/presentation/SearchContract.kt:6–16", "adr:0017-a-condition-is-not-an-event.md"] },
    { what: { en: "The effect channel queues", es: "El canal de efectos encola" },
      instead: { en: "A `SharedFlow` without replay", es: "Un `SharedFlow` sin replay" },
      why: { en: "A one-shot event raised while the screen is being recreated survives instead of being lost in silence.", es: "Un evento de una sola vez que ocurre mientras la pantalla se recrea sobrevive en lugar de perderse en silencio." },
      cost: { en: "A duplicated event replays when the user returns, so every control that navigates has to be guarded against a double tap.", es: "Un evento duplicado se repite cuando el usuario regresa, así que cada control que navega se protege contra el doble toque." },
      files: ["feature/search/presentation/SearchViewModel.kt:42–43", "core/presentation/SingleClick.kt", "adr:0011-the-effect-channel-queues.md"] },
    { what: { en: "`CLAUDE.md` stays small", es: "`CLAUDE.md` se mantiene pequeño" },
      instead: { en: "One long file with every rule, which it used to be", es: "Un archivo largo con todas las reglas, como era antes" },
      why: { en: "Every line is paid on every turn, and agents follow it less as it grows.", es: "Cada línea se paga en cada turno, y los agentes la siguen menos conforme crece." },
      cost: { en: "An agent sees an area's rules only once it touches a file there.", es: "Un agente ve las reglas de un área solo cuando toca un archivo de ahí." },
      files: ["repo:CLAUDE.md", "adr:0051-rules-for-one-part-of-the-code-load-by-path.md"] },
    { what: { en: "Review rounds are capped", es: "Las rondas de revisión tienen tope" },
      instead: { en: "Reviewing until a round finds nothing", es: "Revisar hasta que una ronda no encuentre nada" },
      why: { en: "A reviewer always finds one more item, while real defects fall with each round.", es: "Un revisor siempre encuentra algo más, mientras los defectos reales bajan en cada ronda." },
      cost: { en: "20 of the 151 defects measured appeared only in round 3 or later. I decide the findings that need judgment; the rest stand unless I reopen them.", es: "20 de los 151 defectos medidos aparecieron apenas en la ronda 3 o después. Yo decido los hallazgos que requieren criterio; los demás quedan firmes salvo que los reabra." },
      files: ["repo:.claude/skills/review-round/SKILL.md", "adr:0049-review-rounds-are-capped-and-the-human-confirms-the-triage.md"] },
    { what: { en: "Session state lives outside the repository", es: "El estado de cada sesión vive fuera del repositorio" },
      instead: { en: "Committing the handoff note", es: "Hacer commit de la nota de relevo" },
      why: { en: "Every pull request would carry one person's live state.", es: "Cada pull request cargaría con el estado en curso de una persona." },
      cost: { en: "A team would need a shared place for it, which is still open (#159).", es: "Un equipo necesitaría un lugar compartido, que sigue pendiente (#159)." },
      files: ["repo:.claude/skills/checkpoint/SKILL.md", "adr:0045-the-session-handoff-is-kept-by-a-committed-skill-and-hook.md", "issue:159"] }
  ],

  tests: {
    intro: {
      en: "Unit tests for every layer Search crosses: mapper, query builder, interceptor, both repositories, use case, ViewModel and screen.",
      es: "Tests unitarios en cada capa que cruza Search: mapper, constructor de consultas, interceptor, los dos repositorios, caso de uso, ViewModel y pantalla."
    },
    items: [
      { text: { en: "The ViewModel tests run on virtual time. One pins a fixed bug that could show answers to text already replaced: a newer query must cancel the search already on the network.", es: "Los tests del ViewModel corren con tiempo virtual. Uno fija un bug ya corregido que podía mostrar respuestas a un texto ya reemplazado: una consulta nueva debe cancelar la búsqueda que ya está en la red." },
        files: ["test:feature/search/presentation/SearchViewModelTest.kt:406–431"] },
      { text: { en: "Robolectric is allowed for screen tests only. The first one found a defect no device would show: the double-tap guard swallowed the first click.", es: "Robolectric se permite solo en los tests de pantalla. El primero encontró un defecto que ningún dispositivo mostraría: la protección contra el doble toque se comía el primer clic." },
        files: ["test:feature/search/presentation/SearchScreenTest.kt", "adr:0016-robolectric-only-for-screen-tests.md"] },
      { text: { en: "A regression test counts only after it was seen failing against the code it guards.", es: "Un test de regresión cuenta solo después de verlo fallar contra el código que protege." },
        files: ["adr:0049-review-rounds-are-capped-and-the-human-confirms-the-triage.md"] },
      { text: { en: "The harness is tested too: its hooks and scripts run their own tests on every pull request.", es: "El harness también se prueba: sus hooks y scripts corren sus propios tests en cada pull request." },
        files: ["repo:.github/workflows/commits.yml"] }
    ]
  },

  ai: {
    intro: {
      en: "AI agents write the code and the documents. I choose the work, decide what the rules don't settle, and nothing merges without my yes.",
      es: "Los agentes de IA escriben el código y los documentos. Yo elijo el trabajo, decido lo que las reglas no resuelven y nada se fusiona sin mi visto bueno."
    },
    // the stages by actor (at most 8 and 3): what each one does in each; an actor left out does nothing there
    actors: [
      { id: "me", name: { en: "Me", es: "Yo" } },
      { id: "ai", name: { en: "AI agents", es: "Agentes de IA" } },
      { id: "auto", name: { en: "Automation", es: "Automatización" } }
    ],
    stages: [
      { name: { en: "GitHub issue", es: "Issue de GitHub" }, note: { en: "backlog: defects, product, harness", es: "backlog: defectos, producto, harness" },
        me: { en: "choose it at a triage", es: "lo elijo en un triage" },
        ai: { en: "propose the order", es: "propone el orden" } },
      { name: "Spec", note: { en: "features, from Game Detail on", es: "features, desde Game Detail" },
        me: { en: "approve it", es: "la apruebo" },
        ai: { en: "write it with OpenSpec, a tool for spec-driven development", es: "la escribe con OpenSpec, una herramienta de desarrollo guiado por specs" } },
      { name: "Build",
        me: { en: "decide what the rules don't settle", es: "decido lo que las reglas no resuelven" },
        ai: { en: "write code, tests and documents", es: "escribe código, tests y documentos" },
        auto: { en: "permission rules (deny) block what is off limits", es: "las reglas de permisos (deny) bloquean lo prohibido" } },
      { name: "Commit",
        ai: { en: "commit the work", es: "hace los commits" },
        auto: { en: "check the message and the branch name", es: "revisa el mensaje y el nombre de la rama" } },
      { name: { en: "Review", es: "Revisión" },
        me: { en: "say yes to each round, then decide what needs me", es: "autorizo cada ronda y después decido lo que me toca" },
        ai: { en: "a subagent without the author's context reviews with Claude Code's `/code-review`; the author checks each finding, fixes in round 1 what needs no decision and reports the rest", es: "un subagente sin el contexto del autor revisa con `/code-review` de Claude Code; el autor verifica cada hallazgo, corrige en la ronda 1 lo que no requiere decisión y reporta el resto" } },
      { name: "Pull request",
        me: { en: "say yes to opening it", es: "autorizo abrirlo" },
        ai: { en: "open it; an external bot reviews it once", es: "lo abre; un bot externo lo revisa una vez" },
        auto: { en: "build, test, lint and commit checks", es: "build, tests, lint y reglas de commit" } },
      { name: "Merge",
        me: { en: "say yes", es: "lo autorizo" },
        ai: { en: "merge it", es: "lo fusiona" },
        auto: { en: "branch protection holds it until the checks pass", es: "la protección de rama lo detiene hasta que pasan los checks" } },
      { name: "Checkpoint",
        ai: { en: "write the note the next session starts from", es: "escribe la nota con la que empieza la siguiente sesión" } }
    ],
    // the harness piece by piece (copy deck §12.8, 11-25): grouped by what it controls; kind is how it holds,
    // "blocks", "waits" (for my yes) or "guides", named in copy.case.harness
    // one line over the pieces, with the frame it borrows (Birgitta Böckeler, martinfowler.com)
    harnessNote: {
      text: { en: "Guides steer the agents before they act; checks catch what they got wrong after.", es: "Las guías orientan a los agentes antes de actuar; los checks atrapan después lo que hicieron mal." },
      source: { label: "Birgitta Böckeler, Harness engineering", href: "https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html" }
    },
    harness: [
      { name: { en: "What gets built", es: "Qué se construye" }, pieces: [
        { name: { en: "GitHub issues", es: "Issues de GitHub" }, kind: "waits", text: { en: "pending work is an issue from one of three forms; I choose what comes next at a triage", es: "lo pendiente es un issue de uno de tres formularios; yo elijo lo que sigue en un triage" },
          files: ["repo:.github/ISSUE_TEMPLATE/", "adr:0038-pending-work-is-an-issue-opened-through-one-form.md"] },
        { name: { en: "OpenSpec", es: "OpenSpec" }, kind: "waits", text: { en: "from Game Detail on, I approve a feature's spec before it is built; in Search's, every scenario names what verifies it: a test or a check on a device", es: "desde Game Detail, apruebo la spec de cada feature antes de construirla; en la de Search, cada escenario dice qué lo verifica: un test o una revisión en dispositivo" },
          files: ["repo:openspec/specs/search/spec.md"] },
        { name: { en: "Human in the loop", es: "Human in the loop" }, kind: "waits", text: { en: "what the rules don't settle waits for my approval, and I confirm every review triage and every merge", es: "lo que las reglas no resuelven espera mi aprobación, y yo confirmo cada triage de revisión y cada merge" },
          files: ["repo:CLAUDE.md"] }
      ] },
      { name: { en: "What the agents know", es: "Qué saben los agentes" }, pieces: [
        { name: { en: "CLAUDE.md and area rules", es: "CLAUDE.md y reglas por área" }, kind: "guides", text: { en: "a test holds the standing instructions under 60 lines, and area rules load only when needed: 31% fewer tokens before any task (measured once, Nov 2026)", es: "un test mantiene las instrucciones fijas en menos de 60 líneas, y las reglas de cada área se cargan solo cuando hacen falta: 31 % menos tokens antes de cualquier tarea (medido una vez, nov 2026)" },
          files: ["test:ClaudeMdBoundTest.kt", "repo:.claude/rules/"] },
        { name: { en: "Skills", es: "Skills" }, kind: "guides", text: { en: "one procedure per repeatable task, loaded only when needed: each layer's code and tests, device checks, shipping a branch", es: "un procedimiento por tarea repetible, que se carga solo cuando hace falta: el código y los tests de cada capa, las revisiones en dispositivo y la entrega de una rama" },
          files: ["repo:.claude/skills/"] },
        { name: { en: "Decision records (ADRs)", es: "Registros de decisión (ADR)" }, kind: "guides", text: { en: "each one states what enforces it: a test, a CI check, a setting, or prose only", es: "cada uno indica qué lo hace cumplir: un test, un check de CI, una configuración o solo texto" },
          files: ["adr:README.md"] },
        { name: { en: "Session note", es: "Nota de sesión" }, kind: "guides", text: { en: "a hook opens each session with where the work stands; the checkpoint Skill rewrites the note", es: "un hook abre cada sesión con el estado del trabajo; la Skill checkpoint reescribe la nota" },
          files: ["repo:.claude/hooks/session-start.sh", "repo:.claude/skills/checkpoint/SKILL.md"] }
      ] },
      { name: { en: "What they may do", es: "Qué pueden hacer" }, pieces: [
        { name: { en: "Deny rules", es: "Reglas deny" }, kind: "blocks", text: { en: "refuse the common ways to skip a git hook, push to main or change branch protection", es: "rechazan las formas comunes de saltarse un hook de git, hacer push a main o cambiar la protección de rama" },
          files: ["repo:.claude/settings.json"] },
        { name: { en: "Ask rules", es: "Reglas ask" }, kind: "waits", text: { en: "opening, editing or merging a pull request stops for my yes", es: "abrir, editar o fusionar un pull request se detiene hasta mi visto bueno" },
          files: ["repo:.claude/settings.json"] },
        { name: { en: "Memory hook", es: "Hook de memoria" }, kind: "blocks", text: { en: "stops the first write to each agent memory file, so the agent asks whether the lesson belongs in the repo", es: "detiene la primera escritura en cada archivo de memoria del agente, para que se pregunte si la lección va en el repo" },
          files: ["repo:.claude/hooks/memory-gate.mjs", "adr:0066-agent-memory-holds-only-what-is-personal.md"] }
      ] },
      { name: { en: "What gets reviewed", es: "Qué se revisa" }, pieces: [
        { name: { en: "Capped review rounds", es: "Rondas de revisión con tope" }, kind: "waits", text: { en: "local AI rounds before the pull request, each on my yes and capped per branch: real defects per round fell from 3.3 to 2.2 by round 3 (measured once, Nov 2026)", es: "rondas locales con IA antes del pull request, cada una con mi visto bueno y con tope por rama: los defectos reales por ronda bajaron de 3.3 a 2.2 para la ronda 3 (medido una vez, nov 2026)" },
          files: ["repo:.claude/skills/review-round/SKILL.md", "pr:209"] },
        { name: { en: "Codex, the review bot", es: "Codex, el bot de revisión" }, kind: "guides", text: { en: "one external review round on each pull request, as advice", es: "una ronda de revisión externa en cada pull request, como consejo" },
          files: ["repo:docs/project/TOOLING.md"] },
        { name: { en: "Drift trailer", es: "Trailer Drift" }, kind: "guides", text: { en: "the commit that resolves a disagreement between code and documents says which side was fixed", es: "el commit que resuelve un desacuerdo entre código y documentos dice cuál de los dos se corrigió" },
          files: ["adr:0033-drift-is-a-commit-trailer.md", "commit:a00cf8c"] }
      ] },
      { name: { en: "What reaches main", es: "Qué llega a main" }, pieces: [
        { name: { en: "Git hooks", es: "Hooks de git" }, kind: "blocks", text: { en: "check every commit's message and the branch name, with the script CI runs too", es: "revisan el mensaje de cada commit y el nombre de la rama, con el mismo script que corre CI" },
          files: ["repo:.githooks/"] },
        { name: { en: "CI checks", es: "Checks de CI" }, kind: "blocks", text: { en: "build, test, lint and commit checks on every pull request", es: "build, tests, lint y reglas de commit en cada pull request" },
          files: ["repo:.github/workflows/gate.yml", "repo:.github/workflows/commits.yml"] },
        { name: { en: "Branch protection", es: "Protección de rama" }, kind: "blocks", text: { en: "no direct or forced push; a merge waits for green checks and every review thread resolved, and it binds me too", es: "sin push directo ni forzado; el merge espera los checks en verde y cada hilo de revisión resuelto, y también me obliga a mí" },
          files: ["adr:0028-the-agent-pushes-its-own-branch-without-asking.md"] }
      ] }
    ],
    contrast: {
      text: { en: "ModernNotes is the opposite experiment: I wrote every line by hand, and AI never wrote the code.", es: "ModernNotes es el experimento opuesto: escribí cada línea a mano y la IA nunca escribió el código." },
      to: "mn"
    }
  },

  missing: {
    items: [
      { title: { en: "The first spec fell short.", es: "La primera spec se quedó corta." },
        text: { en: "It repeated the stack and mixed product with test work, and it named no user and no bar for release. A living PRD (product requirements document) replaced it: who the app is for, what each capability does, and what must be true before the first release.", es: "Repetía el stack, mezclaba producto con trabajo de tests y no nombraba ni usuario ni condiciones de lanzamiento. La reemplazó un PRD vivo (documento de requisitos del producto): para quién es la app, qué hace cada capacidad y qué debe cumplirse antes del primer lanzamiento." },
        files: ["repo:docs/project/PRODUCT.md"] },
      { title: { en: "The spec process has not built a feature yet.", es: "El proceso de specs aún no ha construido una feature." },
        text: { en: "It was adopted after Search, whose spec came after its code; Game Detail is the first feature to go through it.", es: "Se adoptó después de Search, cuya spec llegó después del código; Game Detail es la primera en pasar por él." },
        files: ["repo:openspec/"] },
      { title: { en: "The Twitch client secret is inside the APK.", es: "El client secret de Twitch va dentro del APK." },
        text: { en: "It stays out of git, but the build compiles it in, where anyone with the APK could read it. It blocks the first release; a small proxy is the likely fix (#111).", es: "No está en git, pero el build lo compila y quien tenga el APK podría leerlo. Bloquea el primer lanzamiento; lo más probable es resolverlo con un proxy pequeño (#111)." },
        files: ["core/data/repository/AuthRepositoryImpl.kt:27–30", "issue:111"] },
      { title: { en: "Not every rule is a mechanism.", es: "No toda regla es un mecanismo." },
        text: { en: "Most decisions still have a clause that only prose holds, a deny rule matches the common spellings of a command, and the git hooks work only after a Gradle build installs them. Branch protection and the CI checks hold either way.", es: "La mayoría de las decisiones aún tiene una cláusula que solo sostiene el texto, una regla deny reconoce las formas comunes de un comando, y los git hooks funcionan solo después de que un build de Gradle los instala. La protección de rama y los checks de CI se cumplen en cualquier caso." },
        files: ["adr:README.md"] },
      { title: { en: "No automated test runs on a device.", es: "Ningún test automatizado corre en un dispositivo." },
        text: { en: "Gestures, such as pull to refresh, are checked on an emulator by an agent that follows a Skill.", es: "Los gestos, como jalar para refrescar, los revisa en un emulador un agente que sigue una Skill." },
        files: ["repo:.claude/skills/verify-screen-on-device/SKILL.md"] }
    ]
  },

  // the roadmap and the learning path are drawn from the project's entry
  next: {
    intro: {
      en: "The app's roadmap, and the self-directed learning path behind its harness. Each finished block is put to work here, and the repo shows it.",
      es: "El roadmap de la app y la ruta de aprendizaje autodirigida detrás de su harness. Cada bloque terminado se aplica aquí, y el repo lo muestra."
    },
    designed: { en: "Designed: the screen has an approved mockup, which may still change.", es: "Diseñada: la pantalla tiene un mockup aprobado, que aún puede cambiar." }
  }
};
