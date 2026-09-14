export interface TrackingEnv {
  ga4MeasurementId?: string;
  metaPixelId?: string;
}

type EnvMap = Record<string, string | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => number;
    };
    _fbq?: Window['fbq'];
  }
}

export function readTrackingEnv(env: EnvMap): TrackingEnv {
  return {
    ga4MeasurementId: readOptionalId(env.VITE_GA4_MEASUREMENT_ID),
    metaPixelId: readOptionalId(env.VITE_META_PIXEL_ID)
  };
}

export function initTrackingProviders(config: TrackingEnv): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (config.ga4MeasurementId) {
    initGa4(config.ga4MeasurementId);
  }

  if (config.metaPixelId) {
    initMetaPixel(config.metaPixelId);
  }
}

function readOptionalId(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function initGa4(measurementId: string): void {
  if (document.querySelector(`script[data-dof-ga4="${measurementId}"]`)) {
    return;
  }

  const runtime = globalThis as typeof globalThis & Window;

  runtime.dataLayer = runtime.dataLayer ?? [];
  runtime.gtag =
    runtime.gtag ??
    function gtag(...args: unknown[]) {
      runtime.dataLayer?.push(args);
    };

  runtime.gtag('js', new Date());
  runtime.gtag('config', measurementId, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.dofGa4 = measurementId;
  document.head.appendChild(script);
}

function initMetaPixel(pixelId: string): void {
  if (document.querySelector(`script[data-dof-meta="${pixelId}"]`)) {
    return;
  }

  const runtime = globalThis as typeof globalThis & Window;

  if (!runtime.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq.queue?.push(args);
      }
    } as NonNullable<Window['fbq']>;

    fbq.push = (...args: unknown[]) => {
      fbq.queue?.push(args);
      return fbq.queue?.length ?? 0;
    };
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    runtime.fbq = fbq;
    runtime._fbq = fbq;
  }

  runtime.fbq?.('init', pixelId);

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  script.dataset.dofMeta = pixelId;
  document.head.appendChild(script);
}
