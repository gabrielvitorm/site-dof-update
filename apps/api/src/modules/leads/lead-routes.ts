import { ZodError } from 'zod';
import type { FastifyInstance } from 'fastify';

import type { AppConfig } from '../../config';
import type { Queryable } from '../../db/client';
import type { MetaConversionsClient } from '../meta/meta-conversions-client';
import { LeadCaptureService } from './lead-service';

export function registerLeadRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Queryable,
  metaClient: MetaConversionsClient
): void {
  const service = new LeadCaptureService(config, db, metaClient);
  const rateLimiter = createInMemoryRateLimiter(
    config.leadRateLimitMax,
    config.leadRateLimitWindowMs
  );

  app.post('/api/leads', async (request, reply) => {
    if (!rateLimiter.allow(request.ip)) {
      return reply.code(429).send({
        code: 'RATE_LIMITED'
      });
    }

    try {
      const response = await service.capture(request.body, {
        clientIpAddress: request.ip,
        clientUserAgent: request.headers['user-agent']
      });
      const statusCode = response.status === 'CAPTURED' ? 201 : 200;
      return reply.code(statusCode).send(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          code: 'VALIDATION_ERROR',
          fields: formatZodFields(error)
        });
      }
      throw error;
    }
  });
}

function createInMemoryRateLimiter(maxRequests: number, windowMs: number) {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  return {
    allow(key: string): boolean {
      const now = Date.now();
      const current = buckets.get(key);
      if (!current || current.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (current.count >= maxRequests) {
        return false;
      }
      current.count += 1;
      return true;
    }
  };
}

function formatZodFields(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path[0];
    if (typeof path === 'string' && !fields[path]) {
      fields[path] = issue.message;
    }
  }
  return fields;
}
