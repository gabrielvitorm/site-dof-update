import { pathToFileURL } from 'node:url';

import { buildApp } from './app';
import { loadConfig } from './config';
import { createDatabasePool } from './db/client';
import { runMigrations } from './db/migrate';
import { getApiServiceName } from './index';
import { registerWebStatic } from './web/static';

export async function startServer(): Promise<void> {
  const config = loadConfig();
  const pool = createDatabasePool(config.databaseUrl);

  const applied = await runMigrations(pool, new URL('./db/migrations/', import.meta.url));
  if (applied.length > 0) {
    console.log(`[${getApiServiceName()}] applied migrations: ${applied.join(', ')}`);
  }

  const app = buildApp({ config, db: pool });
  const webRoot = process.env.WEB_ROOT?.trim();
  if (webRoot) {
    await registerWebStatic(app, webRoot);
  }

  await app.listen({
    host: resolveListenHost(process.env.HOST),
    port: config.port
  });

  console.log(`[${getApiServiceName()}] listening on http://${resolveListenHost(process.env.HOST)}:${config.port}`);
}

export function resolveListenHost(host: string | undefined): string {
  const value = host?.trim();
  return value && value.length > 0 ? value : '127.0.0.1';
}

function isExecutedDirectly(): boolean {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  return import.meta.url === pathToFileURL(entry).href;
}

if (isExecutedDirectly()) {
  startServer().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
