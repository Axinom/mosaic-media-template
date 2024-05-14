import {
  DeclareImageTypesCommand,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { Config } from '../config/config-definitions';
import { requestServiceAccountToken } from '../utils';

export const ImageTypes = [
  { image_type: 'channel_logo', title: 'Channel logo' },
];

export const registerImageTypes = async (
  storeOutboxMessage: StoreOutboxMessage,
  client: ClientBase,
  config: Config,
): Promise<void> => {
  const accessToken = await requestServiceAccountToken(config);
  await storeOutboxMessage<DeclareImageTypesCommand>(
    config.environmentId,
    ImageServiceMultiTenantMessagingSettings.DeclareImageTypes,
    {
      service_id: config.serviceId,
      image_types: ImageTypes,
    },
    client,
    {
      envelopeOverrides: { auth_token: accessToken },
      options: {
        routingKey:
          ImageServiceMultiTenantMessagingSettings.DeclareImageTypes.getEnvironmentRoutingKey(
            {
              tenantId: config.tenantId,
              environmentId: config.environmentId,
            },
          ),
      },
    },
  );
};
