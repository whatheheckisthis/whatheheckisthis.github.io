import { Link } from "react-router-dom";
import { SITE } from "../content/site";
import { formatShortDate, type Post } from "../content/posts";

// Medium-style story preview: byline, headline, subtitle, date and reading time.
export default function PostPreview({ post }: { post: Post }) {
  const href = `/blog/${post.slug}/`;
  return (
    <article className="preview">
      <p className="byline">
        <img src="/dhruv.webp" alt="" width="24" height="24" loading="lazy" />
        <span>{SITE.name}</span>
      </p>
      <h2 className="preview__title">
        <Link to={href}>{post.title}</Link>
      </h2>
      <p className="preview__summary">{post.summary}</p>
      <p className="preview__meta">
        <time dateTime={post.date}>{formatShortDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.minutes} min read</span>
        {post.medium ? (
          <>
            <span aria-hidden="true">·</span>
            <a href={post.medium}>Read on Medium</a>
          </>
        ) : null}
      </p>
    </article>
  );
}
