import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Env } from './env';

export type DbClients = {
  /** Publishable key: row-level security applies, as for a website visitor. Null until Supabase is configured. */
  public: SupabaseClient | null;
  /** Secret key: bypasses row-level security. Only for trusted server work (payments, webhooks, admin). */
  admin: SupabaseClient | null;
};

const serverAuth = { auth: { persistSession: false, autoRefreshToken: false } } as const;

export function createDbClients(env: Env): DbClients {
  const url = env.SUPABASE_URL;
  return {
    public: url && env.SUPABASE_PUBLISHABLE_KEY ? createClient(url, env.SUPABASE_PUBLISHABLE_KEY, serverAuth) : null,
    admin: url && env.SUPABASE_SECRET_KEY ? createClient(url, env.SUPABASE_SECRET_KEY, serverAuth) : null,
  };
}
