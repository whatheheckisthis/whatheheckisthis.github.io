// Renders each route to static HTML so GitHub Pages serves real files.
// No SPA 404 fallback is written: unknown paths fall through to the MkDocs 404.html.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const { render, routes } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

for (const url of routes()) {
  const { html, meta, siteUrl } = render(url);
  const canonical = siteUrl + meta.path;
  const head = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:site_name" content="Dhruv Setty" />`,
    `<meta name="twitter:card" content="summary" />`,
  ].join("\n    ");
  const page = template.replace("<!--app-head-->", head).replace("<!--app-html-->", html);
  const out = path.join(dist, url, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page);
  console.log("prerendered", url);
}
