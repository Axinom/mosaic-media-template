import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  MonetizationGrantsServiceMultiTenantMessagingSettings,
  SynchronizeClaimDefinitionsFailedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../../common';

export class SyncClaimDefinitionsFailedHandler extends MessageHandler<SynchronizeClaimDefinitionsFailedEvent> {
  private logger: Logger;
  constructor(config: Config) {
    super(
      MonetizationGrantsServiceMultiTenantMessagingSettings
        .SynchronizeClaimDefinitionsFailed.messageType,
    );
    this.logger = new Logger({
      config,
      context: SyncClaimDefinitionsFailedHandler.name,
    });
  }

  async onMessage(
    content: SynchronizeClaimDefinitionsFailedEvent,
  ): Promise<void> {
    this.logger.error({
      message: 'Claim Definitions synchronization has failed!',
      details: { ...content },
    });
  }
}
