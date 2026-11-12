import { describe, expect, it } from 'vitest';
import { boardDuration, hubLabel, pad2, telHref, vehicleSpecs, whatsappHref } from '@/lib/format';
import type { Vehicle } from '@wcs/shared';

const etios: Vehicle = {
  slug: 'toyota-etios',
  make: 'Toyota',
  model: 'Etios',
  categoryName: 'Sedan',
  seats: 4,
  luggageBags: 3,
  hasAc: true,
  tagline: '',
  description: '',
  bestFor: 'Families & airport runs',
  imagePath: null,
};

describe('format helpers', () => {
  it('formats board durations like the departure board', () => {
    expect(boardDuration(150)).toBe('~2H30');
    expect(boardDuration(180)).toBe('~3H00');
    expect(boardDuration(45)).toBe('~0H45');
  });

  it('builds phone and WhatsApp links', () => {
    expect(telHref('+919000000000')).toBe('tel:+919000000000');
    expect(whatsappHref('+919000000000', 'Hi, book a cab')).toBe('https://wa.me/919000000000?text=Hi%2C%20book%20a%20cab');
    expect(whatsappHref('+919000000000', '')).toBe('https://wa.me/919000000000');
  });

  it('labels transfer hubs with their code when present', () => {
    expect(hubLabel({ slug: 'ccj', name: 'Calicut Airport', code: 'CCJ' })).toBe('Calicut Airport (CCJ)');
    expect(hubLabel({ slug: 'mysuru', name: 'Mysuru', code: null })).toBe('Mysuru');
  });

  it('derives the spec list from vehicle data', () => {
    expect(vehicleSpecs(etios)).toEqual([
      { label: 'Seats', value: '4 + driver' },
      { label: 'Boot', value: 'Fits 3 suitcases' },
      { label: 'Comfort', value: 'Full A/C' },
      { label: 'Best for', value: 'Families & airport runs' },
    ]);
    expect(vehicleSpecs({ ...etios, luggageBags: 1, hasAc: false, bestFor: '' })).toEqual([
      { label: 'Seats', value: '4 + driver' },
      { label: 'Boot', value: 'Fits 1 suitcase' },
      { label: 'Comfort', value: 'Non A/C' },
    ]);
  });

  it('pads card numbers', () => {
    expect(pad2(1)).toBe('01');
    expect(pad2(10)).toBe('10');
  });
});
