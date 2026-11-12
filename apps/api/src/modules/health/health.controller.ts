import type { DbClients } from '../../config/database';

/** Liveness check for uptime monitors. No business logic, so no service layer. */
export class HealthController {
  constructor(private readonly db: DbClients) {}

  check = async () => ({
    status: 'ok',
    database: this.db.public ? 'configured' : 'not_configured',
    time: new Date().toISOString(),
  });
}
