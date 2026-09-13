import { describe, expect, it } from 'vitest';

import { buildApp } from '../app';
import { loadConfig } from '../config';
import type { Queryable } from '../db/client';

const db: Queryable = {
  async query() {
    return { rows: [], rowCount: 0, command: 'SELECT', oid: 0, fields: [] };
  }
};

describe('GET /api/config/public', () => {
  it('returns only public landing and checkout configuration', async () => {
    const app = buildApp({ config: loadConfig(testEnv()), db });

    const response = await app.inject({
      method: 'GET',
      url: '/api/config/public'
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body).toEqual({
      eventPrice: 320,
      salesPhase: 'Ultimo lote',
      checkoutUrl: 'https://www.even3.com.br/checkout',
      checkoutFallbackUrl: 'https://www.even3.com.br/evento',
      groupFormUrl: 'https://forms.gle/aSKo8XbHoPgSzHXn9',
      mapsUrl: 'https://maps.google.com/?q=FAESA',
      salesEnabled: true
    });
    expect(JSON.stringify(body)).not.toContain('secret');
    expect(JSON.stringify(body)).not.toContain('token');
    expect(JSON.stringify(body)).not.toContain('postgresql://');
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
