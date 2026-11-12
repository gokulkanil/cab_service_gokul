import type { HomeContent } from '@wcs/shared';
import type { ContentRepository } from './content.repository';

/** Business rules for site content. Knows nothing about HTTP. */
export class ContentService {
  constructor(private readonly content: ContentRepository) {}

  getHomeContent(): Promise<HomeContent> {
    return this.content.findHome();
  }
}
