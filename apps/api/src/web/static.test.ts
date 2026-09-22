import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import Fastify from 'fastify';
import { describe, expect, it } from 'vitest';

import { registerWebStatic } from './static';

describe('fullstack web server', () => {
  it('serves the React entrypoint for browser routes', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dof-web-'));
    await writeFile(join(root, 'index.html'), '<!doctype html><div id="root"></div>');
    const app = Fastify();

    try {
      await registerWebStatic(app, root);
      const response = await app.inject({ method: 'GET', url: '/checkout' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toContain('<div id="root"></div>');
    } finally {
      await app.close();
      await rm(root, { recursive: true, force: true });
    }
  });
});
