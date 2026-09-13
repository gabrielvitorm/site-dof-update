import { describe, expect, it } from 'vitest';

import { buildApp } from '../../app';
import { loadConfig } from '../../config';
import { createTestDatabase } from '../../db/test-database';
import type { Queryable } from '../../db/client';

const leadPayload = {
  name: 'Maria Silva',
  email: 'maria@example.com',
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

describe('POST /webhooks/even3/:secret', () => {
  it('rejects unknown webhook secrets', async () => {
    const db = await createTestDatabase();
    const app = buildApp({ config: loadConfig(testEnv()), db });

    const response = await app.inject({
      method: 'POST',
      url: '/webhooks/even3/wrong-secret',
      payload: approvedPayload('delivery-bad-secret')
    });

    expect(response.statusCode).toBe(401);
  });

  it('rejects malformed webhook payloads', async () => {
    const db = await createTestDatabase();
    const app = buildApp({ config: loadConfig(testEnv()), db });

    const response = await app.inject({
      method: 'POST',
      url: '/webhooks/even3/secret',
      payload: { eventType: 'Venda aprovada' }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ code: 'INVALID_EVEN3_PAYLOAD' });
  });

  it('sets purchased from approved sale and enqueues automation once for duplicate delivery', async () => {
    const db = await createTestDatabase();
    const app = buildApp({ config: loadConfig(testEnv()), db });
    const leadId = await createLead(app);

    const first = await app.inject({
      method: 'POST',
      url: '/webhooks/even3/secret',
      payload: approvedPayload('delivery-approved-1')
    });
    const duplicate = await app.inject({
      method: 'POST',
      url: '/webhooks/even3/secret',
      payload: approvedPayload('delivery-approved-1')
    });
    const lead = await getLead(db, leadId);
    const dispatches = await getDispatches(db);

    expect(first.statusCode).toBe(204);
    expect(duplicate.statusCode).toBe(204);
    expect(lead?.status).toBe('PURCHASED');
    expect(lead?.purchased_at).toBeTruthy();
    expect(dispatches).toHaveLength(1);
    expect(dispatches[0]?.event_type).toBe('sale.approved');
  });

  it('does not downgrade purchased leads when delayed sale started arrives', async () => {
    const db = await createTestDatabase();
    const app = buildApp({ config: loadConfig(testEnv()), db });
    const leadId = await createLead(app);

    await app.inject({
      method: 'POST',
      url: '/webhooks/even3/secret',
      payload: approvedPayload('delivery-approved-2')
    });
    await app.inject({
      method: 'POST',
      url: '/webhooks/even3/secret',
      payload: even3Payload('delivery-started-late', 'Venda iniciada')
    });

    expect((await getLead(db, leadId))?.status).toBe('PURCHASED');
  });

  it('allows cancellation after purchase', async () => {
    const db = await createTestDatabase();
    const app = buildApp({ config: loadConfig(testEnv()), db });
    const leadId = await createLead(app);

    await app.inject({
      method: 'POST',
      url: '/webhooks/even3/secret',
      payload: approvedPayload('delivery-approved-3')
    });
    const cancelled = await app.inject({
      method: 'POST',
      url: '/webhooks/even3/secret',
      payload: even3Payload('delivery-cancelled-1', 'Venda cancelada/reembolsada')
    });
    const dispatches = await getDispatches(db);

    expect(cancelled.statusCode).toBe(204);
    expect((await getLead(db, leadId))?.status).toBe('CANCELLED_REFUNDED');
    expect(dispatches.map((dispatch) => dispatch.event_type)).toContain(
      'sale.cancelled'
    );
  });

  it('maps failed sale to payment failed by email correlation', async () => {
    const db = await createTestDatabase();
    const app = buildApp({ config: loadConfig(testEnv()), db });
    const leadId = await createLead(app);

    await app.inject({
      method: 'POST',
      url: '/webhooks/even3/secret',
      payload: even3Payload('delivery-failed-1', 'Venda reprovada')
    });

    expect((await getLead(db, leadId))?.status).toBe('PAYMENT_FAILED');
  });
});

async function createLead(app: ReturnType<typeof buildApp>): Promise<string> {
  const response = await app.inject({
    method: 'POST',
    url: '/api/leads',
    payload: leadPayload
  });
  return response.json().leadId;
}

function approvedPayload(deliveryId: string) {
  return even3Payload(deliveryId, 'Venda aprovada');
}

function even3Payload(deliveryId: string, eventType: string) {
  return {
    id: deliveryId,
    eventType,
    occurredAt: '2026-09-13T22:00:00.000Z',
    participant: {
      name: 'Maria Silva',
      email: 'maria@example.com',
      phone: '+5527999999999'
    },
    registration: {
      code: 'REG-123'
    }
  };
}

async function getLead(db: Queryable, leadId: string) {
  const result = await db.query<{
    status: string;
    purchased_at: string | null;
  }>('select status, purchased_at from leads where id = $1', [leadId]);
  return result.rows[0];
}

async function getDispatches(db: Queryable) {
  const result = await db.query<{ event_type: string }>(
    'select event_type from automation_dispatches order by created_at asc'
  );
  return result.rows;
}

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

