import { z } from 'zod';

export const publicConfigSchema = z.object({
  eventPrice: z.number().int().positive(),
  salesPhase: z.string().trim().min(1),
  checkoutUrl: z.string().url(),
  checkoutFallbackUrl: z.string().url(),
  groupFormUrl: z.string().url(),
  mapsUrl: z.string().url(),
  salesEnabled: z.boolean()
});

export type PublicConfig = z.infer<typeof publicConfigSchema>;

