import { leadCaptureRequestSchema, type LeadCaptureResponse } from '@dof-update/contracts';

import type { AppConfig } from '../../config';
import type { Queryable } from '../../db/client';
import { LeadRepository } from './lead-repository';
import { normalizeBrazilianPhoneToE164, normalizeEmail } from './normalization';

export interface LeadValidationError {
  code: 'VALIDATION_ERROR';
  fields: Record<string, string>;
}

export class LeadCaptureService {
  private readonly repository: LeadRepository;

  public constructor(
    private readonly config: AppConfig,
    db: Queryable
  ) {
    this.repository = new LeadRepository(db);
  }

  public async capture(rawPayload: unknown): Promise<LeadCaptureResponse> {
    const payload = leadCaptureRequestSchema.parse(rawPayload);
    const lead = await this.repository.upsertCapturedLead({
      name: payload.name,
      email: payload.email,
      emailNormalized: normalizeEmail(payload.email),
      phone: payload.phone,
      phoneE164: normalizeBrazilianPhoneToE164(payload.phone),
      consent: payload.consent,
      checkoutUrl: this.config.publicConfig.checkoutUrl,
      attribution: payload.attribution
    });

    return {
      leadId: lead.id,
      status: lead.status,
      checkoutUrl: this.config.publicConfig.checkoutUrl,
      redirectAllowed: this.config.publicConfig.salesEnabled
    };
  }
}

