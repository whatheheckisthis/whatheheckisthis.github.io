import { Link, useLocation } from "react-router-dom";

// Minimal fixed nav: Home, About, Contact. About and Contact are sections on the landing page.
export default function Header() {
  const { pathname, hash } = useLocation();
  const onHome = pathname === "/";
  const current = (h: string) => (onHome && hash === h ? "location" : undefined);
  return (
    <header className="site-header">
      <nav className="site-header__inner" aria-label="Site">
        <Link to="/" aria-current={onHome && !hash ? "page" : undefined}>Home</Link>
        <a href="/#about" aria-current={current("#about")}>About</a>
        <a href="/#contact" aria-current={current("#contact")}>Contact</a>
      </nav>
    </header>
  );
}
