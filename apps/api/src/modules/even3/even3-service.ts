import type {
  InternalAutomationEventType,
  LeadStatus
} from '@dof-update/contracts';

import type { Queryable } from '../../db/client';
import { AutomationService } from '../automation/automation-service';
import type { LeadRecord } from '../leads/lead-repository';
import { normalizeBrazilianPhoneToE164, normalizeEmail } from '../leads/normalization';
import { even3WebhookPayloadSchema, type Even3WebhookPayload } from './even3-schema';
import { Even3WebhookRepository } from './webhook-repository';

export interface ProcessEven3Result {
  duplicate: boolean;
  processed: boolean;
}

interface LeadRow {
  id: string;
  name: string;
  email: string;
  email_normalized: string;
  phone: string;
  phone_e164: string | null;
  consent: boolean;
  status: LeadStatus;
  checkout_url: string | null;
  first_utm_source: string | null;
  cta_origin: string | null;
}

export class Even3Service {
  private readonly webhookRepository: Even3WebhookRepository;
  private readonly automationService: AutomationService;

  public constructor(private readonly db: Queryable) {
    this.webhookRepository = new Even3WebhookRepository(db);
    this.automationService = new AutomationService(db);
  }

  public async processWebhook(rawPayload: unknown): Promise<ProcessEven3Result> {
    const payload = even3WebhookPayloadSchema.parse(rawPayload);
    const mapping = mapEven3Event(payload.eventType);
    if (!mapping) {
      throw new UnsupportedEven3EventError(payload.eventType);
    }

    const delivery = await this.webhookRepository.recordDelivery({
      even3DeliveryId: payload.id,
      eventType: payload.eventType,
      payload
    });
    if (!delivery.inserted) {
      return { duplicate: true, processed: false };
    }

    const lead = await this.findCorrelatedLead(payload);
    if (!lead) {
      return { duplicate: false, processed: false };
    }

    const transition = await this.applyTransition(
      lead,
      mapping.status,
      payload,
      mapping.businessEvent
    );
    if (transition.changed) {
      await this.automationService.enqueueAutomationEvent({
        eventType: mapping.automationEvent,
        lead: transition.lead,
        idempotencyKey: `${transition.lead.id}:${mapping.automationEvent}:${payload.id}`,
        source: {
          provider: 'even3',
          providerDeliveryId: payload.id
        }
      });
    }

    return { duplicate: false, processed: true };
  }

  private async findCorrelatedLead(
    payload: Even3WebhookPayload
  ): Promise<LeadRecord | null> {
    const registrationCode = payload.registration?.code;
    if (registrationCode) {
      const byRegistration = await this.findLead(
        'even3_registration_code = $1',
        [registrationCode]
      );
      if (byRegistration) {
        return byRegistration;
      }
    }

    const email = payload.participant?.email
      ? normalizeEmail(payload.participant.email)
      : null;
    if (email) {
      const byEmail = await this.findLead('email_normalized = $1', [email]);
      if (byEmail) {
        return byEmail;
      }
    }

    const phone = payload.participant?.phone
      ? normalizeBrazilianPhoneToE164(payload.participant.phone)
      : null;
    if (phone) {
      const byPhone = await this.findLead('phone_e164 = $1', [phone]);
      if (byPhone) {
        return byPhone;
      }
    }

    return null;
  }

  private async findLead(
    whereClause: string,
    values: readonly unknown[]
  ): Promise<LeadRecord | null> {
    const result = await this.db.query<LeadRow>(
      `select ${leadColumns}
       from leads
       where ${whereClause}
       order by last_activity_at desc
       limit 1`,
      values
    );

    return result.rows[0] ? toLeadRecord(result.rows[0]) : null;
  }

