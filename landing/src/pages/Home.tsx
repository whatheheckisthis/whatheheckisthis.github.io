import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { FEATURED, FOCUS, SITE } from "../content/site";
import { STORY } from "../content/story";

export default function Home() {
  const story = STORY.trim();
  return (
    <>
      <Header />
      <main id="main" className="page fade-in">
        <section className="hero" aria-labelledby="hero-h">
          <p className="eyebrow">{SITE.location}</p>
          <h1 id="hero-h" className="hero__name">{SITE.name}</h1>
          <p className="hero__positioning">{SITE.positioning}</p>
          <p className="hero__focus">{SITE.focus}</p>
          <div className="actions">
            <a className="button" href="#contact">Get in touch</a>
            <a className="button button--ghost" href="#work">See my work</a>
            {SITE.resume ? (
              <a className="button button--ghost" href={SITE.resume} target="_blank" rel="noopener">View resume</a>
            ) : null}
          </div>
        </section>

        <section id="about" className="section about" aria-labelledby="about-h">
          <h2 id="about-h" className="section__title">About</h2>
          <div className="about__grid">
            <img className="about__photo" src={SITE.photo.src} alt="Portrait of Dhruv Setty" width={SITE.photo.width} height={SITE.photo.height} loading="lazy" decoding="async" />
            <div className="about__story">
              {story ? story.split("\n\n").map((para) => <p key={para.slice(0, 24)}>{para}</p>) : null}
              {SITE.resume ? (
                <p className="about__resume"><a href={SITE.resume} target="_blank" rel="noopener">View my resume</a></p>
              ) : null}
            </div>
          </div>
        </section>

        <section id="focus" className="section" aria-labelledby="focus-h">
          <h2 id="focus-h" className="section__title">What I focus on</h2>
          <ul className="cards">
            {FOCUS.map((f) => (
              <li key={f.title} className="card">
                <h3 className="card__title">{f.title}</h3>
                <p>{f.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="work" className="section" aria-labelledby="work-h">
          <h2 id="work-h" className="section__title">Selected work</h2>
          <article className="card card--feature">
            <h3 className="card__title card__title--lg">
              {FEATURED.name}
            </h3>
            <p>{FEATURED.summary}</p>
            <div className="actions">
              <a className="button button--ghost" href={FEATURED.readme}>{FEATURED.readmeText}</a>
              <a className="text-link" href={FEATURED.repo}>View the code</a>
            </div>
          </article>
        </section>

        <section id="contact" className="section contact" aria-labelledby="contact-h">
          <h2 id="contact-h" className="section__title">Get in touch</h2>
          <div className="contact__grid">
            <div>
              <p className="contact__lede">Hiring for identity or access work, or want to compare notes? Send a message and I'll reply within two working days.</p>
              <p className="contact__email"><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
              <ul className="inline-list">
                {SITE.contact.filter((c) => c.label !== "Email").map((c) => (
                  <li key={c.label}><a href={c.href}>{c.text}</a></li>
                ))}
              </ul>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
