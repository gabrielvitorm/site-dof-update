import type { Queryable } from '../../db/client';

export interface RecordEven3DeliveryInput {
  even3DeliveryId: string;
  eventType: string;
  payload: unknown;
}

export interface Even3WebhookDeliveryRecord {
  id: string;
  even3DeliveryId: string;
  eventType: string;
  payload: unknown;
  processingStatus: string;
}

export interface RecordEven3DeliveryResult {
  inserted: boolean;
  delivery: Even3WebhookDeliveryRecord;
}

interface DeliveryRow {
  id: string;
  even3_delivery_id: string;
  event_type: string;
  payload: unknown;
  processing_status: string;
}

export class Even3WebhookRepository {
  public constructor(private readonly db: Queryable) {}

  public async recordDelivery(
    input: RecordEven3DeliveryInput
  ): Promise<RecordEven3DeliveryResult> {
    const existing = await this.findByDeliveryId(input.even3DeliveryId);
    if (existing) {
      return {
        inserted: false,
        delivery: existing
      };
    }

    const insertResult = await this.db.query<DeliveryRow>(
      `insert into even3_webhook_deliveries (
        even3_delivery_id, event_type, payload, processing_status
      ) values ($1, $2, $3, 'RECEIVED')
      on conflict (even3_delivery_id) do nothing
      returning id, even3_delivery_id, event_type, payload, processing_status`,
      [input.even3DeliveryId, input.eventType, input.payload]
    );

    if (insertResult.rows[0]) {
      return {
        inserted: true,
        delivery: toDeliveryRecord(insertResult.rows[0])
      };
    }

    const conflicted = await this.findByDeliveryId(input.even3DeliveryId);
    if (!conflicted) {
      throw new Error('Expected existing Even3 webhook delivery after conflict.');
    }

    return {
      inserted: false,
      delivery: conflicted
    };
  }

  private async findByDeliveryId(
    even3DeliveryId: string
  ): Promise<Even3WebhookDeliveryRecord | null> {
    const existingResult = await this.db.query<DeliveryRow>(
      `select id, even3_delivery_id, event_type, payload, processing_status
       from even3_webhook_deliveries
       where even3_delivery_id = $1
       limit 1`,
      [even3DeliveryId]
    );

    return existingResult.rows[0] ? toDeliveryRecord(existingResult.rows[0]) : null;
  }
}

function toDeliveryRecord(row: DeliveryRow): Even3WebhookDeliveryRecord {
  return {
    id: row.id,
    even3DeliveryId: row.even3_delivery_id,
    eventType: row.event_type,
    payload: row.payload,
    processingStatus: row.processing_status
  };
}
