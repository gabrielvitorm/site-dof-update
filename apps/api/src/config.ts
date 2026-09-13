import { publicConfigSchema, type PublicConfig } from '@dof-update/contracts';

export interface AppConfig {
  nodeEnv: string;
  appBaseUrl: string;
  port: number;
  databaseUrl: string;
  publicConfig: PublicConfig;
  even3WebhookPathSecret: string;
  n8nInternalWebhookUrl: string;
  n8nInternalToken: string;
  leadRateLimitMax: number;
  leadRateLimitWindowMs: number;
  logLevel: string;
  piiLogMasking: boolean;
}

type EnvMap = Record<string, string | undefined>;

export function loadConfig(env: EnvMap = process.env): AppConfig {
  const publicConfig = publicConfigSchema.parse({
    eventPrice: readInt(env, 'EVENT_PRICE_BRL'),
    salesPhase: readRequired(env, 'SALES_PHASE'),
    checkoutUrl: readRequired(env, 'EVEN3_CHECKOUT_URL'),
    checkoutFallbackUrl: readRequired(env, 'EVEN3_FALLBACK_URL'),
    groupFormUrl: readRequired(env, 'GROUP_FORM_URL'),
    mapsUrl: readRequired(env, 'MAPS_URL'),
    salesEnabled: readBoolean(env, 'SALES_ENABLED')
  });

  return {
    nodeEnv: env.NODE_ENV ?? 'development',
    appBaseUrl: readRequired(env, 'APP_BASE_URL'),
    port: readInt(env, 'PORT'),
    databaseUrl: readRequired(env, 'DATABASE_URL'),
    publicConfig,
    even3WebhookPathSecret: readRequired(env, 'EVEN3_WEBHOOK_PATH_SECRET'),
    n8nInternalWebhookUrl: readRequired(env, 'N8N_INTERNAL_WEBHOOK_URL'),
    n8nInternalToken: readRequired(env, 'N8N_INTERNAL_TOKEN'),
    leadRateLimitMax: readOptionalInt(env, 'LEAD_RATE_LIMIT_MAX', 20),
    leadRateLimitWindowMs: readOptionalInt(env, 'LEAD_RATE_LIMIT_WINDOW_MS', 60_000),
    logLevel: env.LOG_LEVEL ?? 'info',
    piiLogMasking: readBoolean(env, 'PII_LOG_MASKING')
  };
}

function readRequired(env: EnvMap, name: string): string {
  const value = env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function readInt(env: EnvMap, name: string): number {
  const value = Number.parseInt(readRequired(env, name), 10);
  if (!Number.isInteger(value)) {
    throw new Error(`Environment variable ${name} must be an integer.`);
  }
  return value;
}

function readOptionalInt(env: EnvMap, name: string, fallback: number): number {
  const rawValue = env[name]?.trim();
  if (!rawValue) {
    return fallback;
  }
  const value = Number.parseInt(rawValue, 10);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer.`);
  }
  return value;
}

function readBoolean(env: EnvMap, name: string): boolean {
  const value = readRequired(env, name).toLowerCase();
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  throw new Error(`Environment variable ${name} must be true or false.`);
}
