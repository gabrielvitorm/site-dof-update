import { describe, expect, it } from 'vitest';

import { maskEmail, maskPhone } from './pii';

describe('PII masking', () => {
  it('masks email while keeping enough context for support logs', () => {
    expect(maskEmail('maria.silva@example.com')).toBe('m***@example.com');
  });

  it('masks phone digits except the final four', () => {
    expect(maskPhone('+55 (27) 99999-1234')).toBe('*********1234');
  });
});
