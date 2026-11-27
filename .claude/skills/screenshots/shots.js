// Captures and checks pages with Edge headless, at real phone widths. Plain Node (22+, for WebSocket), no npm.
//   node .claude/skills/screenshots/shots.js <page.html>... [options]
//   --width=390,1440  --theme=light,dark (default light)  --height=900  --query="open&today=2027-09-15"
//   --click=<css>   click it before capturing (repeatable, in order)
//   --el=<css>      capture only that element        --full   whole page, in pieces that stay readable
//   --check         no images                        --out=<dir>  --name=<suffix>
// Every page is first loaded with its animations on, on a 2x screen, for JavaScript errors, failed requests, sideways
// overflow and images stretched past their pixels (blurry); the images are taken at 1x with reduced motion, so they are
// settled. Exit 1 if anything was found.
const fs = require("fs"), os = require("os"), path = require("path"), { spawn } = require("child_process"), { pathToFileURL } = require("url");
const EDGE = [process.env.CHROME_PATH, "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].find(p => p && fs.existsSync(p));
const stop = why => { console.log(why); process.exit(2); };

const KNOWN = ["width", "theme", "height", "query", "click", "el", "full", "check", "out", "name"], opt = { click:[] }, pages = [];
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([a-z]+)(?:=([\s\S]*))?$/);
  if (!m) pages.push(a);
  else if (!KNOWN.includes(m[1])) stop(`unknown option ${a}`);
  else if (m[1] === "click") opt.click.push(m[2]);
  else opt[m[1]] = m[2] ?? true;
  if (m && !["full", "check"].includes(m[1]) && !m[2]) stop(`--${m[1]} needs a value`);
}
const missing = pages.filter(p => !fs.existsSync(p));
if (!EDGE) stop("no Edge found: set CHROME_PATH");
if (!pages.length) stop("which page?");
if (missing.length) stop(`no such page: ${missing.join(", ")}`);
const widths = (opt.width || "390,1440").split(",").map(Number), themes = (opt.theme || "light").split(","), height = +(opt.height || 900);
const out = path.resolve(opt.out || "."), PIECE = 1600;
if (themes.some(t => !["light", "dark"].includes(t))) stop("--theme takes light, dark or both");
// images are named after the page, and after its folder too when two pages share the name
const base = p => path.basename(p, ".html"), names = new Map(pages.map(p => [p, pages.some(q => path.resolve(q) !== path.resolve(p) && base(q) === base(p))
  ? `${path.basename(path.dirname(path.resolve(p)))}-${base(p)}` : base(p)]));
if (new Set(names.values()).size < names.size) stop("two pages would save over each other: capture them with different --out");
if (widths.some(w => !(w > 0)) || !(height > 0)) stop("--width and --height take numbers");
if (!opt.check) fs.mkdirSync(out, { recursive:true });

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "shots-"));
const edge = spawn(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--no-first-run",
  "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { stdio:["ignore", "ignore", "pipe"] });
const gone = new Promise(r => { edge.once("exit", r); edge.once("error", r); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const limit = (p, ms, what) => { let t;
  return Promise.race([p, new Promise((_, no) => { t = setTimeout(() => no(Error(`${what} took over ${ms / 1000} s`)), ms); })]).finally(() => clearTimeout(t)); };

// what each step runs inside the page
const inPage = (fn, ...args) => `(${fn})(${args.map(a => JSON.stringify(a)).join(",")})`;
// elements past the right edge that no ancestor clips: the ones that make the page scroll sideways
const overflow = w => {
  const d = document.documentElement, over = Math.max(d.scrollWidth, innerWidth); if (over <= w) return null;
  const clipped = e => { for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).overflowX !== "visible") return true; };
  const name = e => e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + [...e.classList].map(c => "." + c).join("");
  const who = [...document.body.querySelectorAll("*")].filter(e => e.getBoundingClientRect().right > w + 1 && !clipped(e));
  return `${over} px (${who.slice(-3).map(name).join(", ") || "no element found"})`;
};
const click = css => { const e = document.querySelector(css); if (!e) throw Error("--click matches nothing: " + css); e.click(); };
const box = css => {
  const e = document.querySelector(css); if (!e) throw Error("--el matches nothing: " + css);
  const r = e.getBoundingClientRect(); if (!r.width || !r.height) throw Error("--el is not visible: " + css);
  const x = Math.max(0, r.x - 12), y = Math.max(0, r.y + scrollY - 12);
  return { x, y, width:r.right + 12 - x, height:r.bottom + scrollY + 12 - y, scale:1 };
};
// images shown larger than their pixels allow on this screen (the check pass runs at 2x): blurry. Over 1.2x is reported:
// a large copy can only be as wide as its original (the cut-out, 1448 px, is 1.1x on the widest 2x screens)
const STRETCH = 1.2;
// naturalWidth of a srcset image is already divided by the density it was picked for, so the file's own pixels come
// from loading the same URL again without srcset (from the cache)
const stretched = async max => (await Promise.all([...document.images].filter(i => i.complete && i.naturalWidth && i.getClientRects().length).map(async i => {
  const px = new Image(); px.src = i.currentSrc || i.src; await px.decode().catch(() => {}); if (!px.naturalWidth) return null;
  // the layout size, not the box on screen: a rotated image's box is wider than the image
  const sx = i.offsetWidth / px.naturalWidth, sy = i.offsetHeight / px.naturalHeight, fit = getComputedStyle(i).objectFit;
  const k = (fit === "none" ? 1 : fit === "contain" || fit === "scale-down" ? Math.min(sx, sy) : Math.max(sx, sy)) * devicePixelRatio;
  return k > max ? `${px.src.split("/").pop()} ×${k.toFixed(2)}` : null;
}))).filter(Boolean);
// through the whole page and back: lazy images load, and whatever appears on scroll has appeared
const walk = async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) { scrollTo({ top:y, behavior:"instant" }); await wait(60); }
  scrollTo({ top:0, behavior:"instant" });
  for (let k = 0; k < 30 && [...document.images].some(i => !i.complete && i.getClientRects().length); k++) await wait(100);
  await wait(200);
};

