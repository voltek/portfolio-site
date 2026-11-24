// Prints the CV (src/cv.html + tools/pages/cv.js) as two PDFs, English and Spanish, with a headless Edge or Chrome. Free and
// local; tools/build.js calls it, so the PDFs in _site/ always carry the day's numbers.
// Usage: node tools/cv.js            the site's PDFs, into _site/ (no phone)
//        node tools/cv.js --phone    the ones Alan sends, with the phone in _private/cv/phone.txt, into _private/cv/
//        --check                     also reads each PDF back with pdftotext, as an applicant tracker would
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const root = path.join(__dirname, "..");
const data = require(path.join(root, "data", "portfolio.js"));
const { context, fillTemplate, CV_FILES: FILES } = require("./pages/common.js");
const render = require("./pages/cv.js");

const MAX_PAGES = 2; // the target (Alan): longer is reported, never an error, so a new job or project cannot stop the site
const BROWSER = [process.env.CHROME_PATH, "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium"].find(f => f && fs.existsSync(f));

// Prints both languages into `out` and returns [{ lang, file, pages, kb }]; throws when one does not print.
const printCv = (out, { now = new Date(), phone } = {}) => {
  if (!BROWSER) throw new Error("no Edge or Chrome to print the CV with (set CHROME_PATH)");
  const tpl = fs.readFileSync(path.join(root, "src", "cv.html"), "utf8"), ctx = context(data, now);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cv-"));
  try {
    return Object.entries(FILES).map(([lang, name]) => {
      const html = path.join(tmp, `${lang}.html`), pdf = path.join(out, name);
      const base = "file:///" + root.replace(/\\/g, "/").replace(/^\//, "") + "/";
      fs.writeFileSync(html, fillTemplate(tpl, data, { ...render(ctx, lang, { phone }), base }, `cv ${lang}`));
      fs.rmSync(pdf, { force: true });
      const r = spawnSync(BROWSER, ["--headless=new", "--disable-gpu", "--allow-file-access-from-files", ...(process.env.CI ? ["--no-sandbox"] : []),
        `--user-data-dir=${path.join(tmp, "profile")}`, "--no-pdf-header-footer", `--print-to-pdf=${pdf}`, "file:///" + html.replace(/\\/g, "/").replace(/^\//, "")], { encoding: "utf8", timeout: 60000 });
      const bytes = fs.existsSync(pdf) ? fs.readFileSync(pdf) : Buffer.alloc(0), pages = (bytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
      if (r.error || r.status !== 0 || !pages) throw new Error(`${name} did not print: ${String(r.error || r.stderr || `exit ${r.status}`).trim().split("\n").pop()}`);
      return { lang, file: name, pages, kb: Math.round(bytes.length / 1024), long: pages > MAX_PAGES ? `${pages} pages, the target is ${MAX_PAGES}: shorten the oldest jobs first` : "" };
    });
  } finally {
    // the browser may still hold its profile for a moment: a folder left in the temp directory must not fail the build
    try { fs.rmSync(tmp, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch { }
  }
};

// What an applicant tracker would read: every section in order, and every Skills label right before its own list.
const readBack = (pdf, lang) => {
  const r = spawnSync("pdftotext", ["-enc", "UTF-8", pdf, "-"], { encoding: "utf8" });
  if (r.error) return ["pdftotext not found: install it (Git for Windows has it) or run this from Git Bash"];
  const flat = s => s.replace(/\s+/g, " ").toUpperCase(), text = flat(r.stdout), bad = [], cv = data.cv;
  let from = 0;
  const next = (s, what) => { const i = text.indexOf(flat(s), from); if (i < 0) bad.push(`${what}: "${s}" missing or out of order`); else from = i; };
  const { body } = render(context(data, new Date()), lang);
  const plain = s => s.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
  next(cv.h.skills[lang], "section");
  for (const [, label, list] of body.matchAll(/<div class="lv[^>]*><h3>(.*?)<\/h3> <p>(.*?)<\/p>/g)) next(`${plain(label)} ${plain(list)}`, "skills");
  for (const k of ["projects", "experience", "how", "education", "languages"]) next(cv.h[k][lang], "section");
  return bad;
};

module.exports = { printCv };

if (require.main === module) {
  const withPhone = process.argv.includes("--phone"), out = path.join(root, withPhone ? "_private/cv" : "_site");
  const phoneFile = path.join(root, "_private", "cv", "phone.txt");
  if (withPhone && !fs.existsSync(phoneFile)) { console.error(`write the phone in ${phoneFile} first (one line)`); process.exit(1); }
  fs.mkdirSync(out, { recursive: true });
  let failed = false;
  for (const f of printCv(out, { phone: withPhone ? fs.readFileSync(phoneFile, "utf8").trim() : undefined })) {
    const bad = process.argv.includes("--check") ? readBack(path.join(out, f.file), f.lang) : null;
    console.log(`${path.join(out, f.file)}  ${f.pages} pages · ${f.kb} KB${bad ? (bad.length ? "" : " · reads in order") : ""}`);
    if (f.long) console.log(`  warn  ${f.long}`);
    for (const b of bad || []) { console.error(`  ${b}`); failed = true; }
  }
  if (failed) process.exit(1);
}
