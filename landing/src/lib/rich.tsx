import { Fragment, type ReactNode } from "react";

// Renders `backticked` spans as inline code (grey rectangle), like Markdown.
export function rich(text: string): ReactNode {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
      <code key={i} className="ic">{part.slice(1, -1)}</code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
