export interface Post {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  html: string;
  minutes: number; // estimated reading time
  medium?: string; // optional Medium URL (front matter `medium:`)
}

interface Compiled {
  data: Record<string, string>;
  html: string;
}

// Compiled at build time by the markdown-posts plugin in vite.config.ts.
const files = import.meta.glob<Compiled>("../../posts/*.md", { import: "default", eager: true });

function toPost(path: string, { data, html }: Compiled): Post {
  const slug = (path.split("/").pop() ?? "").replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
  const { title, date, summary, medium } = data;
  if (!title || !date || !summary || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${path}: front matter needs title, date (YYYY-MM-DD) and summary`);
  }
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 230));
  return { slug, title, date, summary, html, minutes, medium: medium || undefined };
}

export const POSTS: Post[] = Object.entries(files)
  .map(([path, mod]) => toPost(path, mod))
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function findPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
