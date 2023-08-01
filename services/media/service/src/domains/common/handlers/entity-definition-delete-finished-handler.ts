import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  EntityDefinitionDeleteFinishedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../../../common';

export class EntityDefinitionDeleteFinishedHandler extends MessageHandler<EntityDefinitionDeleteFinishedEvent> {
  private logger: Logger;
  constructor(config: Config) {
    super(
      LocalizationServiceMultiTenantMessagingSettings
        .EntityDefinitionDeleteFinished.messageType,
    );
    this.logger = new Logger({
      config,
      context: EntityDefinitionDeleteFinishedHandler.name,
    });
  }

  async onMessage(content: EntityDefinitionDeleteFinishedEvent): Promise<void> {
    this.logger.log({
      message: 'Entity Definition delete command has succeeded!',
      details: { ...content },
    });
  }
}
