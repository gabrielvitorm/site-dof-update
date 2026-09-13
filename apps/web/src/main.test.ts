import { describe, expect, it } from 'vitest';
import { getWebAppName } from './main';

describe('web app', () => {
  it('exposes the web app name', () => {
    expect(getWebAppName()).toBe('dof-update-web');
  });
});