  private async applyTransition(
    lead: LeadRecord,
    requestedStatus: LeadStatus,
    payload: Even3WebhookPayload,
    businessEvent: string
  ): Promise<{ changed: boolean; lead: LeadRecord }> {
    const nextStatus = nextLeadStatus(lead.status, requestedStatus);
    if (nextStatus === lead.status) {
      await this.appendLeadEvent(lead.id, businessEvent, payload);
      return { changed: false, lead };
    }

    const result = await this.db.query<LeadRow>(
      `update leads
       set
        status = $2,
        even3_registration_code = coalesce($3, even3_registration_code),
        purchased_at = case
          when $2 = 'PURCHASED' then now()
          else purchased_at
        end,
        last_activity_at = now(),
        updated_at = now()
       where id = $1
       returning ${leadColumns}`,
      [lead.id, nextStatus, payload.registration?.code ?? null]
    );
    await this.appendLeadEvent(lead.id, businessEvent, payload);

    const updatedLead = result.rows[0] ? toLeadRecord(result.rows[0]) : lead;
    return { changed: true, lead: updatedLead };
  }

  private async appendLeadEvent(
    leadId: string,
    type: string,
    payload: unknown
  ): Promise<void> {
    await this.db.query(
      `insert into lead_events (lead_id, type, source, payload, occurred_at)
       values ($1, $2, 'even3', $3, now())`,
      [leadId, type, payload]
    );
  }
}

export class UnsupportedEven3EventError extends Error {}

const eventMappings: Record<
  string,
  {
    status: LeadStatus;
    automationEvent: InternalAutomationEventType;
    businessEvent: string;
  }
> = {
  'Venda iniciada': {
    status: 'SALE_STARTED',
    automationEvent: 'sale.started',
    businessEvent: 'EVEN3_SALE_STARTED'
  },
  'Participante com inscrição pendente no evento': {
    status: 'SALE_STARTED',
    automationEvent: 'sale.started',
    businessEvent: 'EVEN3_REGISTRATION_PENDING'
  },
  'Venda aprovada': {
    status: 'PURCHASED',
    automationEvent: 'sale.approved',
    businessEvent: 'EVEN3_SALE_APPROVED'
  },
  'Participante com inscrição confirmada no evento': {
    status: 'PURCHASED',
    automationEvent: 'sale.approved',
    businessEvent: 'EVEN3_REGISTRATION_CONFIRMED'
  },
  'Venda reprovada': {
    status: 'PAYMENT_FAILED',
    automationEvent: 'sale.failed',
    businessEvent: 'EVEN3_SALE_FAILED'
  },
  'Venda cancelada/reembolsada': {
    status: 'CANCELLED_REFUNDED',
    automationEvent: 'sale.cancelled',
    businessEvent: 'EVEN3_SALE_CANCELLED'
  },
  'Participante com inscrição cancelada no evento': {
    status: 'CANCELLED_REFUNDED',
    automationEvent: 'sale.cancelled',
    businessEvent: 'EVEN3_REGISTRATION_CANCELLED'
  }
};

const leadColumns = `
  id, name, email, email_normalized, phone, phone_e164, consent, status,
  checkout_url, first_utm_source, cta_origin
`;

function mapEven3Event(eventType: string) {
  return eventMappings[eventType] ?? null;
}

function nextLeadStatus(current: LeadStatus, requested: LeadStatus): LeadStatus {
  if (current === 'PURCHASED' && requested !== 'CANCELLED_REFUNDED') {
    return current;
  }
  if (current === requested) {
    return current;
  }
  if (requested === 'PURCHASED' || requested === 'CANCELLED_REFUNDED') {
    return requested;
  }
  if (current === 'CAPTURED' || current === 'CHECKOUT_REDIRECTED') {
    return requested;
  }
  if (current === 'SALE_STARTED' && requested === 'PAYMENT_FAILED') {
    return requested;
  }
  if (current === 'PAYMENT_FAILED' && requested === 'SALE_STARTED') {
    return requested;
  }
  return current;
}

function toLeadRecord(row: LeadRow): LeadRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    emailNormalized: row.email_normalized,
    phone: row.phone,
    phoneE164: row.phone_e164,
    consent: row.consent,
    status: row.status,
    checkoutUrl: row.checkout_url,
    firstUtmSource: row.first_utm_source,
    ctaOrigin: row.cta_origin
  };
}

