import { describe, expect, it } from 'vitest';
import { getApiServiceName } from './index';

describe('api app', () => {
  it('exposes the API service name', () => {
    expect(getApiServiceName()).toBe('dof-update-api');
  });
});

