import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initTrackingProviders, readTrackingEnv } from './features/analytics/providers';

initTrackingProviders(readTrackingEnv(import.meta.env));

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
