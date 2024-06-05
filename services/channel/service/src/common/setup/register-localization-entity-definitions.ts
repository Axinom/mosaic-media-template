import {
  DeclareEntityDefinitionCommand,
  DeleteEntityDefinitionCommand,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import {
  getChannelLocalizationEntityDefinitions,
  getProgramLocalizationEntityDefinitions,
} from '../../domains';
import { Config } from '../config/config-definitions';
import { requestServiceAccountToken } from '../utils';

const allDefinitions = (config: Config): DeclareEntityDefinitionCommand[] => [
  ...getChannelLocalizationEntityDefinitions(config.serviceId),
  ...getProgramLocalizationEntityDefinitions(config.serviceId),
];

export const registerLocalizationEntityDefinitions = async (
  storeOutboxMessage: StoreOutboxMessage,
  client: ClientBase,
  config: Config,
): Promise<void> => {
  const accessToken = await requestServiceAccountToken(config);
  for (const definition of allDefinitions(config)) {
    await storeOutboxMessage<DeclareEntityDefinitionCommand>(
      config.environmentId,
      LocalizationServiceMultiTenantMessagingSettings.DeclareEntityDefinition,
      definition,
      client,
      {
        envelopeOverrides: {
          auth_token: accessToken,
        },
        options: {
          routingKey:
            LocalizationServiceMultiTenantMessagingSettings.DeclareEntityDefinition.getEnvironmentRoutingKey(
              {
                tenantId: config.tenantId,
                environmentId: config.environmentId,
              },
            ),
        },
      },
    );
  }
};

export const unregisterLocalizationEntityDefinitions = async (
  storeOutboxMessage: StoreOutboxMessage,
  client: ClientBase,
  config: Config,
): Promise<void> => {
  const accessToken = await requestServiceAccountToken(config);

  for (const definition of allDefinitions(config)) {
    definition.is_archived = true;

    await storeOutboxMessage<DeclareEntityDefinitionCommand>(
      config.environmentId,
      LocalizationServiceMultiTenantMessagingSettings.DeclareEntityDefinition,
      definition,
      client,
      {
        envelopeOverrides: {
          auth_token: accessToken,
        },
        options: {
          routingKey:
            LocalizationServiceMultiTenantMessagingSettings.DeclareEntityDefinition.getEnvironmentRoutingKey(
              {
                tenantId: config.tenantId,
                environmentId: config.environmentId,
              },
            ),
        },
      },
    );

    const shortDelay = new Date();
    shortDelay.setSeconds(shortDelay.getSeconds() + 10);
    await storeOutboxMessage<DeleteEntityDefinitionCommand>(
      config.environmentId,
      LocalizationServiceMultiTenantMessagingSettings.DeleteEntityDefinition,
      {
        service_id: config.serviceId,
        entity_type: definition.entity_type,
      },
      client,
      {
        envelopeOverrides: {
          auth_token: accessToken,
        },
        options: {
          routingKey:
            LocalizationServiceMultiTenantMessagingSettings.DeclareEntityDefinition.getEnvironmentRoutingKey(
              {
                tenantId: config.tenantId,
                environmentId: config.environmentId,
              },
            ),
        },
        lockedUntil: shortDelay.toISOString(),
      },
    );
  }
};
