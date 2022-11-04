import { Broker } from '@axinom/mosaic-message-bus';
import {
  DeclareImageTypesCommand,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Config, requestServiceAccountToken } from '../common';
import { collectionImageTypes } from './collections';
import { movieImageTypes } from './movies';
import { tvshowImageTypes } from './tvshows';

export const registerImageTypes = async (
  broker: Broker,
  config: Config,
): Promise<void> => {
  const serviceAccountToken = await requestServiceAccountToken(config);
  await broker.publish<DeclareImageTypesCommand>(
    ImageServiceMultiTenantMessagingSettings.DeclareImageTypes.messageType,
    {
      service_id: config.serviceId,
      image_types: [
        ...movieImageTypes,
        ...tvshowImageTypes,
        ...collectionImageTypes,
      ],
    },
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
