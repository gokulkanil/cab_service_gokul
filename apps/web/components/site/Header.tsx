import type { SiteSettings } from '@wcs/shared';
import { telHref } from '@/lib/format';
import { BusinessName } from './BusinessName';
import { BrandMark, PhoneIcon } from './icons';

export function Header({ settings, showFleetLink }: { settings: SiteSettings; showFleetLink: boolean }) {
  return (
    <header className="site-header" id="header">
      <div className="container header-inner">
        <a href="#top" className="brand" aria-label={`${settings.businessName}, back to top`}>
          <BrandMark />
          <BusinessName name={settings.businessName} />
        </a>

        <nav className="nav" id="nav" aria-label="Main">
          <a href="#services">Services</a>
          <a href="#journey">The Churam</a>
          <a href="#destinations">Destinations</a>
          {showFleetLink ? <a href="#fleet">Our Cab</a> : null}
          <a href="#faq">FAQ</a>
          <a className="btn btn-gold nav-cta" href={telHref(settings.phoneE164)}>
            <PhoneIcon />
            Call now
          </a>
        </nav>

        <button className="menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="nav">
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
