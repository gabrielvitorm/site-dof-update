import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { eventContent } from '../../content/event';
import { TicketCarousel } from './TicketCarousel';

describe('TicketCarousel', () => {
  it('renders professional ticket first with capture CTAs and preview-friendly markup', () => {
    const onSelectTicket = vi.fn();
    const html = renderToStaticMarkup(
      <TicketCarousel
        ctaLabel="GARANTIR MINHA VAGA"
        onSelectTicket={onSelectTicket}
        tickets={eventContent.ticketCategories}
      />
    );

    expect(html).toContain('ticket-carousel-card-featured');
    expect(html).toContain('ticket-carousel-card-center');
    expect(html).toContain('ticket-carousel-card-left');
    expect(html).toContain('ticket-carousel-card-right');
    expect(html).toContain('data-ticket-position="left"');
    expect(html).toContain('data-ticket-position="center"');
    expect(html).toContain('data-ticket-position="right"');
    expect(html).toMatch(
      /ticket-carousel-card-center[\s\S]*?<h3>Profissionais<\/h3>[\s\S]*?R\$ 320,00/
    );
    expect(html).toMatch(/ticket-carousel-card-right[\s\S]*?<h3>Aluno de graduação<\/h3>/);
    expect(html).toContain('Acesso ao evento principal');
    expect(html).toContain('Programação científica completa');
    expect(html).toContain('Networking interprofissional');
    expect(html).toContain('Evento + Pré-evento');
    expect(html).toContain('aria-label="Ingresso anterior"');
    expect(html).toContain('aria-label="Próximo ingresso"');
    expect(html).toContain('data-cta-origin="pricing_carousel"');
    expect(html).toContain('GARANTIR MINHA VAGA');
    expect(html).not.toContain('Ver na Even3');
  });
});
