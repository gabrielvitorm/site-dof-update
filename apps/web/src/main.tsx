import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import {
  buildEventJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  resolveSiteUrl
} from './content/seo';
import { initTrackingProviders, readTrackingEnv } from './features/analytics/providers';

initTrackingProviders(readTrackingEnv(import.meta.env));
injectStructuredData(resolveSiteUrl(import.meta.env.VITE_SITE_URL));

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

function injectStructuredData(siteUrl: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  const payloads = [
    buildOrganizationJsonLd(siteUrl),
    buildWebSiteJsonLd(siteUrl),
    buildEventJsonLd(siteUrl)
  ];

  for (const [index, payload] of payloads.entries()) {
    const id = `dof-jsonld-${index}`;
    if (document.getElementById(id)) {
      continue;
    }

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(payload);
    document.head.appendChild(script);
  }
}
