import {
  MonetizationGrantsServiceMultiTenantMessagingSettings,
  SynchronizeClaimDefinitionsFinishedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { EntitlementAuthenticatedTransactionalMessageHandler } from './entitlement-authenticated-message-handler';

export class SyncClaimDefinitionsFinishedHandler extends EntitlementAuthenticatedTransactionalMessageHandler<SynchronizeClaimDefinitionsFinishedEvent> {
  constructor(config: Config) {
    super(
      MonetizationGrantsServiceMultiTenantMessagingSettings.SynchronizeClaimDefinitionsFinished,
      new Logger({
        config,
        context: SyncClaimDefinitionsFinishedHandler.name,
      }),
      'ax-monetization-grants-service',
      config,
    );
  }

  override async handleMessage({
    payload,
  }: TypedTransactionalMessage<SynchronizeClaimDefinitionsFinishedEvent>): Promise<void> {
    this.logger.log({
      message: 'Claim Definitions synchronization has succeeded!',
      details: { ...payload },
    });
  }
}
