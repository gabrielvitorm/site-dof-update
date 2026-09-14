import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import type { Queryable } from './client';

export interface MigrationFile {
  name: string;
  sql: string;
}

export const schemaMigrationsDdl = `
create table if not exists schema_migrations (
  name text primary key,
  applied_at timestamptz not null default now()
);
`;

export function listMigrationFiles(migrationsUrl: URL): MigrationFile[] {
  const directory = fileURLToPath(migrationsUrl);
  return readdirSync(directory)
    .filter((name) => name.endsWith('.sql'))
    .sort((left, right) => left.localeCompare(right))
    .map((name) => ({
      name,
      sql: readFileSync(new URL(name, ensureTrailingSlash(migrationsUrl)), 'utf8')
    }));
}

export function parseAppliedMigrations(rows: Array<{ name: string }>): Set<string> {
  return new Set(rows.map((row) => row.name));
}

export async function runMigrations(
  db: Queryable,
  migrationsUrl: URL = new URL('./migrations/', import.meta.url)
): Promise<string[]> {
  await db.query(schemaMigrationsDdl);

  const appliedResult = await db.query<{ name: string }>('select name from schema_migrations');
  const applied = parseAppliedMigrations(appliedResult.rows);
  const appliedNow: string[] = [];

  for (const migration of listMigrationFiles(migrationsUrl)) {
    if (applied.has(migration.name)) {
      continue;
    }

    await db.query(migration.sql);
    await db.query('insert into schema_migrations (name) values ($1)', [migration.name]);
    appliedNow.push(migration.name);
  }

  return appliedNow;
}

function ensureTrailingSlash(url: URL): URL {
  if (url.href.endsWith('/')) {
    return url;
  }
  return new URL(`${url.href}/`);
}
