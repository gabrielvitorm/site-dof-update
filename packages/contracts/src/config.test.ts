import { describe, expect, it } from 'vitest';
import { publicConfigSchema } from './config';

describe('public config contract', () => {
  it('accepts only public checkout and landing configuration', () => {
    const result = publicConfigSchema.safeParse({
      eventPrice: 320,
      salesPhase: 'Ultimo lote',
      checkoutUrl: 'https://www.even3.com.br/checkout',
      checkoutFallbackUrl: 'https://www.even3.com.br/evento',
      groupFormUrl: 'https://forms.gle/aSKo8XbHoPgSzHXn9',
      mapsUrl: 'https://maps.google.com/?q=FAESA',
      salesEnabled: true
    });

    expect(result.success).toBe(true);
  });

  it('rejects malformed public URLs and non-positive prices', () => {
    const result = publicConfigSchema.safeParse({
      eventPrice: 0,
      salesPhase: 'Ultimo lote',
      checkoutUrl: 'not-a-url',
      checkoutFallbackUrl: 'https://www.even3.com.br/evento',
      groupFormUrl: 'https://forms.gle/aSKo8XbHoPgSzHXn9',
      mapsUrl: 'https://maps.google.com/?q=FAESA',
      salesEnabled: true
    });

    expect(result.success).toBe(false);
  });
});

