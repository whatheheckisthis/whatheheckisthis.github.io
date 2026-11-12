import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
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
      <p className="home__focus">{SITE.focus}</p>

      <div className="home__grid">
        <section id="contact" aria-labelledby="contact-h">
          <h2 id="contact-h" className="label">Get in touch</h2>
          <p className="contact__email">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <ul className="stack">
            {SITE.contact.filter((c) => c.label !== "Email").map((c) => (
              <li key={c.label}>
                <a href={c.href}>{c.text}</a>
              </li>
            ))}
          </ul>
          <ContactForm />
        </section>

        <section id="about" aria-labelledby="story-h" className="home__story">
          <h2 id="story-h" className="label">About</h2>
          <img className="about__photo" src={SITE.photo.src} alt={SITE.photo.alt} width={SITE.photo.width} height={SITE.photo.height} loading="lazy" decoding="async" />
          {story ? (
            story.split("\n\n").map((para) => <p key={para.slice(0, 24)}>{para}</p>)
          ) : (
            <p className="placeholder" role="note">
              [STORY] Placeholder: 80 to 120 words, first person, to be written by Dhruv. Edit{" "}
              <code>landing/src/content/story.ts</code>.
            </p>
          )}
          {SITE.resume ? (
            <p className="about__resume">
              <a href={SITE.resume} target="_blank" rel="noopener">View my resume</a>
            </p>
          ) : null}
        </section>

        <section aria-labelledby="featured-h">
          <h2 id="featured-h" className="label">Featured project</h2>
          <p className="featured__name">
            <a href={FEATURED.repo}>
              {FEATURED.name} <span className="muted">({FEATURED.fullName})</span>
            </a>
          </p>
          <p className="featured__status">{FEATURED.status}</p>
          <p className="featured__summary">
            <a href={FEATURED.readme}>{FEATURED.readmeText}</a>
          </p>
        </section>

      </div>
    </main>
    </>
  );
}
