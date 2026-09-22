import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const compose = readFileSync(new URL('../../../infra/docker-compose.deploy.yml', import.meta.url), 'utf8');
const nginx = readFileSync(new URL('../../../infra/nginx/default.conf', import.meta.url), 'utf8');

describe('production deployment configuration', () => {
  it('runs the API beside PostgreSQL with backend-only Meta settings', () => {
    expect(compose).toContain('  api:');
    expect(compose).toContain('HOST: 0.0.0.0');
    expect(compose).toContain('PORT: 3001');
    expect(compose).toContain('DATABASE_URL:');
    expect(compose).toContain('META_CAPI_ENABLED:');
    expect(compose).toContain('META_CAPI_ACCESS_TOKEN:');
  });

  it('routes public API paths to api:3001', () => {
    expect(nginx).toContain('location /api/');
    expect(nginx).toContain('set $api_upstream http://api:3001;');
  });
});
