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
      track: (name, params) => {
        metaEvents.push({ name, params, custom: false });
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

    analytics.trackCtaClick('offer');
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
      ctaOrigin: 'offer',
      errorCategory: 'api_unavailable'
    });

    expect(adapters.ga4Events.map((event) => event.name)).toEqual([
      'cta_click',
      'generate_lead',
      'begin_checkout',
      'checkout_redirect_failed'
    ]);
    expect(adapters.ga4Events[0]?.params).toEqual({ cta_origin: 'offer' });
    expect(adapters.ga4Events[1]?.params).toMatchObject({
      lead_id: 'lead-123',
      utm_source: 'meta',
      cta_origin: 'hero'
    });
    expect(adapters.ga4Events[2]?.params).toEqual({
      lead_id: 'lead-123',
      value: 320,
      currency: 'BRL'
    });
    expect(adapters.metaEvents).toEqual([
      {
        name: 'cta_click',
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
          utm_campaign: 'lancamento'
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
