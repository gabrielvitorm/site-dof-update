import type { FastifyInstance } from 'fastify';

import type { Queryable } from '../db/client';

export function registerHealthRoute(app: FastifyInstance, db: Queryable): void {
  app.get('/health', async (_request, reply) => {
    try {
      await db.query('select 1');
      return {
        status: 'ok',
        database: 'ok',
        timestamp: new Date().toISOString()
      };
    } catch {
      return reply.code(503).send({
        status: 'error',
        database: 'error',
        timestamp: new Date().toISOString()
      });
    }
  });
}

