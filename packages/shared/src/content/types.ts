// What the public pages need from the database, in the shape the components use.
// Both content sources (Supabase and the local seed file) return exactly this.

export type SiteSettings = {
  businessName: string;
  tagline: string;
  siteUrl: string;
  phoneE164: string;
  phoneDisplay: string;
  whatsappE164: string;
  whatsappMessage: string;
  email: string;
  regionLabel: string;
  serviceArea: string[];
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
};

export type Vehicle = {
  slug: string;
  make: string;
  model: string;
  categoryName: string;
  seats: number;
  luggageBags: number;
  hasAc: boolean;
  tagline: string;
  description: string;
  bestFor: string;
  imagePath: string | null;
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  heroLabel: string | null;
  isFeatured: boolean;
};

export type PlaceCategory = {
  slug: string;
  name: string;
};

export type Destination = {
  slug: string;
  name: string;
  shortName: string;
  region: string | null;
  description: string;
  tagLabel: string | null;
  colorFrom: string | null;
  colorTo: string | null;
  imagePath: string | null;
  categorySlugs: string[];
};

export type TransferHub = {
  slug: string;
  name: string;
  code: string | null;
};

export type BoardRoute = {
  boardLabel: string;
  viaNote: string;
  durationMinutes: number;
};

export type DepartureBoard = {
  originName: string;
  routes: BoardRoute[];
};

export type TravelTip = { title: string; body: string };
export type Faq = { question: string; answer: string };
export type Feature = { title: string; body: string; icon: string };

export type HomeContent = {
  settings: SiteSettings;
  featuredVehicle: Vehicle | null;
  services: Service[];
  transferHubs: TransferHub[];
  destinations: Destination[];
  destinationCategories: PlaceCategory[];
  board: DepartureBoard | null;
  tips: TravelTip[];
  faqs: Faq[];
  features: Feature[];
};
