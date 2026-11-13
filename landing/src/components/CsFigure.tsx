import type { ReactNode } from "react";

export interface FigProps {
  src: string;
  alt: string;
  w: number;
  h: number;
  label: string;
  children: ReactNode;
}

export default function CsFigure({ src, alt, w, h, label, children }: FigProps) {
  return (
    <figure className="cs-figure">
      <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
      <figcaption>
        <span className="cs-figure__label">{label}</span>
        {children}
      </figcaption>
    </figure>
  );
}
