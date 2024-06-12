import { ChannelsQuery } from '../../../generated/graphql';

export type ChannelsData = NonNullable<
  ChannelsQuery['filtered']
>['nodes'][number];
