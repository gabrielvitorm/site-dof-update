import type { CtaOrigin } from '@dof-update/contracts';
import type { FormEvent } from 'react';
import type { CheckoutFormErrors, CheckoutFormState } from './checkout-state';

interface CheckoutCaptureModalProps {
  ctaOrigin: CtaOrigin | null;
  errors: CheckoutFormErrors;
  form: CheckoutFormState;
  isOpen: boolean;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onChange(field: keyof CheckoutFormState, value: string | boolean): void;
  onClose(): void;
  onContinueToCheckout(): void;
  onSubmit(event: FormEvent<HTMLFormElement>): void;
}

export function CheckoutCaptureModal({
  ctaOrigin,
  errors,
  form,
  isOpen,
  isSubmitting,
  errorMessage,
  onChange,
  onClose,
  onContinueToCheckout,
  onSubmit
}: CheckoutCaptureModalProps) {
  if (!isOpen) {
    return null;
  }

  const showFallbackContinue = Boolean(errorMessage);

  return (
    <div className="modal-backdrop" data-cta-origin={ctaOrigin ?? undefined}>
      <div
        aria-describedby="checkout-modal-description"
        aria-labelledby="checkout-modal-title"
        aria-modal="true"
        className="checkout-modal"
        role="dialog"
      >
        <button
          aria-label="Fechar minicaptura"
          className="modal-close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        <p className="eyebrow">Inscrição oficial</p>
        <h2 id="checkout-modal-title">Você está a um passo de garantir sua vaga</h2>
        <p id="checkout-modal-description">
          Preencha seus dados para continuar para a inscrição no DOF Update 2026.
        </p>

        <form className="checkout-form" noValidate onSubmit={onSubmit}>
          <FieldError message={errorMessage} />
          <label>
            <span>Nome</span>
            <input
              aria-invalid={Boolean(errors.name)}
              autoComplete="name"
              name="name"
              onChange={(event) => onChange('name', event.currentTarget.value)}
              placeholder="Ex.: Ana Silva"
              type="text"
              value={form.name}
            />
            <FieldError message={errors.name} />
          </label>

          <label>
            <span>WhatsApp</span>
            <input
              aria-invalid={Boolean(errors.phone)}
              autoComplete="tel"
              inputMode="tel"
              maxLength={19}
              name="phone"
              onChange={(event) => onChange('phone', event.currentTarget.value)}
              placeholder="+55 (27) 99999-9999"
              type="tel"
              value={form.phone}
            />
            <FieldError message={errors.phone} />
          </label>

          <label>
            <span>E-mail</span>
            <input
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              inputMode="email"
              name="email"
              onChange={(event) => onChange('email', event.currentTarget.value)}
              placeholder="seuemail@email.com"
              type="email"
              value={form.email}
            />
            <FieldError message={errors.email} />
          </label>

          <label className="consent-row">
            <input
              checked={form.consent}
              name="consent"
              onChange={(event) => onChange('consent', event.currentTarget.checked)}
              type="checkbox"
            />
            <span>
              Seus dados serão utilizados para informações relacionadas à sua inscrição e ao DOF
              Update 2026.
            </span>
          </label>
          <FieldError message={errors.consent} />

          <button className="button button-primary modal-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'PREPARANDO SUA INSCRIÇÃO...' : 'CONTINUAR PARA INSCRIÇÃO'}
          </button>

          {showFallbackContinue ? (
            <button
              className="button button-secondary modal-fallback"
              disabled={isSubmitting}
              onClick={onContinueToCheckout}
              type="button"
            >
              Continuar mesmo assim
            </button>
          ) : null}
        </form>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <small className="field-error" role="alert">
      {message}
    </small>
  );
}
