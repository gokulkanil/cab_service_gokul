# Wayanad Cab Service

Booking platform for [wayanadcabservice.com](https://wayanadcabservice.com). One repository with separate folders for the website, the backend API, shared code and the database. The full plan lives in the "Cab & Travel Platform — Full-Stack Expansion Plan" doc.

**Status: Phase 0 (foundations).** The original landing page is now a Next.js app, its content lives in the database, and the backend API is set up and ready for Phase 1 (quotes, bookings, payments).

## Layout

```
apps/
  web/          Next.js website (and later the admin panel)
  api/          Fastify backend API
packages/
  shared/       code used by both: content types and loading, domain enums
supabase/       database: migrations, seed content, database tests
legacy-static-site/   the original HTML page, for reference; safe to delete
```

Who does what:

- **Website** reads public content (cab, destinations, FAQ) straight from Supabase. Those reads are protected by row-level security and keep pages fast and good for search.
- **API** handles everything that changes data or moves money: quotes, bookings, payments, refunds, Razorpay webhooks, driver actions (from Phase 1). It also serves content to future mobile apps (`GET /v1/content/home`).
- **Shared** keeps types and rules in one place so the website and API never disagree.

## Run it

Requires Node.js 20.9 or newer. Run all commands from the repository root.

```bash
npm install
npm run dev          # website on http://localhost:3000 and API on http://localhost:4000
npm run dev:web      # website only
npm run dev:api      # API only
```

No database is needed yet: without Supabase settings, both the website and the API serve `supabase/seed/content.json`, the same data the database is seeded with. In production the API refuses to start without Supabase.

```bash
npm test             # all workspaces: API, website, shared, and database (in-memory Postgres)
npm run typecheck
npm run build        # website (.next) and API (apps/api/dist/server.js)
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Liveness check for uptime monitors |
| GET | `/v1/content/home` | Home-page content (for mobile apps) |

Errors always look like `{ "error": { "code": "not_found", "message": "..." } }`; invalid input also lists `details` per field. Built in: security headers, CORS limited to the website's origins, rate limiting per IP, environment variables checked at startup. Settings are listed in [apps/api/.env.example](apps/api/.env.example).

### Backend architecture (MVC, grouped by feature)

Each feature is a folder in `apps/api/src/modules/` with the same layers:

```
apps/api/src/
  modules/
    bookings/                  (example: Phase 1)
      bookings.routes.ts       URLs → controller methods
      bookings.controller.ts   HTTP only: read request, validate, call service, send response
      bookings.service.ts      business rules; no HTTP, no SQL
      bookings.repository.ts   data access; the only layer that queries the database
      bookings.schema.ts       Zod schemas for request bodies and query strings
    content/                   built: routes, controller, service, repository
    health/                    built: routes, controller
    index.ts                   registers every module
  config/                      env.ts (settings checked at startup), database.ts (Supabase clients)
  middlewares/                 security.ts (headers, CORS, rate limit), error-handler.ts
  utils/                       app-error.ts (AppError.notFound(...), .badRequest(...), ...)
  types/                       Fastify type additions
  app.ts                       builds the app (used by tests)
  server.ts                    starts it
```

Rules:

- Requests flow one way: routes → controller → service → repository → database.
- Services throw `AppError` for expected failures (`AppError.notFound('booking_not_found', '...')`); the error handler turns it into JSON. Invalid input (Zod) becomes a 400 with field details automatically.
- Tests mirror the source layout in `apps/api/tests/`.

The website (`apps/web`) follows Next.js conventions instead: `app/` holds pages, `components/` the views, `lib/` data loading and helpers.

## Connect the database (when ready)

1. Create a Supabase project (region: Mumbai, `ap-south-1`).
2. Run the SQL files in `supabase/migrations/` in order, then `supabase/seed.sql`, either in the dashboard's SQL editor or with the Supabase CLI (`supabase link`, then `supabase db push --include-seed`).
3. Website: copy `apps/web/.env.example` to `apps/web/.env.local` and fill in the URL and publishable key.
4. API: copy `apps/api/.env.example` to `apps/api/.env` and fill in the URL, publishable key and secret key.
5. Upload photos to the `site-media` storage bucket using the paths in `PHOTOS.md`.
6. Make yourself admin: after signing up once, run `update public.profiles set role = 'admin' where email = '<you>';` in the SQL editor.

## Where content lives

| Content | Table |
| --- | --- |
| Business name, phone, WhatsApp, email, service area | `site_settings` (one row) |
| The cab and its specs | `vehicles` + `vehicle_categories` |
| Services and hero badges | `services` |
| Destinations, airports, stations, towns | `places` + `place_categories` |
| Departure board | `routes` |
| Travel tips, FAQ, "why choose us" | `travel_tips`, `faqs`, `features` |

Anyone can read active rows; only admins can change them. Page headings, hero copy and the Churam animation text stay in code.

To change the starting content, edit `supabase/seed/content.json` and run `npm run db:seed-sql` to regenerate `supabase/seed.sql`. Once the database is live, edit content there instead (an admin panel comes in Phase 1).

## Before going live

- Replace the placeholder phone number `+91 90000 00000` (in `site_settings`, or `content.json` before the database exists).
- Confirm the email address `hello@wayanadcabservice.com`.
- Add photos (see `PHOTOS.md`).
