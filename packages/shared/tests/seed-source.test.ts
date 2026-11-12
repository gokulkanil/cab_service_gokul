import { describe, expect, it } from 'vitest';
import { getHomeContentFromSeed } from '../src/content/seed-source';

describe('home content from the seed file', () => {
  const content = getHomeContentFromSeed();

  it('features the Etios with its category details', () => {
    expect(content.featuredVehicle).toMatchObject({ make: 'Toyota', model: 'Etios', categoryName: 'Sedan', seats: 4 });
  });

  it('lists the 10 destinations in order with their filter categories', () => {
    expect(content.destinations).toHaveLength(10);
    expect(content.destinations[0]).toMatchObject({ name: 'Edakkal Caves', categorySlugs: ['heritage', 'treks'] });
    expect(content.destinations[1].shortName).toBe('Banasura Sagar');
  });

  it('builds the departure board from Kalpetta', () => {
    expect(content.board?.originName).toBe('Kalpetta');
    expect(content.board?.routes.map((r) => r.boardLabel)).toEqual([
      'KOZHIKODE RLY STN',
      'CALICUT AIRPORT',
      'KANNUR AIRPORT',
      'MYSURU',
      'OOTY',
      'COORG',
      'BENGALURU',
      'KOCHI',
    ]);
  });

  it('lists the transfer hubs shown on the airport card', () => {
    expect(content.transferHubs.map((h) => h.name)).toEqual([
      'Calicut Airport',
      'Kannur Airport',
      'Kozhikode Railway Station',
      'Mysuru',
      'Bengaluru',
    ]);
  });

  it('has one featured service and three hero badges', () => {
    expect(content.services.filter((s) => s.isFeatured)).toHaveLength(1);
    expect(content.services.filter((s) => s.heroLabel)).toHaveLength(3);
  });

  it('carries every FAQ, tip and feature', () => {
    expect(content.faqs).toHaveLength(6);
    expect(content.tips).toHaveLength(5);
    expect(content.features).toHaveLength(6);
  });
});
