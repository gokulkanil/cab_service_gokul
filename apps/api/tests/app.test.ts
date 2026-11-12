import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app';
import { loadEnv } from '../src/config/env';

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp(loadEnv({ NODE_ENV: 'test', LOG_LEVEL: 'silent', CORS_ORIGINS: 'http://localhost:3000' }));
});

afterAll(async () => {
  await app.close();
});

describe('API', () => {
  it('reports health', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ok', database: 'not_configured' });
  });

  it('serves home content (seed data when no database is configured)', async () => {
    const res = await app.inject({ method: 'GET', url: '/v1/content/home' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['cache-control']).toContain('max-age=60');
    const body = res.json();
    expect(body.featuredVehicle).toMatchObject({ make: 'Toyota', model: 'Etios' });
    expect(body.destinations).toHaveLength(10);
  });

  it('returns JSON errors for unknown routes', async () => {
    const res = await app.inject({ method: 'GET', url: '/nope' });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: { code: 'not_found', message: 'No route for GET /nope' } });
  });

  it('allows the website origin and refuses others', async () => {
    const preflight = (origin: string) =>
      app.inject({
        method: 'OPTIONS',
        url: '/v1/content/home',
        headers: { origin, 'access-control-request-method': 'GET' },
      });

    expect((await preflight('http://localhost:3000')).headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect((await preflight('https://evil.example')).headers['access-control-allow-origin']).toBeUndefined();
  });

  it('sends security headers', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('hides internal error details', async () => {
    const failing = await buildApp(loadEnv({ NODE_ENV: 'test', LOG_LEVEL: 'silent' }));
    failing.get('/boom', async () => {
      throw new Error('database password is hunter2');
    });
    const res = await failing.inject({ method: 'GET', url: '/boom' });
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ error: { code: 'internal_error', message: 'Something went wrong. Please try again.' } });
    await failing.close();
  });

  it('rate-limits a flood of requests', async () => {
    const limited = await buildApp(loadEnv({ NODE_ENV: 'test', LOG_LEVEL: 'silent', RATE_LIMIT_PER_MINUTE: '2' }));
    for (let i = 0; i < 2; i++) await limited.inject({ method: 'GET', url: '/v1/content/home' });
    const res = await limited.inject({ method: 'GET', url: '/v1/content/home' });
    expect(res.statusCode).toBe(429);
    expect(res.json().error.code).toBe('rate_limited');
    await limited.close();
  });
});
