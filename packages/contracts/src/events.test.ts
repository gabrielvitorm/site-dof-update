import { describe, expect, it } from 'vitest';
import { internalAutomationEventSchema } from './events';

describe('automation event contract', () => {
  it('accepts a normalized sale approved event for n8n', () => {
    const result = internalAutomationEventSchema.safeParse({
      eventId: '7ff2bbd2-f7a3-42e2-b5fd-9950ed258600',
      eventType: 'sale.approved',
      occurredAt: '2026-09-13T22:00:00.000Z',
      lead: {
        id: 'a5d48df6-a654-4f76-b258-934326bdcadd',
        name: 'Maria Silva',
        email: 'maria@example.com',
        phone: '+5527999999999',
        status: 'PURCHASED'
      },
      source: {
        provider: 'even3',
        providerDeliveryId: 'delivery-123'
      },
      attribution: {
        utmSource: 'meta',
        utmMedium: 'paid_social',
        utmCampaign: 'dof_last_lot',
        utmContent: 'video_01',
        ctaOrigin: 'hero'
      }
    });

    expect(result.success).toBe(true);
  });

  it('rejects unsupported automation event types', () => {
    const result = internalAutomationEventSchema.safeParse({
      eventId: '7ff2bbd2-f7a3-42e2-b5fd-9950ed258600',
      eventType: 'purchase',
      occurredAt: '2026-09-13T22:00:00.000Z',
      lead: {
        id: 'a5d48df6-a654-4f76-b258-934326bdcadd',
        name: 'Maria Silva',
        email: 'maria@example.com',
        phone: '+5527999999999',
        status: 'PURCHASED'
      }
    });

    expect(result.success).toBe(false);
  });
});

