import type { FastifyPluginAsync } from 'fastify';
import { HealthController } from './health.controller';

export const healthRoutes: FastifyPluginAsync = async (app) => {
  const controller = new HealthController(app.db);

  app.get('/health', { config: { rateLimit: false } }, controller.check);
};
