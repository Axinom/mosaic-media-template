import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  MonetizationGrantsServiceMultiTenantMessagingSettings,
  SynchronizeClaimDefinitionsFinishedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../../common';

export class SyncClaimDefinitionsFinishedHandler extends MessageHandler<SynchronizeClaimDefinitionsFinishedEvent> {
  private logger: Logger;
  constructor(config: Config) {
    super(
      MonetizationGrantsServiceMultiTenantMessagingSettings
        .SynchronizeClaimDefinitionsFinished.messageType,
    );
    this.logger = new Logger({
      config,
      context: SyncClaimDefinitionsFinishedHandler.name,
    });
  }

  async onMessage(
    content: SynchronizeClaimDefinitionsFinishedEvent,
  ): Promise<void> {
    this.logger.log({
      message: 'Claim Definitions synchronization has succeeded!',
      details: { ...content },
    });
  }
}
