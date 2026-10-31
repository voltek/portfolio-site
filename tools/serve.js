// Serves _site/ over http, so Lighthouse and the browser see the pages as GitHub Pages will (file:// skews both).
// Gzips text the way Pages does, so the weight Lighthouse reports is the real one. Local only; plain Node, no npm.
// Usage: node tools/build.js && node tools/serve.js        then open http://localhost:8080/
//        node tools/serve.js --port=3000
const http = require("http"), fs = require("fs"), path = require("path"), zlib = require("zlib");
const root = path.join(__dirname, "..", "_site");
const port = +((process.argv.find(a => a.startsWith("--port=")) || "").split("=")[1] || 8080);
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".webp": "image/webp", ".woff2": "font/woff2", ".pdf": "application/pdf" };

if (!fs.existsSync(root)) { console.log("no _site/ yet: run node tools/build.js first"); process.exit(1); }
http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404, { "content-type": "text/plain" }).end("404"); return; }
  const ext = path.extname(file), type = TYPES[ext] || "application/octet-stream";
  let body = fs.readFileSync(file);
  const headers = { "content-type": type, "cache-control": "max-age=600" };
  if (/text|json|xml|svg|javascript/.test(type) && /gzip/.test(req.headers["accept-encoding"] || "")) {
    body = zlib.gzipSync(body); headers["content-encoding"] = "gzip";
  }
  res.writeHead(200, headers).end(body);
}).listen(port, () => console.log(`serving _site/ at http://localhost:${port}/  (Ctrl+C stops it)`));
