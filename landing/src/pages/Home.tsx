import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { FEATURED, FOCUS, PROJECTS, SITE } from "../content/site";
import { GREETING, STORY } from "../content/story";

export default function Home() {
  const story = STORY.trim();
  return (
    <>
      <Header />
      <main id="main" className="page fade-in">
        <section className="hero" aria-labelledby="hero-h">
          {SITE.location ? <p className="eyebrow">{SITE.location}</p> : null}
          <h1 id="hero-h" className="hero__name" aria-label={SITE.name}>
            <span className="hero__word hero__first animate__animated animate__fadeIn" aria-hidden="true">{SITE.name.split(" ")[0]}</span>{" "}
            <span className="hero__word hero__last animate__animated animate__fadeIn" aria-hidden="true">{SITE.name.split(" ").slice(1).join(" ")}</span>
          </h1>
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
            <figure className="portrait">
              <div className="portrait__frame">
                <img className="portrait__img" src={SITE.photo.src} alt="Portrait of Dhruv Setty" width={SITE.photo.width} height={SITE.photo.height} loading="lazy" decoding="async" />
              </div>
            </figure>
            <div className="about__story">
              {GREETING ? <p className="about__greeting">{GREETING}</p> : null}
              {story ? story.split("\n\n").map((para) => (
                <p key={para.slice(0, 24)}>
                  {para.split(/(asking why)/).map((part, i) => (part === "asking why" ? <span key={i}>asking <em className="about__why">why</em></span> : part))}
                </p>
              )) : null}
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
          <h2 id="work-h" className="section__title">Recent Projects</h2>
          <article className="card card--feature">
            <p className="card__tag">Assurance</p>
            <h3 className="card__title card__title--lg">
              {FEATURED.name}
            </h3>
            <p>{FEATURED.summary}</p>
            <div className="actions">
              <a className="button button--ghost" href={FEATURED.readme}>{FEATURED.readmeText}</a>
              <a className="text-link" href={FEATURED.repo}>View the code</a>
            </div>
          </article>
          <ul className="cards cards--projects">
            {PROJECTS.map((p) => (
              <li key={p.name} className="card">
                <p className="card__tag">{p.tag}</p>
                <h3 className="card__title">{p.name}</h3>
                <p>{p.summary}</p>
                <div className="actions">
                  {p.links.filter((l) => l.href && !l.href.startsWith("__")).map((l) => (
                    <a key={l.text} className="text-link" href={l.href}>{l.text}</a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="section contact" aria-labelledby="contact-h">
          <h2 id="contact-h" className="section__title">Get in touch</h2>
          <div className="contact__grid">
            <div>
              <p className="contact__lede">Hiring for identity or access work, or want to compare notes? Send a message and I'll reply within two working days.</p>
              <ul className="inline-list">
                {SITE.contact.map((c) => (
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
