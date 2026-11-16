import { GraphQLClient } from 'graphql-request';
import urljoin from 'url-join';
import { Config, requestServiceAccountToken } from '../../common';
import { getSdk } from '../../generated/graphql/drm';
import { createDrmSettingsCache, DrmSettingsCache } from './drm-settings-cache';
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

let sharedCache: DrmSettingsCache | undefined;

const getSharedCache = (config: DrmSettingsConfig): DrmSettingsCache => {
  if (!sharedCache) {
    sharedCache = createDrmSettingsCache({
      load: () => loadDrmSettings(config),
    });
    sharedCache.start();
  }
  return sharedCache;
};

/**
 * Returns the DRM settings of the environment from the shared cache, without
 * waiting for a refresh. Fails with `DRM_SERVICE_REQUEST_FAILED` only if no
 * settings could be loaded yet.
 */
export const getDrmSettings = (
  config: DrmSettingsConfig,
): Promise<DrmSettings> => getSharedCache(config).get();

/**
 * Starts loading and refreshing the DRM settings in the background. Doesn't
 * block and doesn't fail the startup: the DRM Service may be enabled for the
 * environment later.
 */
export const startDrmSettingsRefresh = (config: DrmSettingsConfig): void => {
  getSharedCache(config);
};

/**
 * Resolves `true` once the DRM settings are loaded, or `false` after the
 * timeout. Never rejects.
 */
export const waitForDrmSettings = (
  config: DrmSettingsConfig,
  timeoutInMs: number,
): Promise<boolean> => getSharedCache(config).waitForSettings(timeoutInMs);

/**
 * Stops the background refresh and drops the shared cache. Used on shutdown
 * and between tests.
 */
export const stopDrmSettingsRefresh = (): void => {
  sharedCache?.stop();
  sharedCache = undefined;
};
