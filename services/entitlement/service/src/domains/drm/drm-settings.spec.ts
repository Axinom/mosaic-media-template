import { vi } from 'vitest';

vi.mock('../../generated/graphql/drm');
vi.mock('@axinom/mosaic-id-link-be', () => ({
  getServiceAccountToken: vi.fn(async () => ({
    accessToken: 'service_account_token',
    expiresInSeconds: 3600,
    tokenType: 'Bearer',
  })),
}));

import { getSdk, Sdk } from '../../generated/graphql/drm';
import {
  getDrmSettings,
  loadDrmSettings,
  resetDrmSettingsCacheForTests,
  stopDrmSettingsRefresh,
} from './drm-settings';

describe('loadDrmSettings', () => {
  const config = {
    drmServiceBaseUrl: 'https://drm.service.test.invalid',
    idServiceAuthBaseUrl: 'https://id.service.test.invalid',
    serviceAccountClientId: 'client-id',
    serviceAccountClientSecret: 'client-secret',
  };

  it('maps the DRM Service response and sends the service account token', async () => {
    const GetDrmSettings = vi.fn(async () => ({
      data: {
        communicationKeys: [
          {
            id: 'key-1',
            data: 'YQ==',
            created: '2022-09-23T07:36:21.0359502+00:00',
          },
        ],
        serviceConfigurations: {
          nodes: [
            {
              drmTenantId: 'ee3eef1f-70da-45de-97c1-c861ae55b304',
              axinomFairPlayCertificateUsageExpires: null,
            },
          ],
        },
        fairPlayDatasets: [
          { url: 'https://example.com/first.cer' },
          { url: 'https://example.com/second.cer' },
        ],
      },
    }));
    vi.mocked(getSdk).mockReturnValue({ GetDrmSettings } as unknown as Sdk);

    const settings = await loadDrmSettings(config);

    expect(GetDrmSettings).toHaveBeenCalledWith(undefined, {
      Authorization: 'Bearer service_account_token',
    });
    expect(settings).toEqual({
      communicationKeys: [
        {
          id: 'key-1',
          data: 'YQ==',
          created: '2022-09-23T07:36:21.0359502+00:00',
        },
      ],
      drmTenantId: 'ee3eef1f-70da-45de-97c1-c861ae55b304',
      axinomFairPlayCertificateUsageExpires: null,
      fairPlayCertificateUrl: 'https://example.com/first.cer',
    });
  });

  it('no service configuration and no FairPlay dataset -> empty values', async () => {
    vi.mocked(getSdk).mockReturnValue({
      GetDrmSettings: async () => ({
        data: {
          communicationKeys: [],
          serviceConfigurations: { nodes: [] },
          fairPlayDatasets: [],
        },
      }),
    } as unknown as Sdk);

    expect(await loadDrmSettings(config)).toEqual({
      communicationKeys: [],
      drmTenantId: undefined,
      axinomFairPlayCertificateUsageExpires: undefined,
      fairPlayCertificateUrl: undefined,
    });
  });
});

describe('stopDrmSettingsRefresh', () => {
  const config = {
    drmServiceBaseUrl: 'https://drm.service.test.invalid',
    idServiceAuthBaseUrl: 'https://id.service.test.invalid',
    serviceAccountClientId: 'client-id',
    serviceAccountClientSecret: 'client-secret',
  };
  const response = {
    data: {
      communicationKeys: [{ id: 'key-1', data: 'YQ==', created: null }],
      serviceConfigurations: {
        nodes: [
          {
            drmTenantId: 'ee3eef1f-70da-45de-97c1-c861ae55b304',
            axinomFairPlayCertificateUsageExpires: null,
          },
        ],
      },
      fairPlayDatasets: [],
    },
  };

  afterEach(() => {
    resetDrmSettingsCacheForTests();
  });

  it('requests after a stop (e.g. during shutdown) keep the loaded settings and start no new load', async () => {
    const GetDrmSettings = vi.fn(async () => response);
    vi.mocked(getSdk).mockReturnValue({ GetDrmSettings } as unknown as Sdk);
    const loaded = await getDrmSettings(config);

    stopDrmSettingsRefresh();

    expect(await getDrmSettings(config)).toBe(loaded);
    expect(GetDrmSettings).toHaveBeenCalledTimes(1);
  });

  it('requests after a stop without loaded settings fail at once and start no new load', async () => {
    const GetDrmSettings = vi.fn(async () => {
      throw new Error('connect ECONNREFUSED');
    });
    vi.mocked(getSdk).mockReturnValue({ GetDrmSettings } as unknown as Sdk);
    await expect(getDrmSettings(config)).rejects.toThrow();

    stopDrmSettingsRefresh();

    await expect(getDrmSettings(config)).rejects.toMatchObject({
      code: 'DRM_SERVICE_REQUEST_FAILED',
    });
    expect(GetDrmSettings).toHaveBeenCalledTimes(1);
  });
});