(async () => {
  let found = false;
  try {
    const started = new Promise((yes, no) => { let s = "";
      edge.stderr.on("data", d => { s += d; const m = s.match(/(ws:\/\/\S+)\r?\n/); if (m) yes(m[1]); });
      gone.then(() => no(Error(`Edge closed before starting: ${s.slice(-200)}`))); });
    const ws = new WebSocket(await limit(started, 15000, "starting Edge"));
    await limit(new Promise((yes, no) => { ws.onopen = yes; ws.onerror = () => no(Error("no connection to Edge")); }), 10000, "connecting to Edge");
    let id = 0; const waiting = new Map(), listeners = new Map();
    ws.onmessage = e => { const m = JSON.parse(e.data), w = waiting.get(m.id);
      if (w) { waiting.delete(m.id); m.error ? w[1](Error(m.error.message)) : w[0](m.result); } else listeners.get(m.sessionId)?.(m); };
    let lost = false; ws.onclose = () => { lost = true; for (const [, no] of waiting.values()) no(Error("Edge closed")); };
    const send = (method, params = {}, sessionId) => limit(new Promise((yes, no) => {
      waiting.set(++id, [yes, no]); ws.send(JSON.stringify({ id, method, params, sessionId })); }), 30000, method);

    // a fresh context per load: nothing a click stored in one capture reaches the next
    const open = async (page, width, theme, still, errors) => {
      const { browserContextId } = await send("Target.createBrowserContext");
      const { targetId } = await send("Target.createTarget", { url:"about:blank", browserContextId });
      const { sessionId } = await send("Target.attachToTarget", { targetId, flatten:true });
      const cdp = (method, params) => send(method, params, sessionId);
      const run = async js => { const r = await cdp("Runtime.evaluate", { expression:js, returnByValue:true, awaitPromise:true });
        if (r.exceptionDetails) throw Error((r.exceptionDetails.exception?.description || r.exceptionDetails.text).split("\n")[0]);
        return r.result.value; };
      const seen = new Set(); let onLoad;
      listeners.set(sessionId, ({ method, params }) => {
        if (method === "Page.lifecycleEvent" && params.name === "load") { seen.add(params.loaderId); onLoad?.(); }
        if (method === "Runtime.exceptionThrown") { const d = params.exceptionDetails;
          errors.add(`${(d.exception?.description || d.text).split("\n")[0]} @${d.lineNumber + 1}`); }
        if (method === "Runtime.consoleAPICalled" && params.type === "error") errors.add("console.error: " + params.args.map(a => a.value ?? a.description).join(" "));
        if (method === "Log.entryAdded" && params.entry.level === "error") errors.add(`${params.entry.text} ${params.entry.url || ""}`.trim());
      });
      for (const d of ["Page", "Runtime", "Log"]) await cdp(`${d}.enable`);
      await cdp("Page.setLifecycleEventsEnabled", { enabled:true });
      await cdp("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor:still ? 1 : 2, mobile:width < 900 });
      await cdp("Emulation.setEmulatedMedia", { features:[{ name:"prefers-reduced-motion", value:still ? "reduce" : "no-preference" },
        { name:"prefers-color-scheme", value:theme }] });
      const close = () => { listeners.delete(sessionId); return send("Target.disposeBrowserContext", { browserContextId }); };
      // the walk is skipped for a capture of the first screen: it adds nothing there
      const ready = async (scroll = true) => {
        const { loaderId, errorText } = await cdp("Page.navigate", { url:`${pathToFileURL(path.resolve(page)).href}?${[`theme=${theme}`, opt.query].filter(Boolean).join("&")}` });
        if (errorText) throw Error(`the page did not open: ${errorText}`);
        // this navigation's load, never a late one of the blank page
        await limit(new Promise(r => { onLoad = () => seen.has(loaderId) && r(); onLoad(); }), 15000, "loading the page");
        await run("document.fonts.ready.then(() => 1)"); await sleep(300);
        for (const css of opt.click) { await run(inPage(click, css)); await sleep(still ? 300 : 900); }
        if (scroll) await run(inPage(walk));
      };
      return { cdp, run, ready, close };
    };

    for (const page of pages) for (const width of widths) {
      if (lost) throw Error("Edge closed");
      const errors = new Set(), over = new Set(), blur = new Set();
      const load = async (theme, still, then) => { const p = await open(page, width, theme, still, errors);
        try { await p.ready(!still || opt.full || opt.el); const o = await p.run(inPage(overflow, width)); if (o) over.add(o);
          if (!still) (await p.run(inPage(stretched, STRETCH))).forEach(b => blur.add(b));
          await then?.(p); } finally { await p.close().catch(() => {}); } };
      // one page that fails still reports what it logged, and the rest are checked
      try {
        for (const theme of themes) await load(theme, false);
        for (const theme of opt.check ? [] : themes) await load(theme, true, async p => {
          const clips = [];
          if (opt.el) clips.push(await p.run(inPage(box, opt.el)));
          else if (opt.full) { const h = await p.run("document.documentElement.scrollHeight");
            for (let y = 0; y < h; y += PIECE) clips.push({ x:0, y, width, height:Math.min(PIECE, h - y), scale:1 }); }
          else clips.push({ x:0, y:0, width, height, scale:1 });
          for (const [k, clip] of clips.entries()) {
            // beyond the viewport only when the clip needs it: Edge enlarges the view for it, which an IntersectionObserver
            // reads as a scroll (Cartoon's bar then showed its photo at the top)
            const { data } = await p.cdp("Page.captureScreenshot", { format:"png", captureBeyondViewport:clip.y + clip.height > height, clip });
            const file = path.join(out, [names.get(page), width, theme, opt.name, clips.length > 1 && k + 1].filter(Boolean).join("-") + ".png");
            fs.writeFileSync(file, Buffer.from(data, "base64")); console.log(`saved ${file}`);
          }
        });
      } catch (e) { found = true; console.log(`FAILED ${names.get(page)} at ${width}: ${e.message}`); }
      if (errors.size || over.size || blur.size) found = true;
      console.log(`${names.get(page)} at ${width}: ${errors.size ? "ERRORS " + [...errors].join(" | ") : "no errors"} · ${over.size ? "OVERFLOWS to " + [...over].join(" | ") : "no overflow"}${blur.size ? " · STRETCHED on a 2x screen " + [...blur].join(" | ") : ""}`);
    }
    await send("Browser.close").catch(() => {});
  } catch (e) { console.log(`FAILED: ${e.message}`); found = true; edge.kill(); }
  // Edge is this script's child: it is closed, or killed, before the script ends
  try { await limit(gone, 5000, "closing Edge"); }
  catch (e) { console.log(e.message); edge.kill(); }
  try { fs.rmSync(profile, { recursive:true, force:true, maxRetries:10, retryDelay:100 }); } catch { console.log(`left behind: ${profile}`); }
  process.exit(found ? 1 : 0);
})();
