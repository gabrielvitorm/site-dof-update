import type { LeadStatus } from '@dof-update/contracts';

import type { Queryable } from '../../db/client';

export interface LeadAttributionRecord {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fbclid: string | null;
  gclid: string | null;
  referrer: string | null;
  landingUrl: string;
  ctaOrigin: string;
  sessionId: string;
  deviceClass: string;
}

export interface CapturedLeadInput {
  eventId: string;
  name: string;
  email: string;
  emailNormalized: string;
  phone: string;
  phoneE164: string | null;
  consent: boolean;
  checkoutUrl: string;
  attribution: LeadAttributionRecord;
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  emailNormalized: string;
  phone: string;
  phoneE164: string | null;
  consent: boolean;
  status: LeadStatus;
  checkoutUrl: string | null;
  firstUtmSource: string | null;
  ctaOrigin: string | null;
}

export interface LeadEventRecord {
  id: string;
  leadId: string;
  type: string;
  source: string;
  payload: unknown;
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

interface LeadEventRow {
  id: string;
  lead_id: string;
  type: string;
  source: string;
  payload: unknown;
}

export class LeadRepository {
  public constructor(private readonly db: Queryable) {}

  public async upsertCapturedLead(input: CapturedLeadInput): Promise<LeadRecord> {
    const existing = await this.findForUpsert(input.emailNormalized, input.phoneE164);
    const lead = existing
      ? await this.updateCapturedLead(existing.id, input)
      : await this.insertCapturedLead(input);

    await this.appendEvent({
      leadId: lead.id,
      type: 'LEAD_CAPTURED',
      source: 'lead_api',
      payload: {
        eventId: input.eventId,
        emailNormalized: input.emailNormalized,
        ctaOrigin: input.attribution.ctaOrigin,
        sessionId: input.attribution.sessionId
      }
    });

    return lead;
  }

  public async listEvents(leadId: string): Promise<LeadEventRecord[]> {
    const result = await this.db.query<LeadEventRow>(
      `select id, lead_id, type, source, payload
       from lead_events
       where lead_id = $1
       order by created_at asc`,
      [leadId]
    );

    return result.rows.map(toLeadEventRecord);
  }

  private async findForUpsert(
    emailNormalized: string,
    phoneE164: string | null
  ): Promise<LeadRecord | null> {
    const byEmail = await this.db.query<LeadRow>(
      `select ${leadColumns}
       from leads
       where email_normalized = $1
       order by last_activity_at desc
       limit 1`,
      [emailNormalized]
    );
    if (byEmail.rows[0]) {
      return toLeadRecord(byEmail.rows[0]);
    }
    if (!phoneE164) {
      return null;
    }

    const byPhone = await this.db.query<LeadRow>(
      `select ${leadColumns}
       from leads
       where phone_e164 = $1
       order by last_activity_at desc
       limit 1`,
      [phoneE164]
    );

    return byPhone.rows[0] ? toLeadRecord(byPhone.rows[0]) : null;
  }

  private async insertCapturedLead(input: CapturedLeadInput): Promise<LeadRecord> {
    const result = await this.db.query<LeadRow>(
      `insert into leads (
        name, email, email_normalized, phone, phone_e164, consent, status, checkout_url,
        first_utm_source, first_utm_medium, first_utm_campaign, first_utm_content, first_utm_term,
        last_utm_source, last_utm_medium, last_utm_campaign, last_utm_content, last_utm_term,
        fbclid, gclid, referrer, landing_url, cta_origin, session_id, device_class
      ) values (
        $1, $2, $3, $4, $5, $6, 'CAPTURED', $7,
        $8, $9, $10, $11, $12,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19
      )
      returning ${leadColumns}`,
      leadValues(input)
    );

    return toLeadRecord(requireRow(result.rows[0]));
  }

  private async updateCapturedLead(
    leadId: string,
    input: CapturedLeadInput
  ): Promise<LeadRecord> {
    const result = await this.db.query<LeadRow>(
      `update leads
       set
        name = $2,
        email = $3,
        email_normalized = $4,
        phone = $5,
        phone_e164 = $6,
        consent = $7,
        checkout_url = $8,
        first_utm_source = coalesce(first_utm_source, $9),
        first_utm_medium = coalesce(first_utm_medium, $10),
        first_utm_campaign = coalesce(first_utm_campaign, $11),
        first_utm_content = coalesce(first_utm_content, $12),
        first_utm_term = coalesce(first_utm_term, $13),
        last_utm_source = $9,
        last_utm_medium = $10,
        last_utm_campaign = $11,
        last_utm_content = $12,
        last_utm_term = $13,
        fbclid = $14,
        gclid = $15,
        referrer = $16,
        landing_url = $17,
        cta_origin = $18,
        session_id = $19,
        device_class = $20,
        status = case
          when status = 'PURCHASED' then status
          else 'CAPTURED'
        end,
        last_activity_at = now(),
        updated_at = now()
       where id = $1
       returning ${leadColumns}`,
      [leadId, ...leadValues(input)]
    );

    return toLeadRecord(requireRow(result.rows[0]));
  }

  private async appendEvent(input: {
    leadId: string;
    type: string;
    source: string;
    payload: unknown;
  }): Promise<void> {
    await this.db.query(
      `insert into lead_events (lead_id, type, source, payload, occurred_at)
       values ($1, $2, $3, $4, now())`,
      [input.leadId, input.type, input.source, input.payload]
    );
  }
}

const leadColumns = `
  id, name, email, email_normalized, phone, phone_e164, consent, status,
  checkout_url, first_utm_source, cta_origin
`;

function leadValues(input: CapturedLeadInput): unknown[] {
  return [
    input.name,
    input.email,
    input.emailNormalized,
    input.phone,
    input.phoneE164,
    input.consent,
    input.checkoutUrl,
    input.attribution.utmSource,
    input.attribution.utmMedium,
    input.attribution.utmCampaign,
    input.attribution.utmContent,
    input.attribution.utmTerm,
    input.attribution.fbclid,
    input.attribution.gclid,
    input.attribution.referrer,
    input.attribution.landingUrl,
    input.attribution.ctaOrigin,
    input.attribution.sessionId,
    input.attribution.deviceClass
  ];
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

function toLeadEventRecord(row: LeadEventRow): LeadEventRecord {
  return {
    id: row.id,
    leadId: row.lead_id,
    type: row.type,
    source: row.source,
    payload: row.payload
  };
}

function requireRow<T>(row: T | undefined): T {
  if (!row) {
    throw new Error('Expected database row to exist.');
  }
  return row;
}
