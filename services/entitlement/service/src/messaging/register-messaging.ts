import { getOwnerPgPool } from '@axinom/mosaic-db-common';
import { RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import {
  MonetizationGrantsServiceMultiTenantMessagingSettings,
  SubscriptionMonetizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Express } from 'express';
import { Config } from '../common';
import {
  ClaimSetPublishedHandler,
  SubscriptionPlanPublishedHandler,
  SyncClaimDefinitionsFailedHandler,
  SyncClaimDefinitionsFinishedHandler,
} from './handlers';

export const registerMessaging = (
  app: Express,
  config: Config,
): RascalConfigBuilder[] => {
  const ownerPool = getOwnerPgPool(app);
  return [
    new RascalConfigBuilder(
      MonetizationGrantsServiceMultiTenantMessagingSettings.SynchronizeClaimDefinitions,
      config,
    ).sendCommand(),
    new RascalConfigBuilder(
      MonetizationGrantsServiceMultiTenantMessagingSettings.SynchronizeClaimDefinitionsFinished,
      config,
    ).subscribeForEvent(() => new SyncClaimDefinitionsFinishedHandler(config)),
    new RascalConfigBuilder(
      MonetizationGrantsServiceMultiTenantMessagingSettings.SynchronizeClaimDefinitionsFailed,
      config,
    ).subscribeForEvent(() => new SyncClaimDefinitionsFailedHandler(config)),
    new RascalConfigBuilder(
      MonetizationGrantsServiceMultiTenantMessagingSettings.ClaimSetPublished,
      config,
    ).subscribeForEvent(() => new ClaimSetPublishedHandler(ownerPool, config)),
    new RascalConfigBuilder(
      SubscriptionMonetizationServiceMultiTenantMessagingSettings.SubscriptionPlanPublished,
      config,
    ).subscribeForEvent(
      () => new SubscriptionPlanPublishedHandler(ownerPool, config),
    ),
  ];
};
