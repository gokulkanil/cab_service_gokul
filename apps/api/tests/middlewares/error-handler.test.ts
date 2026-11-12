import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { buildApp } from '../../src/app';
import { loadEnv } from '../../src/config/env';
import { AppError } from '../../src/utils/app-error';

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp(loadEnv({ NODE_ENV: 'test', LOG_LEVEL: 'silent' }));
  app.get('/missing-booking', async () => {
    throw AppError.notFound('booking_not_found', 'No booking with that code.');
  });
  app.post('/needs-validation', async (request) => {
    z.object({ pax: z.number().int().min(1) }).parse(request.body);
    return { ok: true };
  });
});

afterAll(async () => {
  await app.close();
});

describe('error handling', () => {
  it('sends expected errors from services with their status and code', async () => {
    const res = await app.inject({ method: 'GET', url: '/missing-booking' });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: { code: 'booking_not_found', message: 'No booking with that code.' } });
  });

  it('reports invalid input field by field', async () => {
    const res = await app.inject({ method: 'POST', url: '/needs-validation', payload: { pax: 0 } });
    expect(res.statusCode).toBe(400);
    const body = res.json();
    expect(body.error.code).toBe('validation_failed');
    expect(body.error.details).toEqual([{ path: 'pax', message: expect.any(String) }]);
  });
});
