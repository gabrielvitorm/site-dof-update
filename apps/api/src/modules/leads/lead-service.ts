import { leadCaptureRequestSchema, type LeadCaptureResponse } from '@dof-update/contracts';

import type { AppConfig } from '../../config';
import type { Queryable } from '../../db/client';
import { randomUUID } from 'node:crypto';
import type { MetaConversionsClient } from '../meta/meta-conversions-client';
import { LeadRepository } from './lead-repository';
import { normalizeBrazilianPhoneToE164, normalizeEmail } from './normalization';

export interface LeadValidationError {
  code: 'VALIDATION_ERROR';
  fields: Record<string, string>;
}

export interface LeadCaptureContext {
  clientIpAddress?: string;
  clientUserAgent?: string;
}

export class LeadCaptureService {
  private readonly repository: LeadRepository;

  public constructor(
    private readonly config: AppConfig,
    db: Queryable,
    private readonly metaClient: MetaConversionsClient
  ) {
    this.repository = new LeadRepository(db);
  }

  public async capture(
    rawPayload: unknown,
    context: LeadCaptureContext = {}
  ): Promise<LeadCaptureResponse> {
    const payload = leadCaptureRequestSchema.parse(rawPayload);
    const eventId = payload.eventId ?? randomUUID();
    const lead = await this.repository.upsertCapturedLead({
      eventId,
      name: payload.name,
      email: payload.email,
      emailNormalized: normalizeEmail(payload.email),
      phone: payload.phone,
      phoneE164: normalizeBrazilianPhoneToE164(payload.phone),
      consent: payload.consent,
      checkoutUrl: this.config.publicConfig.checkoutUrl,
      attribution: payload.attribution
    });

    try {
      await this.metaClient.sendLead({
        eventId,
        eventSourceUrl: payload.attribution.landingUrl,
        email: payload.email,
        phoneE164: normalizeBrazilianPhoneToE164(payload.phone),
        fbp: payload.meta?.fbp ?? null,
        fbc: payload.meta?.fbc ?? null,
        clientIpAddress: context.clientIpAddress,
        clientUserAgent: context.clientUserAgent
      });
    } catch {
      console.error('Meta CAPI lead dispatch failed after lead persistence.');
    }

    return {
      eventId,
      leadId: lead.id,
      status: lead.status,
      checkoutUrl: this.config.publicConfig.checkoutUrl,
      redirectAllowed: this.config.publicConfig.salesEnabled
    };
  }
}
