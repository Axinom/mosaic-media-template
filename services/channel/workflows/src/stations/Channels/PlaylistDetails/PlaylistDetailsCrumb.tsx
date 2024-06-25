import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../apolloClient';
import {
  PlaylistTitleDocument,
  PlaylistTitleQuery,
} from '../../../generated/graphql';

export const PlaylistDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<PlaylistTitleQuery>({
      query: PlaylistTitleDocument,
      variables: {
        id: params['playlistId'],
      },
      errorPolicy: 'ignore',
    });
    return response.data.playlist?.title ?? 'Playlist Details';
  };
};
