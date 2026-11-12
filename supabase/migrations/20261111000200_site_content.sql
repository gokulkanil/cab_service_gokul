-- Site content that used to be hardcoded in index.html:
-- business details, the fleet, services, places (destinations, airports, towns),
-- departure-board routes, travel tips, FAQ and "why choose us".
--
-- Access rule for every table here: anyone can read active rows; only admins can write.

-- ---------------------------------------------------------------------------
-- Business details (exactly one row)
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id                smallint primary key default 1 check (id = 1),
  business_name     text not null,
  tagline           text not null,
  site_url          text not null,
  phone_e164        text not null check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  phone_display     text not null,
  whatsapp_e164     text not null check (whatsapp_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  whatsapp_message  text not null default '',
  email             text not null,
  region_label      text not null,
  service_area      text[] not null default '{}',
  address_locality  text not null,
  address_region    text not null,
  address_country   char(2) not null default 'IN',
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.site_settings is 'Single row of business details shown across the site (phone, WhatsApp, email, service area).';

-- ---------------------------------------------------------------------------
-- Fleet
-- ---------------------------------------------------------------------------
create table public.vehicle_categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  seats         smallint not null check (seats between 1 and 60),
  luggage_bags  smallint not null default 0 check (luggage_bags >= 0),
  has_ac        boolean not null default true,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on column public.vehicle_categories.seats is 'Passenger seats, not counting the driver.';
comment on column public.vehicle_categories.luggage_bags is 'Number of large suitcases the boot fits.';

create type public.vehicle_status as enum ('active', 'maintenance', 'retired');

create table public.vehicles (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.vehicle_categories (id) on delete restrict,
  slug          text not null unique,
  make          text not null,
  model         text not null,
  tagline       text not null default '',
  description   text not null default '',
  best_for      text not null default '',
  image_path    text,
  is_featured   boolean not null default false,
  status        public.vehicle_status not null default 'active',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index vehicles_category_id_idx on public.vehicles (category_id);

comment on column public.vehicles.image_path is 'Path inside the site-media storage bucket, e.g. fleet/etios.jpg.';
comment on column public.vehicles.is_featured is 'The vehicle shown in the "Our cab" section of the home page.';

-- ---------------------------------------------------------------------------
-- Places: destinations, airports, stations, towns and cities
-- ---------------------------------------------------------------------------
create type public.place_kind as enum ('destination', 'airport', 'railway_station', 'city', 'town');

create table public.place_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.place_categories is 'Destination filters on the home page (Waterfalls, Lakes & dams, ...).';

create table public.places (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  kind             public.place_kind not null,
  name             text not null,
  short_name       text,
  code             text,
  region           text,
  description      text not null default '',
  tag_label        text,
  color_from       text check (color_from ~ '^#[0-9a-fA-F]{6}$'),
  color_to         text check (color_to ~ '^#[0-9a-fA-F]{6}$'),
  image_path       text,
  latitude         numeric(9, 6) check (latitude between -90 and 90),
  longitude        numeric(9, 6) check (longitude between -180 and 180),
  is_transfer_hub  boolean not null default false,
  sort_order       integer not null default 0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index places_kind_idx on public.places (kind) where is_active;

comment on column public.places.short_name is 'Shorter label for tight spaces such as the scrolling destination strip.';
comment on column public.places.code is 'Airport or station code, e.g. CCJ.';
comment on column public.places.region is 'Nearest town shown under a destination card.';
comment on column public.places.tag_label is 'Small label on a destination card (Trek, Viewpoint, ...).';
comment on column public.places.is_transfer_hub is 'Listed on the airport and railway transfers card.';

create table public.place_category_links (
  place_id     uuid not null references public.places (id) on delete cascade,
  category_id  uuid not null references public.place_categories (id) on delete cascade,
  primary key (place_id, category_id)
);

create index place_category_links_category_id_idx on public.place_category_links (category_id);

-- ---------------------------------------------------------------------------
-- Services offered
-- ---------------------------------------------------------------------------
create table public.services (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  summary      text not null,
  icon         text not null default 'dot',
  hero_label   text,
  is_featured  boolean not null default false,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on column public.services.icon is 'Icon key mapped to an SVG in code (never raw SVG).';
comment on column public.services.hero_label is 'Short label shown as a badge in the hero; null hides it there.';
comment on column public.services.is_featured is 'Shown as the large card with the transfer hubs list.';

-- ---------------------------------------------------------------------------
-- Routes (departure board). Fixed prices join these in Phase 1.
-- ---------------------------------------------------------------------------
create table public.routes (
  id                uuid primary key default gen_random_uuid(),
  from_place_id     uuid not null references public.places (id) on delete restrict,
  to_place_id       uuid not null references public.places (id) on delete restrict,
  board_label       text not null,
  via_note          text not null default '',
  duration_minutes  integer not null check (duration_minutes > 0),
  show_on_board     boolean not null default true,
  sort_order        integer not null default 0,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (from_place_id, to_place_id),
  check (from_place_id <> to_place_id)
);

create index routes_to_place_id_idx on public.routes (to_place_id);

comment on column public.routes.board_label is 'Upper-case label on the departure board, e.g. KOZHIKODE RLY STN.';
comment on column public.routes.duration_minutes is 'Typical drive time in normal conditions.';

-- ---------------------------------------------------------------------------
-- Travel tips, FAQ, "why choose us"
-- ---------------------------------------------------------------------------
create table public.travel_tips (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text not null,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.features (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text not null,
  icon        text not null default 'dot',
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.features is 'The "Why travellers choose us" grid.';

-- ---------------------------------------------------------------------------
-- updated_at triggers and row-level security
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'vehicle_categories', 'vehicles', 'place_categories', 'places',
    'services', 'routes', 'travel_tips', 'faqs', 'features'
  ]
  loop
    execute format(
      'create trigger %1$s_set_updated_at before update on public.%1$I
         for each row execute function public.set_updated_at()', t);
  end loop;

  -- Tables with an is_active flag: public sees active rows.
  foreach t in array array[
    'site_settings', 'vehicle_categories', 'place_categories', 'places',
    'services', 'routes', 'travel_tips', 'faqs', 'features'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "Anyone reads active rows" on public.%I
         for select to anon, authenticated using (is_active)', t);
    execute format(
      'create policy "Admins manage rows" on public.%I
         for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end;
$$;

-- Vehicles use status instead of is_active.
alter table public.vehicles enable row level security;

create policy "Anyone reads active vehicles"
  on public.vehicles for select
  to anon, authenticated
  using (status = 'active');

create policy "Admins manage vehicles"
  on public.vehicles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Links are visible when both sides are visible (RLS on the joined tables applies).
alter table public.place_category_links enable row level security;

create policy "Anyone reads place category links"
  on public.place_category_links for select
  to anon, authenticated
  using (true);

create policy "Admins manage place category links"
  on public.place_category_links for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
