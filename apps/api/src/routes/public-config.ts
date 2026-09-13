import type { FastifyInstance } from 'fastify';

import type { AppConfig } from '../config';

export function registerPublicConfigRoute(
  app: FastifyInstance,
  config: AppConfig
): void {
  app.get('/api/config/public', async () => config.publicConfig);
}

