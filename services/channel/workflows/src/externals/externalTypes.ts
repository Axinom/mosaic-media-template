import '@axinom/mosaic-portal';
import {
  ChannelDetailsStationDynamicSegments,
  ChannelStationNames,
  ProgramDetailsStationDynamicSegments,
} from '../types';

// TODO: create a library for shared types.
interface ChannelDetailsResolverData {
  station: ChannelStationNames.ChannelDetails;
  resolver: (dynamicSegments: ChannelDetailsStationDynamicSegments) => void;
}

interface ProgramDetailsResolverData {
  station: ChannelStationNames.ProgramDetails;
  resolver: (dynamicSegments: ProgramDetailsStationDynamicSegments) => void;
}

declare module '@axinom/mosaic-portal' {
  interface RegistrationFunction {
    (
      station: ChannelStationNames.ChannelDetails,
      resolver: (
        dynamicRouteSegments: ChannelDetailsStationDynamicSegments,
      ) => void,
    ): string | undefined;
  }
  // channel details station resolver function
  interface ResolverFunction {
    (
      station: ChannelStationNames.ChannelDetails,
      dynamicRouteSegments: ChannelDetailsStationDynamicSegments,
    ): string | undefined;
  }
  // channel program details station resolver registration
  interface RegistrationFunction {
    (
      station: ChannelStationNames.ProgramDetails,
      resolver: (
        dynamicRouteSegments: ProgramDetailsStationDynamicSegments,
      ) => void,
    ): string | undefined;
  }
  // channel program details station resolver function
  interface ResolverFunction {
    (
      station: ChannelStationNames.ProgramDetails,
      dynamicRouteSegments: ProgramDetailsStationDynamicSegments,
    ): string | undefined;
  }
  // entity details station resolver function
  interface ResolverFunction {
    (station: string, dynamicRouteSegments: string): string | undefined;
  }
}
