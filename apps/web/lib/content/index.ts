import { cache } from 'react';
import { loadHomeContent, type HomeContent } from '@wcs/shared';
import { createPublicClient, getSupabaseConfig } from '@/lib/supabase/public-client';

let warned = false;

/**
 * Content for the home page, read straight from Supabase (public, read-only data
 * protected by row-level security). Until Supabase is configured it comes from
 * the seed file. Cached per request so metadata and the page share one fetch.
 */
export const getHomeContent = cache(async (): Promise<HomeContent> => {
  const configured = Boolean(getSupabaseConfig());
  if (!configured && !warned) {
    warned = true;
    console.warn('[content] Supabase is not configured; serving content from supabase/seed/content.json.');
  }
  return loadHomeContent(configured ? createPublicClient() : null);
});
