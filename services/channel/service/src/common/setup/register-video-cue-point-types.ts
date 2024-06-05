import {
  DeclareCuePointTypesCommand,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { Config } from '../config/config-definitions';
import { requestServiceAccountToken } from '../utils';

export const CuePointTypes = [{ key: 'AD_SPOT', title: 'Ad spot' }];

export const registerVideoCuePointTypes = async (
  storeOutboxMessage: StoreOutboxMessage,
  client: ClientBase,
  config: Config,
): Promise<void> => {
  const accessToken = await requestServiceAccountToken(config);
  await storeOutboxMessage<DeclareCuePointTypesCommand>(
    config.environmentId,
    VideoServiceMultiTenantMessagingSettings.DeclareCuePointTypes,
    {
      service_id: config.serviceId,
      cue_point_types: CuePointTypes,
    },
    client,
    {
      envelopeOverrides: {
        auth_token: accessToken,
      },
      options: {
        routingKey:
          VideoServiceMultiTenantMessagingSettings.DeclareCuePointTypes.getEnvironmentRoutingKey(
            {
              tenantId: config.tenantId,
              environmentId: config.environmentId,
            },
          ),
      },
    },
  );
};
