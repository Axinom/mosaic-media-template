import {
  ensureError,
  Logger,
  MosaicError,
} from '@axinom/mosaic-service-common';
import { CommonErrors } from '../../common';
import { DrmSettings } from './drm-settings-helpers';

/** How long loaded settings are used before a refresh is tried. */
const DRM_SETTINGS_REFRESH_INTERVAL_IN_MS = 5 * 60 * 1000;
/** First retry delay after a failed load. Doubles with each further failure. */
const DRM_SETTINGS_RETRY_BASE_DELAY_IN_MS = 10 * 1000;

export interface DrmSettingsCacheOptions {
  /** Loads the settings from the DRM Service. */
  load: () => Promise<DrmSettings>;
  /** Clock, replaceable in tests. */
  now?: () => number;
  logger?: Pick<Logger, 'warn' | 'error'>;
  refreshIntervalInMs?: number;
  retryBaseDelayInMs?: number;
}

interface DrmSettingsCache {
  /**
   * Returns the DRM settings. Loads them if they are missing or due for a
   * refresh. A failed refresh keeps the last known settings, and the error
   * `DRM_SERVICE_REQUEST_FAILED` is thrown only if nothing was loaded yet.
   */
  get: () => Promise<DrmSettings>;
}

/**
 * Creates an in-memory cache for the DRM settings. It refreshes them after the
 * refresh interval, makes only one call at a time, keeps the last known
 * settings when a refresh fails, and retries failed refreshes with backoff.
 */
export const createDrmSettingsCache = ({
  load,
  now = Date.now,
  logger = new Logger({ context: 'DrmSettingsCache' }),
  refreshIntervalInMs = DRM_SETTINGS_REFRESH_INTERVAL_IN_MS,
  retryBaseDelayInMs = DRM_SETTINGS_RETRY_BASE_DELAY_IN_MS,
}: DrmSettingsCacheOptions): DrmSettingsCache => {
  let settings: DrmSettings | undefined;
  let nextRefreshAt = 0;
  let failedAttempts = 0;
  let pendingLoad: Promise<void> | undefined;

  const refresh = async (): Promise<void> => {
    try {
      settings = await load();
      failedAttempts = 0;
      nextRefreshAt = now() + refreshIntervalInMs;
    } catch (e) {
      const error = ensureError(e);
      failedAttempts += 1;
      const retryDelay = Math.min(
        retryBaseDelayInMs * 2 ** (failedAttempts - 1),
        refreshIntervalInMs,
      );
      nextRefreshAt = now() + retryDelay;

      if (settings) {
        logger.warn(error, {
          message:
            'Refreshing the DRM settings failed. The last known settings are used until a later refresh succeeds.',
          details: { failedAttempts, retryInMs: retryDelay },
        });
      } else {
        throw new MosaicError({
          ...CommonErrors.DrmServiceRequestFailed,
          error,
        });
      }
    }
  };

  return {
    get: async () => {
      // Without any settings, every request tries to load them (one call at a
      // time), because there is nothing to answer it with.
      if (!settings || now() >= nextRefreshAt) {
        if (!pendingLoad) {
          pendingLoad = refresh().finally(() => {
            pendingLoad = undefined;
          });
        }
        // While loaded settings exist, only a request that is due for a
        // refresh waits for it. A failed refresh does not reject in that case.
        await pendingLoad;
      }
      if (!settings) {
        // Only reachable if a concurrent first load failed.
        throw new MosaicError(CommonErrors.DrmServiceRequestFailed);
      }
      return settings;
    },
  };
};
