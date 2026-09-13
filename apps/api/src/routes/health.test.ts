import { describe, expect, it } from 'vitest';

import { buildApp } from '../app';
import { loadConfig } from '../config';
import type { Queryable } from '../db/client';

const healthyDb: Queryable = {
  async query() {
    return { rows: [], rowCount: 0, command: 'SELECT', oid: 0, fields: [] };
  }
};

const brokenDb: Queryable = {
  async query() {
    throw new Error('database password leaked here');
  }
};

describe('GET /health', () => {
  it('returns ok when the app and database are healthy', async () => {
    const app = buildApp({ config: loadConfig(testEnv()), db: healthyDb });

    const response = await app.inject({ method: 'GET', url: '/health' });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.database).toBe('ok');
    expect(Date.parse(body.timestamp)).not.toBeNaN();
  });

  it('returns 503 without leaking database errors when the db check fails', async () => {
    const app = buildApp({ config: loadConfig(testEnv()), db: brokenDb });

    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(503);
    expect(response.body).not.toContain('password');
    expect(response.json()).toMatchObject({
      status: 'error',
      database: 'error'
    });
  });
});

function testEnv(): Record<string, string> {
  return {
    NODE_ENV: 'test',
    APP_BASE_URL: 'https://dofupdate.test',
    PORT: '3000',
    DATABASE_URL: 'postgresql://user:pass@localhost:5432/dof',
    EVENT_PRICE_BRL: '320',
    SALES_PHASE: 'Ultimo lote',
    EVEN3_CHECKOUT_URL: 'https://www.even3.com.br/checkout',
    EVEN3_FALLBACK_URL: 'https://www.even3.com.br/evento',
    GROUP_FORM_URL: 'https://forms.gle/aSKo8XbHoPgSzHXn9',
    MAPS_URL: 'https://maps.google.com/?q=FAESA',
    SALES_ENABLED: 'true',
    EVEN3_WEBHOOK_PATH_SECRET: 'secret',
    N8N_INTERNAL_WEBHOOK_URL: 'https://n8n.example.com/webhook/test',
    N8N_INTERNAL_TOKEN: 'token',
    LOG_LEVEL: 'info',
    PII_LOG_MASKING: 'true'
  };
}
