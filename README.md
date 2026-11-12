# whatheheckisthis.github.io

One GitHub Pages site built from two sources:

| Path | Source | Tool |
|---|---|---|
| `/` (landing page), `/blog/`, `/blog/<slug>/` | `landing/` | React 18, TypeScript, Vite (prerendered to static HTML) |
| `/overview/`, `/architecture/`, `/reference/`, `/deployment/` | `docs/`, `mkdocs.yml` | MkDocs Material |

## Landing page and blog

### Run locally

```bash
cd landing
npm ci
npm run dev        # http://localhost:5173
```

Docs links (`/overview/` and the rest) are served by MkDocs, so they 404 in the Vite dev server. To check the combined site, build both and serve the merged folder (see below).

### Edit content

- Personal story: `landing/src/content/story.ts`. Leave it empty to show the marked `[STORY]` placeholder.
- Name, positioning, contact links, featured project: `landing/src/content/site.ts`. Contact links show their label (Email, GitHub, LinkedIn), not the address. The featured project links to the repo and to the profile README.
- Blog posts: add `landing/posts/YYYY-MM-DD-slug.md` with front matter:

  ```markdown
  ---
  title: Post title
  date: 2026-11-12
  summary: One sentence used for the page description.
  ---
  ```

  The URL is `/blog/<slug>/` (the date prefix is dropped). Posts are compiled at build time; no Markdown parser ships to the browser.

### Build and preview the whole site

```bash
pip install -r requirements.txt
mkdocs build --strict --site-dir site
(cd landing && npm ci && npm run build)
cp -R landing/dist/. site/
python3 -m http.server -d site 8000   # http://localhost:8000
```

`npm run build` type-checks, builds the client bundle, then prerenders `/`, `/blog/` and every post to its own `index.html`.

## Deploy

`.github/workflows/docs.yml` runs on pushes to `main` that touch `docs/**`, `mkdocs.yml`, `landing/**` or the workflow itself. It:

1. builds MkDocs into `site/` (`--strict`),
2. builds and prerenders the landing app into `landing/dist/`,
3. copies `landing/dist/` into `site/`, failing if any file would overwrite a docs file,
4. uploads `site/` as one Pages artifact and deploys it.

Pull requests run steps 1 to 3, then Lighthouse CI on `/`, `/blog/` and the sample post (`landing/lighthouserc.json`, fails any category below 95), without deploying. Pages source must be set to **GitHub Actions** (Settings > Pages). No Jekyll.

Collision rules: Vite assets go to `/app-assets/` (MkDocs owns `/assets/`), and the landing app writes no `404.html`, so unknown paths get the MkDocs 404 page.
