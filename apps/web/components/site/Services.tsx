import type { Service, SiteSettings, TransferHub } from '@wcs/shared';
import { hubLabel, telHref } from '@/lib/format';
import { revealDelay } from './css';
import { ContentIcon } from './icons';

type Props = { services: Service[]; hubs: TransferHub[]; settings: SiteSettings };

export function Services({ services, hubs, settings }: Props) {
  const featured = services.find((s) => s.isFeatured);
  const others = services.filter((s) => s !== featured);

  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">What we do</p>
          <h2 className="display">
            Every kind of trip, <em>one trusted cab.</em>
          </h2>
          <p>
            Whether you&apos;re landing in Calicut, checking into a hilltop resort or heading home to Bengaluru,
            we&apos;ll get you there comfortably.
          </p>
        </div>

        <div className="bento">
          {featured ? (
            <article className="card card-feature reveal">
              <RouteArt />
              <div className="card-feature-body">
                <h3>{featured.title}</h3>
                <p>{featured.summary}</p>
                {hubs.length ? (
                  <ul className="hubs">
                    {hubs.map((h) => (
                      <li key={h.slug}>{hubLabel(h)}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ) : null}

          {others.map((s, i) => (
            <article key={s.slug} className="card reveal" style={revealDelay(i % 2 === 0 ? 1 : 2)}>
              <div className="icon">
                <ContentIcon name={s.icon} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.summary}</p>
            </article>
          ))}

          <div className="card card-cta reveal">
            <p>
              <strong>Not sure what you need?</strong> Just call. We&apos;ll sort out the plan with you.
            </p>
            <a className="btn btn-dark" href={telHref(settings.phoneE164)}>
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Airport-to-Wayanad route drawing on the featured card. */
function RouteArt() {
  return (
    <svg className="route-art" viewBox="0 0 320 130" aria-hidden="true">
      <path
        id="transferPath"
        d="M28 98 C 95 10, 220 10, 292 84"
        fill="none"
        stroke="rgba(238,241,232,.35)"
        strokeWidth={2}
        strokeDasharray="3 8"
        strokeLinecap="round"
      />
      <g transform="translate(14 84)">
        <circle cx="14" cy="14" r="19" fill="rgba(217,164,65,.16)" />
        <path
          d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
          fill="#d9a441"
          transform="translate(2.5 2.5)"
        />
      </g>
      <g transform="translate(292 74)">
        <path d="M0 -18 C -7 -18 -11 -12 -11 -7 C -11 1 0 10 0 10 C 0 10 11 1 11 -7 C 11 -12 7 -18 0 -18 Z" fill="#a9c3a0" />
        <circle cx="0" cy="-7" r="3.6" fill="#10291b" />
      </g>
      <circle className="route-dot" r="5" fill="#f0c76a">
        <animateMotion dur="5s" repeatCount="indefinite">
          <mpath href="#transferPath" />
        </animateMotion>
      </circle>
      <text x="28" y="127" textAnchor="middle">
        Airport
      </text>
      <text x="292" y="110" textAnchor="middle">
        Wayanad
      </text>
    </svg>
  );
}
