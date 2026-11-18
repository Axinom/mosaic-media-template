import { MosaicError } from '@axinom/mosaic-service-common';
import { vi } from 'vitest';
import { CommonErrors } from '../../common';
import {
  createDrmSettingsCache,
  DrmSettingsCacheOptions,
} from './drm-settings-cache';
import { DrmSettings } from './drm-settings-helpers';

const settingsA: DrmSettings = {
  communicationKeys: [
    { id: 'key-a', data: 'YQ==', created: '2026-01-01T00:00:00Z' },
  ],
  drmTenantId: 'ee3eef1f-70da-45de-97c1-c861ae55b304',
  axinomFairPlayCertificateUsageExpires: null,
};
const settingsB: DrmSettings = {
  ...settingsA,
  communicationKeys: [
    { id: 'key-b', data: 'Yg==', created: '2026-02-01T00:00:00Z' },
  ],
};

const getError = async (promise: Promise<unknown>): Promise<MosaicError> => {
  try {
    await promise;
  } catch (error) {
    return error as MosaicError;
  }
  throw new Error('Expected the promise to reject');
};

/** A load that only settles when the test says so. */
const createDeferred = (): {
  promise: Promise<DrmSettings>;
  resolve: (settings: DrmSettings) => void;
} => {
  let resolve: (settings: DrmSettings) => void = () => undefined;
  const promise = new Promise<DrmSettings>((r) => (resolve = r));
  return { promise, resolve };
};

