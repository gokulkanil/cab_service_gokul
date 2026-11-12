import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';

/** Security headers, CORS limited to the website's origins, and per-IP rate limiting. */
export async function registerSecurity(app: FastifyInstance) {
  await app.register(helmet);
  await app.register(cors, {
    origin: app.env.CORS_ORIGINS,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });
  await app.register(rateLimit, {
    max: app.env.RATE_LIMIT_PER_MINUTE,
    timeWindow: '1 minute',
  });
}
