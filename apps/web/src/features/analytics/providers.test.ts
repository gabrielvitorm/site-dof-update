import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initTrackingProviders, readTrackingEnv } from './providers';

function createDocumentMock() {
  const headChildren: Array<{
    async: boolean;
    src: string;
    dataset: Record<string, string>;
  }> = [];

  const querySelector = (selector: string) => {
    if (selector.startsWith('script[data-dof-ga4=')) {
      const id = selector.slice('script[data-dof-ga4="'.length, -2);
      return headChildren.find((node) => node.dataset.dofGa4 === id) ?? null;
    }
    if (selector.startsWith('script[data-dof-meta=')) {
      const id = selector.slice('script[data-dof-meta="'.length, -2);
      return headChildren.find((node) => node.dataset.dofMeta === id) ?? null;
    }
    return null;
  };

  const head = {
    appendChild(node: (typeof headChildren)[number]) {
      headChildren.push(node);
      return node;
    },
    querySelector
  };

  return {
    head,
    querySelector,
    createElement(tagName: string) {
      if (tagName !== 'script') {
        throw new Error(`Unexpected element: ${tagName}`);
      }

      return {
        async: false,
        src: '',
        dataset: {} as Record<string, string>
      };
    },
    getScripts: () => headChildren
  };
}

describe('tracking providers', () => {
  beforeEach(() => {
    const documentMock = createDocumentMock();
    vi.stubGlobal('document', documentMock);
    (globalThis as { __dofDocumentMock?: ReturnType<typeof createDocumentMock> }).__dofDocumentMock =
      documentMock;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete (globalThis as { dataLayer?: unknown }).dataLayer;
    delete (globalThis as { gtag?: unknown }).gtag;
    delete (globalThis as { fbq?: unknown }).fbq;
    delete (globalThis as { _fbq?: unknown })._fbq;
    delete (globalThis as { __dofDocumentMock?: unknown }).__dofDocumentMock;
  });

  it('reads GA4 and Meta ids from vite env', () => {
    expect(
      readTrackingEnv({
        VITE_GA4_MEASUREMENT_ID: 'G-T21VTEB82Y',
        VITE_META_PIXEL_ID: '1260445516208115'
      })
    ).toEqual({
      ga4MeasurementId: 'G-T21VTEB82Y',
      metaPixelId: '1260445516208115'
    });
  });

  it('ignores blank provider ids', () => {
    expect(
      readTrackingEnv({
        VITE_GA4_MEASUREMENT_ID: '  ',
        VITE_META_PIXEL_ID: undefined
      })
    ).toEqual({
      ga4MeasurementId: undefined,
      metaPixelId: undefined
    });
  });

  it('bootstraps gtag and Meta Pixel when ids are present', () => {
    const documentMock = (
      globalThis as unknown as { __dofDocumentMock: ReturnType<typeof createDocumentMock> }
    ).__dofDocumentMock;
    const appendChildSpy = vi.spyOn(documentMock.head, 'appendChild');

    initTrackingProviders({
      ga4MeasurementId: 'G-T21VTEB82Y',
      metaPixelId: '1260445516208115'
    });

    const scriptSources = appendChildSpy.mock.calls
      .map(([node]) => (node as { src: string }).src)
      .filter(Boolean);

    expect(scriptSources).toContain(
      'https://www.googletagmanager.com/gtag/js?id=G-T21VTEB82Y'
    );
    expect(scriptSources).toContain('https://connect.facebook.net/en_US/fbevents.js');
    expect(typeof (globalThis as { gtag?: unknown }).gtag).toBe('function');
    expect(typeof (globalThis as { fbq?: unknown }).fbq).toBe('function');
    expect((globalThis as { dataLayer?: unknown[] }).dataLayer?.length).toBeGreaterThan(0);
  });

  it('does not inject provider scripts without ids', () => {
    const documentMock = (
      globalThis as unknown as { __dofDocumentMock: ReturnType<typeof createDocumentMock> }
    ).__dofDocumentMock;
    const appendChildSpy = vi.spyOn(documentMock.head, 'appendChild');

    initTrackingProviders({});

    expect(appendChildSpy).not.toHaveBeenCalled();
  });
});
