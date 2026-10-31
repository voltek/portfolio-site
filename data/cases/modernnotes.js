// The ModernNotes case study (modernnotes.html): what only the case page says. Its header (name, status, dates,
// highlights, screens, repo) comes from the project's entry in data/portfolio.js (id "mn"); the bar, the section
// titles and the labels from copy.case there. Text: copy deck §10, approved 10-22 and 10-27. English only.
//
// Conventions
// · `…` in a text becomes code. Texts are escaped: no HTML here.
// · A file is "path" under roots.main, "path:15–22" adds its lines, "test:path" takes another root. Every code link
//   goes to the pinned commit; the page says the commit once, at the end.
// · A section is drawn only if it is here (why, architecture, decisions, tests, ai, missing): each case keeps the ones
//   that say something the page has not said yet (DECISIONS.md → Case page rules).
module.exports = {
  id: "mn",
  pin: { commit: "3274436", date: "2026-10-16" },
  roots: {
    repo: "",
    main: "app/src/main/java/com/example/modernnotes/",
    test: "app/src/test/java/com/example/modernnotes/",
    androidTest: "app/src/androidTest/java/com/example/modernnotes/"
  },
  readme: "repo:README.md",
  lede: "A small offline-first notes app for Android, written entirely by hand to show I can design and build a modern app end to end without AI writing the code.",
  role: "Sole developer: design, code and tests.",
  // Skills of data/portfolio.js with "mn" in `at`, same names (of a compound name, the part that applies), plus the
  // libraries in `libs`, checked in the build at the pin. Order: language and UI, async, DI, data, network,
  // architecture, tests. check-data holds each tag to that.
  stack: ["Kotlin", "Jetpack Compose", "Material 3", "Coroutines", "Flow", "Hilt", "Room", "DataStore", "Retrofit", "Clean Architecture", "MVVM", "JUnit", "MockK", "Turbine", "MockWebServer"],
  libs: ["DataStore", "JUnit", "MockK", "Turbine", "MockWebServer"],
  video: null, // { src, poster, alt } once recorded (DATA.md → New demo video); it goes first among the screens
  shotsFoot: "Real screens from the emulator.",

  architecture: {
    intro: "Clean Architecture in a single module, split into `data`, `domain` and `presentation` packages, with MVVM in the UI layer.",
    // the data's way to the screen: one trunk in one direction, layers as columns, side inputs below, one way back
    flow: {
      layers: [
        { id: "data", name: "Data", pkg: "data/" },
        { id: "domain", name: "Domain", pkg: "domain/" },
        { id: "presentation", name: "Presentation", pkg: "presentation/" }
      ],
      pieces: [
        { id: "api", name: "Remote API", sub: "Retrofit · a fake today", layer: "data", file: "data/notes/remote/repositories/RemoteNotesRepositoryImpl.kt" },
        { id: "room", name: "Room", sub: "repository · DAO", layer: "data", file: "data/notes/local/repositories/NotesRepositoryImpl.kt" },
        { id: "ds", name: "DataStore", sub: "sort order", layer: "data", file: "data/notes/local/user_preferences/UserPreferencesRepositoryImpl.kt" },
        { id: "get", name: "GetNotesUseCase", layer: "domain", file: "domain/notes/usecases/GetNotesUseCase.kt" },
        { id: "vm", name: "NotesListViewModel", sub: "one StateFlow", layer: "presentation", file: "presentation/list/NotesListViewModel.kt" },
        { id: "ui", name: "NotesListScreen", sub: "Compose UI", layer: "presentation", file: "presentation/list/NotesListScreen.kt" }
      ],
      trunk: ["api", "room", "get", "vm", "ui"],
      edges: ["SyncNotesUseCase writes", "Flow", "Flow of notes", "UiState"],
      mark: { room: "Single source of truth" },
      side: [{ into: "get", piece: "ds", say: "flatMapLatest" }],
      back: { from: "ui", to: "vm", say: "events", down: "events go back up" }
    },
    // "Read the code": the approved walk, as links with their lines
    walk: [
      { title: "The list screen", text: "observes one `UiState` and sends events up.", files: ["presentation/list/NotesListScreen.kt"] },
      { title: "The ViewModel", text: "combines the notes flow with a loading flag into one `StateFlow`; the loading state shows only while the list is empty.", files: ["presentation/list/NotesListViewModel.kt:30–57"] },
      { title: "GetNotesUseCase", text: "re-runs the Room query whenever the saved sort order changes.", files: ["domain/notes/usecases/GetNotesUseCase.kt:16"] },
      { title: "The local repository and DAO", text: "answer with a Room `Flow`; Room re-emits when data changes.", files: ["data/notes/local/repositories/NotesRepositoryImpl.kt", "data/notes/local/daos/NoteDao.kt"] },
      { title: "SyncNotesUseCase", text: "fetches remote notes and writes them into Room; the UI sees them through step 4.", files: ["domain/notes/usecases/SyncNotesUseCase.kt"] },
      { title: "Hilt binds the repository", text: "the app uses for the remote side (today a fake; see “What is missing”).", files: ["di/RepositoryModule.kt:33"] }
    ]
  },

  decisions: [
    { what: "The sort order drives the query", instead: "Load the notes and sort them in the ViewModel", why: "The order is saved with DataStore and changes the Room query, so the ViewModel never sorts a list itself and Room stays the one source.", cost: "Each sort order needs its own query in the DAO (three of them).", files: ["domain/notes/usecases/GetNotesUseCase.kt", "data/notes/local/daos/NoteDao.kt:15–22"] },
    { what: "Time is injected", instead: "Call `System.currentTimeMillis()` inside the use case", why: "Tests use a `FakeTimeProvider` and stay deterministic.", cost: "One interface, one implementation and one Hilt binding for a single call.", files: ["domain/notes/usecases/SaveNoteUseCase.kt", "di/UtilModule.kt"] },
    { what: "Validation lives in the domain", instead: "Validate in the ViewModel", why: "`SaveNoteUseCase` throws a typed `InvalidNoteException`; the ViewModel maps each case to a string resource, so no user-facing text lives outside the UI layer.", cost: "The domain has to define its own error types.", files: ["domain/notes/models/InvalidNoteException.kt"] },
    { what: "DTOs and entities never leave the data layer", instead: "Convert remote models straight into local ones", why: "A change in the API or in the database stays inside its own layer.", cost: "Two mapper classes and their tests (`NoteEntityMapper`, `NoteDtoMapper`).", files: ["data/notes/local/mappers/NoteEntityMapper.kt", "data/notes/remote/mappers/NoteDtoMapper.kt"] }
  ],

  tests: {
    intro: "13 unit test classes: all seven use cases, both ViewModels, the local and remote repositories and both mappers, with shared test factories, a main-dispatcher rule and a fake clock.",
    items: [
      { text: "The remote repository is tested against a real HTTP layer with MockWebServer, including an HTTP 500 case.", files: ["test:data/notes/remote/repositories/RemoteNotesRepositoryImplTest.kt"] },
      { text: "One instrumented test runs the DAO against an in-memory database and checks each sort order and the create, read, update and delete queries.", files: ["androidTest:NoteDaoTest.kt"] }
    ]
  },

  ai: {
    intro: "AI was used only as an auditor: after each phase I had the finished code reviewed by an AI model, which returned corrections and explanations, never code.",
    body: ["No code-completion assistants were used at any point. This is my declaration, not something git can prove; what the repo does show is the result: the code, the tests and the fixes below."],
    // one plain line to the other case (no box): its link and name come from that project's entry
    contrast: { text: "GameStack is the opposite experiment: AI agents write the code under rules I wrote.", to: "gs" }
  },

  missing: {
    intro: "This project is finished and I don't plan to extend it.",
    items: [
      { title: "There is no real backend.", text: "The remote layer is implemented and tested against MockWebServer, but the app binds a fake that returns two demo notes after a simulated delay, so the loading state can be seen on a device. Swapping in a real API is a one-line change in `RepositoryModule`.", files: ["di/RepositoryModule.kt"] },
      { title: "Deleting a note is not in the UI.", text: "`DeleteNoteUseCase` and `NoteDao.deleteNote` exist and are tested, but no screen calls them." },
      { title: "Improved after the first version.", text: "On Oct 16, 2026:", list: [
        "Added a missing `@Body` to `addNote` and `updateNote` in the remote API (`8bb8570`).",
        "Made the remote repositories rethrow `CancellationException` (`8b5eb6d`; its message only mentions a test rename).",
        "Made loading show only while the list is empty (`01fda92`)."
      ] }
    ]
  },

  footNote: "The repo README says it was drafted with AI from the code and reviewed by me."
};
