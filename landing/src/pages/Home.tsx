import { Link } from "react-router-dom";
import Header from "../components/Header";
import { FEATURED, SITE } from "../content/site";
import { STORY } from "../content/story";

export default function Home() {
  const story = STORY.trim();
  return (
    <>
    <Header />
    <main className="home fade-in">
      <h1 className="home__name">{SITE.name}</h1>
      <p className="home__positioning">{SITE.positioning}</p>

      <div className="home__grid">
        <section id="contact" aria-labelledby="contact-h">
          <h2 id="contact-h" className="label">Contact</h2>
          <ul className="stack">
            {SITE.contact.map((c) => (
              <li key={c.label}>
                <span className="visually-hidden">{c.label}: </span>
                <a href={c.href}>{c.text}</a>
              </li>
            ))}
          </ul>
        </section>

        <section id="about" aria-labelledby="story-h" className="home__story">
          <h2 id="story-h" className="label">About</h2>
          {story ? (
            <p>{story}</p>
          ) : (
            <p className="placeholder" role="note">
              [STORY] Placeholder: 80 to 120 words, first person, to be written by Dhruv. Edit{" "}
              <code>landing/src/content/story.ts</code>.
            </p>
          )}
        </section>

        <section aria-labelledby="featured-h">
          <h2 id="featured-h" className="label">Featured project</h2>
          <p className="featured__name">
            <a href={FEATURED.repo}>
              {FEATURED.name} <span className="muted">({FEATURED.fullName})</span>
            </a>
          </p>
          <p className="featured__summary">{FEATURED.summary}</p>
        </section>

        <section aria-labelledby="more-h">
          <h2 id="more-h" className="label">Read</h2>
          <ul className="stack">
            <li>
              <Link to="/blog/">Blog</Link>
            </li>
            {SITE.docs.map((d) => (
              <li key={d.href}>
                <a href={d.href}>{d.text}</a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
    </>
  );
}
