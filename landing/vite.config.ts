import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { marked } from "marked";

// Turns posts/*.md into { data, html } at build time, so no Markdown parser ships to the browser.
function markdownPosts(): Plugin {
  return {
    name: "markdown-posts",
    transform(code, id) {
      if (!id.endsWith(".md")) return null;
      const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(code);
      const data: Record<string, string> = {};
      for (const line of (match?.[1] ?? "").split(/\r?\n/)) {
        const i = line.indexOf(":");
        if (i === -1) continue;
        const key = line.slice(0, i).trim();
        if (key) data[key] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      }
      const html = marked.parse(match ? (match[2] ?? "") : code, { async: false });
      return { code: `export default ${JSON.stringify({ data, html })};`, map: null };
    },
  };
}

// Served from the user-site root (https://whatheheckisthis.github.io/).
// Assets go to /app-assets/ so they never collide with MkDocs' /assets/.
export default defineConfig({
  base: "/",
  plugins: [markdownPosts(), react()],
  build: {
    assetsDir: "app-assets",
    emptyOutDir: true,
  },
});
