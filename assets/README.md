# Assets

Files used by the pages. Paths can be declared before a file exists: every image has a designed empty state.
The prototypes in `_private/sources/direcciones/` read these through `../../assets/`.

**Originals and copies.** Each PNG or JPG listed in the data is an original: it stays here as the source but is not
published. `node tools/images.js` makes its WebP copies next to it (`-240`, `-480` and the full `.webp`), which the pages
load (recipe: `DATA.md` → *New app screenshots*).

| Path | Used by | Notes |
|---|---|---|
| `alan.png` | The circles (Cartoon's bar and finale), the share image and the CV | 1448×1086 original, studio background |
| `alan-cutout.png` | Quick's hero and Cartoon's host | The same shot, transparent; its alpha under 8 is zeroed (DATA.md → *New app screenshots*) |
| `projects/gamestack/search_results.png` | Quick, Cartoon, case study | |
| `projects/gamestack/search.png` · `search_refresh_error.png` | Cartoon, case study | |
| `projects/gamestack/search_loading.png` · `search_no_results.png` | Case study | |
| `projects/modernnotes/home.png` · `filters.png` · `detail.png` | Case study | |
| `fonts/` | All pages (`tokens.css`) | Latin subset (WOFF2) of Bricolage Grotesque and Figtree (Quick, CV) and of Titan One, Bangers, Nunito, Pacifico and Gochi Hand (Cartoon), with their SIL OFL licenses |
| `og.jpg` | Share previews (Open Graph) | 1200×630, made from the data by `node tools/og.js`: Quick's hero, the cut-out on the right |
