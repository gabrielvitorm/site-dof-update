import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

export async function registerWebStatic(app: FastifyInstance, root: string): Promise<void> {
  await app.register(fastifyStatic, {
    root,
    prefix: '/'
  });

  app.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith('/api/') || request.url.startsWith('/webhooks/') || request.url === '/health') {
      return reply.code(404).send({ code: 'NOT_FOUND' });
    }

    return reply.sendFile('index.html');
  });
}
