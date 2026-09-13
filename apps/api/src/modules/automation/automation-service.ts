import {
  ctaOriginSchema,
  type InternalAutomationEvent,
  type InternalAutomationEventType
} from '@dof-update/contracts';

import type { Queryable } from '../../db/client';
import type { LeadRecord } from '../leads/lead-repository';

export interface AutomationDispatchRecord {
  id: string;
  leadId: string | null;
  eventType: InternalAutomationEventType;
  idempotencyKey: string;
  payload: InternalAutomationEvent;
  status: 'PENDING' | 'FAILED' | 'SENT';
  attemptCount: number;
}

export interface EnqueueAutomationInput {
  eventType: InternalAutomationEventType;
  lead: LeadRecord;
  idempotencyKey: string;
  source?: InternalAutomationEvent['source'];
}

export interface EnqueueAutomationResult {
  inserted: boolean;
  dispatch: AutomationDispatchRecord;
}

export interface DispatchPendingOptions {
  url: string;
  token: string;
  limit?: number;
  fetch?: typeof fetch;
}

interface AutomationDispatchRow {
  id: string;
  lead_id: string | null;
  event_type: InternalAutomationEventType;
  idempotency_key: string;
  payload: InternalAutomationEvent;
  status: 'PENDING' | 'FAILED' | 'SENT';
  attempt_count: number;
}

export class AutomationService {
  public constructor(private readonly db: Queryable) {}

  public async enqueueAutomationEvent(
    input: EnqueueAutomationInput
  ): Promise<EnqueueAutomationResult> {
    const existing = await this.findByIdempotencyKey(input.idempotencyKey);
    if (existing) {
      return { inserted: false, dispatch: existing };
    }

    const payload = buildAutomationPayload(input);
    const result = await this.db.query<AutomationDispatchRow>(
      `insert into automation_dispatches (
        lead_id, event_type, idempotency_key, payload, status
      ) values ($1, $2, $3, $4, 'PENDING')
      on conflict (idempotency_key) do nothing
      returning id, lead_id, event_type, idempotency_key, payload, status, attempt_count`,
      [input.lead.id, input.eventType, input.idempotencyKey, payload]
    );

    if (result.rows[0]) {
      return {
        inserted: true,
        dispatch: toDispatchRecord(result.rows[0])
      };
    }

    const conflicted = await this.findByIdempotencyKey(input.idempotencyKey);
    if (!conflicted) {
      throw new Error('Expected automation dispatch after idempotency conflict.');
    }
    return { inserted: false, dispatch: conflicted };
  }

  public async listPendingDispatches(limit: number): Promise<AutomationDispatchRecord[]> {
    const result = await this.db.query<AutomationDispatchRow>(
      `select id, lead_id, event_type, idempotency_key, payload, status, attempt_count
       from automation_dispatches
       where status in ('PENDING', 'FAILED')
       order by created_at asc
       limit $1`,
      [limit]
    );

    return result.rows.map(toDispatchRecord);
  }

  public async dispatchPending(
    options: DispatchPendingOptions
  ): Promise<{ sent: number; failed: number }> {
    const fetchImpl = options.fetch ?? fetch;
    const dispatches = await this.listPendingDispatches(options.limit ?? 10);
    let sent = 0;
    let failed = 0;

    for (const dispatch of dispatches) {
      try {
        const response = await fetchImpl(options.url, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${options.token}`,
            'content-type': 'application/json'
          },
          body: JSON.stringify(dispatch.payload)
        });

        if (response.ok) {
          await this.markDispatchSent(dispatch.id);
          sent += 1;
        } else {
          await this.markDispatchFailed(dispatch.id);
          failed += 1;
        }
      } catch {
        await this.markDispatchFailed(dispatch.id);
        failed += 1;
      }
    }

    return { sent, failed };
  }

  private async findByIdempotencyKey(
    idempotencyKey: string
  ): Promise<AutomationDispatchRecord | null> {
    const result = await this.db.query<AutomationDispatchRow>(
      `select id, lead_id, event_type, idempotency_key, payload, status, attempt_count
       from automation_dispatches
       where idempotency_key = $1
       limit 1`,
      [idempotencyKey]
    );

    return result.rows[0] ? toDispatchRecord(result.rows[0]) : null;
  }

  private async markDispatchSent(dispatchId: string): Promise<void> {
    await this.db.query(
      `update automation_dispatches
       set status = 'SENT', attempt_count = attempt_count + 1, last_attempt_at = now()
       where id = $1`,
      [dispatchId]
    );
  }

  private async markDispatchFailed(dispatchId: string): Promise<void> {
    await this.db.query(
      `update automation_dispatches
       set status = 'FAILED', attempt_count = attempt_count + 1, last_attempt_at = now()
       where id = $1`,
      [dispatchId]
    );
  }
}

function buildAutomationPayload(input: EnqueueAutomationInput): InternalAutomationEvent {
  const ctaOrigin = ctaOriginSchema.safeParse(input.lead.ctaOrigin);

  return {
    eventId: crypto.randomUUID(),
    eventType: input.eventType,
    occurredAt: new Date().toISOString(),
    lead: {
      id: input.lead.id,
      name: input.lead.name,
      email: input.lead.emailNormalized,
      phone: input.lead.phoneE164 ?? input.lead.phone,
      status: input.lead.status
    },
    source: input.source,
    attribution: {
      utmSource: input.lead.firstUtmSource,
      ctaOrigin: ctaOrigin.success ? ctaOrigin.data : undefined
    }
  };
}

function toDispatchRecord(row: AutomationDispatchRow): AutomationDispatchRecord {
  return {
    id: row.id,
    leadId: row.lead_id,
    eventType: row.event_type,
    idempotencyKey: row.idempotency_key,
    payload: row.payload,
    status: row.status,
    attemptCount: row.attempt_count
  };
}
