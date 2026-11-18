import {
  CommunicationKey,
  selectCommunicationKey,
} from './communication-key-selection';

describe('selectCommunicationKey', () => {
  const now = Date.parse('2026-11-05T12:00:00.000Z');
  const minutesAgo = (minutes: number): string =>
    new Date(now - minutes * 60 * 1000).toISOString();
  const key = (id: string, created?: string | null): CommunicationKey => ({
    id,
    data: 'c2VjcmV0X2tleQ==',
    created,
  });

  it('no keys -> undefined', () => {
    expect(selectCommunicationKey([], now)).toBeUndefined();
  });

  it.each([
    ['old', minutesAgo(60 * 24)],
    ['young', minutesAgo(1)],
    ['without creation date', undefined],
  ])('single %s key -> that key', (_name, created) => {
    const single = key('single', created);
    expect(selectCommunicationKey([single], now)).toBe(single);
  });

  it('mixed ages -> newest key that is at least 10 minutes old', () => {
    const keys = [
      key('oldest', minutesAgo(60 * 24 * 30)),
      key('newest-active', minutesAgo(15)),
      key('older', minutesAgo(60)),
      key('young', minutesAgo(5)),
    ];
    expect(selectCommunicationKey(keys, now)?.id).toBe('newest-active');
  });

  it('key exactly 10 minutes old counts as active', () => {
    const keys = [key('old', minutesAgo(60)), key('ten', minutesAgo(10))];
    expect(selectCommunicationKey(keys, now)?.id).toBe('ten');
  });

  it('only young keys -> oldest of them', () => {
    const keys = [
      key('young-2', minutesAgo(2)),
      key('young-8', minutesAgo(8)),
      key('young-5', minutesAgo(5)),
    ];
    expect(selectCommunicationKey(keys, now)?.id).toBe('young-8');
  });

  it('key created in the future (clock skew) -> treated as young', () => {
    const keys = [key('future', minutesAgo(-5)), key('old', minutesAgo(60))];
    expect(selectCommunicationKey(keys, now)?.id).toBe('old');
  });

  it.each([undefined, null, '', 'not-a-date'])(
    'key with missing or unreadable creation date (%p) counts as old',
    (created) => {
      // The undated key is the only active key, so it wins over a young key.
      const keys = [key('young', minutesAgo(1)), key('undated', created)];
      expect(selectCommunicationKey(keys, now)?.id).toBe('undated');
    },
  );

  it('undated key loses against a dated key that is at least 10 minutes old', () => {
    const keys = [key('undated', undefined), key('dated', minutesAgo(30))];
    expect(selectCommunicationKey(keys, now)?.id).toBe('dated');
  });

  it('reads the date format returned by the DRM Service', () => {
    // Format of `created` as returned by the DRM Service (7 fractional digits)
    const keys = [
      key('from-drm-service', '2026-11-05T11:30:21.0359502+00:00'),
      key('young', minutesAgo(1)),
    ];
    expect(selectCommunicationKey(keys, now)?.id).toBe('from-drm-service');
  });
});
