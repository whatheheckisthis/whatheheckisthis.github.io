import { Link } from "react-router-dom";
import Header from "../components/Header";
import { POSTS, formatDate } from "../content/posts";

export default function BlogIndex() {
  return (
    <>
      <Header />
      <main className="prose fade-in">
        <h1>Blog</h1>
        {POSTS.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ol className="post-list">
            {POSTS.map((p) => (
              <li key={p.slug}>
                <Link to={`/blog/${p.slug}/`}>{p.title}</Link>
                <time dateTime={p.date}>{formatDate(p.date)}</time>
              </li>
            ))}
          </ol>
        )}
      </main>
    </>
  );
}
