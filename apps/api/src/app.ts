import Fastify, { type FastifyInstance } from 'fastify';
import { createDbClients, type DbClients } from './config/database';
import type { Env } from './config/env';
import { registerErrorHandlers } from './middlewares/error-handler';
import { registerSecurity } from './middlewares/security';
import { registerModules } from './modules';

/** Builds the API without starting it (tests use this directly). */
export async function buildApp(env: Env, deps: { db?: DbClients } = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger:
      env.LOG_LEVEL === 'silent'
        ? false
        : { level: env.LOG_LEVEL, redact: ['req.headers.authorization', 'req.headers.cookie'] },
    trustProxy: true, // behind a load balancer; needed for correct client IPs in rate limiting
  });

  app.decorate('env', env);
  app.decorate('db', deps.db ?? createDbClients(env));

  await registerSecurity(app);
  registerErrorHandlers(app);
  await registerModules(app);

  return app;
}
