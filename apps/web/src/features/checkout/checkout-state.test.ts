import { describe, expect, it } from 'vitest';
import { eventContent } from '../../content/event';
import {
  canContinueToCheckout,
  checkoutReducer,
  createInitialCheckoutState,
  formatBrazilianWhatsApp,
  resolveCheckoutRedirectUrl,
  toSelectedCheckoutTicket,
  validateCheckoutForm
} from './checkout-state';

const profissionaisTicket = toSelectedCheckoutTicket(eventContent.ticketCategories[0]!);

describe('checkout mini-capture state', () => {
  it('opens from a CTA origin with selected ticket and clears ticket on close', () => {
    const opened = checkoutReducer(createInitialCheckoutState(), {
      type: 'open',
      ctaOrigin: 'offer',
      ticket: profissionaisTicket
    });

    expect(opened).toMatchObject({
      isOpen: true,
      ctaOrigin: 'offer',
      selectedTicket: profissionaisTicket,
      status: 'idle'
    });

    const closed = checkoutReducer(opened, { type: 'close' });

    expect(closed).toMatchObject({
      isOpen: false,
      ctaOrigin: null,
      selectedTicket: null,
      status: 'idle'
    });
  });

  it('prefers the selected ticket checkout URL over the API fallback', () => {
    expect(
      resolveCheckoutRedirectUrl(
        profissionaisTicket,
        'https://www.even3.com.br/fallback'
      )
    ).toBe(profissionaisTicket.checkoutUrl);

    expect(resolveCheckoutRedirectUrl(null, 'https://www.even3.com.br/fallback')).toBe(
      'https://www.even3.com.br/fallback'
    );
  });

  it('keeps the selected ticket available after submit failure for checkout fallback', () => {
    const opened = checkoutReducer(createInitialCheckoutState(), {
      type: 'open',
      ctaOrigin: 'pricing_carousel',
      ticket: profissionaisTicket
    });

    const failed = checkoutReducer(opened, {
      type: 'submit_failed',
      message: 'Não conseguimos registrar seus dados agora.'
    });

    expect(failed).toMatchObject({
      status: 'error',
      selectedTicket: profissionaisTicket,
      isOpen: true
    });
    expect(resolveCheckoutRedirectUrl(failed.selectedTicket, '')).toBe(
      profissionaisTicket.checkoutUrl
    );
    expect(canContinueToCheckout(failed.selectedTicket)).toBe(true);
    expect(canContinueToCheckout(null, '')).toBe(false);
  });

  it('maps each ticket category to its Even3 idIngresso', () => {
    const byId = Object.fromEntries(
      eventContent.ticketCategories.map((ticket) => {
        const idIngresso = new URL(ticket.checkoutUrl).searchParams.get('idIngresso');
        return [ticket.id, idIngresso];
      })
    );

    expect(byId).toEqual({
      profissionais: '820401',
      'aluno-graduacao': '820404',
      'profissionais-abrafito': '840321',
      'profissionais-combo': '850856',
      'aluno-combo': '850858',
      'abrafito-combo': '850860'
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

  it('does not duplicate country-code 55 while typing into the masked value', () => {
    expect(formatBrazilianWhatsApp('2')).toBe('+55 (2');
    expect(formatBrazilianWhatsApp('+55 (2')).toBe('+55 (2');
    expect(formatBrazilianWhatsApp('+55 (27')).toBe('+55 (27)');
    expect(formatBrazilianWhatsApp('+55 (27) 9')).toBe('+55 (27) 9');
    expect(formatBrazilianWhatsApp('+55 (27) 9999-9999')).toBe('+55 (27) 9999-9999');
    expect(formatBrazilianWhatsApp('+55 (27) 99999-9999')).toBe('+55 (27) 99999-9999');
    expect(formatBrazilianWhatsApp('+55 (55) 98877-6655')).toBe('+55 (55) 98877-6655');
  });

  it('stores the formatted WhatsApp in the reducer when the phone field changes', () => {
    let state = createInitialCheckoutState();

    for (const digit of '27999999999') {
      state = checkoutReducer(state, {
        type: 'change',
        field: 'phone',
        value: `${state.form.phone}${digit}`
      });
    }

    expect(state.form.phone).toBe('+55 (27) 99999-9999');
  });
});
