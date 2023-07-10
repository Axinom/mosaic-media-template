export const CHANNEL_ID_PREFIX = 'channel-';

/**
 * Adds a `channel-` prefix to the original UUID ID of the channel to match the
 * convention, similar to movies, episodes, etc...
 */
export const getChannelId = (id: string): string => `${CHANNEL_ID_PREFIX}${id}`;
