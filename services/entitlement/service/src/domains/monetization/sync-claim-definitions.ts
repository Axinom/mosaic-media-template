import { Broker } from '@axinom/mosaic-message-bus';
import {
  MonetizationGrantsServiceMultiTenantMessagingSettings,
  SynchronizeClaimDefinitionsCommand,
} from '@axinom/mosaic-messages';
import { Config, requestServiceAccountToken } from '../../common';
import { claimDefinitionGroups } from './claim-definition-groups';

export const syncClaimDefinitions = async (
  broker: Broker,
  config: Config,
): Promise<void> => {
  const serviceAccountToken = await requestServiceAccountToken(config);
  const settings =
    MonetizationGrantsServiceMultiTenantMessagingSettings.SynchronizeClaimDefinitions;
  await broker.publish<SynchronizeClaimDefinitionsCommand>(
    config.environmentId,
    settings,
    { claim_definition_groups: claimDefinitionGroups },
    { auth_token: serviceAccountToken.accessToken },
    {
      routingKey: settings.getEnvironmentRoutingKey({
        tenantId: config.tenantId,
        environmentId: config.environmentId,
      }),
    },
  );
};
