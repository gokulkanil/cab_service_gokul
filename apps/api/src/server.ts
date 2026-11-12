import { buildApp } from './app';
import { loadEnv } from './config/env';

// Load apps/api/.env when present (servers set real environment variables instead).
try {
  process.loadEnvFile();
} catch {
  // no .env file: fine
}

const env = loadEnv();
const app = await buildApp(env);

if (!app.db.public) {
  app.log.warn('Supabase is not configured; serving content from supabase/seed/content.json.');
}

async function shutdown(signal: string) {
  app.log.info(`${signal} received, shutting down`);
  await app.close();
  process.exit(0);
}
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

try {
  await app.listen({ host: env.HOST, port: env.PORT });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
