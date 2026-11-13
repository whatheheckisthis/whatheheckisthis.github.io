import { Children, useEffect, useRef, useState, type ReactNode } from "react";

// Scroll-snap carousel: equal-height slides, arrow buttons and dots. Works without JS (native horizontal scroll).
export default function Carousel({ label, children }: { label: string; children: ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const count = Children.count(children);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const slides = Array.from(el.children) as HTMLElement[];
      const left = el.scrollLeft;
      let best = 0;
      slides.forEach((s, i) => {
        if (Math.abs(s.offsetLeft - el.offsetLeft - left) < Math.abs((slides[best]?.offsetLeft ?? 0) - el.offsetLeft - left)) best = i;
      });
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) best = slides.length - 1;
      setActive(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const target = el?.children[Math.max(0, Math.min(count - 1, i))] as HTMLElement | undefined;
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className="carousel" role="region" aria-roledescription="carousel" aria-label={label}>
      <ul className="carousel__track" ref={track}>
        {children}
      </ul>
      <div className="carousel__controls">
        <button type="button" className="carousel__btn" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous project">‹</button>
        <div className="carousel__dots">
          {Array.from({ length: count }, (_, i) => (
            <button key={i} type="button" className={`carousel__dot${i === active ? " is-active" : ""}`} onClick={() => go(i)} aria-label={`Project ${i + 1} of ${count}`} aria-current={i === active ? "true" : undefined} />
          ))}
        </div>
        <button type="button" className="carousel__btn" onClick={() => go(active + 1)} disabled={active === count - 1} aria-label="Next project">›</button>
      </div>
    </div>
  );
}
