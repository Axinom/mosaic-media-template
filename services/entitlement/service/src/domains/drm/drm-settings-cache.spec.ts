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

describe('createDrmSettingsCache', () => {
  const refreshIntervalInMs = 5 * 60 * 1000;
  const retryBaseDelayInMs = 10 * 1000;
  let time: number;
  let logger: {
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };

  const createCache = (load: () => Promise<DrmSettings>) =>
    createDrmSettingsCache({
      load,
      now: () => time,
      logger: logger as unknown as DrmSettingsCacheOptions['logger'],
      refreshIntervalInMs,
      retryBaseDelayInMs,
    });

  beforeEach(() => {
    time = 1_000_000;
    logger = { warn: vi.fn(), error: vi.fn() };
  });

  it('first call loads the settings', async () => {
    const load = vi.fn(async () => settingsA);
    const cache = createCache(load);

    expect(await cache.get()).toBe(settingsA);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('cache hit within the refresh interval -> no further load', async () => {
    const load = vi.fn(async () => settingsA);
    const cache = createCache(load);
    await cache.get();

    time += refreshIntervalInMs - 1;
    expect(await cache.get()).toBe(settingsA);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('expired cache -> settings are reloaded', async () => {
    const load = vi
      .fn<() => Promise<DrmSettings>>()
      .mockResolvedValueOnce(settingsA)
      .mockResolvedValueOnce(settingsB);
    const cache = createCache(load);
    await cache.get();

    time += refreshIntervalInMs;
    expect(await cache.get()).toBe(settingsB);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('concurrent calls -> only one load in flight', async () => {
    let resolveLoad: (settings: DrmSettings) => void = () => undefined;
    const load = vi.fn(
      () => new Promise<DrmSettings>((resolve) => (resolveLoad = resolve)),
    );
    const cache = createCache(load);

    const calls = [cache.get(), cache.get(), cache.get()];
    resolveLoad(settingsA);

    expect(await Promise.all(calls)).toEqual([settingsA, settingsA, settingsA]);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('nothing loaded yet and load fails -> DRM_SERVICE_REQUEST_FAILED', async () => {
    const load = vi.fn(async () => {
      throw new Error('connect ECONNREFUSED');
    });
    const cache = createCache(load);

    const error = await getError(cache.get());
    expect(error).toBeInstanceOf(MosaicError);
    expect(error.code).toBe(CommonErrors.DrmServiceRequestFailed.code);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('nothing loaded yet -> next call tries again and succeeds', async () => {
    const load = vi
      .fn<() => Promise<DrmSettings>>()
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce(settingsA);
    const cache = createCache(load);

    await getError(cache.get());
    expect(await cache.get()).toBe(settingsA);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('failed refresh -> last known settings are kept and a warning is logged', async () => {
    const load = vi
      .fn<() => Promise<DrmSettings>>()
      .mockResolvedValueOnce(settingsA)
      .mockRejectedValue(new Error('503 Service Unavailable'));
    const cache = createCache(load);
    await cache.get();

    time += refreshIntervalInMs;
    expect(await cache.get()).toBe(settingsA);
    expect(load).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn.mock.calls[0][1]).toMatchObject({
      details: { failedAttempts: 1, retryInMs: retryBaseDelayInMs },
    });
  });

  it('failed refresh -> retries with backoff, capped at the refresh interval', async () => {
    const load = vi
      .fn<() => Promise<DrmSettings>>()
      .mockResolvedValueOnce(settingsA)
      .mockRejectedValue(new Error('503 Service Unavailable'));
    const cache = createCache(load);
    await cache.get();
    time += refreshIntervalInMs;
    await cache.get(); // 1st failure, retry in 10s

    time += retryBaseDelayInMs - 1;
    await cache.get();
    expect(load).toHaveBeenCalledTimes(2); // still waiting

    time += 1;
    await cache.get(); // 2nd failure, retry in 20s
    expect(load).toHaveBeenCalledTimes(3);

    time += 2 * retryBaseDelayInMs - 1;
    await cache.get();
    expect(load).toHaveBeenCalledTimes(3);

    // Many further failures: the delay never exceeds the refresh interval
    for (let i = 0; i < 10; i++) {
      time += refreshIntervalInMs;
      expect(await cache.get()).toBe(settingsA);
    }
    expect(load).toHaveBeenCalledTimes(13);
    const lastCall = logger.warn.mock.calls[logger.warn.mock.calls.length - 1];
    expect(lastCall[1].details.retryInMs).toBe(refreshIntervalInMs);
  });

  it('successful refresh after failures -> new settings and normal interval', async () => {
    const load = vi
      .fn<() => Promise<DrmSettings>>()
      .mockResolvedValueOnce(settingsA)
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce(settingsB);
    const cache = createCache(load);
    await cache.get();
    time += refreshIntervalInMs;
    await cache.get(); // fails, keeps A

    time += retryBaseDelayInMs;
    expect(await cache.get()).toBe(settingsB);

    time += refreshIntervalInMs - 1;
    await cache.get();
    expect(load).toHaveBeenCalledTimes(3);
  });
});
