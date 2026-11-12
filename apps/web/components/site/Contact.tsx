import type { SiteSettings } from '@wcs/shared';
import { telHref, whatsappHref } from '@/lib/format';

export function Contact({ settings }: { settings: SiteSettings }) {
  return (
    <section className="contact" id="contact">
      <div className="container contact-inner reveal">
        <p className="eyebrow light">Ready when you are</p>
        <h2 className="display">
          Your ride through the hills is <em>one call away.</em>
        </h2>
        <a className="big-phone" href={telHref(settings.phoneE164)}>
          {settings.phoneDisplay}
        </a>
        <div className="cta-row center">
          <a
            className="btn btn-gold btn-lg"
            href={whatsappHref(settings.whatsappE164, settings.whatsappMessage)}
            target="_blank"
            rel="noopener"
          >
            Message on WhatsApp
          </a>
          <a className="btn btn-outline-light btn-lg" href={`mailto:${settings.email}`}>
            {settings.email}
          </a>
        </div>
        {settings.serviceArea.length ? (
          <p className="service-area">
            Serving {settings.serviceArea.join(' · ')} · and all of {settings.addressLocality}
          </p>
        ) : null}
      </div>
      <svg className="contact-hills" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120 C 200 60 360 70 520 100 S 860 40 1040 80 S 1320 60 1440 90 V200 H0Z" fill="rgba(169,195,160,.08)" />
        <path d="M0 160 C 240 120 480 130 720 150 S 1200 120 1440 140 V200 H0Z" fill="rgba(169,195,160,.10)" />
      </svg>
    </section>
  );
}
