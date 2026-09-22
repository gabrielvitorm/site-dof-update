import type { Attribution, CtaOrigin, DeviceClass } from '@dof-update/contracts';
import {
  getOrCreateSessionId,
  readStorageValue,
  writeStorageValue,
  type StorageLike
} from './session';

export type { StorageLike };

export interface AttributionEnvironment {
  href: string;
  referrer: string;
  localStorage: StorageLike;
  sessionStorage: StorageLike;
  viewportWidth: number;
  createSessionId: () => string;
}

export interface AttributionTouch {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fbclid: string | null;
  gclid: string | null;
  referrer: string | null;
  landingUrl: string;
}

const FIRST_TOUCH_KEY = 'dofupdate.attribution.firstTouch';
const LATEST_TOUCH_KEY = 'dofupdate.attribution.latestTouch';

export function getAttributionSnapshot(
  ctaOrigin: CtaOrigin,
  environment: AttributionEnvironment = createBrowserEnvironment()
): Attribution {
  const currentTouch = createTouchFromEnvironment(environment);
  const storedTouches = getStoredAttributionTouches(environment);

  if (!storedTouches.firstTouch) {
    writeStorageValue(environment.localStorage, FIRST_TOUCH_KEY, JSON.stringify(currentTouch));
  }

  const shouldReplaceLatest = hasCampaignSignal(currentTouch) || !storedTouches.latestTouch;
  let latestTouch: AttributionTouch = currentTouch;

  if (!shouldReplaceLatest && storedTouches.latestTouch) {
    latestTouch = storedTouches.latestTouch;
  }

  if (shouldReplaceLatest) {
    writeStorageValue(environment.sessionStorage, LATEST_TOUCH_KEY, JSON.stringify(latestTouch));
  }

  return {
    ...latestTouch,
    ctaOrigin,
    sessionId: getOrCreateSessionId(environment.sessionStorage, environment.createSessionId),
    deviceClass: classifyDevice(environment.viewportWidth)
  };
}

export function getMetaBrowserTracking(): { fbp: string | null; fbc: string | null } {
  const cookies = globalThis.document?.cookie ?? '';
  const values = new Map(
    cookies
      .split(';')
      .map((cookie) => cookie.trim().split('='))
      .filter(([name, value]) => name && value)
      .map(([name, value]) => [name, decodeURIComponent(value ?? '')])
  );

  return {
    fbp: values.get('_fbp') ?? null,
    fbc: values.get('_fbc') ?? null
  };
}

export function getStoredAttributionTouches(storage: {
  localStorage: StorageLike;
  sessionStorage: StorageLike;
}): {
  firstTouch: AttributionTouch | null;
  latestTouch: AttributionTouch | null;
} {
  return {
    firstTouch: readStoredTouch(storage.localStorage, FIRST_TOUCH_KEY),
    latestTouch: readStoredTouch(storage.sessionStorage, LATEST_TOUCH_KEY)
  };
}

function createTouchFromEnvironment(environment: AttributionEnvironment): AttributionTouch {
  const url = new URL(environment.href);

  return {
    utmSource: readParam(url, 'utm_source', 500),
    utmMedium: readParam(url, 'utm_medium', 500),
    utmCampaign: readParam(url, 'utm_campaign', 500),
    utmContent: readParam(url, 'utm_content', 500),
    utmTerm: readParam(url, 'utm_term', 500),
    fbclid: readParam(url, 'fbclid', 1000),
    gclid: readParam(url, 'gclid', 1000),
    referrer: normalizeNullableString(environment.referrer, 500),
    landingUrl: trimToMax(environment.href.trim(), 500)
  };
}

function readParam(url: URL, paramName: string, maxLength: number): string | null {
  return normalizeNullableString(url.searchParams.get(paramName), maxLength);
}

function normalizeNullableString(value: string | null, maxLength: number): string | null {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  return trimToMax(trimmed, maxLength);
}

function trimToMax(value: string, maxLength: number): string {
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function hasCampaignSignal(touch: AttributionTouch): boolean {
  return Boolean(
    touch.utmSource ||
      touch.utmMedium ||
      touch.utmCampaign ||
      touch.utmContent ||
      touch.utmTerm ||
      touch.fbclid ||
      touch.gclid
  );
}

function readStoredTouch(storage: StorageLike, key: string): AttributionTouch | null {
  const serialized = readStorageValue(storage, key);

  if (!serialized) {
    return null;
  }

  try {
    return JSON.parse(serialized) as AttributionTouch;
  } catch {
    return null;
  }
}

function classifyDevice(viewportWidth: number): DeviceClass {
  if (viewportWidth <= 767) {
    return 'mobile';
  }

  if (viewportWidth <= 1024) {
    return 'tablet';
  }

  return 'desktop';
}

function createBrowserEnvironment(): AttributionEnvironment {
  return {
    href: globalThis.location?.href ?? '',
    referrer: globalThis.document?.referrer ?? '',
    localStorage: globalThis.localStorage,
    sessionStorage: globalThis.sessionStorage,
    viewportWidth: globalThis.innerWidth,
    createSessionId: () => globalThis.crypto.randomUUID()
  };
}
