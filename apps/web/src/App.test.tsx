import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from './App';
import { CheckoutCaptureModal } from './features/checkout/CheckoutCaptureModal';

describe('DOF Update landing page', () => {
  it('renders the approved landing sections and official event facts', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('DOF Update 2026');
    expect(html).toContain('III Imersão Interprofissional em DTM e Dores Orofaciais');
    expect(html).toContain('03 de outubro de 2026');
    expect(html).toContain('Auditório da FAESA');
    expect(html).toContain('Vitória, ES');
    expect(html).toContain('Av. Vitória, 2220 - Monte Belo, Vitória - ES, 29053-360');
    expect(html).not.toContain('[ENDEREÇO COMPLETO DA FAESA]');
    expect(html).toContain('title="Mapa do Auditório da FAESA"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('https://www.google.com/maps?q=Av.%20Vit%C3%B3ria%2C%202220%20-%20Monte%20Belo%2C%20Vit%C3%B3ria%20-%20ES%2C%2029053-360&amp;output=embed');
    expect(html).toContain('https://www.google.com/maps/dir/?api=1&amp;destination=Av.%20Vit%C3%B3ria%2C%202220%20-%20Monte%20Belo%2C%20Vit%C3%B3ria%20-%20ES%2C%2029053-360');
    expect(html).toContain('R$ 320');
    expect(html).toContain('100% presencial');
    expect(html).toContain('Atualização científica que se conecta à prática clínica');
    expect(html).toContain('Para quem é o DOF Update 2026?');
    expect(html).toContain('Programação DOF Update 2026');
    expect(html).toContain('Quem estará no DOF Update 2026');
    expect(html).toContain('Condições especiais para grupos');
    expect(html).toContain('Perguntas frequentes');
  });

  it('anchors general CTAs to the ticket offer section', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('GARANTIR MINHA VAGA');
    expect(html).toContain('href="#offer"');
    expect(html).toContain('Escolha a categoria do ingresso e continue para a inscrição oficial.');
    expect(html).toContain('data-cta-origin="hero"');
    expect(html).toContain('data-cta-origin="audience"');
    expect(html).toContain('data-cta-origin="pricing_carousel"');
    expect(html).toContain('data-cta-origin="final"');
    expect(html).toContain('id="offer"');
  });

  it('renders all official ticket categories, group link and refund policy', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('R$ 320,00');
    expect(html).toContain('Aluno de graduação');
    expect(html).toContain('R$ 230,00');
    expect(html).toContain('aria-label="Ir para Profissionais sócios adimplentes ABRAFITO"');
    expect(html).toContain('aria-label="Ir para Profissionais evento + pré-evento"');
    expect(html).toContain('Evento + Pré-evento');
    expect(html).toContain('aria-label="Ir para Alunos de graduação evento + pré-evento"');
    expect(html).toContain(
      'aria-label="Ir para Profissionais sócios adimplentes ABRAFITO evento + pré-evento"'
    );
    expect(html).toContain('R$ 332,00');
    expect(html).toContain('até 01/10/2026');
    expect(html).toContain('Escolha a categoria da sua inscrição. Estamos no último lote.');
    expect(html).toContain('data-cta-origin="pricing_carousel"');
    expect(html).toContain('ticket-carousel-card-left');
    expect(html).toContain('ticket-carousel-card-center');
    expect(html).toContain('ticket-carousel-card-right');
    expect(html).toContain('GARANTIR MINHA VAGA');
    expect(html).not.toContain('Ver na Even3');
    expect(html).toContain('https://forms.gle/aSKo8XbHoPgSzHXn9');
    expect(html).toContain('https://www.even3.com.br/dof-update-iii-imersao-interprofissional-em-dtm-e-dores-orofaciais-698642/');
    expect(html).toContain('Abrir página oficial na Even3');
    expect(html).toContain('Até 30 dias antes da realização do evento');
    expect(html).toContain('90% do valor da inscrição');
  });

  it('renders confirmed speakers, main program periods and pre-event workshops', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('Manhã');
    expect(html).toContain('Tarde');
    expect(html).toContain('Credenciamento: 07h30');
    expect(html).toContain('Abertura: 08h00');
    expect(html).toContain('Encerramento: 18h45');
    expect(html).toContain('Raí Santiago');
    expect(html).toContain('Gabriela Vendolin');
    expect(html).toContain('Thays Crosara');
    expect(html).toContain('Juliana Stuginski');
    expect(html).toContain('Márcia Targino');
    expect(html).toContain('Roberto Garanhani');
    expect(html).toContain('Guacyra Muzzi');
    expect(html).toContain('Thiago Motta');
    expect(html).toContain('Bruna Cabugueira');
    expect(html).toContain('Nídia Marinho');
    expect(html).toContain('Amplie sua experiência no DOF Update 2026');
    expect(html).toContain('Workshop de Tecnologias para Dor');
    expect(html).toContain('Eletromiografia na percepção e conduta terapêutica do bruxismo e da dor orofacial');
    expect(html).toContain('Manejo Interprofissional do Zumbido Somatossensorial');
    expect(html).toContain('Gerenciamento Estratégico do Consultório de Dor Orofacial');
    expect(html).toContain('Eletroestimulação na DTM');
    expect(html).toContain('Sheila Paiva');
    expect(html).toContain('Erika Galiza');
    expect(html).toContain('Benedita Barbosa');
    expect(html).toContain('src="/speakers/rai-santiago.webp"');
    expect(html).toContain('src="/speakers/gabriela-vendolin.png"');
    expect(html).toContain('src="/speakers/thays-crosara.webp"');
    expect(html).toContain('src="/speakers/juliana-stuginski.webp"');
    expect(html).toContain('src="/speakers/marcia-targino.webp"');
    expect(html).toContain('src="/speakers/roberto-garanhani.webp"');
    expect(html).toContain('src="/speakers/guacyra-muzzi.webp"');
    expect(html).toContain('src="/speakers/thiago-motta.webp"');
    expect(html).toContain('src="/speakers/bruna-cabugueira.webp"');
    expect(html).toContain('src="/speakers/nidia-marinho.png"');
    expect(html).not.toContain('[PALESTRANTE');
    expect(html).not.toContain('[HORÁRIO]');
    expect(html).not.toContain('Scheila');
    expect(html).not.toContain('Sheila Farias');
  });

  it('renders the mini-capture modal with accessible labels and approved copy when open', () => {
    const html = renderToStaticMarkup(
      <CheckoutCaptureModal
        ctaOrigin="hero"
        errors={{}}
        form={{ name: '', phone: '', email: '', consent: true }}
        isOpen
        isSubmitting={false}
        onChange={() => undefined}
        onClose={() => undefined}
        onContinueToCheckout={() => undefined}
        onSubmit={() => undefined}
      />
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('Você está a um passo de garantir sua vaga');
    expect(html).toContain('Preencha seus dados para continuar para a inscrição no DOF Update 2026.');
    expect(html).toContain('Nome');
    expect(html).toContain('WhatsApp');
    expect(html).toContain('E-mail');
    expect(html).toContain('placeholder="Ex.: Ana Silva"');
    expect(html).toContain('placeholder="+55 (27) 99999-9999"');
    expect(html).toContain('placeholder="seuemail@email.com"');
    expect(html).toContain('CONTINUAR PARA INSCRIÇÃO');
    expect(html).toContain('Seus dados serão utilizados para informações relacionadas à sua inscrição');
    expect(html).not.toContain('Continuar mesmo assim');
  });

  it('shows a checkout fallback action when lead capture fails', () => {
    const html = renderToStaticMarkup(
      <CheckoutCaptureModal
        ctaOrigin="hero"
        errorMessage="Não conseguimos registrar seus dados agora. Você pode tentar de novo ou continuar para a inscrição."
        errors={{}}
        form={{
          name: 'Ana Silva',
          phone: '+55 (27) 99999-9999',
          email: 'ana@example.com',
          consent: true
        }}
        isOpen
        isSubmitting={false}
        onChange={() => undefined}
        onClose={() => undefined}
        onContinueToCheckout={() => undefined}
        onSubmit={() => undefined}
      />
    );

    expect(html).toContain('Continuar mesmo assim');
    expect(html).toContain(
      'Não conseguimos registrar seus dados agora. Você pode tentar de novo ou continuar para a inscrição.'
    );
  });
});
