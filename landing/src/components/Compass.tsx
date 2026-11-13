// Faint compass rose behind the page. The needle swings as you scroll (CSS scroll-driven animation).
export default function Compass() {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <div className="compass" aria-hidden="true">
      <svg viewBox="-100 -100 200 200" width="100%" height="100%">
        <circle r="96" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle r="78" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1.5 3" />
        {ticks.map((d) => (
          <line key={d} x1="0" y1={-96} x2="0" y2={d % 45 === 0 ? -86 : -91}
            stroke="currentColor" strokeWidth={d % 45 === 0 ? 0.9 : 0.4} transform={`rotate(${d})`} />
        ))}
        <g className="compass__rose" fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round">
          <path d="M0 -70 L9 0 L0 70 L-9 0 Z" />
          <path d="M-70 0 L0 9 L70 0 L0 -9 Z" />
          <path d="M0 -40 L28 -28 L40 0 L28 28 L0 40 L-28 28 L-40 0 L-28 -28 Z" strokeDasharray="2 2.5" />
        </g>
        <g fontFamily="Georgia, serif" fontSize="9" fontStyle="italic" fill="currentColor" textAnchor="middle">
          <text y="-80" dy="3">N</text><text x="81" dy="3">E</text><text y="85">S</text><text x="-81" dy="3">W</text>
        </g>
        <g className="compass__needle">
          <path d="M0 -60 L5 0 L-5 0 Z" fill="#D9480F" />
          <path d="M0 60 L5 0 L-5 0 Z" fill="currentColor" />
          <circle r="3.5" fill="var(--bg)" stroke="currentColor" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}
