// Renders each route to static HTML so GitHub Pages serves real files.
// No SPA 404 fallback is written: unknown paths fall through to the MkDocs 404.html.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const { render, routes, feedItems } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);

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
    `<link rel="alternate" type="application/rss+xml" title="Dhruv Setty: Blog" href="${siteUrl}/feed.xml" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta property="og:image" content="${siteUrl}/dhruv.webp" />`,
    `<meta property="og:image:alt" content="Portrait of Dhruv Setty" />`,
    meta.path === "/"
      ? `<script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Dhruv Setty",
          jobTitle: "Identity Engineer",
          url: siteUrl,
          image: `${siteUrl}/dhruv.webp`,
          address: { "@type": "PostalAddress", addressLocality: "Auckland", addressCountry: "NZ" },
          sameAs: ["https://github.com/whatheheckisthis", "https://www.linkedin.com/in/its-dhruv-setty"],
        })}</script>`
      : "",
  ].join("\n    ");
  const page = template.replace("<!--app-head-->", head).replace("<!--app-html-->", html);
  const out = path.join(dist, url, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page);
  console.log("prerendered", url);
}

// RSS 2.0 feed of every post, full text in content:encoded.
{
  const { siteUrl } = render("/");
  const items = feedItems();
  const rfc = (d) => new Date(d + "T00:00:00Z").toUTCString();
  const cdata = (s) => "<![CDATA[" + s.replace(/]]>/g, "]]]]><![CDATA[>") + "]]>";
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>Dhruv Setty: Blog</title>
<link>${siteUrl}/blog/</link>
<atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
<description>Notes on identity, access and assurance.</description>
<language>en-nz</language>
${items[0] ? `<lastBuildDate>${rfc(items[0].date)}</lastBuildDate>` : ""}
${items
  .map(
    (p) => `<item>
<title>${esc(p.title)}</title>
<link>${siteUrl}/blog/${p.slug}/</link>
<guid isPermaLink="true">${siteUrl}/blog/${p.slug}/</guid>
<pubDate>${rfc(p.date)}</pubDate>
<description>${esc(p.summary)}</description>
<content:encoded>${cdata(p.html)}</content:encoded>
</item>`,
  )
  .join("\n")}
</channel>
</rss>
`;
  fs.writeFileSync(path.join(dist, "feed.xml"), xml);
  console.log("wrote feed.xml", items.length, "items");
}
