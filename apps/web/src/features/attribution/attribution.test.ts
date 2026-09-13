import { describe, expect, it } from 'vitest';
import type { CtaOrigin } from '@dof-update/contracts';
import {
  getAttributionSnapshot,
  getStoredAttributionTouches,
  type AttributionEnvironment,
  type StorageLike
} from './attribution';

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    }
  };
}

function createEnvironment(overrides: Partial<AttributionEnvironment> = {}): AttributionEnvironment {
  return {
    href: 'https://dofupdate.com.br/?utm_source=meta&utm_medium=cpc&utm_campaign=lancamento&utm_content=video&utm_term=zumbido&fbclid=fb.123&gclid=google.456',
    referrer: 'https://facebook.com/',
    localStorage: createMemoryStorage(),
    sessionStorage: createMemoryStorage(),
    viewportWidth: 1366,
    createSessionId: () => '11111111-1111-4111-8111-111111111111',
    ...overrides
  };
}

describe('getAttributionSnapshot', () => {
  it('captures campaign parameters and click ids from the landing URL', () => {
    const attribution = getAttributionSnapshot('hero', createEnvironment());

    expect(attribution).toEqual({
      utmSource: 'meta',
      utmMedium: 'cpc',
      utmCampaign: 'lancamento',
      utmContent: 'video',
      utmTerm: 'zumbido',
      fbclid: 'fb.123',
      gclid: 'google.456',
      referrer: 'https://facebook.com/',
      landingUrl:
        'https://dofupdate.com.br/?utm_source=meta&utm_medium=cpc&utm_campaign=lancamento&utm_content=video&utm_term=zumbido&fbclid=fb.123&gclid=google.456',
      ctaOrigin: 'hero',
      sessionId: '11111111-1111-4111-8111-111111111111',
      deviceClass: 'desktop'
    });
  });

  it('keeps the session id stable inside the same browser session', () => {
    const sessionStorage = createMemoryStorage();
    const env = createEnvironment({
      sessionStorage,
      createSessionId: () => '22222222-2222-4222-8222-222222222222'
    });

    const first = getAttributionSnapshot('offer', env);
    const second = getAttributionSnapshot('faq', {
      ...env,
      createSessionId: () => '33333333-3333-4333-8333-333333333333'
    });

    expect(first.sessionId).toBe('22222222-2222-4222-8222-222222222222');
    expect(second.sessionId).toBe('22222222-2222-4222-8222-222222222222');
  });

  it('stores first touch once and updates latest touch when a new campaign arrives', () => {
    const localStorage = createMemoryStorage();
    const sessionStorage = createMemoryStorage();
    const baseEnv = createEnvironment({ localStorage, sessionStorage });

    getAttributionSnapshot('hero', baseEnv);
    getAttributionSnapshot('final', {
      ...baseEnv,
      href: 'https://dofupdate.com.br/?utm_source=google&utm_medium=search&utm_campaign=remarketing&gclid=latest.789',
      referrer: 'https://google.com/'
    });

    const touches = getStoredAttributionTouches({ localStorage, sessionStorage });

    expect(touches.firstTouch?.utmSource).toBe('meta');
    expect(touches.firstTouch?.utmCampaign).toBe('lancamento');
    expect(touches.latestTouch?.utmSource).toBe('google');
    expect(touches.latestTouch?.utmCampaign).toBe('remarketing');
  });

  it('represents direct traffic without inventing campaign data', () => {
    const attribution = getAttributionSnapshot(
      'final',
      createEnvironment({
        href: 'https://dofupdate.com.br/inscricao',
        referrer: ''
      })
    );

    expect(attribution).toMatchObject({
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      fbclid: null,
      gclid: null,
      referrer: null,
      landingUrl: 'https://dofupdate.com.br/inscricao',
      ctaOrigin: 'final'
    });
  });

  it.each([
    [390, 'mobile'],
    [820, 'tablet'],
    [1280, 'desktop']
  ] as const)('classifies a %dpx viewport as %s', (viewportWidth, deviceClass) => {
    const ctaOrigin: CtaOrigin = 'hero';

    expect(getAttributionSnapshot(ctaOrigin, createEnvironment({ viewportWidth })).deviceClass).toBe(
      deviceClass
    );
  });
});
