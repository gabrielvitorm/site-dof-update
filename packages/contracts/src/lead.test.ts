import { describe, expect, it } from 'vitest';
import {
  attributionSchema,
  ctaOriginSchema,
  leadCaptureRequestSchema,
  leadCaptureResponseSchema,
  leadStatusSchema
} from './lead';

const validAttribution = {
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
};

describe('lead contracts', () => {
  it('accepts a valid lead capture request and normalizes email/name whitespace', () => {
    const result = leadCaptureRequestSchema.safeParse({
      eventId: '11111111-1111-4111-8111-111111111111',
      name: '  Maria Silva  ',
      email: '  MARIA@EXAMPLE.COM  ',
      phone: '(27) 99999-9999',
      consent: true,
      attribution: validAttribution
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.eventId).toBe('11111111-1111-4111-8111-111111111111');
      expect(result.data.name).toBe('Maria Silva');
      expect(result.data.email).toBe('maria@example.com');
    }
  });

  it('rejects invalid lead identity fields and missing consent', () => {
    const result = leadCaptureRequestSchema.safeParse({
      name: 'M',
      email: 'email-invalido',
      phone: '1234567',
      consent: false,
      attribution: validAttribution
    });

    expect(result.success).toBe(false);
  });

  it('limits attribution fields and accepts nullable campaign values', () => {
    expect(attributionSchema.safeParse(validAttribution).success).toBe(true);
    expect(
      attributionSchema.safeParse({
        ...validAttribution,
        utmCampaign: 'x'.repeat(501)
      }).success
    ).toBe(false);
  });

  it('keeps CTA origins and lead statuses aligned with the funnel docs', () => {
    expect(ctaOriginSchema.parse('sticky_mobile')).toBe('sticky_mobile');
    expect(ctaOriginSchema.parse('pricing_carousel')).toBe('pricing_carousel');
    expect(leadStatusSchema.parse('PURCHASED')).toBe('PURCHASED');
    expect(ctaOriginSchema.safeParse('direct_checkout').success).toBe(false);
    expect(leadStatusSchema.safeParse('BUYER').success).toBe(false);
  });

  it('accepts the documented successful lead capture response', () => {
    const result = leadCaptureResponseSchema.safeParse({
      eventId: '11111111-1111-4111-8111-111111111111',
      leadId: 'a5d48df6-a654-4f76-b258-934326bdcadd',
      status: 'CAPTURED',
      checkoutUrl: 'https://www.even3.com.br/dof-update',
      redirectAllowed: true
    });

    expect(result.success).toBe(true);
  });
});
