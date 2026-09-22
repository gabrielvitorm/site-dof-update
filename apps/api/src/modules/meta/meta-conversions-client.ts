import { createHash } from 'node:crypto';

export interface MetaCapiConfig {
  enabled: boolean;
  pixelId: string | null;
  accessToken: string | null;
  apiVersion: string;
  timeoutMs: number;
}

export interface MetaLeadEvent {
  eventId: string;
  eventSourceUrl: string;
  email: string;
  phoneE164: string | null;
  fbp: string | null;
  fbc: string | null;
  clientIpAddress?: string;
  clientUserAgent?: string;
}

export interface MetaConversionsClient {
  sendLead(input: MetaLeadEvent): Promise<void>;
}

interface MetaLogger {
  error(message: string, details?: unknown): void;
}

export function createMetaConversionsClient(
  config: MetaCapiConfig,
  fetchImpl: typeof fetch = fetch,
  logger: MetaLogger = console
): MetaConversionsClient {
  return {
    async sendLead(input) {
      if (!config.enabled) {
        return;
      }
      if (!config.pixelId || !config.accessToken) {
        logger.error('Meta CAPI is enabled without complete credentials.');
        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

      try {
        const response = await fetchImpl(
          `https://graph.facebook.com/${config.apiVersion}/${config.pixelId}/events`,
          {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              data: [
                {
                  event_name: 'Lead',
                  event_time: Math.floor(Date.now() / 1000),
                  event_id: input.eventId,
                  action_source: 'website',
                  event_source_url: input.eventSourceUrl,
                  user_data: {
                    em: [hashMetaUserValue(input.email)],
                    ...(input.phoneE164
                      ? { ph: [hashMetaUserValue(input.phoneE164.replace(/\D/g, ''))] }
                      : {}),
                    ...(input.fbp ? { fbp: input.fbp } : {}),
                    ...(input.fbc ? { fbc: input.fbc } : {}),
                    ...(input.clientIpAddress
                      ? { client_ip_address: input.clientIpAddress }
                      : {}),
                    ...(input.clientUserAgent
                      ? { client_user_agent: input.clientUserAgent }
                      : {})
                  }
                }
              ],
              access_token: config.accessToken
            }),
            signal: controller.signal
          }
        );

        if (!response.ok) {
          throw new Error(`Meta CAPI returned HTTP ${response.status}.`);
        }
      } finally {
        clearTimeout(timeout);
      }
    }
  };
}

export function hashMetaUserValue(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}
