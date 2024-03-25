import { OwnerPgPool } from '@axinom/mosaic-db-common';
import {
  MonetizationGrantsServiceMultiTenantMessagingSettings,
  SynchronizeClaimDefinitionsCommand,
} from '@axinom/mosaic-messages';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config, requestServiceAccountToken } from '../../common';
import { claimDefinitionGroups } from './claim-definition-groups';

export const syncClaimDefinitions = async (
  storeOutboxMessage: StoreOutboxMessage,
  loginPool: OwnerPgPool,
  config: Config,
): Promise<void> => {
  const serviceAccountToken = await requestServiceAccountToken(config);
  const settings =
    MonetizationGrantsServiceMultiTenantMessagingSettings.SynchronizeClaimDefinitions;
  // for a single query Postgres creates a single transaction - no need to manually create one
  await storeOutboxMessage<SynchronizeClaimDefinitionsCommand>(
    config.environmentId,
    settings,
    { claim_definition_groups: claimDefinitionGroups },
    loginPool,
    {
      envelopeOverrides: { auth_token: serviceAccountToken.accessToken },
      options: {
        routingKey: settings.getEnvironmentRoutingKey({
          tenantId: config.tenantId,
          environmentId: config.environmentId,
        }),
      },
    },
  );
};
