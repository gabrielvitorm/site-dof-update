import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { DataType, newDb } from 'pg-mem';

import type { Queryable } from './client';

export async function createTestDatabase(): Promise<Queryable> {
  const db = newDb();
  db.public.registerFunction({
    name: 'gen_random_uuid',
    returns: DataType.uuid,
    implementation: () => randomUUID(),
    impure: true
  });

  const migrationSql = readFileSync(
    new URL('./migrations/001_initial.sql', import.meta.url),
    'utf8'
  );
  const { Pool } = db.adapters.createPg();
  const pool = new Pool();
  await pool.query(migrationSql);
  return pool;
}
