import { describe, expect, it } from 'vitest';

import { createTestDatabase } from '../../db/test-database';
import { Even3WebhookRepository } from './webhook-repository';

describe('Even3WebhookRepository', () => {
  it('persists a unique Even3 delivery only once', async () => {
    const db = await createTestDatabase();
    const repository = new Even3WebhookRepository(db);

    const first = await repository.recordDelivery({
      even3DeliveryId: 'delivery-123',
      eventType: 'Venda aprovada',
      payload: { id: 'delivery-123', tipo: 'Venda aprovada' }
    });
    const second = await repository.recordDelivery({
      even3DeliveryId: 'delivery-123',
      eventType: 'Venda aprovada',
      payload: { id: 'delivery-123', tipo: 'Venda aprovada' }
    });

    expect(first.inserted).toBe(true);
    expect(second.inserted).toBe(false);
    expect(second.delivery.id).toBe(first.delivery.id);
  });
});

