import type { Destination } from '@wcs/shared';

/** Scrolling strip of destination names; the list is repeated so the loop is seamless. */
export function Marquee({ destinations }: { destinations: Destination[] }) {
  if (!destinations.length) return null;
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].flatMap((copy) => destinations.map((d) => <span key={`${copy}-${d.slug}`}>{d.shortName}</span>))}
      </div>
    </div>
  );
}
