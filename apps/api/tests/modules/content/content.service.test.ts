import { getHomeContentFromSeed } from '@wcs/shared';
import { describe, expect, it } from 'vitest';
import { ContentRepository } from '../../../src/modules/content/content.repository';
import { ContentService } from '../../../src/modules/content/content.service';

describe('ContentService', () => {
  it('returns home content from the repository', async () => {
    const service = new ContentService(new ContentRepository(null)); // null = no database, seed file
    const content = await service.getHomeContent();
    expect(content).toEqual(getHomeContentFromSeed());
  });
});
