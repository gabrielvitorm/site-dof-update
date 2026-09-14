import type { Attribution, CtaOrigin } from '@dof-update/contracts';

export interface Ga4Adapter {
  event(name: string, params: Record<string, unknown>): void;
}

export interface MetaAdapter {
  track(name: string, params: Record<string, unknown>): void;
  trackCustom(name: string, params: Record<string, unknown>): void;
}

export interface AnalyticsConfig {
  ga4MeasurementId?: string;
  metaPixelId?: string;
  ga4?: Ga4Adapter;
  meta?: MetaAdapter;
}

export interface LeadTrackingInput {
  leadId: string;
  attribution: Attribution;
}

export interface CheckoutTrackingInput {
  leadId: string;
  price: number;
  currency: 'BRL';
}

export interface CheckoutRedirectFailureInput {
  ctaOrigin: CtaOrigin;
  errorCategory: string;
}

export interface CtaClickInput {
  ctaOrigin: CtaOrigin;
  ticketType?: string;
  ticketPrice?: string;
  ticketVariant?: string;
}

export interface Analytics {
  trackPageView(attribution: Attribution): void;
  trackViewContent(attribution: Attribution): void;
  trackCtaClick(input: CtaOrigin | CtaClickInput): void;
  trackLeadFormOpen(ctaOrigin: CtaOrigin): void;
  trackLeadFormSubmit(ctaOrigin: CtaOrigin): void;
  trackLead(input: LeadTrackingInput): void;
  trackBeginCheckout(input: CheckoutTrackingInput): void;
  trackCheckoutRedirectFailed(input: CheckoutRedirectFailureInput): void;
  trackMapOpen(section: string): void;
  trackGroupInterest(section: string): void;
  trackWhatsappSupportClick(section: string): void;
}

export function createAnalytics(config: AnalyticsConfig = {}): Analytics {
  const ga4 = config.ga4MeasurementId ? config.ga4 ?? createBrowserGa4Adapter() : null;
  const meta = config.metaPixelId ? config.meta ?? createBrowserMetaAdapter() : null;

  return {
    trackPageView(attribution) {
      ga4?.event('page_view', {
        page_location: attribution.landingUrl,
        page_referrer: attribution.referrer,
        ...toAttributionParams(attribution)
      });
      meta?.track('PageView', {
        content_name: 'DOF Update 2026',
        event_source_url: attribution.landingUrl
      });
    },

    trackViewContent(attribution) {
      ga4?.event('view_content', {
        content_name: 'DOF Update 2026',
        page_location: attribution.landingUrl,
        ...toAttributionParams(attribution)
      });
      meta?.track('ViewContent', {
        content_name: 'DOF Update 2026',
        content_category: 'event',
        event_source_url: attribution.landingUrl
      });
    },

    trackCtaClick(input) {
      const payload = typeof input === 'string' ? { ctaOrigin: input } : input;
      const params = {
        cta_origin: payload.ctaOrigin,
        ...(payload.ticketType ? { ticket_type: payload.ticketType } : {}),
        ...(payload.ticketPrice ? { ticket_price: payload.ticketPrice } : {}),
        ...(payload.ticketVariant ? { ticket_variant: payload.ticketVariant } : {})
      };

      ga4?.event('cta_click', params);
      meta?.trackCustom('cta_click', params);
    },

    trackLeadFormOpen(ctaOrigin) {
      const params = { cta_origin: ctaOrigin };

      ga4?.event('lead_form_open', params);
      meta?.trackCustom('lead_form_open', params);
    },

    trackLeadFormSubmit(ctaOrigin) {
      const params = { cta_origin: ctaOrigin };

      ga4?.event('lead_form_submit', params);
      meta?.trackCustom('lead_form_submit', params);
    },

    trackLead(input) {
      ga4?.event('generate_lead', {
        lead_id: input.leadId,
        ...toAttributionParams(input.attribution),
        cta_origin: input.attribution.ctaOrigin
      });
      meta?.track('Lead', {
        lead_id: input.leadId,
        content_name: 'DOF Update 2026',
        utm_source: input.attribution.utmSource,
        utm_medium: input.attribution.utmMedium,
        utm_campaign: input.attribution.utmCampaign
      });
    },

    trackBeginCheckout(input) {
      const params = {
        lead_id: input.leadId,
        value: input.price,
        currency: input.currency
      };

      ga4?.event('begin_checkout', params);
      meta?.track('InitiateCheckout', params);
    },

    trackCheckoutRedirectFailed(input) {
      const params = {
        cta_origin: input.ctaOrigin,
        error_category: input.errorCategory
      };

      ga4?.event('checkout_redirect_failed', params);
      meta?.trackCustom('checkout_redirect_failed', params);
    },

    trackMapOpen(section) {
      const params = { section };

      ga4?.event('map_open', params);
      meta?.trackCustom('map_open', params);
    },

    trackGroupInterest(section) {
      const params = { section };

      ga4?.event('group_interest', params);
      meta?.trackCustom('group_interest', params);
    },

    trackWhatsappSupportClick(section) {
      const params = { section };

      ga4?.event('whatsapp_support_click', params);
      meta?.trackCustom('whatsapp_support_click', params);
    }
  };
}

function toAttributionParams(attribution: Attribution): Record<string, unknown> {
  return {
    utm_source: attribution.utmSource,
    utm_medium: attribution.utmMedium,
    utm_campaign: attribution.utmCampaign,
    utm_content: attribution.utmContent,
    utm_term: attribution.utmTerm,
    fbclid: attribution.fbclid,
    gclid: attribution.gclid,
    session_id: attribution.sessionId,
    device_class: attribution.deviceClass
  };
}

function createBrowserGa4Adapter(): Ga4Adapter {
  return {
    event(name, params) {
      const gtag = (globalThis as { gtag?: (...args: unknown[]) => void }).gtag;
      gtag?.('event', name, params);
    }
  };
}

function createBrowserMetaAdapter(): MetaAdapter {
  const getFbq = (): ((...args: unknown[]) => void) | undefined =>
    (globalThis as { fbq?: (...args: unknown[]) => void }).fbq;

  return {
    track(name, params) {
      getFbq()?.('track', name, params);
    },
    trackCustom(name, params) {
      getFbq()?.('trackCustom', name, params);
    }
  };
}
