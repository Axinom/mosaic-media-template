/**
 * Generate a route from a string and a map of values
 * @param value the route template string e.g. `/:id`
 * @param map the map of values to replace e.g. `{ id: 1 }`
 * @returns the generated route e.g. `/1`
 */
const generateRoute = (value: string, map: Record<string, string>): string => {
  let result = value;

  Object.entries(map).forEach(([key, val]) => {
    // Replace optional segments with empty string if not provided
    result = result.replace(`:${key}?`, val || '');
    result = result.replace(`:${key}`, val);
  });

  // Remove any remaining optional segments that were not provided and are at the end of the path
  result = result.replace(/\/:[^/]+\?$/, '');
  // Replace any remaining optional placeholders with an empty string
  result = result.replace(/:[^/]+\?/g, '');

  return result;
};

export const routes = {
  channels: '/channels',
  channelCreate: '/channels/create',
  channelDetails: '/channels/:channelId',
  channelLogo: '/channels/:channelId/logo',
  channelPublishing: '/channels/:channelId/publishing',
  channelVideos: '/channels/:channelId/videos',
  playlists: '/channels/:channelId/playlists',
  playlistCreate: '/channels/:channelId/playlists/create',
  playlistDetails: '/channels/:channelId/playlists/:playlistId',
  playlistPublishing: '/channels/:channelId/playlists/:playlistId/publishing',
  playlistStartTime: '/channels/:channelId/playlists/:playlistId/starttime',
  program: '/channels/:channelId/playlists/:playlistId/program',
  programDetails: '/channels/program/:programId',
  programLocalizationRoot:
    '/channels/:channelId/playlists/:playlistId/program/:programId',
  generate: generateRoute,
} as const;
