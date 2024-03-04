import {
  MonetizationGrantsServiceMultiTenantMessagingSettings,
  SynchronizeClaimDefinitionsFailedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { EntitlementAuthenticatedTransactionalMessageHandler } from './entitlement-authenticated-message-handler';

export class SyncClaimDefinitionsFailedHandler extends EntitlementAuthenticatedTransactionalMessageHandler<SynchronizeClaimDefinitionsFailedEvent> {
  constructor(config: Config) {
    super(
      MonetizationGrantsServiceMultiTenantMessagingSettings.SynchronizeClaimDefinitionsFailed,
      new Logger({
        config,
        context: SyncClaimDefinitionsFailedHandler.name,
      }),
      'ax-monetization-grants-service',
      config,
    );
  }

  override async handleMessage({
    payload,
  }: TypedTransactionalMessage<SynchronizeClaimDefinitionsFailedEvent>): Promise<void> {
    this.logger.error({
      message: 'Claim Definitions synchronization has failed!',
      details: { ...payload },
    });
  }
}
