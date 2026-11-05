/**
 * A new communication key needs up to this long to reach every License Service
 * instance. Until then, entitlement messages signed with it may be rejected.
 */
const COMMUNICATION_KEY_ACTIVATION_DELAY_IN_MS = 10 * 60 * 1000;

export interface CommunicationKey {
  id: string;
  /** Base64 encoded key value */
  data: string;
  /** Creation date as returned by the DRM Service (optional ISO date string) */
  created?: string | null;
}

/**
 * Parses the creation date of a key. A key without a readable creation date
 * counts as old, so it gets the lowest possible timestamp.
 */
const getCreatedTime = (key: CommunicationKey): number => {
  const time = key.created ? Date.parse(key.created) : NaN;
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
};

/**
 * Chooses the communication key to sign entitlement messages with:
 * - Keys younger than 10 minutes are ignored, and the newest of the remaining
 *   keys is used. Switching to the newest key lets an older key "dry out", so it
 *   can be deleted safely later.
 * - If all keys are younger than 10 minutes, the oldest of them is used.
 * - A key without a readable creation date counts as old.
 *
 * @returns the chosen key, or `undefined` if there are no keys.
 */
export const selectCommunicationKey = <T extends CommunicationKey>(
  keys: readonly T[],
  now: number = Date.now(),
): T | undefined => {
  const keysWithTime = keys.map((key) => ({
    key,
    created: getCreatedTime(key),
  }));

  const activeKeys = keysWithTime.filter(
    ({ created }) => now - created >= COMMUNICATION_KEY_ACTIVATION_DELAY_IN_MS,
  );

  const candidates = activeKeys.length > 0 ? activeKeys : keysWithTime;
  const pickNewest = activeKeys.length > 0;

  const chosen = candidates.reduce<(typeof keysWithTime)[number] | undefined>(
    (best, current) => {
      if (!best) {
        return current;
      }
      const isBetter = pickNewest
        ? current.created > best.created
        : current.created < best.created;
      return isBetter ? current : best;
    },
    undefined,
  );

  return chosen?.key;
};
