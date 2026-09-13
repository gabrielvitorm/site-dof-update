import { z } from 'zod';
import { ctaOriginSchema, leadStatusSchema } from './lead';

export const internalAutomationEventTypeSchema = z.enum([
  'lead.captured',
  'checkout.redirected',
  'sale.started',
  'sale.failed',
  'sale.approved',
  'sale.cancelled'
]);

export const internalAutomationEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: internalAutomationEventTypeSchema,
  occurredAt: z.string().datetime(),
  lead: z.object({
    id: z.string().uuid(),
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().trim().min(1).max(30),
    status: leadStatusSchema
  }),
  source: z
    .object({
      provider: z.string().trim().min(1).max(100),
      providerDeliveryId: z.string().trim().min(1).max(200).optional()
    })
    .optional(),
  attribution: z
    .object({
      utmSource: z.string().trim().max(500).nullable().optional(),
      utmMedium: z.string().trim().max(500).nullable().optional(),
      utmCampaign: z.string().trim().max(500).nullable().optional(),
      utmContent: z.string().trim().max(500).nullable().optional(),
      ctaOrigin: ctaOriginSchema.optional()
    })
    .optional()
});

export type InternalAutomationEventType = z.infer<
  typeof internalAutomationEventTypeSchema
>;
export type InternalAutomationEvent = z.infer<typeof internalAutomationEventSchema>;

