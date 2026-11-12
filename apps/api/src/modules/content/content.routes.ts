import type { FastifyPluginAsync } from 'fastify';
import { ContentController } from './content.controller';
import { ContentRepository } from './content.repository';
import { ContentService } from './content.service';

/**
 * Public site content for apps that cannot read Supabase directly (future mobile apps).
 * The website itself reads this content straight from Supabase.
 */
export const contentRoutes: FastifyPluginAsync = async (app) => {
  const controller = new ContentController(new ContentService(new ContentRepository(app.db.public)));

  app.get('/content/home', controller.getHome);
};
