import {
  ensureError,
  Logger,
  MosaicError,
} from '@axinom/mosaic-service-common';
import { CommonErrors } from '../../common';
import { DrmSettings } from './drm-settings-helpers';

/** How long loaded settings are used before the next refresh. */
const DRM_SETTINGS_REFRESH_INTERVAL_IN_MS = 5 * 60 * 1000;
/** First retry delay after a failed load. Doubles with each further failure. */
const DRM_SETTINGS_RETRY_BASE_DELAY_IN_MS = 10 * 1000;
/**
 * Longest retry delay while no settings were loaded yet. Kept short, so
 * protected content plays again soon after the DRM Service recovers.
 */
const DRM_SETTINGS_MAX_RETRY_DELAY_WITHOUT_SETTINGS_IN_MS = 30 * 1000;
/**
 * Upper bound for one load (service account token and DRM Service call), so a
 * hanging call can't stop the refresh loop.
 */
const DRM_SETTINGS_LOAD_TIMEOUT_IN_MS = 15 * 1000;

export interface DrmSettingsCacheOptions {
  /** Loads the settings from the DRM Service. */
  load: () => Promise<DrmSettings>;
  logger?: Pick<Logger, 'warn'>;
  refreshIntervalInMs?: number;
  retryBaseDelayInMs?: number;
  maxRetryDelayWithoutSettingsInMs?: number;
  loadTimeoutInMs?: number;
}

export interface DrmSettingsCache {
  /** Starts the background refresh loop. Does nothing if already started. */
  start: () => void;
  /** Stops the background refresh loop. */
  stop: () => void;
  /**
   * Returns the current DRM settings without waiting for a refresh. If no
   * settings were loaded yet, waits for a load that is in progress, and
   * otherwise fails at once with `DRM_SERVICE_REQUEST_FAILED`.
   */
  get: () => Promise<DrmSettings>;
  /**
   * Resolves `true` once settings are loaded, or `false` after the timeout.
   * Never rejects.
   */
  waitForSettings: (timeoutInMs: number) => Promise<boolean>;
}

/**
 * Creates an in-memory cache for the DRM settings. A background loop loads
 * them, refreshes them after the refresh interval and retries failed loads
 * with backoff. Requests never trigger or wait for a refresh while settings
 * exist; a failed refresh keeps the last known settings.
 */
export const createDrmSettingsCache = ({
  load,
  logger = new Logger({ context: 'DrmSettingsCache' }),
  refreshIntervalInMs = DRM_SETTINGS_REFRESH_INTERVAL_IN_MS,
  retryBaseDelayInMs = DRM_SETTINGS_RETRY_BASE_DELAY_IN_MS,
  maxRetryDelayWithoutSettingsInMs = DRM_SETTINGS_MAX_RETRY_DELAY_WITHOUT_SETTINGS_IN_MS,
  loadTimeoutInMs = DRM_SETTINGS_LOAD_TIMEOUT_IN_MS,
}: DrmSettingsCacheOptions): DrmSettingsCache => {
  let settings: DrmSettings | undefined;
  let lastError: Error | undefined;
  let failedAttempts = 0;
  let pendingLoad: Promise<void> | undefined;
  let timer: NodeJS.Timeout | undefined;
  let started = false;
  let stopped = false;
  const settingsListeners = new Set<() => void>();

  const scheduleNextLoad = (delayInMs: number): void => {
    if (stopped) {
      return;
    }
    timer = setTimeout(() => void runLoad(), delayInMs);
    // Don't keep the process alive only for the refresh loop.
    timer.unref?.();
  };

  const loadWithTimeout = async (): Promise<DrmSettings> => {
    let timeout: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        load(),
        new Promise<never>((_resolve, reject) => {
          timeout = setTimeout(
            () =>
              reject(
                new Error(
                  `Loading the DRM settings took longer than ${loadTimeoutInMs} ms.`,
                ),
              ),
            loadTimeoutInMs,
          );
        }),
      ]);
    } finally {
      clearTimeout(timeout);
    }
  };

  // Runs one load and schedules the next one. Never rejects, because nobody
  // awaits the loads started by the timer.
  const runLoad = (): Promise<void> => {
    if (!pendingLoad) {
      pendingLoad = (async () => {
        try {
          settings = await loadWithTimeout();
          failedAttempts = 0;
          lastError = undefined;
          settingsListeners.forEach((notify) => notify());
          scheduleNextLoad(refreshIntervalInMs);
        } catch (e) {
          lastError = ensureError(e);
          failedAttempts += 1;
          const retryDelay = Math.min(
            retryBaseDelayInMs * 2 ** (failedAttempts - 1),
            settings ? refreshIntervalInMs : maxRetryDelayWithoutSettingsInMs,
          );
          logger.warn(lastError, {
            message: settings
              ? 'Refreshing the DRM settings failed. The last known settings are used until a later refresh succeeds.'
              : 'Loading the DRM settings failed. Protected content can be played only once the DRM Service is enabled for this environment and reachable.',
            details: { failedAttempts, retryInMs: retryDelay },
          });
          scheduleNextLoad(retryDelay);
        } finally {
          pendingLoad = undefined;
        }
      })();
    }
    return pendingLoad;
  };

  const start = (): void => {
    if (started || stopped) {
      return;
    }
    started = true;
    void runLoad();
  };

  return {
    start,
    stop: () => {
      stopped = true;
      clearTimeout(timer);
      settingsListeners.forEach((notify) => notify());
    },
    get: async () => {
      if (settings) {
        return settings;
      }
      start();
      // Without settings there is nothing to answer with, so wait for a load
      // that is in progress (e.g. right after startup).
      if (pendingLoad) {
        await pendingLoad;
      }
      if (settings) {
        return settings;
      }
      throw new MosaicError({
        ...CommonErrors.DrmServiceRequestFailed,
        ...(lastError && { error: lastError }),
      });
    },
    waitForSettings: (timeoutInMs) => {
      if (settings) {
        return Promise.resolve(true);
      }
      start();
      return new Promise<boolean>((resolve) => {
        const done = (): void => {
          clearTimeout(timeout);
          settingsListeners.delete(done);
          resolve(settings !== undefined);
        };
        const timeout = setTimeout(done, timeoutInMs);
        timeout.unref?.();
        settingsListeners.add(done);
      });
    },
  };
};
