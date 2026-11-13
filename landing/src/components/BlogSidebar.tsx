import { Link } from "react-router-dom";
import { POSTS, formatShortDate } from "../content/posts";

// Side panel for the blog: every post, newest first, with the one being read marked. Collapses to a disclosure on small screens.
export default function BlogSidebar({ current }: { current?: string }) {
  return (
    <aside className="blog-side" aria-label="All posts">
      <details className="blog-side__box" open>
        <summary className="blog-side__title">
          All posts <span className="blog-side__count">{POSTS.length}</span>
        </summary>
        <ol className="blog-side__list">
          {POSTS.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/blog/${p.slug}/`}
                className="blog-side__link"
                aria-current={p.slug === current ? "page" : undefined}
              >
                <span className="blog-side__name">{p.title}</span>
                <span className="blog-side__meta">
                  {formatShortDate(p.date)} · {p.minutes} min read
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <a className="blog-side__rss" href="/feed.xml">
          <svg aria-hidden="true" viewBox="0 0 16 16" width="13" height="13">
            <circle cx="3" cy="13" r="2" fill="currentColor" />
            <path d="M1 7a8 8 0 0 1 8 8M1 1.5A13.5 13.5 0 0 1 14.5 15" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          RSS feed
        </a>
      </details>
    </aside>
  );
}
