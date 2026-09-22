import { describe, expect, it } from 'vitest';
import type { Attribution } from '@dof-update/contracts';
import { createAnalytics, type Ga4Adapter, type MetaAdapter } from './analytics';

function createAttribution(): Attribution {
  return {
    utmSource: 'meta',
    utmMedium: 'cpc',
    utmCampaign: 'lancamento',
    utmContent: 'video',
    utmTerm: 'zumbido',
    fbclid: 'fb.123',
    gclid: null,
    referrer: 'https://facebook.com/',
    landingUrl: 'https://dofupdate.com.br/?utm_source=meta',
    ctaOrigin: 'hero',
    sessionId: '11111111-1111-4111-8111-111111111111',
    deviceClass: 'desktop'
  };
}

function createRecordingAdapters(): {
  ga4Events: Array<{ name: string; params: Record<string, unknown> }>;
  metaEvents: Array<{ name: string; params: Record<string, unknown>; custom: boolean }>;
  ga4: Ga4Adapter;
  meta: MetaAdapter;
} {
  const ga4Events: Array<{ name: string; params: Record<string, unknown> }> = [];
  const metaEvents: Array<{ name: string; params: Record<string, unknown>; custom: boolean }> = [];

  return {
    ga4Events,
    metaEvents,
      ga4: {
      event: (name, params) => {
        ga4Events.push({ name, params });
      }
    },
    meta: {
      track: (name, params, options) => {
        metaEvents.push({ name, params: { ...params, ...options }, custom: false });
      },
      trackCustom: (name, params) => {
        metaEvents.push({ name, params, custom: true });
      }
    }
  };
}

