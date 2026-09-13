import { describe, expect, it } from 'vitest';

import { buildApp } from '../../app';
import { loadConfig } from '../../config';
import { createTestDatabase } from '../../db/test-database';
import { LeadRepository } from './lead-repository';

const validRequest = {
  name: '  Maria Silva  ',
  email: '  MARIA@EXAMPLE.COM  ',
  phone: '(27) 99999-9999',
  consent: true,
  attribution: {
    utmSource: 'meta',
    utmMedium: 'paid_social',
    utmCampaign: 'dof_last_lot',
    utmContent: 'video_01',
    utmTerm: null,
    fbclid: 'fbclid-123',
    gclid: null,
    referrer: 'https://instagram.com/',
    landingUrl: 'https://dofupdate.com.br/?utm_source=meta',
    ctaOrigin: 'hero',
    sessionId: '7ff2bbd2-f7a3-42e2-b5fd-9950ed258600',
    deviceClass: 'mobile'
  }
};

describe('POST /api/leads', () => {
  it('validates, normalizes and persists a captured lead before returning checkout', async () => {
    const db = await createTestDatabase();
    const app = buildApp({ config: loadConfig(testEnv()), db });

    const response = await app.inject({
      method: 'POST',
      url: '/api/leads',
      payload: validRequest
    });
    const body = response.json();

    expect(response.statusCode).toBe(201);
    expect(body).toMatchObject({
      status: 'CAPTURED',
      checkoutUrl: 'https://www.even3.com.br/checkout',
      redirectAllowed: true
    });
    expect(body.leadId).toEqual(expect.any(String));

    const events = await new LeadRepository(db).listEvents(body.leadId);
    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe('LEAD_CAPTURED');
  });

  it('returns field validation errors for invalid payloads', async () => {
    const db = await createTestDatabase();
    const app = buildApp({ config: loadConfig(testEnv()), db });

    const response = await app.inject({
      method: 'POST',
      url: '/api/leads',
      payload: {
        ...validRequest,
        name: 'M',
        email: 'email-invalido',
        phone: '123',
        consent: false
      }
    });
    const body = response.json();

    expect(response.statusCode).toBe(400);
    expect(body.code).toBe('VALIDATION_ERROR');
    expect(body.fields).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
      consent: expect.any(String)
    });
  });

  it('does not downgrade a purchased lead on repeated capture', async () => {
    const db = await createTestDatabase();
    const config = loadConfig(testEnv());
    const app = buildApp({ config, db });

    const firstResponse = await app.inject({
      method: 'POST',
      url: '/api/leads',
      payload: validRequest
    });
    const leadId = firstResponse.json().leadId;
    await db.query(
      `update leads set status = 'PURCHASED', purchased_at = now() where id = $1`,
      [leadId]
    );

    const secondResponse = await app.inject({
      method: 'POST',
      url: '/api/leads',
      payload: {
        ...validRequest,
        attribution: {
          ...validRequest.attribution,
          ctaOrigin: 'offer'
        }
      }
    });

    expect(secondResponse.statusCode).toBe(200);
    expect(secondResponse.json()).toMatchObject({
      leadId,
      status: 'PURCHASED',
      checkoutUrl: config.publicConfig.checkoutUrl,
      redirectAllowed: true
    });
  });

  it('rate limits repeated lead submissions from the same client', async () => {
    const db = await createTestDatabase();
    const app = buildApp({
      config: loadConfig({ ...testEnv(), LEAD_RATE_LIMIT_MAX: '1' }),
      db
    });

    const firstResponse = await app.inject({
      method: 'POST',
      url: '/api/leads',
      remoteAddress: '203.0.113.10',
      payload: validRequest
    });
    const secondResponse = await app.inject({
      method: 'POST',
      url: '/api/leads',
      remoteAddress: '203.0.113.10',
      payload: {
        ...validRequest,
        email: 'outra@example.com'
      }
    });

    expect(firstResponse.statusCode).toBe(201);
    expect(secondResponse.statusCode).toBe(429);
    expect(secondResponse.json()).toMatchObject({
      code: 'RATE_LIMITED'
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
