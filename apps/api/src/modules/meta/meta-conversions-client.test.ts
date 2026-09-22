import { describe, expect, it, vi } from 'vitest';

import { createMetaConversionsClient, hashMetaUserValue, type MetaCapiConfig } from './meta-conversions-client';

const config: MetaCapiConfig = {
  enabled: true,
  pixelId: '123456789',
  accessToken: 'secret-token',
  apiVersion: 'v20.0',
  timeoutMs: 1000
};

describe('MetaConversionsClient', () => {
  it('hashes user data and sends a deduplicated Lead event', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    const client = createMetaConversionsClient(config, fetch);

    await client.sendLead({
      eventId: '11111111-1111-4111-8111-111111111111',
      eventSourceUrl: 'https://dofupdate.com.br/',
      email: 'Maria@Example.com ',
      phoneE164: '+5527999999999',
      fbp: 'fb.1.123.456',
      fbc: null,
      clientIpAddress: '203.0.113.10',
      clientUserAgent: 'test-agent'
    });

    expect(hashMetaUserValue('Maria@Example.com ')).toBe(
      '10ef04a5a1acd81d18a0c61fdd354a063da07223720a1d8760aa5c2afa5e8ee0'
    );
    expect(fetch).toHaveBeenCalledWith(
      'https://graph.facebook.com/v20.0/123456789/events',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('11111111-1111-4111-8111-111111111111')
      })
    );
    expect(JSON.parse(fetch.mock.calls[0]?.[1]?.body as string)).toMatchObject({
      data: [
        {
          event_name: 'Lead',
          event_id: '11111111-1111-4111-8111-111111111111',
          action_source: 'website',
          user_data: {
            em: [expect.any(String)],
            ph: [expect.any(String)],
            fbp: 'fb.1.123.456',
            client_ip_address: '203.0.113.10',
            client_user_agent: 'test-agent'
          }
        }
      ]
    });
  });

  it('does not call Meta when disabled', async () => {
    const fetch = vi.fn();
    const client = createMetaConversionsClient({ ...config, enabled: false }, fetch);

    await client.sendLead({
      eventId: '11111111-1111-4111-8111-111111111111',
      eventSourceUrl: 'https://dofupdate.com.br/',
      email: 'maria@example.com',
      phoneE164: null,
      fbp: null,
      fbc: null
    });

    expect(fetch).not.toHaveBeenCalled();
  });
});
