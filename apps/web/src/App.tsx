import { useEffect, useReducer, useRef, type FormEvent, type ReactNode } from 'react';
import type { CtaOrigin, LeadCaptureResponse } from '@dof-update/contracts';
import { eventContent } from './content/event';
import { createAnalytics } from './features/analytics/analytics';
import { getAttributionSnapshot } from './features/attribution/attribution';
import { CheckoutCaptureModal } from './features/checkout/CheckoutCaptureModal';
import {
  checkoutReducer,
  createInitialCheckoutState,
  hasCheckoutErrors,
  validateCheckoutForm
} from './features/checkout/checkout-state';
import './styles.css';

export function App() {
  const [checkoutState, dispatchCheckout] = useReducer(
    checkoutReducer,
    undefined,
    createInitialCheckoutState
  );
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const analytics = useRef(createAnalytics()).current;

  const openCheckoutCapture = (ctaOrigin: CtaOrigin, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    analytics.trackCtaClick(ctaOrigin);
    dispatchCheckout({ type: 'open', ctaOrigin });
  };

  const closeCheckoutCapture = () => {
    dispatchCheckout({ type: 'close' });
    window.setTimeout(() => lastTriggerRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!checkoutState.isOpen) {
      return undefined;
    }

    const modalElement = document.querySelector<HTMLElement>('.checkout-modal');
    const focusableElements = modalElement?.querySelectorAll<HTMLElement>(
      'button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCheckoutCapture();
        return;
      }

      if (event.key !== 'Tab' || !focusableElements?.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [checkoutState.isOpen]);

  const submitCheckoutCapture = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateCheckoutForm(checkoutState.form);
    if (hasCheckoutErrors(errors)) {
      dispatchCheckout({ type: 'validation_failed', errors });
      return;
    }

    if (!checkoutState.ctaOrigin) {
      return;
    }

    dispatchCheckout({ type: 'submit_started' });

    try {
      const attribution = getAttributionSnapshot(checkoutState.ctaOrigin);
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: checkoutState.form.name,
          phone: checkoutState.form.phone,
          email: checkoutState.form.email,
          consent: checkoutState.form.consent,
          attribution
        })
      });

      if (!response.ok) {
        throw new Error('lead_capture_failed');
      }

      const result = (await response.json()) as LeadCaptureResponse;
      analytics.trackLead({ leadId: result.leadId, attribution });
      analytics.trackBeginCheckout({ leadId: result.leadId, price: 320, currency: 'BRL' });

      if (result.redirectAllowed) {
        window.location.assign(result.checkoutUrl);
      }
    } catch {
      analytics.trackCheckoutRedirectFailed({
        ctaOrigin: checkoutState.ctaOrigin,
        errorCategory: 'lead_capture_failed'
      });
      dispatchCheckout({
        type: 'submit_failed',
        message:
          'Não conseguimos registrar seus dados agora. Tente novamente ou continue para a inscrição.'
      });
    }
  };

  return (
    <main className="landing">
      <HeroSection onOpenCheckoutCapture={openCheckoutCapture} />
      <section className="section section-light" id="why-participate">
        <SectionIntro
          eyebrow="Por que participar"
          title="Atualização científica que se conecta à prática clínica"
          copy={eventContent.whyParticipate}
        />
        <div className="feature-grid">
          {eventContent.pillars.map((pillar) => (
            <article className="feature-card" key={pillar.title}>
              <span>{pillar.title}</span>
              <p>{pillar.description}</p>
              <small>{pillar.focus}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-muted" id="audience">
        <SectionIntro
          eyebrow="Público"
          title="Para quem é o DOF Update 2026?"
          copy="Uma imersão criada para profissionais e estudantes da saúde que querem aprofundar DTM, dor orofacial, sono e cuidado interprofissional."
        />
        <div className="audience-grid">
          {eventContent.audience.map((item) => (
            <article className="audience-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <div className="section-action">
          <CheckoutButton ctaOrigin="audience" onOpen={openCheckoutCapture}>
            GARANTIR MINHA VAGA
          </CheckoutButton>
        </div>
      </section>

      <ProgramSection />
      <SpeakersSection />
      <ExperienceSection />
      <OfferSection onOpenCheckoutCapture={openCheckoutCapture} />
      <LocationSection />
      <FaqSection />
      <FinalCtaSection onOpenCheckoutCapture={openCheckoutCapture} />
      <CheckoutCaptureModal
        ctaOrigin={checkoutState.ctaOrigin}
        errorMessage={checkoutState.errorMessage}
        errors={checkoutState.errors}
        form={checkoutState.form}
        isOpen={checkoutState.isOpen}
        isSubmitting={checkoutState.status === 'submitting'}
        onChange={(field, value) => dispatchCheckout({ type: 'change', field, value })}
        onClose={closeCheckoutCapture}
        onSubmit={submitCheckoutCapture}
      />
    </main>
  );
}

function HeroSection({
  onOpenCheckoutCapture
}: {
  onOpenCheckoutCapture: (ctaOrigin: CtaOrigin, trigger: HTMLButtonElement) => void;
}) {
  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <p className="eyebrow">{eventContent.lot}</p>
        <h1>{eventContent.name}</h1>
        <p className="hero-edition">{eventContent.edition}</p>
        <p className="hero-promise">{eventContent.promise}</p>
        <p className="hero-copy">{eventContent.intro}</p>
      <div className="hero-facts" aria-label="Informacoes principais do evento">
        <span>{eventContent.date}</span>
        <span>{eventContent.venue}</span>
        <span>{eventContent.city}</span>
        <span>Profissionais {eventContent.price}</span>
      </div>
        <div className="hero-actions">
          <CheckoutButton ctaOrigin="hero" onOpen={onOpenCheckoutCapture}>
            {eventContent.primaryCta}
          </CheckoutButton>
          <span>{eventContent.ctaMicrocopy}</span>
          <small>{eventContent.scarcityNote}</small>
        </div>
        <p className="hero-note">
          {eventContent.format}. {eventContent.noRecording}
        </p>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="target target-large" />
        <div className="target target-small" />
        <div className="visual-panel">
          <span>DTM</span>
          <span>Dor Orofacial</span>
          <span>Sono</span>
          <span>Interprofissional</span>
        </div>
      </div>
    </section>
  );
}

function ProgramSection() {
  return (
    <section className="section section-dark" id="program">
      <SectionIntro
        eyebrow="Programação"
        title="Programação DOF Update 2026"
        copy="Dois dias de conteúdo, prática e integração entre profissionais de diferentes áreas da saúde."
      />
      <div className="program-grid">
        {eventContent.program.map((program) => (
          <article className="program-block" key={program.date}>
            <p className="eyebrow">{program.date}</p>
            <h3>{program.title}</h3>
            <strong>{program.time}</strong>
            <p>{program.description}</p>
            <ul>
              {program.agenda.map((agendaItem) => (
                <li key={agendaItem}>{agendaItem}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function SpeakersSection() {
  return (
    <section className="section section-light" id="speakers">
      <SectionIntro
        eyebrow="Palestrantes"
        title="Quem estará no DOF Update 2026"
        copy="Os nomes e credenciais definitivos devem ser inseridos apenas quando forem fornecidos pela organização."
      />
      <div className="speaker-grid">
        {eventContent.speakers.map((speaker) => (
          <article className="speaker-card" key={speaker.name}>
            <div className="speaker-avatar" aria-hidden="true" />
            <h3>{speaker.name}</h3>
            <p>{speaker.specialty}</p>
            <small>{speaker.topic}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="section section-muted" id="experience">
      <SectionIntro
        eyebrow="Experiência"
        title="Mais do que assistir palestras. Uma experiência para ampliar sua prática clínica."
        copy="O DOF Update foi pensado para profissionais que não querem apenas acumular informação, mas compreender melhor os casos que chegam ao consultório."
      />
      <div className="line-list">
        {eventContent.differentiators.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
      <aside className="workshop-callout">
        <p className="eyebrow">Workshop</p>
        <h3>Workshop de Tecnologias para Dor</h3>
        <p>{eventContent.workshopNotice}</p>
      </aside>
    </section>
  );
}

function OfferSection({
  onOpenCheckoutCapture
}: {
  onOpenCheckoutCapture: (ctaOrigin: CtaOrigin, trigger: HTMLButtonElement) => void;
}) {
  return (
    <section className="section offer-section" id="offer">
      <div>
        <p className="eyebrow">{eventContent.lot}</p>
        <h2>Garanta sua vaga no DOF Update 2026</h2>
        <p>
          {eventContent.edition}. Um dia inteiro de atualização científica, integração entre especialidades e
          discussões voltadas para a prática clínica.
        </p>
        <CheckoutButton ctaOrigin="offer" onOpen={onOpenCheckoutCapture}>
          {eventContent.primaryCta}
        </CheckoutButton>
        <p className="cta-support">{eventContent.ctaMicrocopy}</p>
        <a className="even3-inline-link" href={eventContent.even3RegistrationUrl} rel="noreferrer" target="_blank">
          Abrir página oficial na Even3
        </a>
        <p className="scarcity-note">{eventContent.scarcityNote}</p>
      </div>
      <div className="price-box">
        <span>{eventContent.lot}</span>
        <h3>Ingressos por categoria</h3>
        <p>Valores oficiais da Even3 válidos {eventContent.ticketValidity}, sujeitos à disponibilidade.</p>
        <div className="ticket-grid">
          {eventContent.ticketCategories.map((ticket) => (
            <article className="ticket-card" key={ticket.name}>
              <div>
                <h4>{ticket.name}</h4>
                {ticket.badge ? <span className="ticket-badge">{ticket.badge}</span> : null}
              </div>
              <strong>{ticket.price}</strong>
              <small>{ticket.validUntil}</small>
              <a href={eventContent.even3RegistrationUrl} rel="noreferrer" target="_blank">
                Ver na Even3
              </a>
            </article>
          ))}
        </div>
      </div>
      <div className="group-box">
        <h3>{eventContent.groupOffer.title}</h3>
        {eventContent.groupOffer.items.map((item) => (
          <p key={item}>{item}</p>
        ))}
        <a href={eventContent.groupOffer.url} rel="noreferrer" target="_blank">
          {eventContent.groupOffer.cta}
        </a>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section className="section section-light" id="location">
      <SectionIntro
        eyebrow="Localização"
        title={eventContent.location.title}
        copy={`${eventContent.venue} - ${eventContent.city}. ${eventContent.location.guidance}`}
      />
      <div className="location-panel">
        <div className="map-frame">
          <iframe
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={eventContent.location.mapEmbedUrl}
            title="Mapa do Auditório da FAESA"
          />
          <address>{eventContent.location.address}</address>
        </div>
        <a
          className="button button-secondary"
          href={eventContent.location.mapsDirectionsUrl}
          rel="noreferrer"
          target="_blank"
        >
          Traçar rota
        </a>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section section-muted" id="faq">
      <SectionIntro eyebrow="FAQ" title="Perguntas frequentes" copy="Respostas para as principais dúvidas antes da inscrição." />
      <div className="faq-list">
        {eventContent.faqs.map((faq) => (
          <FaqItem answer={faq.answer} key={faq.question} question={faq.question} />
        ))}
      </div>
    </section>
  );
}

function FinalCtaSection({
  onOpenCheckoutCapture
}: {
  onOpenCheckoutCapture: (ctaOrigin: CtaOrigin, trigger: HTMLButtonElement) => void;
}) {
  return (
    <section className="final-cta" id="final">
      <p className="eyebrow">Próxima atualização clínica</p>
      <h2>Sua próxima atualização clínica pode começar aqui.</h2>
      <p>
        {eventContent.name} - Ciência, prática clínica e diferentes especialidades reunidas em torno do mesmo
        paciente.
      </p>
      <div className="quick-facts">
        <span>{eventContent.name}</span>
        <span>03 de outubro</span>
        <span>Vitória/ES</span>
        <span>{eventContent.lot} - categorias até 01/10</span>
      </div>
      <CheckoutButton ctaOrigin="final" onOpen={onOpenCheckoutCapture}>
        {eventContent.primaryCta}
      </CheckoutButton>
    </section>
  );
}

function CheckoutButton({
  children,
  ctaOrigin,
  onOpen
}: {
  children: ReactNode;
  ctaOrigin: CtaOrigin;
  onOpen: (ctaOrigin: CtaOrigin, trigger: HTMLButtonElement) => void;
}) {
  return (
    <button
      className="button button-primary"
      data-cta-origin={ctaOrigin}
      onClick={(event) => onOpen(ctaOrigin, event.currentTarget)}
      type="button"
    >
      {children}
    </button>
  );
}

function FaqItem({ answer, question }: { answer: string; question: string }) {
  const [isOpen, toggleOpen] = useReducer((value: boolean) => !value, false);

  return (
    <article className="faq-item">
      <button
        aria-expanded={isOpen}
        className="faq-trigger"
        onClick={toggleOpen}
        type="button"
      >
        {question}
        <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      <div className="faq-answer" hidden={!isOpen}>
        <p>{answer}</p>
      </div>
    </article>
  );
}

function SectionIntro({
  eyebrow,
  title,
  copy
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}
