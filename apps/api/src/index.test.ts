import { describe, expect, it } from 'vitest';
import { getApiServiceName } from './index';
import { resolveListenHost } from './server';

describe('api app', () => {
  it('exposes the API service name', () => {
    expect(getApiServiceName()).toBe('dof-update-api');
  });

  it('listens on 127.0.0.1 by default and honors HOST overrides', () => {
    expect(resolveListenHost(undefined)).toBe('127.0.0.1');
    expect(resolveListenHost('')).toBe('127.0.0.1');
    expect(resolveListenHost('0.0.0.0')).toBe('0.0.0.0');
  });
});

