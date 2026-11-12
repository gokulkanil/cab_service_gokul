import type { Metadata } from 'next';
import { Contact } from '@/components/site/Contact';
import { Destinations } from '@/components/site/Destinations';
import { FaqSection } from '@/components/site/FaqSection';
import { Fleet } from '@/components/site/Fleet';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { Journey } from '@/components/site/Journey';
import { Marquee } from '@/components/site/Marquee';
import { PageEffects } from '@/components/site/PageEffects';
import { PlanTrip } from '@/components/site/PlanTrip';
import { Services } from '@/components/site/Services';
import { WhyUs } from '@/components/site/WhyUs';
import { getHomeContent } from '@/lib/content';
import { vehicleName } from '@/lib/format';

// Rebuild the page from the database at most every 5 minutes.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings, featuredVehicle } = await getHomeContent();
  const cabs = featuredVehicle ? `${featuredVehicle.hasAc ? 'air-conditioned ' : ''}${vehicleName(featuredVehicle)} cabs` : 'cabs';
  const description = `${settings.businessName}: clean, ${cabs} with local drivers. Airport and railway transfers, Wayanad sightseeing and outstation trips. Call or WhatsApp to book.`;

  return {
    metadataBase: new URL(settings.siteUrl),
    title: `${settings.businessName} | Taxi, Airport Transfers & Sightseeing in ${settings.regionLabel}`,
    description,
    alternates: { canonical: '/' },
    icons: { icon: { url: '/images/favicon.svg', type: 'image/svg+xml' } },
    openGraph: {
      type: 'website',
      title: settings.businessName,
      description: settings.tagline,
      url: '/',
      images: ['/images/og-image.jpg'],
    },
  };
}

export default async function HomePage() {
  const content = await getHomeContent();
  const { settings, featuredVehicle } = content;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: settings.businessName,
    url: `${settings.siteUrl}/`,
    areaServed: { '@type': 'Place', name: `${settings.regionLabel}, India` },
    provider: {
      '@type': 'LocalBusiness',
      name: settings.businessName,
      url: `${settings.siteUrl}/`,
      telephone: settings.phoneE164,
      email: settings.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: settings.addressLocality,
        addressRegion: settings.addressRegion,
        addressCountry: settings.addressCountry,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so content from the database can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header settings={settings} showFleetLink={Boolean(featuredVehicle)} />

      <main id="main">
        <Hero settings={settings} vehicle={featuredVehicle} services={content.services} />
        <Marquee destinations={content.destinations} />
        <Services services={content.services} hubs={content.transferHubs} settings={settings} />
        <Journey />
        <Destinations destinations={content.destinations} categories={content.destinationCategories} />
        {featuredVehicle ? <Fleet vehicle={featuredVehicle} /> : null}
        <WhyUs features={content.features} />
        <PlanTrip board={content.board} tips={content.tips} />
        <FaqSection faqs={content.faqs} settings={settings} />
        <Contact settings={settings} />
      </main>

      <Footer settings={settings} showFleetLink={Boolean(featuredVehicle)} />
      <PageEffects />
    </>
  );
}
