import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from './App';

describe('DOF Update landing page', () => {
  it('renders the approved landing sections and official event facts', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('DOF Update 2026');
    expect(html).toContain('III Imersao Interprofissional em DTM e Dores Orofaciais');
    expect(html).toContain('03 de outubro de 2026');
    expect(html).toContain('Auditorio da FAESA');
    expect(html).toContain('Vitoria, ES');
    expect(html).toContain('R$ 320');
    expect(html).toContain('100% presencial');
    expect(html).toContain('Atualizacao cientifica que se conecta a pratica clinica');
    expect(html).toContain('Para quem e o DOF Update 2026?');
    expect(html).toContain('Programacao DOF Update 2026');
    expect(html).toContain('Quem estara no DOF Update 2026');
    expect(html).toContain('Condicoes especiais para grupos');
    expect(html).toContain('Perguntas frequentes');
  });
});
