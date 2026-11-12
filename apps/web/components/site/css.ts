import type { CSSProperties } from 'react';

/** Inline CSS custom properties, e.g. cssVars({ '--d': 1 }). */
export function cssVars(vars: Record<`--${string}`, string | number | undefined>): CSSProperties {
  return vars as CSSProperties;
}

/** Reveal delay used by the stylesheet's staggered fade-in. */
export function revealDelay(d: number): CSSProperties | undefined {
  return d > 0 ? cssVars({ '--d': d }) : undefined;
}
