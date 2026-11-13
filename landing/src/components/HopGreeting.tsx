import { useEffect, useRef, useState } from "react";

// "Hello, it's Dhruv": each letter hops in turn like a bunny (leap, land, squash) when the line scrolls into view,
// and hops again on hover. Black text, name in orange.
export default function HopGreeting({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setRun((n) => n + 1);
        io.disconnect();
      }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const name = text.split(" ").pop() ?? "";
  const lead = text.slice(0, text.length - name.length);
  let i = 0;
  const letters = (s: string, cls: string) =>
    Array.from(s).map((ch) => {
      const idx = i++;
      return ch === " " ? (
        " "
      ) : (
        <span key={idx} className={`hop__ch ${cls}`} style={{ animationDelay: `${idx * 55}ms` }}>{ch}</span>
      );
    });

  return (
    <p
      ref={ref}
      className={`about__greeting hop${run ? " hop--go" : ""}`}
      aria-label={text}
      onMouseEnter={() => setRun((n) => n + 1)}
    >
      <span key={run} aria-hidden="true" className="hop__inner">
        {letters(lead, "hop__ch--ink")}
        {letters(name, "hop__ch--name")}
      </span>
    </p>
  );
}
