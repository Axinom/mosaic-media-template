import { vi } from 'vitest';

// Mock the DRM Service SDK and the service account token request
let drmCall: () => unknown = () => undefined;
vi.mock('../../generated/graphql/drm');
vi.mock('@axinom/mosaic-id-link-be', () => ({
  getServiceAccountToken: vi.fn(async () => ({
    accessToken: 'service_account_token',
    expiresInSeconds: 3600,
    tokenType: 'Bearer',
  })),
}));

import express from 'express';
import { AddressInfo } from 'net';
import { Server } from 'http';
import { CommonErrors, Config } from '../../common';
import { getSdk, Sdk } from '../../generated/graphql/drm';
import { createTestConfig } from '../../tests/test-utils/test-config';
import { stopDrmSettingsRefresh } from '../drm';
import { setupEntitlementWebhookEndpoint } from './video-playback-middlewares';

const drmTenantId = 'ee3eef1f-70da-45de-97c1-c861ae55b304';
const communicationKeyId = '34fd9c80-3ea9-4f35-8ca2-af19007d5728';
const keyId = '68945fc1-2337-4685-8dac-31cb808dc747';

const drmResponse = (
  overrides: {
    fairPlayDatasets?: { url: string }[];
    axinomFairPlayCertificateUsageExpires?: string | null;
  } = {},
): unknown => ({
  data: {
    communicationKeys: [
      {
        id: communicationKeyId,
        data: Buffer.from('secret_key').toString('base64'),
        created: '2022-09-23T07:36:21.0359502+00:00',
      },
    ],
    serviceConfigurations: {
      nodes: [
        {
          drmTenantId,
          axinomFairPlayCertificateUsageExpires:
            overrides.axinomFairPlayCertificateUsageExpires ?? null,
        },
      ],
    },
    fairPlayDatasets: overrides.fairPlayDatasets ?? [],
  },
});

const createRequestBody = (keyIds: (string | null)[]): unknown => ({
  message_type: 'EntitlementWebhookRequest',
  message_version: '1.0',
  timestamp: new Date().toISOString(),
  payload: {
    video: {
      id: 'b1a2e6b8-0d4b-4c1e-9d2a-0c6f1a9e1f00',
      title: 'Video',
      source_location: 'source',
      is_archived: false,
      videos_tags: [],
      video_encoding: {
        is_protected: keyIds.some((id) => id !== null),
        encoding_state: 'READY',
        output_format: 'CMAF',
        preview_status: 'APPROVED',
        audio_languages: [],
        subtitle_languages: [],
        caption_languages: [],
        video_streams: keyIds.map((key_id, index) => ({
          label: index === 0 ? 'audio' : 'SD',
          format: 'CMAF',
          key_id,
        })),
      },
    },
    management_user: {
      tenant_id: 'tenant',
      environment_id: 'environment',
      name: 'User',
      permissions: { 'ax-video-service': ['VIDEOS_STREAMING'] },
      subject_type: 'UserAccount',
      iat: 0,
      aud: '*',
      iss: 'id-service',
      sub: 'user',
    },
  },
});

const decodeJwtPayload = (jwt: string): Record<string, any> =>
  JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());

describe('Entitlement webhook', () => {
  let server: Server;
  let url: string;
  let config: Config;
  let drmCalls: number;

  beforeAll(async () => {
    // DEMO_MODE skips the webhook signature check, but still validates the payload.
    config = createTestConfig({ DEMO_MODE: 'true' });
    const app = express();
    setupEntitlementWebhookEndpoint(app, config);
    await new Promise<void>((resolve) => {
      server = app.listen(0, resolve);
    });
    url = `http://localhost:${(server.address() as AddressInfo).port}/entitlement`;

    vi.mocked(getSdk).mockReturnValue({
      GetDrmSettings: async () => {
        drmCalls++;
        return drmCall();
      },
    } as unknown as Sdk);
  });

  beforeEach(() => {
    stopDrmSettingsRefresh();
    drmCalls = 0;
    drmCall = () => drmResponse();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  const post = async (
    keyIds: (string | null)[],
  ): Promise<{ status: number; body: any }> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(createRequestBody(keyIds)),
    });
    return { status: response.status, body: await response.json() };
  };

  it('protected video -> JWT signed with the DRM Service key and tenant license URLs', async () => {
    const { status, body } = await post([keyId, null]);

    expect(status).toBe(200);
    expect(drmCalls).toBe(1);
    const payload = body.payload;
    expect(decodeJwtPayload(payload.entitlement_message_jwt)).toMatchObject({
      com_key_id: communicationKeyId,
      message: { content_keys_source: { inline: [{ id: keyId }] } },
    });
    expect(payload).toMatchObject({
      widevine_license_service_url:
        'https://ee3eef1f.drm-widevine-licensing.axprod.net/AcquireLicense',
      playready_license_service_url:
        'https://ee3eef1f.drm-playready-licensing.axprod.net/AcquireLicense',
      fairplay_license_service_url:
        'https://ee3eef1f.drm-fairplay-licensing.axprod.net/AcquireLicense',
      // no FairPlay dataset and no expiry -> Axinom test certificate
      fairplay_streaming_certificate_url: config.fairplayTestCertUrl,
    });
  });

  it('FairPlay dataset exists -> its certificate URL', async () => {
    drmCall = () =>
      drmResponse({
        fairPlayDatasets: [{ url: 'https://example.com/own.cer' }],
      });

    const { body } = await post([keyId]);

    expect(body.payload.fairplay_streaming_certificate_url).toBe(
      'https://example.com/own.cer',
    );
  });

  it('no FairPlay dataset and expired test certificate -> NO_FAIRPLAY_CERTIFICATE_AVAILABLE', async () => {
    drmCall = () =>
      drmResponse({
        axinomFairPlayCertificateUsageExpires: '2020-01-01T00:00:00Z',
      });

    const { status, body } = await post([keyId]);

    expect(status).not.toBe(200);
    expect(JSON.stringify(body)).toContain(
      CommonErrors.NoFairplayCertificateAvailable.code,
    );
  });

  it('clear content without key IDs -> empty payload, DRM Service not called', async () => {
    drmCall = () => {
      throw new Error('The DRM Service must not be called');
    };

    const { status, body } = await post([null, null]);

    expect(status).toBe(200);
    expect(body.payload).toEqual({});
    expect(drmCalls).toBe(0);
  });

  it('DRM Service unavailable and nothing loaded yet -> DRM_SERVICE_REQUEST_FAILED', async () => {
    drmCall = () => {
      throw new Error('connect ECONNREFUSED');
    };

    const { status, body } = await post([keyId]);

    expect(status).not.toBe(200);
    expect(JSON.stringify(body)).toContain(
      CommonErrors.DrmServiceRequestFailed.code,
    );
  });

  it('no communication key -> NO_COMMUNICATION_KEYS_AVAILABLE', async () => {
    drmCall = () => {
      const response = drmResponse() as any;
      response.data.communicationKeys = [];
      return response;
    };

    const { status, body } = await post([keyId]);

    expect(status).not.toBe(200);
    expect(JSON.stringify(body)).toContain(
      CommonErrors.NoCommunicationKeysAvailable.code,
    );
  });
});
