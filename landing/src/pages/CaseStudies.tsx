import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CASE_STUDIES } from "../content/caseStudies";

export default function CaseStudies() {
  return (
    <>
      <Header />
      <div className="cs-shell fade-in" id="main">
        <main className="prose-article cs-main">
          <header className="cs-head">
            <p className="cs-kicker">Case studies</p>
            <h1 className="cs-head__title">Correctness Framework for Heterogeneous Accelerator Architectures</h1>
          </header>
          <aside className="cs-lede" aria-label="Approach">
            <span className="cs-lede__label">Approach</span>
            <p className="cs-lede__text">
              Four studies from one framework. Each defines what must be observably true first, then designs and
              measures against it.
            </p>
          </aside>
          <ul className="cs-index">
            {CASE_STUDIES.map((c, i) => (
              <li key={c.slug} className="cs-index__item">
                <Link to={`/case-studies/${c.slug}/`} className="cs-index__link">
                  <img src={c.cover} alt="" width={c.coverW} height={c.coverH} loading="lazy" decoding="async" />
                  <span className="cs-index__num">{String(i + 1).padStart(2, "0")} · {c.tag}</span>
                  <span className="cs-index__title">{c.title}</span>
                  <span className="cs-index__summary">{c.summary}</span>
                  <span className="cs-index__more">Learn More</span>
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </div>
      <Footer />
    </>
  );
}
