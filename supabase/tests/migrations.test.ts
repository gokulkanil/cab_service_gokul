// Runs every migration and the generated seed against an in-memory Postgres (PGlite)
// with a minimal stand-in for Supabase's auth and storage schemas, then checks
// the data and the row-level security rules.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const dbDir = fileURLToPath(new URL('..', import.meta.url)); // the supabase/ folder
const migrationsDir = join(dbDir, 'migrations');

// The parts of Supabase the migrations depend on.
const supabaseStub = `
create role anon nologin;
create role authenticated nologin;
grant usage on schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on functions to anon, authenticated;

create schema auth;
create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  phone text,
  raw_user_meta_data jsonb not null default '{}'
);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to anon, authenticated;

create schema storage;
create table storage.buckets (
  id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]
);
create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
alter table storage.objects enable row level security;
`;

let db: PGlite;

async function count(table: string): Promise<number> {
  const res = await db.query<{ n: number }>(`select count(*)::int as n from ${table}`);
  return res.rows[0].n;
}

/** Run fn as a Supabase role, optionally as a signed-in user. */
async function as<T>(role: 'anon' | 'authenticated', userId: string | null, fn: () => Promise<T>): Promise<T> {
  await db.exec(`set role ${role}`);
  await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [userId ?? '']);
  try {
    return await fn();
  } finally {
    await db.exec('reset role');
    await db.query(`select set_config('request.jwt.claim.sub', '', false)`);
  }
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(supabaseStub);
  for (const file of readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()) {
    await db.exec(readFileSync(join(migrationsDir, file), 'utf8'));
  }
  const seed = readFileSync(join(dbDir, 'seed.sql'), 'utf8');
  await db.exec(seed);
  await db.exec(seed); // running it twice must not duplicate anything
});

afterAll(async () => {
  await db?.close();
});

describe('migrations and seed', () => {
  it('loads all content exactly once', async () => {
    expect(await count('public.site_settings')).toBe(1);
    expect(await count('public.vehicle_categories')).toBe(1);
    expect(await count('public.vehicles')).toBe(1);
    expect(await count('public.place_categories')).toBe(5);
    expect(await count('public.places')).toBe(19);
    expect(await count('public.place_category_links')).toBe(11);
    expect(await count('public.services')).toBe(5);
    expect(await count('public.routes')).toBe(8);
    expect(await count('public.travel_tips')).toBe(5);
    expect(await count('public.faqs')).toBe(6);
    expect(await count('public.features')).toBe(6);
    expect(await count('storage.buckets')).toBe(1);
  });

  it('links the Etios to the sedan category', async () => {
    const res = await db.query<{ make: string; seats: number }>(
      `select v.make, c.seats from public.vehicles v join public.vehicle_categories c on c.id = v.category_id`,
    );
    expect(res.rows).toEqual([{ make: 'Toyota', seats: 4 }]);
  });
});

describe('row-level security', () => {
  it('shows visitors active rows only', async () => {
    await db.exec(`update public.faqs set is_active = false where sort_order = 6`);
    expect(await as('anon', null, () => count('public.faqs'))).toBe(5);
    await db.exec(`update public.faqs set is_active = true where sort_order = 6`);
    expect(await as('anon', null, () => count('public.faqs'))).toBe(6);
  });

  it('stops visitors from changing content', async () => {
    await expect(
      as('anon', null, () => db.query(`insert into public.faqs (question, answer) values ('x', 'y')`)),
    ).rejects.toThrow();
  });

  it('creates a customer profile on sign-up and blocks self-promotion to admin', async () => {
    const user = await db.query<{ id: string }>(`insert into auth.users (phone) values ('+919111111111') returning id`);
    const userId = user.rows[0].id;

    const profile = await db.query<{ role: string }>(`select role from public.profiles where id = $1`, [userId]);
    expect(profile.rows[0].role).toBe('customer');

    await expect(
      as('authenticated', userId, () => db.query(`update public.profiles set role = 'admin' where id = $1`, [userId])),
    ).rejects.toThrow(/Only admins/);

    await expect(
      as('authenticated', userId, () => db.query(`insert into public.faqs (question, answer) values ('x', 'y')`)),
    ).rejects.toThrow();
  });

  it('lets admins manage content, including hidden rows', async () => {
    const user = await db.query<{ id: string }>(`insert into auth.users (email) values ('owner@example.com') returning id`);
    const adminId = user.rows[0].id;
    await db.query(`update public.profiles set role = 'admin' where id = $1`, [adminId]);

    await as('authenticated', adminId, async () => {
      await db.query(`insert into public.faqs (question, answer, sort_order, is_active) values ('Draft?', 'Not yet.', 7, false)`);
    });
    expect(await as('authenticated', adminId, () => count('public.faqs'))).toBe(7);
    expect(await as('anon', null, () => count('public.faqs'))).toBe(6);
  });
});