describe('analytics facade', () => {
  it('tracks page views with canonical attribution params', () => {
    const adapters = createRecordingAdapters();
    const analytics = createAnalytics({
      ga4MeasurementId: 'G-DOF2026',
      metaPixelId: '123456',
      ga4: adapters.ga4,
      meta: adapters.meta
    });

    analytics.trackPageView(createAttribution());

    expect(adapters.ga4Events).toEqual([
      {
        name: 'page_view',
        params: {
          page_location: 'https://dofupdate.com.br/?utm_source=meta',
          page_referrer: 'https://facebook.com/',
          utm_source: 'meta',
          utm_medium: 'cpc',
          utm_campaign: 'lancamento',
          utm_content: 'video',
          utm_term: 'zumbido',
          fbclid: 'fb.123',
          gclid: null,
          session_id: '11111111-1111-4111-8111-111111111111',
          device_class: 'desktop'
        }
      }
    ]);
    expect(adapters.metaEvents).toEqual([
      {
        name: 'PageView',
        params: {
          content_name: 'DOF Update 2026',
          event_source_url: 'https://dofupdate.com.br/?utm_source=meta'
        },
        custom: false
      }
    ]);
  });

  it('maps funnel actions to GA4 and Meta event names', () => {
    const adapters = createRecordingAdapters();
    const analytics = createAnalytics({
      ga4MeasurementId: 'G-DOF2026',
      metaPixelId: '123456',
      ga4: adapters.ga4,
      meta: adapters.meta
    });

    analytics.trackViewContent(createAttribution());
    analytics.trackCtaClick('offer');
    analytics.trackLeadFormOpen('offer');
    analytics.trackLeadFormSubmit('offer');
    analytics.trackLead({
      leadId: 'lead-123',
      eventId: '11111111-1111-4111-8111-111111111111',
      attribution: createAttribution()
    });
    analytics.trackBeginCheckout({
      leadId: 'lead-123',
      price: 320,
      currency: 'BRL'
    });
    analytics.trackCheckoutRedirectFailed({
      ctaOrigin: 'offer',
      errorCategory: 'api_unavailable'
    });
    analytics.trackMapOpen('location');
    analytics.trackGroupInterest('offer');
    analytics.trackWhatsappSupportClick('footer');

    expect(adapters.ga4Events.map((event) => event.name)).toEqual([
      'view_content',
      'cta_click',
      'lead_form_open',
      'lead_form_submit',
      'generate_lead',
      'begin_checkout',
      'checkout_redirect_failed',
      'map_open',
      'group_interest',
      'whatsapp_support_click'
    ]);
    expect(adapters.ga4Events[0]?.params).toMatchObject({
      content_name: 'DOF Update 2026',
      page_location: 'https://dofupdate.com.br/?utm_source=meta'
    });
    expect(adapters.ga4Events[1]?.params).toEqual({ cta_origin: 'offer' });
    expect(adapters.ga4Events[2]?.params).toEqual({ cta_origin: 'offer' });
    expect(adapters.ga4Events[3]?.params).toEqual({ cta_origin: 'offer' });
    expect(adapters.ga4Events[4]?.params).toMatchObject({
      lead_id: 'lead-123',
      utm_source: 'meta',
      cta_origin: 'hero'
    });
    expect(adapters.ga4Events[5]?.params).toEqual({
      lead_id: 'lead-123',
      value: 320,
      currency: 'BRL'
    });
    expect(adapters.ga4Events[7]?.params).toEqual({ section: 'location' });
    expect(adapters.ga4Events[8]?.params).toEqual({ section: 'offer' });
    expect(adapters.ga4Events[9]?.params).toEqual({ section: 'footer' });
    expect(adapters.metaEvents).toEqual([
      {
        name: 'ViewContent',
        params: {
          content_name: 'DOF Update 2026',
          content_category: 'event',
          event_source_url: 'https://dofupdate.com.br/?utm_source=meta'
        },
        custom: false
      },
      {
        name: 'cta_click',
        params: { cta_origin: 'offer' },
        custom: true
      },
      {
        name: 'lead_form_open',
        params: { cta_origin: 'offer' },
        custom: true
      },
      {
        name: 'lead_form_submit',
        params: { cta_origin: 'offer' },
        custom: true
      },
      {
      name: 'Lead',
        params: {
          lead_id: 'lead-123',
          content_name: 'DOF Update 2026',
          utm_source: 'meta',
          utm_medium: 'cpc',
          utm_campaign: 'lancamento',
          eventID: '11111111-1111-4111-8111-111111111111'
        },
        custom: false
      },
      {
        name: 'InitiateCheckout',
        params: {
          lead_id: 'lead-123',
          value: 320,
          currency: 'BRL'
        },
        custom: false
      },
      {
        name: 'checkout_redirect_failed',
        params: {
          cta_origin: 'offer',
          error_category: 'api_unavailable'
        },
        custom: true
      },
      {
        name: 'map_open',
        params: { section: 'location' },
        custom: true
      },
      {
        name: 'group_interest',
        params: { section: 'offer' },
        custom: true
      },
      {
        name: 'whatsapp_support_click',
        params: { section: 'footer' },
        custom: true
      }
    ]);
  });

  it('tracks pricing carousel CTA with ticket metadata', () => {
    const adapters = createRecordingAdapters();
    const analytics = createAnalytics({
      ga4MeasurementId: 'G-DOF2026',
      metaPixelId: '123456',
      ga4: adapters.ga4,
      meta: adapters.meta
    });

    analytics.trackCtaClick({
      ctaOrigin: 'pricing_carousel',
      ticketType: 'Profissionais',
      ticketPrice: 'R$ 320,00',
      ticketVariant: 'main'
    });

    expect(adapters.ga4Events).toEqual([
      {
        name: 'cta_click',
        params: {
          cta_origin: 'pricing_carousel',
          ticket_type: 'Profissionais',
          ticket_price: 'R$ 320,00',
          ticket_variant: 'main'
        }
      }
    ]);
    expect(adapters.metaEvents).toEqual([
      {
        name: 'cta_click',
        params: {
          cta_origin: 'pricing_carousel',
          ticket_type: 'Profissionais',
          ticket_price: 'R$ 320,00',
          ticket_variant: 'main'
        },
        custom: true
      }
    ]);
  });

  it('does nothing when provider ids are absent', () => {
    const adapters = createRecordingAdapters();
    const analytics = createAnalytics({
      ga4: adapters.ga4,
      meta: adapters.meta
    });

    analytics.trackPageView(createAttribution());
    analytics.trackCtaClick('hero');
    analytics.trackLead({
      leadId: 'lead-123',
      attribution: createAttribution()
    });
    analytics.trackBeginCheckout({
      leadId: 'lead-123',
      price: 320,
      currency: 'BRL'
    });
    analytics.trackCheckoutRedirectFailed({
      ctaOrigin: 'hero',
      errorCategory: 'blocked_popup'
    });

    expect(adapters.ga4Events).toEqual([]);
    expect(adapters.metaEvents).toEqual([]);
  });
});
