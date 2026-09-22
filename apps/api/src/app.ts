import Fastify, { type FastifyInstance } from 'fastify';

import type { AppConfig } from './config';
import type { Queryable } from './db/client';
import { registerEven3Routes } from './modules/even3/even3-routes';
import { createMetaConversionsClient, type MetaConversionsClient } from './modules/meta/meta-conversions-client';
import { registerLeadRoutes } from './modules/leads/lead-routes';
import { registerHealthRoute } from './routes/health';
import { registerPublicConfigRoute } from './routes/public-config';

export interface BuildAppOptions {
  config: AppConfig;
  db: Queryable;
  metaClient?: MetaConversionsClient;
}

export function buildApp(options: BuildAppOptions): FastifyInstance {
  const app = Fastify({ logger: false });

  registerHealthRoute(app, options.db);
  registerPublicConfigRoute(app, options.config);
  registerLeadRoutes(
    app,
    options.config,
    options.db,
    options.metaClient ?? createMetaConversionsClient(options.config.metaCapi)
  );
  registerEven3Routes(app, options.config, options.db);

  return app;
}
