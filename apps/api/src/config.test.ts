import { describe, expect, it } from 'vitest';

import { loadConfig } from './config';

describe('API configuration', () => {
  it('keeps Meta CAPI disabled unless explicitly configured', () => {
    const config = loadConfig({
      ...baseEnv(),
      META_CAPI_ENABLED: 'false'
    });

    expect(config.metaCapi.enabled).toBe(false);
    expect(config.metaCapi.accessToken).toBeNull();
  });
});

function baseEnv(): Record<string, string> {
  return {
    NODE_ENV: 'test',
    APP_BASE_URL: 'https://dofupdate.test',
    PORT: '3000',
    DATABASE_URL: 'postgresql://user:pass@localhost:5432/dof',
    EVENT_PRICE_BRL: '320',
    SALES_PHASE: 'Ultimo lote',
    EVEN3_CHECKOUT_URL: 'https://www.even3.com.br/checkout',
    EVEN3_FALLBACK_URL: 'https://www.even3.com.br/evento',
    GROUP_FORM_URL: 'https://forms.gle/test',
    MAPS_URL: 'https://maps.google.com/?q=FAESA',
    SALES_ENABLED: 'true',
    EVEN3_WEBHOOK_PATH_SECRET: 'secret',
    N8N_INTERNAL_WEBHOOK_URL: 'https://n8n.example.com/webhook/test',
    N8N_INTERNAL_TOKEN: 'token',
    LOG_LEVEL: 'info',
    PII_LOG_MASKING: 'true'
  };
}
