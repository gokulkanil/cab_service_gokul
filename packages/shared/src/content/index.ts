import type { SupabaseClient } from '@supabase/supabase-js';
import { getHomeContentFromSeed } from './seed-source';
import { getHomeContentFromSupabase } from './supabase-source';
import type { HomeContent } from './types';

export * from './types';
export { getHomeContentFromSeed } from './seed-source';
export { getHomeContentFromSupabase } from './supabase-source';

/**
 * Home-page content from Supabase, or from the seed file when no database is
 * connected yet (pass null). Both return the same shape.
 */
export function loadHomeContent(db: SupabaseClient | null): Promise<HomeContent> {
  return db ? getHomeContentFromSupabase(db) : Promise.resolve(getHomeContentFromSeed());
}
