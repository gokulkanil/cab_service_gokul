import { heroSceneSvg } from '@/components/art/heroSceneSvg';
import type { Service, SiteSettings, Vehicle } from '@wcs/shared';
import { telHref, vehicleName, whatsappHref } from '@/lib/format';
import { ChatIcon, PhoneIcon } from './icons';

const skies = [
  {
    key: 'dawn',
    title: 'Misty morning',
    label: 'Morning',
    icon: <path d="M5 17a7 7 0 0 1 14 0M2 20h20M12 4v3M4.9 8.9l1.4 1.4M19.1 8.9l-1.4 1.4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />,
  },
  {
    key: 'day',
    title: 'Clear skies',
    label: 'Day',
    icon: (
      <>
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth={1.8} />
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
      </>
    ),
  },
  {
    key: 'dusk',
    title: 'Golden hour',
    label: 'Evening',
    icon: <path d="M5 17a7 7 0 0 1 14 0M2 20h20M12 9V4M9.5 6.5 12 9l2.5-2.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    key: 'night',
    title: 'Starlit night',
    label: 'Night',
    icon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />,
  },
];

type Props = { settings: SiteSettings; vehicle: Vehicle | null; services: Service[] };

export function Hero({ settings, vehicle, services }: Props) {
  const cabWords = vehicle ? `${vehicle.hasAc ? 'air-conditioned ' : ''}${vehicleName(vehicle)} cabs` : 'cabs';
  const badges = services.filter((s) => s.heroLabel);

  return (
    <section className="hero" id="top">
      <div className="stars" aria-hidden="true"></div>
      <div className="sun" aria-hidden="true"></div>

      <div className="container hero-content">
        <p className="eyebrow hero-eyebrow">
          <span className="pulse" aria-hidden="true"></span>
          <span>
            <span data-sky-label>Clear skies</span> over {settings.regionLabel}
          </span>
        </p>
        <h1 className="display hero-title">
          Wayanad, <em>one curve</em> at a{' '}time.
        </h1>
        <p className="hero-lead">
          Clean, {cabWords} with local drivers who know every ghat road, waterfall trail and resort lane in Wayanad.
        </p>

        <div className="cta-row">
          <a className="btn btn-dark btn-lg" href={telHref(settings.phoneE164)}>
            <PhoneIcon />
            Call {settings.phoneDisplay}
          </a>
          <a
            className="btn btn-ghost btn-lg"
            href={whatsappHref(settings.whatsappE164, settings.whatsappMessage)}
            target="_blank"
            rel="noopener"
          >
            <ChatIcon />
            Chat on WhatsApp
          </a>
        </div>

        <div className="hero-foot">
          <ul className="hero-badges">
            {badges.map((s) => (
              <li key={s.slug}>{s.heroLabel}</li>
            ))}
          </ul>
          <div className="sky-switch" role="group" aria-label="Change the sky">
            <span className="sky-switch-label">Sky</span>
            {skies.map((sky) => (
              <button key={sky.key} type="button" data-sky={sky.key} aria-pressed="false" title={sky.title}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {sky.icon}
                </svg>
                <span className="sr-only">{sky.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Illustrated hills, mist, tea rows and the cab on the road */}
      <div className="hero-scene" aria-hidden="true" dangerouslySetInnerHTML={{ __html: heroSceneSvg }} />
    </section>
  );
}
