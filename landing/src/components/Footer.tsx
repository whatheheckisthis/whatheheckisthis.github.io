import { SITE } from "../content/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>© {new Date().getFullYear()} {SITE.name}</p>
        <ul className="site-footer__links">
          {SITE.contact.map((c) => (
            <li key={c.label}><a href={c.href}>{c.text}</a></li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
