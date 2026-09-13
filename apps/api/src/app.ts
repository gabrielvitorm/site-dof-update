import Fastify, { type FastifyInstance } from 'fastify';

import type { AppConfig } from './config';
import type { Queryable } from './db/client';
import { registerEven3Routes } from './modules/even3/even3-routes';
import { registerLeadRoutes } from './modules/leads/lead-routes';
import { registerHealthRoute } from './routes/health';
import { registerPublicConfigRoute } from './routes/public-config';

export interface BuildAppOptions {
  config: AppConfig;
  db: Queryable;
}

export function buildApp(options: BuildAppOptions): FastifyInstance {
  const app = Fastify({ logger: false });

  registerHealthRoute(app, options.db);
  registerPublicConfigRoute(app, options.config);
  registerLeadRoutes(app, options.config, options.db);
  registerEven3Routes(app, options.config, options.db);

  return app;
}
