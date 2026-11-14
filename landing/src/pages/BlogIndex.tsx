import Header from "../components/Header";
import Footer from "../components/Footer";
import BlogSidebar from "../components/BlogSidebar";
import PostPreview from "../components/PostPreview";
import { POSTS } from "../content/posts";

export default function BlogIndex() {
  return (
    <>
      <Header />
      <div className="blog-shell fade-in" id="main">
        <main className="blog-main">
          <h1 className="visually-hidden">Journal</h1>
          {POSTS.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            <div className="preview-feed">
              {POSTS.map((p) => (
                <PostPreview key={p.slug} post={p} />
              ))}
            </div>
          )}
        </main>
        <BlogSidebar />
      </div>
      <Footer />
    </>
  );
}
