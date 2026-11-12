// Small helpers that turn stored values into what the page shows.

import type { TransferHub, Vehicle } from '@wcs/shared';

export function telHref(e164: string): string {
  return `tel:${e164}`;
}

export function whatsappHref(e164: string, message: string): string {
  const number = e164.replace(/^\+/, '');
  return message ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/${number}`;
}

/** 150 → "~2H30", the departure-board style. */
export function boardDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `~${h}H${String(m).padStart(2, '0')}`;
}

/** "Calicut Airport (CCJ)" or just the name when there is no code. */
export function hubLabel(hub: TransferHub): string {
  return hub.code ? `${hub.name} (${hub.code})` : hub.name;
}

export function vehicleName(v: Pick<Vehicle, 'make' | 'model'>): string {
  return `${v.make} ${v.model}`.trim();
}

export function vehicleSpecs(v: Vehicle): { label: string; value: string }[] {
  const specs = [
    { label: 'Seats', value: `${v.seats} + driver` },
    {
      label: 'Boot',
      value: v.luggageBags > 0 ? `Fits ${v.luggageBags} suitcase${v.luggageBags === 1 ? '' : 's'}` : 'Small bags only',
    },
    { label: 'Comfort', value: v.hasAc ? 'Full A/C' : 'Non A/C' },
  ];
  if (v.bestFor) specs.push({ label: 'Best for', value: v.bestFor });
  return specs;
}

/** Public URL for a file in the site-media bucket (or /public/images before Supabase is connected). */
export function mediaUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL ??
    (process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-media`
      : '/images');
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

/** Two-digit card number: 1 → "01". */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
