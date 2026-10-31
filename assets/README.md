# Assets

Files used by the pages. Paths can be declared before a file exists: every image has a designed empty state.
The prototypes in `_private/sources/direcciones/` read these through `../../assets/`.

**Originals and copies.** Each PNG or JPG listed in the data is an original: it stays here as the source but is not
published. `node tools/images.js` makes its WebP copies next to it (`-240`, `-480` and the full `.webp`), which the pages
load (recipe: `DATA.md` → *New app screenshots*).

| Path | Used by | Notes |
|---|---|---|
| `alan.jpg` | Both versions and the CV | 600×800 original. The first original lives in `_private/archive/alan-original.jpg`. |
| `projects/gamestack/search_results.png` | Plain, Show, case study | |
| `projects/gamestack/search.png` · `search_refresh_error.png` | Show, case study | |
| `projects/gamestack/search_loading.png` · `search_no_results.png` | Case study | |
| `projects/modernnotes/home.png` · `filters.png` · `detail.png` | Case study | |
| `fonts/` | All pages (`tokens.css`) | Latin subset (WOFF2) of Bricolage Grotesque and Figtree (Plain, CV) and of Titan One, Bangers, Nunito, Pacifico and Gochi Hand (Show), with their SIL OFL licenses |
| `og.png` | Share previews (Open Graph) | 1200×630, made from the data by `node tools/og.js` (design A, 10-21) |
