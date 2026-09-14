import type { CtaOrigin } from '@dof-update/contracts';
import type { TicketCategory } from '../../content/event';

export interface CheckoutFormState {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormState, string>>;

export type CheckoutStatus = 'idle' | 'submitting' | 'error';

export interface SelectedCheckoutTicket {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  variant: TicketCategory['variant'];
  checkoutUrl: string;
}

export interface CheckoutState {
  isOpen: boolean;
  ctaOrigin: CtaOrigin | null;
  selectedTicket: SelectedCheckoutTicket | null;
  form: CheckoutFormState;
  errors: CheckoutFormErrors;
  status: CheckoutStatus;
  errorMessage: string | null;
}

export type CheckoutAction =
  | { type: 'open'; ctaOrigin: CtaOrigin; ticket: SelectedCheckoutTicket }
  | { type: 'close' }
  | { type: 'change'; field: keyof CheckoutFormState; value: string | boolean }
  | { type: 'validation_failed'; errors: CheckoutFormErrors }
  | { type: 'submit_started' }
  | { type: 'submit_failed'; message: string };

const initialForm: CheckoutFormState = {
  name: '',
  phone: '',
  email: '',
  consent: true
};

export function formatBrazilianWhatsApp(value: string): string {
  const digitsOnly = value.replace(/\D/g, '');

  if (!digitsOnly) {
    return '';
  }

  const prefixedByMask = value.trimStart().startsWith('+55');
  let nationalDigits = digitsOnly;

  if (digitsOnly.startsWith('55') && (prefixedByMask || digitsOnly.length > 11)) {
    nationalDigits = digitsOnly.slice(2);
  }

  nationalDigits = nationalDigits.slice(0, 11);

  const areaCode = nationalDigits.slice(0, 2);
  const firstPart = nationalDigits.length > 10 ? nationalDigits.slice(2, 7) : nationalDigits.slice(2, 6);
  const secondPart = nationalDigits.length > 10 ? nationalDigits.slice(7, 11) : nationalDigits.slice(6, 10);

  let formatted = '+55';

  if (areaCode) {
    formatted += ` (${areaCode}`;
  }

  if (areaCode.length === 2) {
    formatted += ')';
  }

  if (firstPart) {
    formatted += ` ${firstPart}`;
  }

  if (secondPart) {
    formatted += `-${secondPart}`;
  }

  return formatted;
}

export function createInitialCheckoutState(): CheckoutState {
  return {
    isOpen: false,
    ctaOrigin: null,
    selectedTicket: null,
    form: initialForm,
    errors: {},
    status: 'idle',
    errorMessage: null
  };
}

export function toSelectedCheckoutTicket(ticket: TicketCategory): SelectedCheckoutTicket {
  return {
    id: ticket.id,
    name: ticket.name,
    price: ticket.price,
    priceValue: ticket.priceValue,
    variant: ticket.variant,
    checkoutUrl: ticket.checkoutUrl
  };
}

export function resolveCheckoutRedirectUrl(
  selectedTicket: SelectedCheckoutTicket | null,
  apiCheckoutUrl: string
): string {
  return selectedTicket?.checkoutUrl ?? apiCheckoutUrl;
}

export function canContinueToCheckout(
  selectedTicket: SelectedCheckoutTicket | null,
  apiCheckoutUrl = ''
): boolean {
  return Boolean(resolveCheckoutRedirectUrl(selectedTicket, apiCheckoutUrl));
}

export function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        isOpen: true,
        ctaOrigin: action.ctaOrigin,
        selectedTicket: action.ticket,
        errors: {},
        status: 'idle',
        errorMessage: null
      };
    case 'close':
      return {
        ...state,
        isOpen: false,
        ctaOrigin: null,
        selectedTicket: null,
        status: 'idle',
        errorMessage: null
      };
    case 'change': {
      const nextValue =
        action.field === 'phone' && typeof action.value === 'string'
          ? formatBrazilianWhatsApp(action.value)
          : action.value;

      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: nextValue
        },
        errors: {
          ...state.errors,
          [action.field]: undefined
        }
      };
    }
    case 'validation_failed':
      return {
        ...state,
        errors: action.errors,
        status: 'idle'
      };
    case 'submit_started':
      return {
        ...state,
        status: 'submitting',
        errorMessage: null
      };
    case 'submit_failed':
      return {
        ...state,
        status: 'error',
        errorMessage: action.message
      };
  }
}

export function validateCheckoutForm(form: CheckoutFormState): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  if (form.name.trim().split(/\s+/).filter(Boolean).length < 2) {
    errors.name = 'Informe seu nome completo.';
  }

  const digitCount = form.phone.replace(/\D/g, '').length;
  if (digitCount < 10 || digitCount > 15) {
    errors.phone = 'Informe um WhatsApp válido.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (!form.consent) {
    errors.consent = 'Confirme o uso dos dados para continuar.';
  }

  return errors;
}

export function hasCheckoutErrors(errors: CheckoutFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}
