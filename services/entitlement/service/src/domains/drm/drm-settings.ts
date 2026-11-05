import { ensureError, Logger } from '@axinom/mosaic-service-common';
import { GraphQLClient } from 'graphql-request';
import urljoin from 'url-join';
import { Config, requestServiceAccountToken } from '../../common';
import { getSdk } from '../../generated/graphql/drm';
import { createDrmSettingsCache } from './drm-settings-cache';
import { DrmSettings } from './drm-settings-helpers';

/** Timeout of a single request to the DRM Service. */
const DRM_SERVICE_REQUEST_TIMEOUT_IN_MS = 5 * 1000;

type DrmSettingsConfig = Pick<
  Config,
  | 'drmServiceBaseUrl'
  | 'idServiceAuthBaseUrl'
  | 'serviceAccountClientId'
  | 'serviceAccountClientSecret'
>;

/**
 * Loads the DRM settings of the environment from the DRM Service, using the
 * service account of the Entitlement Service.
 */
export const loadDrmSettings = async (
  config: DrmSettingsConfig,
): Promise<DrmSettings> => {
  const token = await requestServiceAccountToken(config);
  const client = new GraphQLClient(
    urljoin(config.drmServiceBaseUrl, 'graphql'),
    {
      // A short timeout, so a slow DRM Service doesn't block entitlement requests
      // that the last known settings can answer.
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, {
          ...init,
          signal: AbortSignal.timeout(DRM_SERVICE_REQUEST_TIMEOUT_IN_MS),
        }),
    },
  );
  const { data } = await getSdk(client).GetDrmSettings(undefined, {
    Authorization: `Bearer ${token}`,
  });
  const serviceConfiguration = data.serviceConfigurations?.nodes[0];
  return {
    communicationKeys: data.communicationKeys.map(({ id, data, created }) => ({
      id,
      data,
      created,
    })),
    drmTenantId: serviceConfiguration?.drmTenantId ?? undefined,
    axinomFairPlayCertificateUsageExpires:
      serviceConfiguration?.axinomFairPlayCertificateUsageExpires,
    fairPlayCertificateUrl: data.fairPlayDatasets[0]?.url,
  };
};

let sharedCache: ReturnType<typeof createDrmSettingsCache> | undefined;

/**
 * Returns the DRM settings of the environment from the shared cache.
 */
export const getDrmSettings = (
  config: DrmSettingsConfig,
): Promise<DrmSettings> => {
  if (!sharedCache) {
    sharedCache = createDrmSettingsCache({
      load: () => loadDrmSettings(config),
    });
  }
  return sharedCache.get();
};

/**
 * Loads the DRM settings once at startup, so a running instance has them before
 * the DRM Service may become unavailable. Doesn't block and doesn't fail the
 * startup: the DRM Service may be enabled for the environment later.
 */
export const preloadDrmSettings = (config: DrmSettingsConfig): void => {
  getDrmSettings(config).catch((error) => {
    new Logger({ context: 'DrmSettings' }).warn(ensureError(error), {
      message:
        'The DRM settings could not be loaded at startup. Protected content can be played only once the DRM Service is enabled for this environment and reachable.',
    });
  });
};

/** Only for tests: drops the shared cache. */
export const resetDrmSettingsCache = (): void => {
  sharedCache = undefined;
};
