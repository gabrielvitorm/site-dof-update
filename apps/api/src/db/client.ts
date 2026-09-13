import pg from 'pg';

export interface Queryable {
  query<T extends pg.QueryResultRow = pg.QueryResultRow>(
    text: string,
    values?: readonly unknown[]
  ): Promise<pg.QueryResult<T>>;
}

export function createDatabasePool(connectionString: string): pg.Pool {
  return new pg.Pool({ connectionString });
}

