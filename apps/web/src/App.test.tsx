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

  it('renders conversion CTAs that target the shared mini-capture flow', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('GARANTIR MINHA VAGA');
    expect(html).toContain('Você fará um cadastro rápido e seguirá para a inscrição oficial.');
    expect(html).toContain('Valores por categoria disponíveis até 01/10/2026 ou enquanto houver vagas.');
    expect(html).toContain('data-cta-origin="hero"');
    expect(html).toContain('data-cta-origin="audience"');
    expect(html).toContain('data-cta-origin="offer"');
    expect(html).toContain('data-cta-origin="final"');
  });

  it('renders all official ticket categories, group link and refund policy', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('Profissionais');
    expect(html).toContain('R$320,00');
    expect(html).toContain('Aluno de graduação');
    expect(html).toContain('R$230,00');
    expect(html).toContain('Profissionais sócios adimplentes ABRAFITO');
    expect(html).toContain('R$272,00');
    expect(html).toContain('Profissionais evento + pré-evento');
    expect(html).toContain('R$380,00');
    expect(html).toContain('Últimas vagas');
    expect(html).toContain('Alunos de graduação evento + pré-evento');
    expect(html).toContain('R$290,00');
    expect(html).toContain('Profissionais sócios adimplentes ABRAFITO evento + pré-evento');
    expect(html).toContain('R$332,00');
    expect(html).toContain('até 01/10/2026');
    expect(html).toContain('https://forms.gle/aSKo8XbHoPgSzHXn9');
    expect(html).toContain('https://www.even3.com.br/dof-update-iii-imersao-interprofissional-em-dtm-e-dores-orofaciais-698642/');
    expect(html).toContain('Ver na Even3');
    expect(html).toContain('Abrir página oficial na Even3');
    expect(html).toContain('Até 30 dias antes da realização do evento');
    expect(html).toContain('90% do valor da inscrição');
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
  });
});
