# Photos

Each photo's path is stored with its record in the database (`places.image_path`, `vehicles.image_path`).
Until a photo exists, its card shows the built-in coloured artwork, so nothing looks broken.

Where to put the files:

- **Before Supabase is connected:** in `apps/web/public/images/` using the paths below (e.g. `apps/web/public/images/destinations/edakkal-caves.jpg`).
- **After:** upload them to the `site-media` storage bucket using the same paths (e.g. `destinations/edakkal-caves.jpg`).

Tips: landscape or portrait JPGs about 1200–1600 px wide, compressed to under ~300 KB each. The bucket accepts JPG, PNG and WebP up to 5 MB.

## Destinations (`destinations/`): portrait (4:5) works best

- edakkal-caves.jpg
- banasura-sagar-dam.jpg
- chembra-peak.jpg
- pookode-lake.jpg
- soochipara-falls.jpg
- kuruva-island.jpg
- thirunelli-temple.jpg
- muthanga-wildlife-sanctuary.jpg
- lakkidi-viewpoint.jpg
- meenmutty-falls.jpg

## Fleet (`fleet/`): landscape (4:3)

- etios.jpg: your Etios cab, ideally on a Wayanad road. Covers the illustrated car.

## Sharing preview (always `apps/web/public/images/`)

- og-image.jpg: 1200 × 630 image shown when the link is shared on WhatsApp, Facebook, etc.
