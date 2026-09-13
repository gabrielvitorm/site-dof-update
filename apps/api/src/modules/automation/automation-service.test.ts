import { describe, expect, it } from 'vitest';

import { createTestDatabase } from '../../db/test-database';
import { LeadRepository } from '../leads/lead-repository';
import { AutomationService } from './automation-service';

const leadInput = {
  name: 'Maria Silva',
  email: 'maria@example.com',
  emailNormalized: 'maria@example.com',
  phone: '(27) 99999-9999',
  phoneE164: '+5527999999999',
  consent: true,
  checkoutUrl: 'https://www.even3.com.br/checkout',
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

describe('AutomationService', () => {
  it('enqueues an automation event once per idempotency key', async () => {
    const db = await createTestDatabase();
    const lead = await new LeadRepository(db).upsertCapturedLead(leadInput);
    const service = new AutomationService(db);

    const first = await service.enqueueAutomationEvent({
      eventType: 'lead.captured',
      lead,
      idempotencyKey: `${lead.id}:lead.captured:v1`,
      source: { provider: 'lead_api' }
    });
    const second = await service.enqueueAutomationEvent({
      eventType: 'lead.captured',
      lead,
      idempotencyKey: `${lead.id}:lead.captured:v1`,
      source: { provider: 'lead_api' }
    });

    expect(first.inserted).toBe(true);
    expect(second.inserted).toBe(false);
    expect(second.dispatch.id).toBe(first.dispatch.id);
    expect(await service.listPendingDispatches(10)).toHaveLength(1);
  });

  it('keeps lead state intact when n8n delivery fails', async () => {
    const db = await createTestDatabase();
    const leadRepository = new LeadRepository(db);
    const lead = await leadRepository.upsertCapturedLead(leadInput);
    const service = new AutomationService(db);
    await service.enqueueAutomationEvent({
      eventType: 'lead.captured',
      lead,
      idempotencyKey: `${lead.id}:lead.captured:v1`,
      source: { provider: 'lead_api' }
    });

    const result = await service.dispatchPending({
      url: 'https://n8n.example.com/webhook/test',
      token: 'token',
      fetch: async () => new Response('offline', { status: 503 })
    });
    const persistedLead = await db.query<{ status: string }>(
      'select status from leads where id = $1',
      [lead.id]
    );
    const pending = await service.listPendingDispatches(10);

    expect(result).toEqual({ sent: 0, failed: 1 });
    expect(persistedLead.rows[0]?.status).toBe('CAPTURED');
    expect(pending[0]?.status).toBe('FAILED');
    expect(pending[0]?.attemptCount).toBe(1);
  });

  it('marks dispatch as sent after a successful n8n response', async () => {
    const db = await createTestDatabase();
    const lead = await new LeadRepository(db).upsertCapturedLead(leadInput);
    const service = new AutomationService(db);
    await service.enqueueAutomationEvent({
      eventType: 'lead.captured',
      lead,
      idempotencyKey: `${lead.id}:lead.captured:v1`,
      source: { provider: 'lead_api' }
    });

    const result = await service.dispatchPending({
      url: 'https://n8n.example.com/webhook/test',
      token: 'token',
      fetch: async (_url, init) => {
        expect(init?.headers).toMatchObject({
          authorization: 'Bearer token',
          'content-type': 'application/json'
        });
        return new Response(null, { status: 204 });
      }
    });
    const pending = await service.listPendingDispatches(10);

    expect(result).toEqual({ sent: 1, failed: 0 });
    expect(pending).toHaveLength(0);
  });
});

