import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  buildEventJsonLd,
  buildOrganizationJsonLd,
  resolveSiteUrl,
  siteSeo
} from './seo';

describe('site SEO content', () => {
  it('keeps the approved canonical domain and event metadata', () => {
    expect(resolveSiteUrl(undefined)).toBe('https://dofupdate.com.br');
    expect(resolveSiteUrl('https://dofupdate.com.br/')).toBe('https://dofupdate.com.br');
    expect(siteSeo.title).toContain('DOF Update 2026');
    expect(siteSeo.description).toContain('DTM');
    expect(siteSeo.description).toContain('Vitória/ES');
    expect(siteSeo.event.startDate).toBe('2026-10-03');
    expect(siteSeo.event.location.name).toBe('Auditório da FAESA');
  });

  it('builds Event and Organization JSON-LD without inventing facts', () => {
    const event = buildEventJsonLd();
    const organization = buildOrganizationJsonLd();

    expect(event).toMatchObject({
      '@type': 'Event',
      name: 'DOF Update 2026',
      url: 'https://dofupdate.com.br/',
      location: {
        '@type': 'Place',
        name: 'Auditório da FAESA'
      }
    });
    expect(event.image).toContain('https://dofupdate.com.br/og-dof-update-2026.jpg');
    expect(organization).toMatchObject({
      '@type': 'Organization',
      name: 'DOF Update',
      logo: 'https://dofupdate.com.br/dof-update-logo.png'
    });
  });

  it('ships Google and AI SEO files in public/', () => {
    const indexHtml = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
    const robots = readFileSync(new URL('../../public/robots.txt', import.meta.url), 'utf8');
    const sitemap = readFileSync(new URL('../../public/sitemap.xml', import.meta.url), 'utf8');
    const llmsTxt = readFileSync(new URL('../../public/llms.txt', import.meta.url), 'utf8');
    const llmsMd = readFileSync(new URL('../../public/llms.md', import.meta.url), 'utf8');

    expect(indexHtml).toContain('rel="canonical"');
    expect(indexHtml).toContain('og:image');
    expect(indexHtml).toContain('/favicon.ico');
    expect(indexHtml).toContain('llms.md');
    expect(robots).toContain('Sitemap: https://dofupdate.com.br/sitemap.xml');
    expect(sitemap).toContain('https://dofupdate.com.br/');
    expect(llmsTxt).toContain('https://dofupdate.com.br/llms.md');
    expect(llmsMd).toContain('03 de outubro de 2026');
    expect(llmsMd).toContain('Raí Santiago');
    expect(llmsMd).toContain('R$ 320,00');
  });
});
