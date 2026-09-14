import { pathToFileURL } from 'node:url';

import { buildApp } from './app';
import { loadConfig } from './config';
import { createDatabasePool } from './db/client';
import { runMigrations } from './db/migrate';
import { getApiServiceName } from './index';

export async function startServer(): Promise<void> {
  const config = loadConfig();
  const pool = createDatabasePool(config.databaseUrl);

  const applied = await runMigrations(pool);
  if (applied.length > 0) {
    console.log(`[${getApiServiceName()}] applied migrations: ${applied.join(', ')}`);
  }

  const app = buildApp({ config, db: pool });

  await app.listen({
    host: '127.0.0.1',
    port: config.port
  });

  console.log(`[${getApiServiceName()}] listening on http://127.0.0.1:${config.port}`);
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
