import { describe, expect, it } from 'vitest';
import {
  checkoutReducer,
  createInitialCheckoutState,
  formatBrazilianWhatsApp,
  validateCheckoutForm
} from './checkout-state';

describe('checkout mini-capture state', () => {
  it('opens from a CTA origin and closes with escape while returning to idle state', () => {
    const opened = checkoutReducer(createInitialCheckoutState(), {
      type: 'open',
      ctaOrigin: 'offer'
    });

    expect(opened).toMatchObject({
      isOpen: true,
      ctaOrigin: 'offer',
      status: 'idle'
    });

    const closed = checkoutReducer(opened, { type: 'close' });

    expect(closed).toMatchObject({
      isOpen: false,
      ctaOrigin: null,
      status: 'idle'
    });
  });

  it('validates name, WhatsApp, e-mail and consent before submit', () => {
    expect(
      validateCheckoutForm({
        name: 'A',
        phone: '123',
        email: 'email-invalido',
        consent: false
      })
    ).toEqual({
      name: 'Informe seu nome completo.',
      phone: 'Informe um WhatsApp válido.',
      email: 'Informe um e-mail válido.',
      consent: 'Confirme o uso dos dados para continuar.'
    });

    expect(
      validateCheckoutForm({
        name: 'Ana Silva',
        phone: '(27) 99999-9999',
        email: 'ana@example.com',
        consent: true
      })
    ).toEqual({});
  });

  it('formats WhatsApp with Brazilian country code while typing', () => {
    expect(formatBrazilianWhatsApp('27999999999')).toBe('+55 (27) 99999-9999');
    expect(formatBrazilianWhatsApp('5527999999999')).toBe('+55 (27) 99999-9999');
    expect(formatBrazilianWhatsApp('+55 (27) 99999-9999')).toBe('+55 (27) 99999-9999');
  });

  it('stores the formatted WhatsApp in the reducer when the phone field changes', () => {
    const changed = checkoutReducer(createInitialCheckoutState(), {
      type: 'change',
      field: 'phone',
      value: '27999999999'
    });

    expect(changed.form.phone).toBe('+55 (27) 99999-9999');
  });
});
