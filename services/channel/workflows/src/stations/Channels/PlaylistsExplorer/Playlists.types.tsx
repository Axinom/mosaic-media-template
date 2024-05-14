import { PlaylistsQuery } from '../../../generated/graphql';

export type PlaylistsData = NonNullable<
  PlaylistsQuery['filtered']
>['nodes'][number];
