import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../apolloClient';
import {
  ChannelTitleDocument,
  ChannelTitleQuery,
} from '../../../generated/graphql';

export const ChannelDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<ChannelTitleQuery>({
      query: ChannelTitleDocument,
      variables: {
        id: params['channelId'],
      },
      errorPolicy: 'ignore',
    });
    return response.data.channel?.title ?? 'Channel Details';
  };
};
