import { randomUUID } from 'node:crypto';
import { DataType, newDb } from 'pg-mem';

import type { Queryable } from './client';
import { runMigrations } from './migrate';

export async function createTestDatabase(): Promise<Queryable> {
  const db = newDb();
  db.public.registerFunction({
    name: 'gen_random_uuid',
    returns: DataType.uuid,
    implementation: () => randomUUID(),
    impure: true
  });

  const { Pool } = db.adapters.createPg();
  const pool = new Pool();
  await runMigrations(pool);
  return pool;
}
