import { z } from 'zod';

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    HOST: z.string().default('0.0.0.0'),
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
    CORS_ORIGINS: z
      .string()
      .default('http://localhost:3000')
      .transform((value) =>
        value
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean),
      ),
    RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(120),
    SUPABASE_URL: z.url().optional(),
    SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
    SUPABASE_SECRET_KEY: z.string().min(1).optional(),
  })
  .superRefine((env, ctx) => {
    if (Boolean(env.SUPABASE_URL) !== Boolean(env.SUPABASE_PUBLISHABLE_KEY)) {
      ctx.addIssue({
        code: 'custom',
        path: ['SUPABASE_URL'],
        message: 'Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY together',
      });
    }
    if (env.SUPABASE_SECRET_KEY && !env.SUPABASE_URL) {
      ctx.addIssue({ code: 'custom', path: ['SUPABASE_SECRET_KEY'], message: 'SUPABASE_SECRET_KEY needs SUPABASE_URL' });
    }
    if (env.NODE_ENV === 'production' && !env.SUPABASE_URL) {
      // Never serve seed content from a live server.
      ctx.addIssue({ code: 'custom', path: ['SUPABASE_URL'], message: 'Supabase is required in production' });
    }
  });

export type Env = z.infer<typeof schema>;

/** Reads and checks environment variables. Blank values count as not set. */
export function loadEnv(env: Record<string, string | undefined> = process.env): Env {
  const present = Object.fromEntries(Object.entries(env).filter(([, value]) => value !== undefined && value !== ''));
  const result = schema.safeParse(present);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `  - ${issue.path.join('.') || 'env'}: ${issue.message}`);
    throw new Error(`Invalid API configuration:\n${problems.join('\n')}`);
  }
  return result.data;
}
