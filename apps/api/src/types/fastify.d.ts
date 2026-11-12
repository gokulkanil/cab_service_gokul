import 'fastify';
import type { DbClients } from '../config/database';
import type { Env } from '../config/env';

declare module 'fastify' {
  interface FastifyInstance {
    env: Env;
    db: DbClients;
  }
}
