import { describe, expect, it } from 'vitest';
import { getWebAppName } from './app-info';

describe('web app', () => {
  it('exposes the web app name', () => {
    expect(getWebAppName()).toBe('dof-update-web');
  });
});
