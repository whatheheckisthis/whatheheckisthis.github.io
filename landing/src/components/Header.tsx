import { Link, useLocation } from "react-router-dom";

// Minimal fixed nav: Home, About, Blog, Contact. About and Contact are sections on the landing page.
export default function Header() {
  const { pathname, hash } = useLocation();
  const onHome = pathname === "/";
  const current = (h: string) => (onHome && hash === h ? "location" : undefined);
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">Skip to content</a>
      <nav className="site-header__inner" aria-label="Site">
        <Link to="/" className="site-header__brand">{"DS"}<span className="visually-hidden"> Dhruv Setty, home</span></Link>
        <span className="site-header__spacer" />
        <Link to="/" aria-current={onHome && !hash ? "page" : undefined}>Home</Link>
        <a href="/#about" aria-current={current("#about")}>About</a>
        <a href="/#work" aria-current={current("#work")}>Work</a>
        <Link to="/blog/" aria-current={pathname.startsWith("/blog/") ? "page" : undefined}>Blog</Link>
        <a href="/#contact" aria-current={current("#contact")}>Contact</a>
      </nav>
    </header>
  );
}
