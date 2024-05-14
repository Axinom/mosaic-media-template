import {
  ChannelDetailsStationDynamicSegments,
  ChannelStationNames,
  ProgramDetailsStationDynamicSegments,
} from '../types';

interface ChannelDetailsResolverData {
  station: ChannelStationNames.ChannelDetails;
  resolver: (dynamicSegments: ChannelDetailsStationDynamicSegments) => void;
}

interface ProgramDetailsResolverData {
  station: ChannelStationNames.ProgramDetails;
  resolver: (dynamicSegments: ProgramDetailsStationDynamicSegments) => void;
}

declare module '@axinom/mosaic-portal' {
  interface RegisterRouteResolver {
    (data: ChannelDetailsResolverData): void;
  }

  interface RegisterRouteResolver {
    (data: ProgramDetailsResolverData): void;
  }
}
