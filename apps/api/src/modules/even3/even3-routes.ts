import { ZodError } from 'zod';
import type { FastifyInstance } from 'fastify';

import type { AppConfig } from '../../config';
import type { Queryable } from '../../db/client';
import { Even3Service, UnsupportedEven3EventError } from './even3-service';

export function registerEven3Routes(
  app: FastifyInstance,
  config: AppConfig,
  db: Queryable
): void {
  const service = new Even3Service(db);

  app.post('/webhooks/even3/:secret', async (request, reply) => {
    const params = request.params as { secret?: string };
    if (params.secret !== config.even3WebhookPathSecret) {
      return reply.code(401).send({ code: 'UNAUTHORIZED' });
    }

    try {
      await service.processWebhook(request.body);
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ code: 'INVALID_EVEN3_PAYLOAD' });
      }
      if (error instanceof UnsupportedEven3EventError) {
        return reply.code(400).send({ code: 'UNSUPPORTED_EVEN3_EVENT' });
      }
      throw error;
    }
  });
}

