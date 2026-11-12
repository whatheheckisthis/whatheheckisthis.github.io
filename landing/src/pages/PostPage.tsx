import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotFound from "./NotFound";
import { findPost, formatDate } from "../content/posts";

export default function PostPage() {
  const { slug } = useParams();
  const post = slug ? findPost(slug) : undefined;
  if (!post) return <NotFound />;
  return (
    <>
      <Header />
      <main className="prose fade-in">
        <article>
          <header className="post-header">
            <h1>{post.title}</h1>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </header>
          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
        <p className="back">
          <Link to="/blog/">All posts</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
