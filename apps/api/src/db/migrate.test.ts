import { describe, expect, it } from 'vitest';

import { listMigrationFiles, parseAppliedMigrations, schemaMigrationsDdl } from './migrate';

describe('database migrations', () => {
  it('lists SQL migrations in lexical order', () => {
    const files = listMigrationFiles(new URL('./migrations', import.meta.url));
    expect(files.map((file) => file.name)).toEqual(['001_initial.sql']);
  });

  it('parses already-applied migration names from query rows', () => {
    expect(
      parseAppliedMigrations([{ name: '001_initial.sql' }, { name: '002_extra.sql' }])
    ).toEqual(new Set(['001_initial.sql', '002_extra.sql']));
  });

  it('exposes schema_migrations DDL for bootstrap', () => {
    expect(schemaMigrationsDdl).toContain('schema_migrations');
    expect(schemaMigrationsDdl).toContain('name text primary key');
  });
});
