/**
 * Create an ISO string formatted time value with the given amount of
 * milliseconds in the future.
 * @param duration The duration to add to the current date
 * @returns Future ISO date string
 */
export const getFutureIsoDateInMilliseconds = (duration: number): string => {
  const t = new Date();
  t.setMilliseconds(t.getMilliseconds() + duration);
  return t.toISOString();
};
