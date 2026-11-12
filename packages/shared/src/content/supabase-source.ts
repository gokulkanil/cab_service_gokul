// Reads home-page content from Supabase. Row-level security returns active rows only.
// Row types are written by hand for now; replace them with generated types
// (`supabase gen types typescript`) once the project exists.

import type { SupabaseClient } from '@supabase/supabase-js';
import type { HomeContent } from './types';

type SettingsRow = {
  business_name: string;
  tagline: string;
  site_url: string;
  phone_e164: string;
  phone_display: string;
  whatsapp_e164: string;
  whatsapp_message: string;
  email: string;
  region_label: string;
  service_area: string[];
  address_locality: string;
  address_region: string;
  address_country: string;
};

type VehicleRow = {
  slug: string;
  make: string;
  model: string;
  tagline: string;
  description: string;
  best_for: string;
  image_path: string | null;
  category: { name: string; seats: number; luggage_bags: number; has_ac: boolean } | null;
};

type ServiceRow = {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  hero_label: string | null;
  is_featured: boolean;
};

type PlaceRow = {
  slug: string;
  kind: string;
  name: string;
  short_name: string | null;
  code: string | null;
  region: string | null;
  description: string;
  tag_label: string | null;
  color_from: string | null;
  color_to: string | null;
  image_path: string | null;
  is_transfer_hub: boolean;
  links: { category: { slug: string } | null }[];
};

type RouteRow = {
  board_label: string;
  via_note: string;
  duration_minutes: number;
  origin: { name: string } | null;
  destination: { slug: string } | null;
};

type CategoryRow = { slug: string; name: string };
type TipRow = { title: string; body: string };
type FaqRow = { question: string; answer: string };
type FeatureRow = { title: string; body: string; icon: string };

/** Throws on a query error so a broken database never shows as an empty page. */
function rowsOf<T>(label: string, result: { data: unknown; error: { message: string } | null }): T {
  if (result.error) throw new Error(`Could not load ${label}: ${result.error.message}`);
  return result.data as T;
}

export async function getHomeContentFromSupabase(db: SupabaseClient): Promise<HomeContent> {
  const [settingsRes, vehicleRes, servicesRes, placesRes, categoriesRes, routesRes, tipsRes, faqsRes, featuresRes] =
    await Promise.all([
      db
        .from('site_settings')
        .select('business_name, tagline, site_url, phone_e164, phone_display, whatsapp_e164, whatsapp_message, email, region_label, service_area, address_locality, address_region, address_country')
        .eq('id', 1)
        .single(),
      db
        .from('vehicles')
        .select('slug, make, model, tagline, description, best_for, image_path, category:vehicle_categories!inner(name, seats, luggage_bags, has_ac)')
        .eq('is_featured', true)
        .order('sort_order')
        .limit(1)
        .maybeSingle(),
      db.from('services').select('slug, title, summary, icon, hero_label, is_featured').order('sort_order'),
      db
        .from('places')
        .select('slug, kind, name, short_name, code, region, description, tag_label, color_from, color_to, image_path, is_transfer_hub, links:place_category_links(category:place_categories(slug))')
        .order('sort_order'),
      db.from('place_categories').select('slug, name').order('sort_order'),
      db
        .from('routes')
        .select('board_label, via_note, duration_minutes, origin:places!routes_from_place_id_fkey(name), destination:places!routes_to_place_id_fkey(slug)')
        .eq('show_on_board', true)
        .order('sort_order'),
      db.from('travel_tips').select('title, body').order('sort_order'),
      db.from('faqs').select('question, answer').order('sort_order'),
      db.from('features').select('title, body, icon').order('sort_order'),
    ]);

  const s = rowsOf<SettingsRow>('site settings', settingsRes);
  const vehicle = rowsOf<VehicleRow | null>('featured vehicle', vehicleRes);
  const places = rowsOf<PlaceRow[]>('places', placesRes);

  // Hidden places come back as null through RLS; drop routes that point at them.
  const routes = rowsOf<RouteRow[]>('routes', routesRes).filter((r) => r.origin && r.destination);
  const originName = routes[0]?.origin?.name;

  return {
    settings: {
      businessName: s.business_name,
      tagline: s.tagline,
      siteUrl: s.site_url,
      phoneE164: s.phone_e164,
      phoneDisplay: s.phone_display,
      whatsappE164: s.whatsapp_e164,
      whatsappMessage: s.whatsapp_message,
      email: s.email,
      regionLabel: s.region_label,
      serviceArea: s.service_area,
      addressLocality: s.address_locality,
      addressRegion: s.address_region,
      addressCountry: s.address_country,
    },
    featuredVehicle:
      vehicle && vehicle.category
        ? {
            slug: vehicle.slug,
            make: vehicle.make,
            model: vehicle.model,
            categoryName: vehicle.category.name,
            seats: vehicle.category.seats,
            luggageBags: vehicle.category.luggage_bags,
            hasAc: vehicle.category.has_ac,
            tagline: vehicle.tagline,
            description: vehicle.description,
            bestFor: vehicle.best_for,
            imagePath: vehicle.image_path,
          }
        : null,
    services: rowsOf<ServiceRow[]>('services', servicesRes).map((r) => ({
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      icon: r.icon,
      heroLabel: r.hero_label,
      isFeatured: r.is_featured,
    })),
    transferHubs: places
      .filter((p) => p.is_transfer_hub)
      .map((p) => ({ slug: p.slug, name: p.name, code: p.code })),
    destinations: places
      .filter((p) => p.kind === 'destination')
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        shortName: p.short_name ?? p.name,
        region: p.region,
        description: p.description,
        tagLabel: p.tag_label,
        colorFrom: p.color_from,
        colorTo: p.color_to,
        imagePath: p.image_path,
        categorySlugs: p.links.flatMap((l) => (l.category ? [l.category.slug] : [])),
      })),
    destinationCategories: rowsOf<CategoryRow[]>('destination categories', categoriesRes),
    board: originName
      ? {
          originName,
          routes: routes
            .filter((r) => r.origin?.name === originName)
            .map((r) => ({ boardLabel: r.board_label, viaNote: r.via_note, durationMinutes: r.duration_minutes })),
        }
      : null,
    tips: rowsOf<TipRow[]>('travel tips', tipsRes),
    faqs: rowsOf<FaqRow[]>('FAQ', faqsRes),
    features: rowsOf<FeatureRow[]>('features', featuresRes),
  };
}
