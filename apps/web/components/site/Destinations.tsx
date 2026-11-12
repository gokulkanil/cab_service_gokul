import type { Destination, PlaceCategory } from '@wcs/shared';
import { mediaUrl, pad2 } from '@/lib/format';
import { cssVars } from './css';
import { ChevronIcon, PinIcon } from './icons';

type Props = { destinations: Destination[]; categories: PlaceCategory[] };

export function Destinations({ destinations, categories }: Props) {
  return (
    <section className="section destinations" id="destinations">
      <div className="container">
        <div className="dest-head">
          <div className="section-head reveal">
            <p className="eyebrow">Explore Wayanad</p>
            <h2 className="display">
              Where would you <em>like to go?</em>
            </h2>
            <p>
              Pick a mood. We&apos;ll drive you to the start of the trail, wait while you explore, and take you to the
              next stop.
            </p>
          </div>
          <div className="rail-nav reveal">
            <button type="button" data-rail="prev" aria-label="Previous destinations">
              <ChevronIcon direction="left" />
            </button>
            <button type="button" data-rail="next" aria-label="Next destinations">
              <ChevronIcon direction="right" />
            </button>
          </div>
        </div>

        <div className="chips reveal" role="group" aria-label="Filter destinations">
          <button type="button" className="chip" data-filter="all" aria-pressed="true">
            All
          </button>
          {categories.map((c) => (
            <button key={c.slug} type="button" className="chip" data-filter={c.slug} aria-pressed="false">
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Missing photos fall back to the coloured artwork. */}
      <div className="rail" id="rail">
        {destinations.map((d, i) => (
          <article
            key={d.slug}
            className="dest"
            data-cat={d.categorySlugs.join(' ')}
            style={cssVars({ '--g1': d.colorFrom ?? undefined, '--g2': d.colorTo ?? undefined })}
          >
            <div className="art"></div>
            {d.imagePath ? (
              <div className="photo" style={{ backgroundImage: `url('${mediaUrl(d.imagePath)}')` }}></div>
            ) : null}
            {d.tagLabel ? <span className="dest-tag">{d.tagLabel}</span> : null}
            <span className="dest-num">{pad2(i + 1)}</span>
            <div className="dest-body">
              <h3>{d.name}</h3>
              <p>{d.description}</p>
              {d.region ? (
                <span className="dest-region">
                  <PinIcon />
                  {d.region}
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
