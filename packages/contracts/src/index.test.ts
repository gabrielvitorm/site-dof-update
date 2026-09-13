import { describe, expect, it } from 'vitest';
import { getContractPackageName } from './index';

describe('contracts package', () => {
  it('identifies the shared contracts package', () => {
    expect(getContractPackageName()).toBe('@dof-update/contracts');
  });
});

