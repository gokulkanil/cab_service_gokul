/**
 * An expected failure with a status code and a stable code for callers,
 * e.g. throw AppError.notFound('booking_not_found', 'No booking with that code').
 * Services throw these; the error handler turns them into JSON responses.
 */
export class AppError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(code: string, message: string) {
    return new AppError(400, code, message);
  }

  static unauthorized(message = 'Please sign in to continue.') {
    return new AppError(401, 'unauthorized', message);
  }

  static forbidden(message = 'You do not have access to this.') {
    return new AppError(403, 'forbidden', message);
  }

  static notFound(code: string, message: string) {
    return new AppError(404, code, message);
  }

  static conflict(code: string, message: string) {
    return new AppError(409, code, message);
  }
}
