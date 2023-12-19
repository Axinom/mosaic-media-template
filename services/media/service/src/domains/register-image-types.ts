import {
  DeclareImageTypesCommand,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { Config, requestServiceAccountToken } from '../common';
import { collectionImageTypes } from './collections';
import { movieImageTypes } from './movies';
import { tvshowImageTypes } from './tvshows';

export const registerImageTypes = async (
  storeOutboxMessage: StoreOutboxMessage,
  loginClient: ClientBase,
  config: Config,
): Promise<void> => {
  const serviceAccountToken = await requestServiceAccountToken(config);
  await storeOutboxMessage<DeclareImageTypesCommand>(
    config.environmentId,
    ImageServiceMultiTenantMessagingSettings.DeclareImageTypes,
    {
      service_id: config.serviceId,
      image_types: [
        ...movieImageTypes,
        ...tvshowImageTypes,
        ...collectionImageTypes,
      ],
    },
    loginClient,
    {
      auth_token: serviceAccountToken.accessToken,
    },
    {
      routingKey:
        ImageServiceMultiTenantMessagingSettings.DeclareImageTypes.getEnvironmentRoutingKey(
          {
            tenantId: config.tenantId,
            environmentId: config.environmentId,
          },
        ),
    },
  );
};
