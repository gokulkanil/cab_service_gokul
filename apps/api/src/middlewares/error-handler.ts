import type { FastifyError, FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error';

/** Every error response has this shape. */
export type ApiErrorBody = {
  error: { code: string; message: string; details?: { path: string; message: string }[] };
};

/** Turns thrown errors into consistent JSON and never leaks internal details. */
export function registerErrorHandlers(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError | AppError | ZodError, request, reply) => {
    // Our own expected errors (thrown by services).
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(body(error.code, error.message));
    }

    // Request validation (schemas in each module's *.schema.ts).
    if (error instanceof ZodError) {
      const details = error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
      return reply.status(400).send(body('validation_failed', 'Some details are missing or invalid.', details));
    }

    const status = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
    if (status >= 500) {
      request.log.error(error);
      return reply.status(500).send(body('internal_error', 'Something went wrong. Please try again.'));
    }
    if (status === 429) return reply.status(429).send(body('rate_limited', error.message));
    return reply.status(status).send(body(error.code ?? 'bad_request', error.message));
  });

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send(body('not_found', `No route for ${request.method} ${request.url}`));
  });
}

function body(code: string, message: string, details?: { path: string; message: string }[]): ApiErrorBody {
  return { error: details ? { code, message, details } : { code, message } };
}
