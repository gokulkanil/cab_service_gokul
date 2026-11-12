import { describe, expect, it } from 'vitest';
import { loadEnv } from '../../src/config/env';

describe('API environment settings', () => {
  it('uses safe defaults for development', () => {
    const config = loadEnv({});
    expect(config).toMatchObject({ NODE_ENV: 'development', PORT: 4000, CORS_ORIGINS: ['http://localhost:3000'] });
    expect(config.SUPABASE_URL).toBeUndefined();
  });

  it('reads a list of allowed origins', () => {
    expect(loadEnv({ CORS_ORIGINS: 'https://a.example, https://b.example' }).CORS_ORIGINS).toEqual([
      'https://a.example',
      'https://b.example',
    ]);
  });

  it('treats blank values as not set', () => {
    expect(loadEnv({ SUPABASE_URL: '', SUPABASE_PUBLISHABLE_KEY: '', PORT: '' }).PORT).toBe(4000);
  });

  it('needs the Supabase URL and publishable key together', () => {
    expect(() => loadEnv({ SUPABASE_URL: 'https://x.supabase.co' })).toThrow(/together/);
  });

  it('refuses to start in production without a database', () => {
    expect(() => loadEnv({ NODE_ENV: 'production' })).toThrow(/required in production/);
  });

  it('rejects a bad port', () => {
    expect(() => loadEnv({ PORT: 'eighty' })).toThrow(/PORT/);
  });
});
