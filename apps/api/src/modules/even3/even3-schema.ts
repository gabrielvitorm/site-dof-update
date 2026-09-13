import { z } from 'zod';

export const even3WebhookPayloadSchema = z.object({
  id: z.string().trim().min(1),
  eventType: z.string().trim().min(1),
  occurredAt: z.string().datetime().optional(),
  participant: z
    .object({
      name: z.string().trim().min(1).optional(),
      email: z.string().trim().toLowerCase().email().optional(),
      phone: z.string().trim().min(1).optional()
    })
    .optional(),
  registration: z
    .object({
      code: z.string().trim().min(1).optional()
    })
    .optional()
});

export type Even3WebhookPayload = z.infer<typeof even3WebhookPayloadSchema>;

