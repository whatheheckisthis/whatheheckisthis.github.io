import { Children, useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

// Flash-card deck: drag or swipe the top card left for next, right for previous.
// Arrow keys and buttons work too. Without JS the cards still render stacked in order.
const THRESHOLD = 90;

export default function FlashDeck({ label, children, noun = "card" }: { label: string; children: ReactNode; noun?: string }) {
  const cards = Children.toArray(children);
  const count = cards.length;
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [fly, setFly] = useState<0 | 1 | -1>(0);
  const start = useRef<number | null>(null);
  const moved = useRef(false);

  const go = useCallback((dir: 1 | -1) => {
    if (fly) return;
    const next = active + dir;
    if (next < 0 || next >= count) { setDrag(0); return; }
    setFly(dir);
    window.setTimeout(() => { setActive(next); setFly(0); setDrag(0); }, 320);
  }, [active, count, fly]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    start.current = e.clientX; moved.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    if (Math.abs(dx) > 4) moved.current = true;
    setDrag(dx);
  };
  const onUp = () => {
    if (start.current === null) return;
    start.current = null;
    if (drag < -THRESHOLD) go(1);
    else if (drag > THRESHOLD) go(-1);
    else setDrag(0);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  return (
    <div className="deck" role="region" aria-roledescription="card deck" aria-label={label} tabIndex={0} onKeyDown={onKey}>
      <div className="deck__stage" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        {cards.map((card, i) => {
          const offset = i - active;
          const isTop = offset === 0;
          let transform: string;
          let opacity = 1;
          if (offset < 0) { transform = "translate3d(-120%,0,0) rotate(-8deg)"; opacity = 0; }
          else if (isTop) {
            const x = fly ? fly * -130 : 0;
            transform = fly ? `translate3d(${x}%,0,0) rotate(${fly * -10}deg)` : `translate3d(${drag}px,0,0) rotate(${drag / 22}deg)`;
            if (fly) opacity = 0;
          } else {
            const depth = Math.min(offset, 3) - (fly === 1 ? 1 : 0);
            transform = `translate3d(0,${depth * 20}px,0) scale(${1 - depth * 0.05})`;
            opacity = offset > 3 ? 0 : 1 - depth * 0.22;
          }
          const dragging = isTop && start.current !== null && !fly;
          return (
            <div
              key={i}
              className={`deck__card${isTop ? " is-top" : ""}${dragging ? " is-dragging" : ""}`}
              style={{ transform, opacity, zIndex: count - Math.abs(offset) }}
              aria-hidden={!isTop}
              {...(!isTop ? ({ inert: "" } as Record<string, string>) : {})}
            >
              {card}
            </div>
          );
        })}
      </div>
      <div className="deck__controls">
        <button type="button" className="deck__btn" onClick={() => go(-1)} disabled={active === 0} aria-label={`Previous ${noun}`}>←</button>
        <span className="deck__count" aria-live="polite">
          <span className="deck__now">{String(active + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
        </span>
        <button type="button" className="deck__btn" onClick={() => go(1)} disabled={active === count - 1} aria-label={`Next ${noun}`}>→</button>
      </div>
      <p className="deck__hint" aria-hidden="true">Swipe or use arrow keys</p>
    </div>
  );
}
