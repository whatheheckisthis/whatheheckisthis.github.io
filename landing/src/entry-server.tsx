import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { POSTS } from "./content/posts";
import { metaFor, type PageMeta } from "./content/meta";
import { SITE } from "./content/site";

export function routes(): string[] {
  return ["/", "/case-studies/", "/blog/", ...POSTS.map((p) => `/blog/${p.slug}/`)];
}

export function feedItems() {
  return POSTS.map(({ slug, title, date, summary, html }) => ({ slug, title, date, summary, html }));
}

export function render(url: string): { html: string; meta: PageMeta; siteUrl: string } {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, meta: metaFor(url), siteUrl: SITE.url };
}
