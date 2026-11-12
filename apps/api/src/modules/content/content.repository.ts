import type { SupabaseClient } from '@supabase/supabase-js';
import { loadHomeContent, type HomeContent } from '@wcs/shared';

/**
 * Data access for site content. The queries live in @wcs/shared because the
 * website runs the same ones; with no database connected they read the seed file.
 */
export class ContentRepository {
  constructor(private readonly db: SupabaseClient | null) {}

  findHome(): Promise<HomeContent> {
    return loadHomeContent(this.db);
  }
}
