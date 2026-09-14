import { createDatabasePool } from './client';
import { loadConfig } from '../config';
import { runMigrations } from './migrate';

async function main(): Promise<void> {
  const config = loadConfig();
  const pool = createDatabasePool(config.databaseUrl);

  try {
    const applied = await runMigrations(pool);
    if (applied.length === 0) {
      console.log('Migrations already up to date.');
    } else {
      console.log(`Applied migrations: ${applied.join(', ')}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
