import { MosaicError } from '@axinom/mosaic-service-common';
import { CommonErrors } from '../../common';
import {
  CommunicationKey,
  selectCommunicationKey,
} from './communication-key-selection';

/** The DRM settings of the environment, as read from the DRM Service. */
export interface DrmSettings {
  communicationKeys: CommunicationKey[];
  drmTenantId?: string;
  axinomFairPlayCertificateUsageExpires?: string | null;
  /** URL of the first FairPlay dataset, if there is one */
  fairPlayCertificateUrl?: string;
}

/**
 * Returns the communication key to sign entitlement messages with.
 */
export const getCommunicationKey = (
  settings: DrmSettings,
  now: number = Date.now(),
): CommunicationKey => {
  if (!settings.drmTenantId) {
    throw new MosaicError(CommonErrors.NoDrmTenantFound);
  }
  const key = selectCommunicationKey(settings.communicationKeys, now);
  if (!key) {
    throw new MosaicError(CommonErrors.NoCommunicationKeysAvailable);
  }
  return key;
};

/**
 * Puts the first block of the DRM tenant ID in front of the host of a License
 * Service URL, e.g. `https://drm-widevine-licensing.axprod.net/AcquireLicense`
 * becomes `https://ee3eef1f.drm-widevine-licensing.axprod.net/AcquireLicense`.
 */
export const getDrmTenantUrl = (url: string, drmTenantId: string): string => {
  const shortId = drmTenantId.split('-')[0];
  const parsed = new URL(url);
  parsed.hostname = `${shortId}.${parsed.hostname}`;
  return parsed.toString();
};

/**
 * Returns the FairPlay certificate URL: the first FairPlay dataset, or the
 * Axinom test certificate while it may still be used. Matching the managed
 * Entitlement Service, an empty expiry date means that the test certificate
 * has no expiry.
 */
export const getFairPlayCertificateUrl = (
  settings: DrmSettings,
  testCertificateUrl: string,
  now: number = Date.now(),
): string => {
  if (settings.fairPlayCertificateUrl) {
    return settings.fairPlayCertificateUrl;
  }
  const expires = settings.axinomFairPlayCertificateUsageExpires;
  const isTestCertificateUsable =
    expires === null || (expires !== undefined && Date.parse(expires) >= now);
  if (!isTestCertificateUsable) {
    throw new MosaicError(CommonErrors.NoFairplayCertificateAvailable);
  }
  return testCertificateUrl;
};
