import type { SiteSettings } from '@wcs/shared';
import { telHref, whatsappHref } from '@/lib/format';
import { BusinessName } from './BusinessName';

export function Footer({ settings, showFleetLink }: { settings: SiteSettings; showFleetLink: boolean }) {
  const domain = settings.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return (
    <>
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <BusinessName name={settings.businessName} />
            <p>{settings.tagline}</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <a href="#services">Services</a>
            <a href="#destinations">Destinations</a>
            {showFleetLink ? <a href="#fleet">Our Cab</a> : null}
            <a href="#plan">Plan your trip</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
        <div className="container footer-base">
          <span>
            © <span id="year">{new Date().getFullYear()}</span> {settings.businessName}
          </span>
          <span>{domain}</span>
        </div>
      </footer>

      {/* Sticky call/WhatsApp bar on phones */}
      <div className="mobile-bar" id="mobileBar">
        <a className="btn btn-gold" href={telHref(settings.phoneE164)}>
          Call now
        </a>
        <a
          className="btn btn-outline-light"
          href={whatsappHref(settings.whatsappE164, settings.whatsappMessage)}
          target="_blank"
          rel="noopener"
        >
          WhatsApp
        </a>
      </div>
    </>
  );
}
