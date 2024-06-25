import { routes } from '../stations/Channels/routes';
import {
  ChannelDetailsStationDynamicSegments,
  ProgramDetailsStationDynamicSegments,
} from '../types';

export const programDetailsStationResolverRegistration = (
  dynamicSegments: ProgramDetailsStationDynamicSegments,
): string | undefined => {
  switch (typeof dynamicSegments) {
    case 'string':
      return routes.generate(routes.programDetails, {
        programId: dynamicSegments,
      });

    case 'object':
      if ('programId' in dynamicSegments) {
        const { programId } = dynamicSegments;
        return routes.generate(routes.programDetails, { programId });
      } else if ('playlistId' in dynamicSegments) {
        const { playlistId, channelId } = dynamicSegments;
        return routes.generate(
          routes.programs,
          channelId
            ? {
                playlistId,
                channelId,
              }
            : { playlistId },
        );
      }
      break;
  }

  return undefined;
};

export const channelDetailsStationResolverRegistration = (
  dynamicSegments: ChannelDetailsStationDynamicSegments | undefined,
): string | undefined => {
  const channelId =
    typeof dynamicSegments === 'string'
      ? dynamicSegments
      : dynamicSegments?.channelId;

  return channelId
    ? routes.generate(routes.channelDetails, { channelId })
    : undefined;
};
