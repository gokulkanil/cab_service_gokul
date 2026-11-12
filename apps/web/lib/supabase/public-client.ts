import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Supabase settings from the environment, or null when no project is connected yet. */
export function getSupabaseConfig(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

/**
 * Server-side client for public content. Uses the publishable key, so row-level
 * security decides what it can read (active rows only).
 */
export function createPublicClient(): SupabaseClient {
  const config = getSupabaseConfig();
  if (!config) throw new Error('Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  return createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
