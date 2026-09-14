import { useRef, useState, type TouchEvent } from 'react';
import type { TicketCategory } from '../../content/event';

interface TicketCarouselProps {
  tickets: TicketCategory[];
  ctaLabel: string;
  onSelectTicket(ticket: TicketCategory, trigger: HTMLButtonElement): void;
}

export function TicketCarousel({ tickets, ctaLabel, onSelectTicket }: TicketCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const ticketCount = tickets.length;
  const previousIndex = (activeIndex - 1 + ticketCount) % ticketCount;
  const nextIndex = (activeIndex + 1) % ticketCount;
  const activeTicket = tickets[activeIndex];
  const previousTicket = tickets[previousIndex];
  const nextTicket = tickets[nextIndex];

  if (!activeTicket || !previousTicket || !nextTicket) {
    return null;
  }

  const goTo = (index: number) => {
    setActiveIndex(((index % ticketCount) + ticketCount) % ticketCount);
  };

  const goPrevious = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;

    if (startX == null || endX == null) {
      return;
    }

    const delta = endX - startX;
    if (Math.abs(delta) < 40) {
      return;
    }

    if (delta < 0) {
      goNext();
    } else {
      goPrevious();
    }
  };

  return (
    <div
      aria-label="Ingressos por categoria"
      aria-roledescription="carrossel"
      className="ticket-carousel"
      role="region"
    >
      <div className="ticket-carousel-controls">
        <button
          aria-label="Ingresso anterior"
          className="ticket-carousel-arrow"
          onClick={goPrevious}
          type="button"
        >
          ‹
        </button>
        <button
          aria-label="Próximo ingresso"
          className="ticket-carousel-arrow"
          onClick={goNext}
          type="button"
        >
          ›
        </button>
      </div>

      <div
        className="ticket-carousel-stage"
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        <TicketCard
          ctaLabel={ctaLabel}
          onSelectTicket={onSelectTicket}
          onSelectSlide={() => goTo(previousIndex)}
          position="left"
          ticket={previousTicket}
        />
        <TicketCard
          ctaLabel={ctaLabel}
          onSelectTicket={onSelectTicket}
          position="center"
          ticket={activeTicket}
        />
        <TicketCard
          ctaLabel={ctaLabel}
          onSelectTicket={onSelectTicket}
          onSelectSlide={() => goTo(nextIndex)}
          position="right"
          ticket={nextTicket}
        />
      </div>

      <div aria-label="Indicadores do carrossel" className="ticket-carousel-dots" role="tablist">
        {tickets.map((ticket, index) => (
          <button
            aria-current={index === activeIndex ? 'true' : undefined}
            aria-label={`Ir para ${ticket.name}`}
            className={`ticket-carousel-dot${index === activeIndex ? ' is-active' : ''}`}
            key={ticket.id}
            onClick={() => goTo(index)}
            role="tab"
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

function TicketCard({
  ticket,
  ctaLabel,
  position,
  onSelectTicket,
  onSelectSlide
}: {
  ticket: TicketCategory;
  ctaLabel: string;
  position: 'left' | 'center' | 'right';
  onSelectTicket(ticket: TicketCategory, trigger: HTMLButtonElement): void;
  onSelectSlide?(): void;
}) {
  const isCenter = position === 'center';

  return (
    <article
      aria-hidden={isCenter ? undefined : true}
      aria-label={`${ticket.name}, ${ticket.price}`}
      aria-roledescription="slide"
      className={`ticket-carousel-card ticket-carousel-card-${position}${
        isCenter ? ' ticket-carousel-card-featured' : ''
      }`}
      data-ticket-card={isCenter ? true : undefined}
      data-ticket-position={position}
      onClick={isCenter ? undefined : onSelectSlide}
    >
      <div className="ticket-carousel-badges">
        {ticket.badge ? <span className="ticket-badge">{ticket.badge}</span> : null}
        {ticket.secondaryBadge ? (
          <span className="ticket-badge ticket-badge-secondary">{ticket.secondaryBadge}</span>
        ) : null}
      </div>
      <p className="eyebrow">Último lote</p>
      <h3>{ticket.name}</h3>
      <strong className="ticket-carousel-price">{ticket.price}</strong>
      <small className="ticket-carousel-validity">Válido {ticket.validUntil}</small>
      {isCenter ? (
        <>
          <ul className="ticket-carousel-summary">
            {ticket.summary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button
            className="button button-primary"
            data-cta-origin="pricing_carousel"
            data-ticket-id={ticket.id}
            onClick={(event) => onSelectTicket(ticket, event.currentTarget)}
            type="button"
          >
            {ctaLabel}
          </button>
        </>
      ) : null}
    </article>
  );
}
