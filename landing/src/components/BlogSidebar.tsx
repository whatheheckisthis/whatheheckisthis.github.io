import { SITE } from "../content/site";
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
        {SITE.coffee ? (
          <a className="icon-link blog-side__coffee" href={SITE.coffee} aria-label="Buy me a coffee" title="Buy me a coffee"><img src="/icons/bmc.svg" alt="" width="22" height="22" /></a>
        ) : null}
      </details>
    </aside>
  );
}
