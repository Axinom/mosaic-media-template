import { CommonErrors } from '../../common';
import {
  DrmSettings,
  getCommunicationKey,
  getDrmTenantUrl,
  getFairPlayCertificateUrl,
} from './drm-settings-helpers';

const settingsA: DrmSettings = {
  communicationKeys: [
    { id: 'key-a', data: 'YQ==', created: '2026-01-01T00:00:00Z' },
  ],
  drmTenantId: 'ee3eef1f-70da-45de-97c1-c861ae55b304',
  axinomFairPlayCertificateUsageExpires: null,
};

describe('getCommunicationKey', () => {
  it('returns the chosen key', () => {
    expect(getCommunicationKey(settingsA).id).toBe('key-a');
  });

  it('no DRM tenant -> NO_DRM_TENANT_FOUND', () => {
    expect(() =>
      getCommunicationKey({ ...settingsA, drmTenantId: undefined }),
    ).toThrow(
      expect.objectContaining({ code: CommonErrors.NoDrmTenantFound.code }),
    );
  });

  it('no keys -> NO_COMMUNICATION_KEYS_AVAILABLE', () => {
    expect(() =>
      getCommunicationKey({ ...settingsA, communicationKeys: [] }),
    ).toThrow(
      expect.objectContaining({
        code: CommonErrors.NoCommunicationKeysAvailable.code,
      }),
    );
  });
});

describe('getDrmTenantUrl', () => {
  it('puts the first block of the DRM tenant ID in front of the host', () => {
    expect(
      getDrmTenantUrl(
        'https://drm-widevine-licensing.axprod.net/AcquireLicense',
        'ee3eef1f-70da-45de-97c1-c861ae55b304',
      ),
    ).toBe('https://ee3eef1f.drm-widevine-licensing.axprod.net/AcquireLicense');
  });
});

describe('getFairPlayCertificateUrl', () => {
  const now = Date.parse('2026-11-05T12:00:00Z');
  const testCert = 'https://tools.axinom.com/FPScert/fairplay.cer';

  it('FairPlay dataset exists -> its URL', () => {
    expect(
      getFairPlayCertificateUrl(
        {
          ...settingsA,
          fairPlayCertificateUrl: 'https://example.com/own.cer',
          axinomFairPlayCertificateUsageExpires: '2020-01-01T00:00:00Z',
        },
        testCert,
        now,
      ),
    ).toBe('https://example.com/own.cer');
  });

  it.each([null, '2026-12-01T00:00:00Z'])(
    'no dataset, test certificate usage expires %p -> test certificate',
    (expires) => {
      expect(
        getFairPlayCertificateUrl(
          { ...settingsA, axinomFairPlayCertificateUsageExpires: expires },
          testCert,
          now,
        ),
      ).toBe(testCert);
    },
  );

  it.each([undefined, '2026-11-01T00:00:00Z'])(
    'no dataset, test certificate usage expires %p -> NO_FAIRPLAY_CERTIFICATE_AVAILABLE',
    (expires) => {
      expect(() =>
        getFairPlayCertificateUrl(
          { ...settingsA, axinomFairPlayCertificateUsageExpires: expires },
          testCert,
          now,
        ),
      ).toThrow(
        expect.objectContaining({
          code: CommonErrors.NoFairplayCertificateAvailable.code,
        }),
      );
    },
  );
});
