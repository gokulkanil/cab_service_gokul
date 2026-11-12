// The enum lists in domain.ts must match the database enums in the migrations.

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { APP_ROLES, PLACE_KINDS, VEHICLE_STATUSES } from '../src/domain';

const migrationsDir = fileURLToPath(new URL('../../../supabase/migrations/', import.meta.url));
const sql = readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .map((f) => readFileSync(migrationsDir + f, 'utf8'))
  .join('\n');

function dbEnum(name: string): string[] {
  const match = sql.match(new RegExp(`create type public\\.${name} as enum \\(([^)]*)\\)`));
  if (!match) throw new Error(`enum ${name} not found in migrations`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

describe('domain enums match the database', () => {
  it.each([
    ['app_role', APP_ROLES],
    ['vehicle_status', VEHICLE_STATUSES],
    ['place_kind', PLACE_KINDS],
  ])('%s', (name, values) => {
    expect([...values]).toEqual(dbEnum(name));
  });
});
