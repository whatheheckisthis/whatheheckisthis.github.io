import { SITE } from "../content/site";
import BackToTop from "./BackToTop";
import PlaneTrails from "./PlaneTrails";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>© {new Date().getFullYear()} {SITE.name}</p>
        <ul className="site-footer__links">
          {SITE.contact.map((c) => (
            <li key={c.label}><a className="icon-link" href={c.href} aria-label={c.label} title={c.label}><img src={c.icon} alt="" width="22" height="22" /></a></li>
          ))}
        </ul>
      </div>
      <BackToTop />
      <PlaneTrails />
    </footer>
  );
}
