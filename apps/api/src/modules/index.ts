import type { FastifyInstance } from 'fastify';
import { contentRoutes } from './content/content.routes';
import { healthRoutes } from './health/health.routes';

/** Every feature module is registered here. Feature routes live under /v1. */
export async function registerModules(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(contentRoutes, { prefix: '/v1' });
}
