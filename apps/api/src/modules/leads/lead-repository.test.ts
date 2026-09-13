import { describe, expect, it } from 'vitest';

import { createTestDatabase } from '../../db/test-database';
import { LeadRepository } from './lead-repository';

const baseLead = {
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

describe('LeadRepository', () => {
  it('upserts by normalized email and appends a capture event each time', async () => {
    const db = await createTestDatabase();
    const repository = new LeadRepository(db);

    const first = await repository.upsertCapturedLead(baseLead);
    const second = await repository.upsertCapturedLead({
      ...baseLead,
      name: 'Maria Souza',
      phone: '(27) 98888-7777',
      phoneE164: '+5527988887777',
      attribution: {
        ...baseLead.attribution,
        ctaOrigin: 'offer'
      }
    });
    const events = await repository.listEvents(second.id);

    expect(second.id).toBe(first.id);
    expect(second.name).toBe('Maria Souza');
    expect(second.phoneE164).toBe('+5527988887777');
    expect(second.firstUtmSource).toBe('meta');
    expect(second.ctaOrigin).toBe('offer');
    expect(events.map((event) => event.type)).toEqual([
      'LEAD_CAPTURED',
      'LEAD_CAPTURED'
    ]);
  });

  it('matches by normalized phone when email does not exist', async () => {
    const db = await createTestDatabase();
    const repository = new LeadRepository(db);

    const first = await repository.upsertCapturedLead(baseLead);
    const second = await repository.upsertCapturedLead({
      ...baseLead,
      email: 'outro@example.com',
      emailNormalized: 'outro@example.com'
    });

    expect(second.id).toBe(first.id);
    expect(second.emailNormalized).toBe('outro@example.com');
  });
});

