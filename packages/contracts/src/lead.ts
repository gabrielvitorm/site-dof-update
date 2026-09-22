import { z } from 'zod';

const nullableTrackingString = z.string().trim().max(500).nullable();
const nullableClickIdString = z.string().trim().max(1000).nullable();

export const ctaOriginSchema = z.enum([
  'hero',
  'why_participate',
  'audience',
  'program',
  'speakers',
  'experience',
  'workshop_cross_sell',
  'offer',
  'pricing_carousel',
  'location',
  'faq',
  'final',
  'sticky_mobile'
]);

export const leadStatusSchema = z.enum([
  'CAPTURED',
  'CHECKOUT_REDIRECTED',
  'SALE_STARTED',
  'PAYMENT_FAILED',
  'PURCHASED',
  'CANCELLED_REFUNDED'
]);

export const deviceClassSchema = z.enum(['mobile', 'tablet', 'desktop']);

const metaBrowserTrackingSchema = z.object({
  fbp: nullableTrackingString,
  fbc: nullableTrackingString
});

export const attributionSchema = z.object({
  utmSource: nullableTrackingString,
  utmMedium: nullableTrackingString,
  utmCampaign: nullableTrackingString,
  utmContent: nullableTrackingString,
  utmTerm: nullableTrackingString,
  fbclid: nullableClickIdString,
  gclid: nullableClickIdString,
  referrer: z.string().trim().max(500).nullable(),
  landingUrl: z.string().trim().max(500),
  ctaOrigin: ctaOriginSchema,
  sessionId: z.string().uuid(),
  deviceClass: deviceClassSchema
});

export const leadCaptureRequestSchema = z.object({
  eventId: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  phone: z
    .string()
    .trim()
    .refine((value) => {
      const digitCount = value.replace(/\D/g, '').length;
      return digitCount >= 8 && digitCount <= 20;
    }, 'Phone must contain 8 to 20 digits.'),
  consent: z.literal(true),
  meta: metaBrowserTrackingSchema.optional(),
  attribution: attributionSchema
});

export const leadCaptureResponseSchema = z.object({
  eventId: z.string().uuid(),
  leadId: z.string().uuid(),
  status: leadStatusSchema,
  checkoutUrl: z.string().url(),
  redirectAllowed: z.boolean()
});

export type CtaOrigin = z.infer<typeof ctaOriginSchema>;
export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type DeviceClass = z.infer<typeof deviceClassSchema>;
export type Attribution = z.infer<typeof attributionSchema>;
export type LeadCaptureRequest = z.infer<typeof leadCaptureRequestSchema>;
export type LeadCaptureResponse = z.infer<typeof leadCaptureResponseSchema>;