describe('createDrmSettingsCache', () => {
  const refreshIntervalInMs = 5 * 60 * 1000;
  const retryBaseDelayInMs = 10 * 1000;
  const maxRetryDelayWithoutSettingsInMs = 30 * 1000;
  const loadTimeoutInMs = 15 * 1000;
  let logger: { warn: ReturnType<typeof vi.fn> };
  let stopCache: (() => void) | undefined;

  const createCache = (load: () => Promise<DrmSettings>) => {
    const cache = createDrmSettingsCache({
      load,
      logger: logger as unknown as DrmSettingsCacheOptions['logger'],
      refreshIntervalInMs,
      retryBaseDelayInMs,
      maxRetryDelayWithoutSettingsInMs,
      loadTimeoutInMs,
    });
    stopCache = cache.stop;
    return cache;
  };

  /** Lets pending promises and timers due within `ms` run. */
  const advance = (ms = 0): Promise<void> =>
    vi.advanceTimersByTimeAsync(ms).then(() => undefined);

  beforeEach(() => {
    vi.useFakeTimers();
    logger = { warn: vi.fn() };
  });

  afterEach(() => {
    stopCache?.();
    vi.useRealTimers();
  });

  describe('loading and refreshing', () => {
    it('start loads the settings once', async () => {
      const load = vi.fn(async () => settingsA);
      const cache = createCache(load);

      cache.start();
      cache.start();
      await advance();

      expect(load).toHaveBeenCalledTimes(1);
      expect(await cache.get()).toBe(settingsA);
    });

    it('get before start starts the loop and waits for the first load', async () => {
      const load = vi.fn(async () => settingsA);
      const cache = createCache(load);

      expect(await cache.get()).toBe(settingsA);
      expect(load).toHaveBeenCalledTimes(1);
    });

    it('concurrent calls during the first load -> one load, all get the settings', async () => {
      const deferred = createDeferred();
      const load = vi.fn(() => deferred.promise);
      const cache = createCache(load);

      const calls = [cache.get(), cache.get(), cache.get()];
      deferred.resolve(settingsA);

      expect(await Promise.all(calls)).toEqual([
        settingsA,
        settingsA,
        settingsA,
      ]);
      expect(load).toHaveBeenCalledTimes(1);
    });

    it('refreshes in the background after the refresh interval', async () => {
      const load = vi
        .fn<() => Promise<DrmSettings>>()
        .mockResolvedValueOnce(settingsA)
        .mockResolvedValueOnce(settingsB);
      const cache = createCache(load);
      cache.start();
      await advance();

      await advance(refreshIntervalInMs - 1);
      expect(load).toHaveBeenCalledTimes(1);

      await advance(1);
      expect(load).toHaveBeenCalledTimes(2);
      expect(await cache.get()).toBe(settingsB);
    });

    it('requests do not trigger a load while settings exist', async () => {
      const load = vi.fn(async () => settingsA);
      const cache = createCache(load);
      cache.start();
      await advance();

      for (let i = 0; i < 5; i++) {
        await cache.get();
      }
      expect(load).toHaveBeenCalledTimes(1);
    });

    it('a refresh in progress does not delay requests', async () => {
      const refresh = createDeferred();
      const load = vi
        .fn<() => Promise<DrmSettings>>()
        .mockResolvedValueOnce(settingsA)
        .mockReturnValueOnce(refresh.promise);
      const cache = createCache(load);
      cache.start();
      await advance();

      await advance(refreshIntervalInMs); // refresh starts and hangs
      expect(load).toHaveBeenCalledTimes(2);

      // Resolves at once with the last known settings
      expect(await cache.get()).toBe(settingsA);

      refresh.resolve(settingsB);
      await advance();
      expect(await cache.get()).toBe(settingsB);
    });

    it('stop prevents further loads', async () => {
      const load = vi.fn(async () => settingsA);
      const cache = createCache(load);
      cache.start();
      await advance();

      cache.stop();
      await advance(refreshIntervalInMs * 3);

      expect(load).toHaveBeenCalledTimes(1);
    });
  });

  describe('failures with loaded settings', () => {
    it('failed refresh -> last known settings are kept and a warning is logged', async () => {
      const load = vi
        .fn<() => Promise<DrmSettings>>()
        .mockResolvedValueOnce(settingsA)
        .mockRejectedValue(new Error('503 Service Unavailable'));
      const cache = createCache(load);
      cache.start();
      await advance();

      await advance(refreshIntervalInMs);

      expect(load).toHaveBeenCalledTimes(2);
      expect(await cache.get()).toBe(settingsA);
      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn.mock.calls[0][1]).toMatchObject({
        details: { failedAttempts: 1, retryInMs: retryBaseDelayInMs },
      });
    });

    it('failed refreshes -> retries with backoff, capped at the refresh interval', async () => {
      const load = vi
        .fn<() => Promise<DrmSettings>>()
        .mockResolvedValueOnce(settingsA)
        .mockRejectedValue(new Error('503 Service Unavailable'));
      const cache = createCache(load);
      cache.start();
      await advance();
      await advance(refreshIntervalInMs); // 1st failure, retry in 10s

      await advance(retryBaseDelayInMs - 1);
      expect(load).toHaveBeenCalledTimes(2);
      await advance(1); // 2nd failure, retry in 20s
      expect(load).toHaveBeenCalledTimes(3);
      await advance(2 * retryBaseDelayInMs);
      expect(load).toHaveBeenCalledTimes(4);

      // Many further failures: the delay never exceeds the refresh interval
      await advance(refreshIntervalInMs * 10);
      const retryDelays = logger.warn.mock.calls.map(
        (call) => call[1].details.retryInMs,
      );
      expect(Math.max(...retryDelays)).toBe(refreshIntervalInMs);
      expect(await cache.get()).toBe(settingsA);
    });

    it('successful refresh after failures -> new settings and normal interval', async () => {
      const load = vi
        .fn<() => Promise<DrmSettings>>()
        .mockResolvedValueOnce(settingsA)
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValueOnce(settingsB);
      const cache = createCache(load);
      cache.start();
      await advance();
      await advance(refreshIntervalInMs); // fails, keeps A

      await advance(retryBaseDelayInMs);
      expect(await cache.get()).toBe(settingsB);

      await advance(refreshIntervalInMs - 1);
      expect(load).toHaveBeenCalledTimes(3);
    });

    it('hanging load -> times out and the loop keeps running', async () => {
      const load = vi
        .fn<() => Promise<DrmSettings>>()
        .mockResolvedValueOnce(settingsA)
        .mockReturnValueOnce(new Promise<DrmSettings>(() => undefined))
        .mockResolvedValueOnce(settingsB);
      const cache = createCache(load);
      cache.start();
      await advance();
      await advance(refreshIntervalInMs); // refresh hangs

      await advance(loadTimeoutInMs); // times out, retry in 10s
      expect(logger.warn).toHaveBeenCalledTimes(1);
      await advance(retryBaseDelayInMs);

      expect(load).toHaveBeenCalledTimes(3);
      expect(await cache.get()).toBe(settingsB);
    });
  });

  describe('failures without loaded settings', () => {
    it('first load fails -> DRM_SERVICE_REQUEST_FAILED', async () => {
      const load = vi.fn(async () => {
        throw new Error('connect ECONNREFUSED');
      });
      const cache = createCache(load);

      const error = await getError(cache.get());
      expect(error).toBeInstanceOf(MosaicError);
      expect(error.code).toBe(CommonErrors.DrmServiceRequestFailed.code);
    });

    it('no load in progress -> fails at once without calling the DRM Service', async () => {
      const load = vi.fn(async () => {
        throw new Error('connect ECONNREFUSED');
      });
      const cache = createCache(load);
      await getError(cache.get());

      const error = await getError(cache.get());
      expect(error.code).toBe(CommonErrors.DrmServiceRequestFailed.code);
      expect(load).toHaveBeenCalledTimes(1);
    });

    it('retries in the background with backoff capped at 30 seconds, then serves the settings', async () => {
      const load = vi
        .fn<() => Promise<DrmSettings>>()
        .mockRejectedValueOnce(new Error('1'))
        .mockRejectedValueOnce(new Error('2'))
        .mockRejectedValueOnce(new Error('3'))
        .mockRejectedValueOnce(new Error('4'))
        .mockResolvedValueOnce(settingsA);
      const cache = createCache(load);
      cache.start();
      await advance(); // 1st failure, retry in 10s
      await advance(10_000); // 2nd failure, retry in 20s
      await advance(20_000); // 3rd failure, retry in 30s (not 40s)
      await advance(30_000); // 4th failure, retry in 30s
      await advance(30_000); // success

      const retryDelays = logger.warn.mock.calls.map(
        (call) => call[1].details.retryInMs,
      );
      expect(retryDelays).toEqual([10_000, 20_000, 30_000, 30_000]);
      expect(load).toHaveBeenCalledTimes(5);
      expect(await cache.get()).toBe(settingsA);
    });
  });

  describe('waitForSettings', () => {
    it('settings already loaded -> true at once', async () => {
      const cache = createCache(async () => settingsA);
      await cache.get();

      expect(await cache.waitForSettings(1000)).toBe(true);
    });

    it('first load succeeds after a retry within the timeout -> true', async () => {
      const load = vi
        .fn<() => Promise<DrmSettings>>()
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValueOnce(settingsA);
      const cache = createCache(load);

      const wait = cache.waitForSettings(15_000);
      await advance(retryBaseDelayInMs);

      expect(await wait).toBe(true);
    });

    it('no settings within the timeout -> false, never rejects', async () => {
      const load = vi.fn(async () => {
        throw new Error('connect ECONNREFUSED');
      });
      const cache = createCache(load);

      const wait = cache.waitForSettings(15_000);
      await advance(15_000);

      expect(await wait).toBe(false);
    });
  });
});
