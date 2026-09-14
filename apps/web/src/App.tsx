import { useEffect, useReducer, useRef, type FormEvent, type ReactNode } from 'react';
import type { CtaOrigin, LeadCaptureResponse } from '@dof-update/contracts';
import { eventContent, type TicketCategory } from './content/event';
import { createAnalytics, type Analytics } from './features/analytics/analytics';
import { readTrackingEnv } from './features/analytics/providers';
import { getAttributionSnapshot } from './features/attribution/attribution';
import { CheckoutCaptureModal } from './features/checkout/CheckoutCaptureModal';
import {
  checkoutReducer,
  canContinueToCheckout,
  createInitialCheckoutState,
  hasCheckoutErrors,
  resolveCheckoutRedirectUrl,
  toSelectedCheckoutTicket,
  validateCheckoutForm
} from './features/checkout/checkout-state';
import { TicketCarousel } from './features/pricing/TicketCarousel';
import './styles.css';

export function App() {
  const [checkoutState, dispatchCheckout] = useReducer(
    checkoutReducer,
    undefined,
    createInitialCheckoutState
  );
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const analytics = useRef(createAnalytics(readTrackingEnv(import.meta.env))).current;
  const hasTrackedLandingRef = useRef(false);

  useEffect(() => {
    if (hasTrackedLandingRef.current) {
      return;
    }

    hasTrackedLandingRef.current = true;
    const attribution = getAttributionSnapshot('hero');
    analytics.trackPageView(attribution);
    analytics.trackViewContent(attribution);
  }, [analytics]);

  const openCheckoutCapture = (
    ctaOrigin: CtaOrigin,
    trigger: HTMLButtonElement,
    ticket?: TicketCategory
  ) => {
    const selectedTicket = toSelectedCheckoutTicket(
      ticket ?? eventContent.ticketCategories[0]!
    );
    lastTriggerRef.current = trigger;
    analytics.trackCtaClick({
      ctaOrigin,
      ticketType: selectedTicket.name,
      ticketPrice: selectedTicket.price,
      ticketVariant: selectedTicket.variant
    });
    analytics.trackLeadFormOpen(ctaOrigin);
    dispatchCheckout({ type: 'open', ctaOrigin, ticket: selectedTicket });
  };

  const closeCheckoutCapture = () => {
    dispatchCheckout({ type: 'close' });
    window.setTimeout(() => lastTriggerRef.current?.focus(), 0);
  };

  const redirectToSelectedCheckout = (apiCheckoutUrl = '') => {
    const checkoutUrl = resolveCheckoutRedirectUrl(
      checkoutState.selectedTicket,
      apiCheckoutUrl
    );

    if (!checkoutUrl) {
      return;
    }

    window.location.assign(checkoutUrl);
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
    analytics.trackLeadFormSubmit(checkoutState.ctaOrigin);

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
      const checkoutPrice = checkoutState.selectedTicket?.priceValue ?? 320;

      analytics.trackLead({ leadId: result.leadId, attribution });
      analytics.trackBeginCheckout({
        leadId: result.leadId,
        price: checkoutPrice,
        currency: 'BRL'
      });

      if (result.redirectAllowed) {
        redirectToSelectedCheckout(result.checkoutUrl);
      }
    } catch {
      analytics.trackCheckoutRedirectFailed({
        ctaOrigin: checkoutState.ctaOrigin,
        errorCategory: 'lead_capture_failed'
      });

      // API/proxy may be unavailable in local or degraded production.
      // Never trap a valid form behind lead capture — go to the selected ticket.
      if (canContinueToCheckout(checkoutState.selectedTicket)) {
        redirectToSelectedCheckout();
        return;
      }

      dispatchCheckout({
        type: 'submit_failed',
        message:
          'Não conseguimos registrar seus dados agora. Você pode tentar de novo ou continuar para a inscrição.'
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
      <PreEventSection />
      <OfferSection analytics={analytics} onOpenCheckoutCapture={openCheckoutCapture} />
      <LocationSection analytics={analytics} />
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
        onContinueToCheckout={() => redirectToSelectedCheckout()}
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
  const { mainProgram } = eventContent;

  return (
    <section className="section section-dark" id="program">
      <SectionIntro
        eyebrow="Programação"
        title="Programação DOF Update 2026"
        copy={mainProgram.description}
      />
      <div className="program-meta">
        <span>{mainProgram.date}</span>
        <span>{mainProgram.time}</span>
        <span>{mainProgram.venue}</span>
      </div>
      <div className="program-milestones" aria-label="Marcos do dia">
        {mainProgram.milestones.map((milestone) => (
          <span key={milestone}>{milestone}</span>
        ))}
      </div>
      <div className="program-schedule">
        {mainProgram.periods.map((period) => (
          <article className="program-period" key={period.label}>
            <header className="program-period-header">
              <p className="eyebrow">03 OUT</p>
              <h3>{period.label}</h3>
            </header>
            <div className="program-talk-list">
              {period.talks.map((talk) => (
                <div className="program-talk" key={`${talk.speaker}-${talk.topic}`}>
                  <h4>{talk.speaker}</h4>
                  <p className="program-talk-topic">{talk.topic}</p>
                  <span className="program-talk-profession">{talk.profession}</span>
                </div>
              ))}
            </div>
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
        copy={eventContent.speakersIntro[0] ?? ''}
      />
      <p className="speakers-support">{eventContent.speakersIntro[1]}</p>
      <div className="speaker-grid">
        {eventContent.speakers.map((speaker) => (
          <article className="speaker-card" key={speaker.name}>
            {speaker.image ? (
              <img
                alt={speaker.name}
                className="speaker-avatar speaker-avatar-photo"
                height={96}
                loading="lazy"
                src={speaker.image}
                width={96}
              />
            ) : (
              <div className="speaker-avatar" aria-hidden="true" />
            )}
            <h3>{speaker.name}</h3>
            <p className="speaker-profession">{speaker.profession}</p>
            <small>{speaker.topic}</small>
            <p className="speaker-bio">{speaker.bio}</p>
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
    </section>
  );
}

function PreEventSection() {
  const { preEvent } = eventContent;

  return (
    <section className="section section-pre-event" id="pre-event">
      <div className="pre-event-banner">
        <span className="pre-event-date-badge">{preEvent.dateLabel}</span>
        <div>
          <p className="eyebrow">Pré-evento</p>
          <h2>{preEvent.title}</h2>
          <h3>{preEvent.subtitle}</h3>
        </div>
      </div>
      <div className="pre-event-meta">
        <span>{preEvent.date}</span>
        <span>{preEvent.time}</span>
        <span>{preEvent.venue}</span>
      </div>
      <div className="pre-event-copy">
        {preEvent.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ul className="pre-event-notices">
        {preEvent.notices.map((notice) => (
          <li key={notice}>{notice}</li>
        ))}
      </ul>
      <div className="workshop-grid">
        {preEvent.workshops.map((workshop, index) => (
          <article className="workshop-card" key={workshop.title}>
            <p className="eyebrow">Workshop {String(index + 1).padStart(2, '0')}</p>
            <h3>{workshop.title}</h3>
            <div className="workshop-hosts">
              {workshop.hosts.map((host) => (
                <p key={`${workshop.title}-${host.name}`}>
                  <strong>{host.name}</strong>
                  <span>{host.profession}</span>
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="pre-event-guests">
        <h3>Convidados do pré-evento</h3>
        <div className="guest-grid">
          {preEvent.guests.map((guest) => (
            <article className="guest-card" key={guest.name}>
              <h4>{guest.name}</h4>
              <p className="speaker-profession">{guest.profession}</p>
              <p>{guest.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferSection({
  analytics,
  onOpenCheckoutCapture
}: {
  analytics: Analytics;
  onOpenCheckoutCapture: (
    ctaOrigin: CtaOrigin,
    trigger: HTMLButtonElement,
    ticket?: TicketCategory
  ) => void;
}) {
  return (
    <section className="section offer-section" id="offer">
      <div className="offer-copy">
        <p className="eyebrow">{eventContent.lot}</p>
        <h2>Garanta sua vaga no DOF Update 2026</h2>
        <p>Escolha a categoria da sua inscrição. Estamos no último lote.</p>
      </div>

      <TicketCarousel
        ctaLabel={eventContent.primaryCta}
        onSelectTicket={(ticket, trigger) =>
          onOpenCheckoutCapture('pricing_carousel', trigger, ticket)
        }
        tickets={eventContent.ticketCategories}
      />

      <p className="cta-support offer-microcopy">{eventContent.ctaMicrocopy}</p>
      <a className="even3-inline-link" href={eventContent.even3RegistrationUrl} rel="noreferrer" target="_blank">
        Abrir página oficial na Even3
      </a>

      <div className="group-box">
        <h3>{eventContent.groupOffer.title}</h3>
        {eventContent.groupOffer.items.map((item) => (
          <p key={item}>{item}</p>
        ))}
        <a
          href={eventContent.groupOffer.url}
          onClick={() => analytics.trackGroupInterest('offer')}
          rel="noreferrer"
          target="_blank"
        >
          {eventContent.groupOffer.cta}
        </a>
      </div>
    </section>
  );
}

function LocationSection({ analytics }: { analytics: Analytics }) {
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
          onClick={() => analytics.trackMapOpen('location')}
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
