// Reads home-page content from supabase/seed/content.json (the @wcs/db package).
// Used until a Supabase project is connected, so the site and API run on day one
// with the same data the database will be seeded with.

import seed from '@wcs/db/seed/content.json' with { type: 'json' };
import type { BoardRoute, HomeContent } from './types';

type SeedPlace = (typeof seed.places)[number] & {
  shortName?: string;
  code?: string;
  region?: string;
  description?: string;
  tagLabel?: string;
  colorFrom?: string;
  colorTo?: string;
  imagePath?: string;
  isTransferHub?: boolean;
  categories?: string[];
};

const bySort = <T extends { sortOrder: number }>(a: T, b: T) => a.sortOrder - b.sortOrder;

export function getHomeContentFromSeed(): HomeContent {
  const places = [...(seed.places as SeedPlace[])].sort(bySort);
  const placeBySlug = new Map(places.map((p) => [p.slug, p]));
  const categories = [...seed.vehicleCategories];

  const featured = [...seed.vehicles]
    .filter((v) => v.status === 'active')
    .sort(bySort)
    .find((v) => v.isFeatured);
  const featuredCategory = featured && categories.find((c) => c.slug === featured.category);

  // The board shows routes from the origin of the first route (Kalpetta today).
  const routes = [...seed.routes].sort(bySort);
  const origin = routes[0]?.from;
  const boardRoutes: BoardRoute[] = routes
    .filter((r) => r.from === origin)
    .map((r) => ({ boardLabel: r.boardLabel, viaNote: r.viaNote, durationMinutes: r.durationMinutes }));

  return {
    settings: { ...seed.siteSettings },
    featuredVehicle:
      featured && featuredCategory
        ? {
            slug: featured.slug,
            make: featured.make,
            model: featured.model,
            categoryName: featuredCategory.name,
            seats: featuredCategory.seats,
            luggageBags: featuredCategory.luggageBags,
            hasAc: featuredCategory.hasAc,
            tagline: featured.tagline,
            description: featured.description,
            bestFor: featured.bestFor,
            imagePath: featured.imagePath ?? null,
          }
        : null,
    services: [...seed.services].sort(bySort).map((s) => ({
      slug: s.slug,
      title: s.title,
      summary: s.summary,
      icon: s.icon,
      heroLabel: s.heroLabel ?? null,
      isFeatured: s.isFeatured ?? false,
    })),
    transferHubs: places
      .filter((p) => p.isTransferHub)
      .map((p) => ({ slug: p.slug, name: p.name, code: p.code ?? null })),
    destinations: places
      .filter((p) => p.kind === 'destination')
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        shortName: p.shortName ?? p.name,
        region: p.region ?? null,
        description: p.description ?? '',
        tagLabel: p.tagLabel ?? null,
        colorFrom: p.colorFrom ?? null,
        colorTo: p.colorTo ?? null,
        imagePath: p.imagePath ?? null,
        categorySlugs: p.categories ?? [],
      })),
    destinationCategories: [...seed.placeCategories].sort(bySort).map((c) => ({ slug: c.slug, name: c.name })),
    board: origin
      ? { originName: placeBySlug.get(origin)?.name ?? origin, routes: boardRoutes }
      : null,
    tips: [...seed.travelTips].sort(bySort).map((t) => ({ title: t.title, body: t.body })),
    faqs: [...seed.faqs].sort(bySort).map((f) => ({ question: f.question, answer: f.answer })),
    features: [...seed.features].sort(bySort).map((f) => ({ title: f.title, body: f.body, icon: f.icon })),
  };
}
