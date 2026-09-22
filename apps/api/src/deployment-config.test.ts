import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const compose = readFileSync(new URL('../../../infra/docker-compose.deploy.yml', import.meta.url), 'utf8');

describe('production deployment configuration', () => {
  it('runs the API beside PostgreSQL with backend-only Meta settings', () => {
    expect(compose).toContain('  app:');
    expect(compose).toContain('target: fullstack');
    expect(compose).toContain('HOST: 0.0.0.0');
    expect(compose).toContain('PORT: 3001');
    expect(compose).toContain('WEB_ROOT: /app/apps/api/dist/web');
    expect(compose).toContain('DATABASE_URL:');
    expect(compose).toContain('META_CAPI_ENABLED:');
    expect(compose).toContain('META_CAPI_ACCESS_TOKEN:');
  });

  it('publishes the single fullstack application port', () => {
    expect(compose).toContain("'${HTTP_PORT:-8080}:3001'");
    expect(compose).not.toContain('  web:');
  });
});
